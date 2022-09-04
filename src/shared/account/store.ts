import { ArrayStorage } from "../storage";
import { AllowArray, SelectorFn } from "../storage/types";
import { BaseGuildAccount, GuildAccount } from "../guild.model";
import { accountsEqual } from "../guild.service";
import { getAccountSelector, withoutHiddenSelector } from "./selectors";
import { deserialize, serialize } from "./serialize";

export const accountStore = new ArrayStorage<GuildAccount>([], {
  namespace: "core:accounts",
  compare: accountsEqual,
  serialize,
  deserialize,
});

export async function getAccounts(
  selector: SelectorFn<GuildAccount> = withoutHiddenSelector
): Promise<GuildAccount[]> {
  return accountStore.get(selector);
}

export async function addAccounts(
  account: AllowArray<GuildAccount>
): Promise<void> {
  await accountStore.push(account);
}

export async function removeAccount(
  baseAccount: BaseGuildAccount
): Promise<void> {
  await accountStore.remove((account) => accountsEqual(account, baseAccount));
}

export async function hideAccount(
  baseAccount: BaseGuildAccount
): Promise<void> {
  const [hit] = await getAccounts(getAccountSelector(baseAccount));
  if (!hit) {
    return;
  }
  await accountStore.push({
    ...hit,
    hidden: true,
  });
}

export async function unhideAccount(
  baseAccount: BaseGuildAccount
): Promise<void> {
  const [hit] = await getAccounts(getAccountSelector(baseAccount));
  if (!hit) {
    return;
  }
  await accountStore.push({
    ...hit,
    hidden: false,
  });
}
