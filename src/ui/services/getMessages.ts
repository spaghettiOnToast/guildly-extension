import { sendMessage, waitForMessage } from "../../shared/messages";

export const getInstalledWallets = async () => {
  sendMessage({ type: "GET_INSTALLED_WALLETS" });
  return waitForMessage("INSTALLED_WALLETS_RES");
};

export const connectWallet = async (msg) => {
  console.log("got here");
  sendMessage({ type: "CONNECT_WALLET", data: msg });
  return waitForMessage("CONNECTED_WALLET_RES");
};

export const getWallet = async () => {
  return waitForMessage("CONNECTED_WALLET_RES");
};

export const exposeGuild = async (msg) => {
  sendMessage({ type: "CONNECTED_GUILD", data: msg });
};
