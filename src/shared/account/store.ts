import { ArrayStorage } from "../storage";
import { ObjectStorage } from "../storage";
import { AllowArray, SelectorFn } from "../storage/types";
import { BaseGuildAccount, GuildAccount } from "../guild.model";
import { accountsEqual } from "../guild.service";
import { getAccountSelector, withoutHiddenSelector } from "./selectors";
import { deserialize, serialize } from "./serialize";

export const accountStore = new ObjectStorage<BaseGuildAccount | null>(null, {
  namespace: "core:accounts",
});

export async function getAccounts(): Promise<BaseGuildAccount | null> {
  return accountStore.get();
}

export async function addAccounts(account: BaseGuildAccount): Promise<void> {
  await accountStore.set(account);
}

export async function removeAccount(): Promise<void> {
  await accountStore.set({});
}
