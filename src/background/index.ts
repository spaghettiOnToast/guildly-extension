import { messageStream, MessageType } from "../shared/messages";
import { handleMessage, sendMessageToActiveTabsAndUi } from "./handleMessaging";
import { getQueue } from "./actionQueue";
import { globalActionQueueStore } from "../shared/actionQueue/store";
import { ActionItem } from "../shared/actionQueue/types";
import { handleActionMessage } from "./actionMessaging";
import {
  BackgroundService,
  HandleMessage,
  UnhandledMessage,
} from "./background";

messageStream.subscribe(async ([msg, sender]) => {
  const sendToTabAndUi = async (msg: MessageType) => {
    sendMessageToActiveTabsAndUi(msg);
  };

  const actionQueue = await getQueue<ActionItem>(globalActionQueueStore);

  const handlers = [handleMessage, handleActionMessage] as Array<any>;

  for (const handleMessage of handlers) {
    try {
      await handleMessage({
        msg,
        sender,
        actionQueue,
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
