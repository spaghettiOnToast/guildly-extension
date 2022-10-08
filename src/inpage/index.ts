import { getInstalledWallets, connect, getStarknet } from "get-starknet";
import { InstalledWalletObject, ConnectedWalletObject } from "./inpage.model";
import { useState } from "react";
import {
  starknetWindowObject,
  userEventHandlers,
} from "./starknetWindowObject";
import { getIsPreauthorized } from "./preAuthorization";
import { disconnectAccount } from "./account";
import { getProvider } from "../shared/network/provider";
import { GuildAccount } from "./GuildAccount";
import { assertNever } from "./../ui/services/assertNever";
import {
  useContract,
  useStarknetCall,
  useStarknetTransactionManager,
} from "@starknet-react/core";
import GuildContract from "../abis/guild_contract.json";
import { Abi } from "starknet";

function attach() {
  try {
    delete window.starknet_guildly;
    // set read only property to window
    Object.defineProperty(window, "starknet_guildly", {
      value: starknetWindowObject,
      writable: false,
    });
  } catch {
    // ignore
  }
  // we need 2 different try catch blocks because we want to execute both even if one of them fails
  try {
    window.starknet_guildly = starknetWindowObject;
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

const getWallets = async () => {
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
};

function attachHandler() {
  attach();
  getWallets();
  setTimeout(attach, 100);
}
attachHandler();

// const [wallets, setWallets] = useState(null)

const extensionId = document
  .getElementById("guildly-extension")
  ?.getAttribute("data-extension-id");

window.addEventListener("message", async (event: any) => {
  const { starknet_guildly } = window;
  if (!starknet_guildly) {
    return;
  }
  if (event.data.type === "GET_INSTALLED_WALLETS_RES") {
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
  } else if (event.data.type === "CONNECT_WALLET_RES") {
    const installedWallets = await getInstalledWallets();
    const currentWallet = installedWallets.find((obj) => {
      return obj.id === event.data.data.id;
    });
    await currentWallet?.enable();
    const wallet = {
      account: {
        address: currentWallet?.account.address,
        baseUrl: currentWallet?.account.baseUrl,
        chainId: currentWallet?.account.chainId,
        feederGatewayUrl: currentWallet?.account.feederGatewayUrl,
        gatewayUrl: currentWallet?.account.gatewayUrl,
      },
      chainId: currentWallet?.chainId,
      icon: currentWallet?.icon,
      id: currentWallet?.id,
      isConnected: currentWallet?.isConnected,
      name: currentWallet?.name,
      provider: currentWallet?.provider,
      selectedAddress: currentWallet?.selectedAddress,
      version: currentWallet?.version,
    };
    // const connectedWallet = <ConnectedWalletObject>getStarknet();
    window.postMessage({
      type: "CONNECTED_WALLET",
      data: wallet,
      extensionId: extensionId,
    });
  } else if (
    starknet_guildly.account &&
    event.data.type === "CONNECT_ACCOUNT_RES"
  ) {
    // const { address, network } = event.data.data;
    const guildAccount = event.data.data;
    const isPreauthorized = await getIsPreauthorized();
    if (!isPreauthorized) {
      // disconnect so the user can see they are no longer connected
      // TODO: better UX would be to also re-connect when user selects pre-authorized account
      await disconnectAccount();
    } else {
      if (
        guildAccount.account.address !== starknet_guildly.selectedAddress ||
        guildAccount.account.chainId !== starknet_guildly.chainId
      ) {
        starknet_guildly.selectedAddress = guildAccount.account.address;
        starknet_guildly.chainId = guildAccount.account.chainId;
        starknet_guildly.provider = guildAccount.account.provider;
        starknet_guildly.account = guildAccount.account;
        for (const userEvent of userEventHandlers) {
          if (userEvent.type === "accountsChanged") {
            userEvent.handler([guildAccount.account.address]);
          } else if (userEvent.type === "networkChanged") {
            userEvent.handler(guildAccount.account.chainId);
          } else {
            assertNever(userEvent);
          }
        }
      }
    }
  } else if (event.data.type === "DISCONNECT_ACCOUNT") {
    starknet_guildly.selectedAddress = undefined;
    starknet_guildly.account = undefined;
    starknet_guildly.isConnected = false;
    for (const userEvent of userEventHandlers) {
      if (userEvent.type === "accountsChanged") {
        userEvent.handler([]);
      } else if (userEvent.type === "networkChanged") {
        userEvent.handler(undefined);
      } else {
        assertNever(userEvent);
      }
    }
  } else if (event.data.type === "FORWARD_TRANSACTION") {
    if (event.data.data?.wallet) {
      const installedWallets = await getInstalledWallets();
      const currentWallet = installedWallets.find((obj) => {
        return obj.id === event.data.data?.wallet;
      });
      try {
        const result = await currentWallet?.account.execute(
          event.data.data.payload.transactions
        );
        window.postMessage({
          type: "TRANSACTION_FORWARDED",
          data: result,
          extensionId: extensionId,
        });
      } catch (e) {
        console.log(e);
      }
    }
  } else if (event.data.type == "GET_NONCE") {
    const installedWallets = await getInstalledWallets();
    const currentWallet = installedWallets.find((obj) => {
      return obj.id === event.data.data?.wallet;
    });
    // try {
    const result = await currentWallet?.provider.callContract(
      {
        contractAddress: event.data.data.guildAddress,
        entrypoint: "get_nonce",
        calldata: [],
      },
      {
        blockIdentifier: "pending",
      }
    );
    window.postMessage({
      type: "GET_NONCE_RES",
      data: result,
      extensionId: extensionId,
    });
    // } catch (e) {
    //   console.log(e);
    // }
    // const output = event.data.data.toString(16);
    // const { contract: guildContract } = useContract({
    //   abi: GuildContract as Abi,
    //   address: /^0x/.test(output) ? output : "0x" + output,
    // });
    // const { data: nonceResult } = useStarknetCall({
    //   contract: guildContract,
    //   method: "get_nonce",
    //   args: [],
    // });
    // console.log(nonceResult);
    // window.postMessage({
    //   type: "GET_NONCE_RES",
    //   data: nonceResult,
    //   extensionId: extensionId,
    // });
  }
});
