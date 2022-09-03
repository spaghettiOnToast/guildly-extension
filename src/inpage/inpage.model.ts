// import type { AccountInterface, ProviderInterface } from "starknet";

import { Account } from "starknet";

export interface AccountInterface {
  address: string;
  baseUrl: string;
  chainId: string;
  feederGatewayUrl: string;
  gatewayUrl: string;
}

export interface InstalledWalletObject {
  id: string;
  name: string;
  version: string;
  icon: string;
  selectedAddress?: string;
}

export interface ConnectedWalletObject {
  account: AccountInterface;
  chainId: string;
  icon: string;
  id: string;
  isConnected: boolean;
  name: string;
  selectedAddress?: string;
  version: string;
}

// interface IStarketWindowObject {
//   id: string;
//   name: string;
//   version: string;
//   icon: string;
//   request: <T extends RpcMessage>(
//     call: Omit<T, "result">
//   ) => Promise<T["result"]>;
//   enable: (options?: {
//     starknetVersion?: StarknetJsVersion;
//   }) => Promise<string[]>;
//   isPreauthorized: () => Promise<boolean>;
//   on: (
//     event: WalletEvents["type"],
//     handleEvent: WalletEvents["handler"]
//   ) => void;
//   off: (
//     event: WalletEvents["type"],
//     handleEvent: WalletEvents["handler"]
//   ) => void;
//   starknetJsVersion?: StarknetJsVersion;
//   account?: AccountInterface | AccountInterface3;
//   provider?: ProviderInterface | ProviderInterface3;
//   selectedAddress?: string;
//   chainId?: string;
// }
