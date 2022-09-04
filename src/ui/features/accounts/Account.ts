import { Abi, Contract, ProviderInterface, number, stark } from "starknet";

import GuildlyCompiledContractAbi from "../../../abis/guild_contract.json";
import ProxyCompiledContractAbi from "../../../abis/proxy.json";
import { Network, getNetwork, getProvider } from "../../../shared/network";
import {
  BaseGuildAccount,
  GuildAccount,
  WalletAccountSigner,
} from "../../../shared/guild.model";
import { getAccountIdentifier } from "../../../shared/guild.service";
import { createNewAccount } from "../../services/backgroundAccounts";

export class Account {
  address: string;
  network: Network;
  networkId: string;
  signer: WalletAccountSigner;
  deployTransaction?: string;
  contract: Contract;
  proxyContract: Contract;
  provider: ProviderInterface;
  hidden?: boolean;

  constructor({
    address,
    network,
    signer,
    deployTransaction,
    hidden,
  }: {
    address: string;
    network: Network;
    signer: WalletAccountSigner;
    deployTransaction?: string;
    hidden?: boolean;
  }) {
    this.address = address;
    this.network = network;
    this.networkId = network.id;
    this.signer = signer;
    this.hidden = hidden;
    this.deployTransaction = deployTransaction;
    this.provider = getProvider(network);
    this.contract = new Contract(
      GuildlyCompiledContractAbi as Abi,
      address,
      this.provider
    );
    this.proxyContract = new Contract(
      ProxyCompiledContractAbi as Abi,
      address,
      this.provider
    );
  }

  public async getCurrentNonce(): Promise<string> {
    const { nonce } = await this.contract.call("get_nonce");
    return nonce.toString();
  }

  public async getCurrentImplementation(): Promise<string> {
    const { implementation } = await this.proxyContract.call(
      "get_implementation"
    );
    return stark.makeAddress(number.toHex(implementation));
  }

  public toGuildAccount(): GuildAccount {
    const { networkId, address, network, signer } = this;
    return {
      networkId,
      address,
      network,
      signer,
    };
  }

  public toBaseGuildAccount(): BaseGuildAccount {
    const { networkId, address } = this;
    return {
      networkId,
      address,
    };
  }
}
