import { memoize } from "lodash-es";

import { BaseGuildAccount, StoredGuildAccount } from "../guild.model";
import { accountsEqual } from "../guild.service";

export const getAccountSelector = memoize(
  (baseAccount: BaseGuildAccount) => (account: StoredGuildAccount) =>
    accountsEqual(account, baseAccount)
);

export const getNetworkSelector = memoize(
  (networkId: string) => (account: StoredGuildAccount) =>
    account.networkId === networkId
);

export const withoutHiddenSelector = (account: StoredGuildAccount) =>
  !account.hidden;

export const withHiddenSelector = memoize(
  () => true,
  () => "default"
);
