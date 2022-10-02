import { FC, useCallback, useState } from "react";

import { waitForMessage } from "../../../shared/messages";
import { ApproveTransaction } from "./ApproveTransaction";
import { actionStore } from "../../../shared/storage/actionStore";
import { useActions } from "./action.state";
import { approveAction, rejectAction } from "../../services/backgroundActions";
import { EXTENSION_IS_POPUP } from "../browser/constants";
import { useAppState } from "../../app.state";
import {
  useAccount,
  useSelectedAccountStore,
} from "../accounts/accounts.state";
import { Account } from "../accounts/Account";
import { connectAccount } from "../../services/backgroundAccounts";
import { ConnectDappScreen } from "./ConnectDappScreen";
import { removePreAuthorization } from "../../../shared/preAuthorizations";
import { formatTransaction } from "./transaction/formatTransaction";
import { getAccount } from "../../../shared/account/store";
import { BaseGuildAccount, GuildAccount } from "../../../shared/guild.model";

export const ActionScreen: FC = () => {
  const [guilds, setGuilds] = useState<any>(null);
  const getGuilds = async () => {
    const currentGuilds = await getAccount();
    return setGuilds(currentGuilds);
  };
  getGuilds();
  console.log(guilds);
  const account = useAccount();
  console.log(account);
  const actions = useActions();
  const [action] = actions;
  const isLastAction = actions.length === 1;
  const closePopupIfLastAction = useCallback(() => {
    if (EXTENSION_IS_POPUP && isLastAction) {
      window.close();
    }
  }, [isLastAction]);

  const onSubmit = useCallback(async () => {
    await approveAction(action);
    closePopupIfLastAction();
  }, [action, closePopupIfLastAction]);

  const onReject = useCallback(async () => {
    await rejectAction(action);
    closePopupIfLastAction();
  }, [action, closePopupIfLastAction]);
  switch (action?.type) {
    case "CONNECT_DAPP":
      return (
        <ConnectDappScreen
          host={action.payload.host}
          onConnect={async (selectedAccount: BaseGuildAccount) => {
            useAppState.setState({ isLoading: true });
            // switch UI to the account that was selected
            useSelectedAccountStore.setState({
              selectedAccount,
            });
            connectAccount(selectedAccount);
            await waitForMessage("CONNECT_GUILD_RES");
            // continue with approval with selected account
            await approveAction(action);
            console.log("connecting");
            await waitForMessage("CONNECT_DAPP_RES");
            useAppState.setState({ isLoading: false });
            closePopupIfLastAction();
          }}
          onDisconnect={async (selectedAccount: Account) => {
            await removePreAuthorization(action.payload.host, selectedAccount);
            await rejectAction(action);
            closePopupIfLastAction();
          }}
          onReject={onReject}
        />
      );

    case "TRANSACTION":
      return (
        <ApproveTransaction
          transactions={action.payload.transactions}
          onSubmit={onSubmit}
          onReject={onReject}
          selectedAccount={account}
        />
      );
  }
};
