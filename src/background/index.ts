import { messageStream, MessageType } from "../shared/messages";
import { handleMessage } from "./handleMessaging";
import { getQueue } from "./actionQueue";
import { globalActionQueueStore } from "../shared/actionQueue/store";
import { ActionItem } from "../shared/actionQueue/types";
import { handleActionMessage } from "./actionMessaging";
import { Guild, sessionStore, walletStore } from "./guild";
import { getNetwork } from "../shared/network";
import { accountStore, getAccounts } from "../shared/account/store";
import {
  BackgroundService,
  HandleMessage,
  UnhandledMessage,
} from "./background";
import {
  hasTab,
  sendMessageToActiveTabs,
  sendMessageToActiveTabsAndUi,
} from "./activeTabs";
import { handlePreAuthorizationMessage } from "./preAuthorizationMessaging";

const handlers = [
  handleMessage,
  handleActionMessage,
  handlePreAuthorizationMessage,
] as Array<any>;

messageStream.subscribe(async ([msg, sender]) => {
  const actionQueue = await getQueue<ActionItem>(globalActionQueueStore);

  const guild = new Guild(walletStore, accountStore, sessionStore, getNetwork);

  const background: BackgroundService = {
    guild,
    // transactionTracker,
    actionQueue,
  };

  const sendToTabAndUi = async (msg: MessageType) => {
    sendMessageToActiveTabsAndUi(msg, [sender.tab?.id]);
  };

  // forward UI messages to rest of the tabs
  if (!hasTab(sender.tab?.id)) {
    sendMessageToActiveTabs(msg);
  }

  for (const handleMessage of handlers) {
    try {
      await handleMessage({
        msg,
        sender,
        background,
        sendToTabAndUi,
      });
    } catch (error) {
      if (error instanceof UnhandledMessage) {
        continue;
      }
      throw error;
    }
    break;
  }
});
