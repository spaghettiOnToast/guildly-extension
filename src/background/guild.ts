import { ethers } from "ethers";
import { ProgressCallback } from "ethers/lib/utils";
import { find, union } from "lodash-es";
import { Account, DeployContractPayload, ec, stark } from "starknet";
import {
  calculateContractAddressFromHash,
  getSelectorFromName,
} from "starknet/dist/utils/hash";
import browser from "webextension-polyfill";

import {
  Network,
  defaultNetwork,
  defaultNetworks,
  getProvider,
} from "../shared/network";
import {
  IArrayStorage,
  IKeyValueStorage,
  IObjectStorage,
  KeyValueStorage,
  ObjectStorage,
} from "../shared/storage";
import { BaseGuildAccount, GuildAccount } from "../shared/guild.model";
import { accountsEqual, baseDerivationPath } from "../shared/guild.service";
import {
  getIndexForPath,
  getNextPathIndex,
  getPathForIndex,
  getStarkPair,
} from "./keys/keyDerivation";

const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";
const isDevOrTest = isDev || isTest;

const CURRENT_BACKUP_VERSION = 1;
export const SESSION_DURATION = isDev ? 24 * 60 * 60 : 30 * 60; // 30 mins in prod, 24 hours in dev

const CHECK_OFFSET = 10;

const PROXY_CONTRACT_CLASS_HASHES = [
  "0x7cbef2d79d3beea452ecf4058d1fa2eb2e408cd58a23008da97a8dca4616a6c",
];
const GUILD_CONTRACT_CLASS_HASHES = [
  "0x31cca0d34b699973f51b438669db131cf48867b88cc1ee628a8b11aacde04d1",
];

export interface WalletSession {
  secret: string;
}

export interface WalletStorageProps {
  backup?: string;
  selected?: BaseGuildAccount;
  discoveredOnce?: boolean;
}

export const walletStore = new KeyValueStorage<WalletStorageProps>(
  {},
  "core:wallet"
);

export const sessionStore = new ObjectStorage<WalletSession | null>(null, {
  namespace: "core:wallet:session",
  areaName: "session",
});

export type GetNetwork = (networkId: string) => Promise<Network>;

export class Guild {
  constructor(
    private readonly store: IKeyValueStorage<WalletStorageProps>,
    private readonly guildStore: IArrayStorage<GuildAccount>,
    private readonly sessionStore: IObjectStorage<WalletSession | null>,
    private readonly getNetwork: GetNetwork
  ) {}

  public async isInitialized(): Promise<boolean> {
    return Boolean(await this.store.get("backup"));
  }

  public async isSessionOpen(): Promise<boolean> {
    return (await this.sessionStore.get()) !== null;
  }

  private async generateNewLocalSecret(progressCallback?: ProgressCallback) {
    if (await this.isInitialized()) {
      return;
    }
    const N = isDevOrTest ? 64 : 32768;
    const ethersWallet = ethers.Wallet.createRandom();

    // return this.setSession(ethersWallet.privateKey);
    return this.setSession("123");
  }

  public async getSeedPhrase(): Promise<string> {
    const session = await this.sessionStore.get();
    const backup = await this.store.get("backup");

    if (!(await this.isSessionOpen()) || !session || !backup) {
      throw new Error("Session is not open");
    }

    const wallet = await ethers.Wallet.fromEncryptedJson(session.password);

    return wallet.mnemonic.phrase;
  }

  public async discoverAccounts() {
    const session = await this.sessionStore.get();
    if (!session?.secret) {
      throw new Error("Wallet is not initialized");
    }
    const wallet = new ethers.Wallet(session?.secret);

    const networks = defaultNetworks
      .map((network) => network.id)
      .filter((networkId) => networkId !== "localhost");
    const accountsResults = await Promise.all(
      networks.map(async (networkId) => {
        const network = await this.getNetwork(networkId);
        if (!network) {
          throw new Error(`Network ${networkId} not found`);
        }
        return this.restoreAccountsFromWallet(wallet.privateKey, network);
      })
    );
    const accounts = accountsResults.flatMap((x) => x);

    await this.guildStore.push(accounts);

    this.store.set("discoveredOnce", true);
  }

