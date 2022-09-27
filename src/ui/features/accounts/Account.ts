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
  contract: Contract;
  proxyContract: Contract;
  provider: ProviderInterface;

  constructor({ address, network }: { address: string; network: Network }) {
    this.address = address;
    this.network = network;
    this.networkId = network.id;
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
