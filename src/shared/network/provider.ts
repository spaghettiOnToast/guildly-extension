import { Provider } from "starknet";

import { Network } from "./type";

export function getProvider(url: any) {
  return new Provider({ baseUrl: url });
}
