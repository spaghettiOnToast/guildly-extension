import { getAccounts, removeAccount } from "../shared/account/store";
import { sendMessageToUi } from "./activeTabs";
import { HandleMessage, UnhandledMessage } from "./background";
import { Guild } from "./guild";

export const handleAccountMessage: HandleMessage<any> = async ({
  msg,
  background: { guild },
  sendToTabAndUi,
}) => {
  switch (msg.type) {
    case "GET_ACCOUNTS": {
      return sendToTabAndUi({
        type: "GET_ACCOUNTS_RES",
        data: await getAccounts(msg.data?.showHidden ? () => true : undefined),
      });
    }

    case "CONNECT_GUILD": {
      await guild.addAccount(msg.data.account.address);
      return sendToTabAndUi({
        type: "CONNECT_GUILD_RES",
        data: msg.data,
      });
    }

    case "GET_SELECTED_ACCOUNT": {
      const selectedAccount = await guild.getSelectedAccount();
      return sendToTabAndUi({
        type: "GET_SELECTED_ACCOUNT_RES",
        data: selectedAccount,
      });
    }

    case "DELETE_ACCOUNT": {
      try {
        await removeAccount(msg.data);
        return sendToTabAndUi({ type: "DELETE_ACCOUNT_RES" });
      } catch {
        return sendToTabAndUi({ type: "DELETE_ACCOUNT_REJ" });
      }
    }
  }

  throw new UnhandledMessage();
};
