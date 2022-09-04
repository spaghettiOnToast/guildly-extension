import { mergeArrayStableWith } from "../storage/array";
import { SelectorFn } from "../storage/types";
import { Network } from "./type";
import { networkSelector, networkSelectorByChainId } from "./selectors";
import {
  customNetworksStore,
  defaultCustomNetworks,
  defaultReadonlyNetworks,
  equalNetwork,
} from "./storage";

export function extendByDefaultReadonlyNetworks(customNetworks: Network[]) {
  return mergeArrayStableWith(
    defaultReadonlyNetworks,
    customNetworks,
    equalNetwork
  );
}

export async function getNetworks(
  selector?: SelectorFn<Network>
): Promise<Network[]> {
  const customNetworks = await customNetworksStore.get();
  const allNetworks = extendByDefaultReadonlyNetworks(customNetworks);
  if (selector) {
    return allNetworks.filter(selector);
  }
  return allNetworks;
}

export async function getNetwork(networkId: string) {
  const [network] = await getNetworks(networkSelector(networkId));
  return network;
}

export type { Network, NetworkStatus } from "./type";
export { customNetworksStore } from "./storage";
export { getProvider } from "./provider";
export { defaultNetworks, defaultNetwork } from "./defaults";