  private async restoreAccountsFromWallet(
    secret: string,
    network: Network,
    offset: number = CHECK_OFFSET
  ): Promise<GuildAccount[]> {
    const provider = getProvider(network);

    const accounts: GuildAccount[] = [];

    const accountClassHashes = union(
      GUILD_CONTRACT_CLASS_HASHES,
      network?.accountClassHash ? [network.accountClassHash] : []
    );
    const proxyClassHashes = PROXY_CONTRACT_CLASS_HASHES;

    if (!accountClassHashes?.length) {
      console.error(`No known account class hashes for network ${network.id}`);
      return accounts;
    }

    const proxyClassHashAndAccountClassHash2DMap = proxyClassHashes.flatMap(
      (contractHash) =>
        accountClassHashes.map(
          (implementation) => [contractHash, implementation] as const
        )
    );

    const promises = proxyClassHashAndAccountClassHash2DMap.map(
      async ([contractClassHash, accountClassHash]) => {
        let lastHit = 0;
        let lastCheck = 0;

        while (lastHit + offset > lastCheck) {
          const starkPair = getStarkPair(lastCheck, secret, baseDerivationPath);
          const starkPub = ec.getStarkKey(starkPair);

          const address = calculateContractAddressFromHash(
            starkPub,
            contractClassHash,
            stark.compileCalldata({
              implementation: accountClassHash,
              selector: getSelectorFromName("initialize"),
              calldata: stark.compileCalldata({
                signer: starkPub,
                guardian: "0",
              }),
            }),
            0
          );

          const code = await provider.getCode(address);

          if (code.bytecode.length > 0) {
            lastHit = lastCheck;
            accounts.push({
              address,
              networkId: network.id,
              network,
              signer: {
                type: "local_secret",
                derivationPath: getPathForIndex(lastCheck, baseDerivationPath),
              },
            });
          }

          ++lastCheck;
        }
      }
    );

    await Promise.all(promises);

    return accounts;
  }

  public async startSession(
    progressCallback?: ProgressCallback
  ): Promise<boolean> {
    // session has already started
    const session = await this.sessionStore.get();
    if (session) {
      return true;
    }

    // wallet is not initialized: let's initialise it
    if (!(await this.isInitialized())) {
      await this.generateNewLocalSecret(progressCallback);
      return true;
    }

    try {
      await this.setSession("123");

      return true;
    } catch {
      return false;
    }
  }

  public async checkPassword(password: string): Promise<boolean> {
    const session = await this.sessionStore.get();
    return session?.password === password;
  }

  public async discoverAccountsForNetwork(
    network?: Network,
    offset: number = CHECK_OFFSET
  ) {
    const session = await this.sessionStore.get();
    if (!this.isSessionOpen() || !session?.secret) {
      throw new Error("Session is not open");
    }
    const wallet = new ethers.Wallet(session?.secret);

    if (!network?.accountClassHash) {
      // silent fail if no account implementation is defined for this network
      return;
    }

    const accounts = await this.restoreAccountsFromWallet(
      wallet.privateKey,
      network,
      offset
    );

    await this.guildStore.push(accounts);
  }

  public async getAccount(selector: BaseGuildAccount): Promise<GuildAccount> {
    const accounts = await this.guildStore.get();
    const hit = find(accounts, (account) => accountsEqual(account, selector));
    if (!hit) {
      throw Error("account not found");
    }
    return hit;
  }

  public async getKeyPairByDerivationPath(derivationPath: string) {
    const session = await this.sessionStore.get();
    if (!session?.secret) {
      throw Error("session is not open");
    }
    return getStarkPair(derivationPath, session.secret);
  }

  public async getStarknetAccount(
    selector: BaseGuildAccount
  ): Promise<Account> {
    if (!(await this.isSessionOpen())) {
      throw Error("no open session");
    }
    const account = await this.getAccount(selector);
    if (!account) {
      throw Error("account not found");
    }

    const keyPair = await this.getKeyPairByDerivationPath(
      account.signer.derivationPath
    );
    const provider = getProvider(account.network);
    return new Account(provider, account.address, keyPair);
  }

  public async getSelectedStarknetAccount(): Promise<Account> {
    if (!this.isSessionOpen()) {
      throw Error("no open session");
    }

    const account = await this.getSelectedAccount();
    if (!account) {
      throw new Error("no selected account");
    }

    return this.getStarknetAccount(account);
  }

  public async getSelectedAccount(): Promise<GuildAccount | undefined> {
    if (!this.isSessionOpen()) {
      return;
    }
    const accounts = await this.guildStore.get();
    const selectedAccount = await this.store.get("selected");
    const defaultAccount =
      accounts.find((account) => account.networkId === defaultNetwork.id) ??
      accounts[0];
    if (!selectedAccount) {
      return defaultAccount;
    }
    const account = find(accounts, (account) =>
      accountsEqual(selectedAccount, account)
    );
    return account ?? defaultAccount;
  }

  public async selectAccount(accountIdentifier: BaseGuildAccount) {
    const accounts = await this.guildStore.get();
    const account = find(accounts, (account) =>
      accountsEqual(account, accountIdentifier)
    );

    if (account) {
      const { address, networkId } = account; // makes sure to strip away unused properties
      await this.store.set("selected", { address, networkId });
    }
  }

  public async lock() {
    await this.sessionStore.set(this.sessionStore.defaults);
  }

  private async setSession(secret: string) {
    await this.sessionStore.set({ secret });

    browser.alarms.onAlarm.addListener(async (alarm) => {
      if (alarm.name === "session_timeout") {
        return this.lock();
      }
    });

    const alarm = await browser.alarms.get("session-timeout");
    if (alarm?.name !== "session-timeout") {
      browser.alarms.create("session_timeout", {
        delayInMinutes: SESSION_DURATION,
      });
    }
  }
}
