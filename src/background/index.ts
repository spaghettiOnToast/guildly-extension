import { messageStream, MessageType } from "../shared/messages";
import { handleMessage, sendMessageToActiveTabsAndUi } from "./handleMessaging";
import { getQueue } from "./actionQueue";
import { globalActionQueueStore } from "../shared/actionQueue/store";
import { ActionItem } from "../shared/actionQueue/types";
import { handleActionMessage } from "./actionMessaging";

messageStream.subscribe(async ([msg, sender]) => {
  const sendToTabAndUi = async (msg: MessageType) => {
    sendMessageToActiveTabsAndUi(msg);
  };

  const actionQueue = await getQueue<ActionItem>(globalActionQueueStore);

  const handlers = [handleMessage, handleActionMessage] as Array<
    HandleMessage<MessageType>
  >;

  try {
    await handleMessage({
      msg,
      sender,
      actionQueue,
      sendToTabAndUi,
    });
  } catch (error) {
    throw error;
  }
});
