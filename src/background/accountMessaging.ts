import { getAccount, removeAccount } from "../shared/account/store";
import { sendMessageToUi } from "./activeTabs";
import { HandleMessage, UnhandledMessage } from "./background";
import { Guild } from "./guild";

export const handleAccountMessage: HandleMessage<any> = async ({
  msg,
  background: { guild },
  sendToTabAndUi,
}) => {
  switch (msg.type) {
    case "CONNECT_GUILD": {
      // await guild.addAccount(msg.data.account.address);
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

    case "SELECT_ACCOUNT": {
      try {
        await guild.addAccount(
          msg.data.address,
          msg.data.account,
          msg.data.networkId,
          msg.data.network,
          msg.data.walletProvider
        );
        return sendToTabAndUi({ type: "SELECT_ACCOUNT_RES", data: msg });
      } catch {
        return sendToTabAndUi({ type: "SELECT_ACCOUNT_REJ", data: msg });
      }
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
