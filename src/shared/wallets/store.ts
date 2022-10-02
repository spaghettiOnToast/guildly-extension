import { ArrayStorage } from "../storage";
import { ObjectStorage } from "../storage";
import { AllowArray, SelectorFn } from "../storage/types";
import { accountsEqual } from "../guild.service";

export const walletsStore = new ObjectStorage<any | null>(null, {
  namespace: "core:wallets",
});

export async function getWallets(): Promise<any | null> {
  return walletsStore.get();
}

export async function setWallets(wallets: any): Promise<void> {
  await walletsStore.set(wallets);
}

export async function removeWallets(): Promise<void> {
  await walletsStore.set({});
}
