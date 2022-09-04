import { sendMessage } from "../shared/messages";
import { MessageType } from "../shared/messages";
import { getActiveTabURL } from "../common/Utils";
import { accountStore, storeAccount } from "../shared/storage/accounts";
import { storeAction, actionStore } from "../shared/storage/actionStore";
import { globalActionQueueStore } from "../shared/actionQueue/store";
import { HandleMessage, UnhandledMessage } from "./background";
import { sendMessageToCurrentTab } from "./activeTabs";
import { openUi } from "./openUi";

export const handleMessage: any = async ({
  msg,
  sender,
  background,
  sendToTabAndUi,
}) => {
  const { actionQueue } = background;
  switch (msg.type) {
    case "INSTALLED_WALLETS": {
      return sendToTabAndUi({
        type: "INSTALLED_WALLETS_RES",
        data: msg,
      });
    }
    case "GET_INSTALLED_WALLETS": {
      return sendMessageToCurrentTab({ type: "GET_INSTALLED_WALLETS_RES" });
    }
    case "CONNECT_WALLET": {
      return sendToTabAndUi({ type: "CONNECT_WALLET_RES", data: msg.data });
    }
    case "CONNECTED_WALLET": {
      return sendToTabAndUi({ type: "CONNECTED_WALLET_RES", data: msg.data });
    }
    case "CONNECTED_GUILD": {
      return sendToTabAndUi({ type: "CONNECTED_GUILD_RES", data: msg.data });
    }
    case "EXECUTE_TRANSACTION": {
      await actionQueue.push({
        type: "TRANSACTION",
        payload: msg.data,
      });
      await openUi();
    }
    case "OPEN_UI": {
      await openUi();
    }
  }

  throw new UnhandledMessage();
};
