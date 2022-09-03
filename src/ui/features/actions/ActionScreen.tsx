import { FC, useCallback } from "react";
import { ApproveTransaction } from "./ApproveTransaction";
import { actionStore } from "../../../shared/storage/actionStore";
import { useActions } from "./action.state";
import { approveAction, rejectAction } from "../../services/backgroundActions";
import { EXTENSION_IS_POPUP } from "../browser/constants";
import { useAppState } from "../../app.state";
import { useSelectedAccountStore } from "../accounts/accounts.state";
import { connectAccount } from "../../services/backgroundAccounts";

export const ActionScreen: FC = () => {
  const actions = useActions();
  const [action] = actions;
  const isLastAction = actions.length === 1;
  const closePopupIfLastAction = useCallback(() => {
    if (EXTENSION_IS_POPUP && isLastAction) {
      window.close();
    }
  }, [isLastAction]);
  switch (action?.type) {
    case "CONNECT_DAPP":
      return (
        <ConnectDappScreen
          host={action.payload.host}
          onConnect={async (selectedAccount: Account) => {
            useAppState.setState({ isLoading: true });
            // switch UI to the account that was selected
            useSelectedAccountStore.setState({
              selectedAccount,
            });
            // switch background wallet to the account that was selected
            connectAccount(selectedAccount);
            await waitForMessage("CONNECT_ACCOUNT_RES");
            // continue with approval with selected account
            await approveAction(action);
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
      return <ApproveTransaction transactions={action.payload.transactions} />;
  }
};