import { compactDecrypt } from "jose";
import { encode } from "starknet";

import { SessionMessage } from "../shared/messages/SessionMessage";
import { UnhandledMessage } from "./background";
import { HandleMessage } from "./background";

export const handleSessionMessage: HandleMessage<SessionMessage> = async ({
  msg,
  background: { guild },
  // messagingKeys: { privateKey },
  sendToTabAndUi,
}) => {
  switch (msg.type) {
    case "START_SESSION": {
      const result = await guild.startSession();
      if (result) {
        const selectedAccount = await guild.getSelectedAccount();
        return sendToTabAndUi({
          type: "START_SESSION_RES",
          data: selectedAccount,
        });
      }
      return sendToTabAndUi({ type: "START_SESSION_REJ" });
    }

    case "HAS_SESSION": {
      return sendToTabAndUi({
        type: "HAS_SESSION_RES",
        data: await guild.isSessionOpen(),
      });
    }

    case "STOP_SESSION": {
      await guild.lock();
      return sendToTabAndUi({ type: "DISCONNECT_ACCOUNT" });
    }

    // case "IS_INITIALIZED": {
    //   const initialized = await guild.isInitialized();
    //   return sendToTabAndUi({
    //     type: "IS_INITIALIZED_RES",
    //     data: { initialized },
    //   });
    // }
  }

  throw new UnhandledMessage();
};
