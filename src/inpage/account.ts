import { sendMessage } from "../shared/messageActions";

export const disconnectAccount = async () => {
  sendMessage({ type: "DISCONNECT_ACCOUNT" });
};
