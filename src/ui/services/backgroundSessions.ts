import { sendMessage, waitForMessage } from "../../shared/messages";
import { encryptForBackground } from "./crypto";

export const hasActiveSession = async () => {
  sendMessage({ type: "HAS_SESSION" });
  return waitForMessage("HAS_SESSION_RES");
};

export const isInitialized = async () => {
  sendMessage({ type: "IS_INITIALIZED" });
  return await waitForMessage("IS_INITIALIZED_RES");
};

export const startSession = async (): Promise<void> => {
  sendMessage({ type: "START_SESSION" });

  const succeeded = await Promise.race([
    waitForMessage("START_SESSION_RES").then(() => true),
    waitForMessage("START_SESSION_REJ")
      .then(() => false)
      .catch(() => false),
  ]);

  if (!succeeded) {
    throw Error("Wrong password");
  }
};

export const stopSession = () => {
  sendMessage({ type: "STOP_SESSION" });
};
