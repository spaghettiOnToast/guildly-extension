import { getInstalledWallets, connect, getStarknet } from "get-starknet";
import { InstalledWalletObject, ConnectedWalletObject } from "./inpage.model";
import { useState } from "react";
import {
  starknetWindowObject,
  userEventHandlers,
} from "./starknetWindowObject";

function attach() {
  try {
    delete window.starknet;
    // set read only property to window
    Object.defineProperty(window, "starknet", {
      value: starknetWindowObject,
      writable: false,
    });
  } catch {
    // ignore
  }
  // we need 2 different try catch blocks because we want to execute both even if one of them fails
  try {
    window.starknet = starknetWindowObject;
  } catch {
    // ignore
  }
  try {
    delete (window as any)["starknet-guildly"];
    // set read only property to window
    Object.defineProperty(window, "starknet-guildly", {
      value: starknetWindowObject,
      writable: false,
    });
  } catch {
    // ignore
  }
  try {
    (window as any)["starknet-guildly"] = starknetWindowObject;
  } catch {
    // ignore
  }
}

function attachHandler() {
  attach();
  setTimeout(attach, 100);
}
attachHandler();

// const [wallets, setWallets] = useState(null)

const extensionId = document
  .getElementById("guildly-extension")
  ?.getAttribute("data-extension-id");

window.addEventListener("message", async (event: any) => {
  if (event.data.type === "GET_INSTALLED_WALLETS_RES") {
    console.log("hey");
    const starknetWindows = await getInstalledWallets();
    const wallets = [];
    for (var i = 0; i < starknetWindows.length; i++) {
      wallets[i] = {
        id: starknetWindows[i].id,
        name: starknetWindows[i].name,
        version: starknetWindows[i].version,
        icon: starknetWindows[i].icon,
        selectedAddress: starknetWindows[i].selectedAddress,
      };
    }
    window.postMessage({
      type: "INSTALLED_WALLETS",
      data: wallets,
      extensionId: extensionId,
    });
  }
  if (event.data.type === "CONNECT_WALLET_RES") {
    getStarknet().enable(event.data.data);
    const starknetWallet = getStarknet();
    const wallet = {
      account: {
        address: starknetWallet.account.address,
        baseUrl: starknetWallet.account.baseUrl,
        chainId: starknetWallet.account.chainId,
        feederGatewayUrl: starknetWallet.account.feederGatewayUrl,
        gatewayUrl: starknetWallet.account.gatewayUrl,
      },
      icon: starknetWallet.icon,
      id: starknetWallet.id,
      isConnected: starknetWallet.isConnected,
      name: starknetWallet.name,
      selectedAddress: starknetWallet.selectedAddress,
      version: starknetWallet.version,
    };
    // const connectedWallet = <ConnectedWalletObject>getStarknet();
    window.postMessage({
      type: "CONNECTED_WALLET",
      data: wallet,
      extensionId: extensionId,
    });
  }
});
