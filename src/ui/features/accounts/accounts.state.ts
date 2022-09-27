import { useMemo } from "react";
import create from "zustand";

import {
  getNetworkSelector,
  withHiddenSelector,
  withoutHiddenSelector,
} from "../../../shared/account/selectors";
import { accountStore } from "../../../shared/account/store";
import { defaultNetwork } from "../../../shared/network";
import { useArrayStorage } from "../../../shared/storage/hooks";
import { useObjectStorage } from "../../../shared/storage/hooks";
import { BaseGuildAccount, GuildAccount } from "../../../shared/guild.model";
import { accountsEqual } from "../../../shared/guild.service";
import { useCurrentNetwork } from "../networks/useNetworks";
import { Account } from "./Account";

export const mapWalletAccountsToAccounts = (
  walletAccounts: GuildAccount[]
): Account[] => {
  return walletAccounts.map(
    (walletAccount) =>
      new Account({
        address: walletAccount.address,
        network: walletAccount.network,
        signer: walletAccount.signer,
        hidden: walletAccount.hidden,
      })
  );
};

export const useAccount = ({} = {}) => {
  const account = useObjectStorage(accountStore);
  // const newAccount = new Account({
  //   account: account?.address,
  //   network: account.networkId,
  // });
  return account;
};

export const isHiddenAccount = (account: Account) => !!account.hidden;

interface State {
  selectedAccount?: BaseGuildAccount;
  showMigrationScreen?: boolean; // FIXME: remove when depricated accounts do not longer work
}

export const useSelectedAccountStore = create<State>(() => ({}));

export const useSelectedAccount = () => {
  const allAccounts = useAccounts({ showHidden: true });
  const selectedAccount = useSelectedAccountStore(
    (state) => state.selectedAccount
  );
  return useMemo(() => {
    return allAccounts.find(
      (a) => selectedAccount && accountsEqual(a, selectedAccount)
    );
  }, [allAccounts, selectedAccount]);
};
