import { Network } from "./network";

export interface WalletAccountSigner {
  type: "local_secret";
  derivationPath: string;
}

export interface WithSigner {
  signer: WalletAccountSigner;
}

export interface BaseGuildAccount {
  address: string;
  account: string;
  networkId: string;
  walletProvider: string;
}

export interface GuildAccount extends BaseGuildAccount {
  network: Network;
}

export type StoredGuildAccount = Omit<GuildAccount, "network">;
