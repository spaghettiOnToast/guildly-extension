import { assertNever } from "./../ui/services/assertNever";
import { getProvider } from "../shared/network/provider";
import { getInstalledWallets } from "get-starknet";
import type {
  AccountChangeEventHandler,
  NetworkChangeEventHandler,
  StarknetWindowObject,
  WalletEvents,
} from "./inpage.model";
import { sendMessage, waitForMessage } from "../shared/messageActions";
import { getIsPreauthorized } from "./preAuthorization";
import { GuildAccount } from "./GuildAccount";
import { GuildAccount3, getProvider3 } from "./GuildAccount3";
import { guildStore } from "../shared/storage/guilds";
import { truncate } from "lodash-es";

const VERSION = `${process.env.VERSION}`;

export const userEventHandlers: WalletEvents[] = [];

// window.ethereum like
export const starknetWindowObject: any = {
  id: "guildly",
  name: "Guildly",
  icon: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCEtLSBHZW5lcmF0ZWQgYnkgUGl4ZWxtYXRvciBQcm8gMi40LjEgLS0+Cjxzdmcgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyR3JhZGllbnQxIiB4MT0iMjIuMTQxNiIgeTE9IjgwLjYwODQiIHgyPSI0OTAuNDYyNCIgeTI9IjMyMi43NzYyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIxZS0wNSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNzk4Y2IwIiBzdG9wLW9wYWNpdHk9IjEiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cGF0aCBpZD0iUGF0aCIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudDEpIiBzdHJva2U9Im5vbmUiIGQ9Ik0gNDk2Ljg5OTk5NCAxMjAuMjk5OTg4IEMgNDI1Ljg5OTk5NCAxNzkuMTAwMDA2IDM0NC43OTk5ODggMTY2Ljg5OTk5NCAzNDQuNzk5OTg4IDE2Ni44OTk5OTQgQyAzMzUuODk5OTk0IDg5LjIwMDAxMiAyNTYgODEuNSAyNTYgODEuNSBDIDI1NiA4MS41IDE3Ni4xMDAwMDYgODkuMjk5OTg4IDE2Ny4xOTk5OTcgMTY3IEMgMTY3LjE5OTk5NyAxNjcgODYuMTk5OTk3IDE3OS4yMDAwMTIgMTUuMSAxMjAuMzk5OTk0IEMgMTUuMSAxMjAuMzk5OTk0IC04LjIgMTczLjcwMDAxMiAxMzUuNSAyMTguMTAwMDA2IEwgMTU0Ljg5OTk5NCAyNDcgTCAxMjkuMzk5OTk0IDI5Mi41IEMgMTExLjU5OTk5OCAzMjIuNSAxMjUgMzI2Ljg5OTk5NCAxMjUgMzI2Ljg5OTk5NCBMIDE1My44OTk5OTQgMzU0LjYwMDAwNiBMIDE4OS4zOTk5OTQgMjg0LjEwMDAwNiBMIDE5Ni4xMDAwMDYgMjIyLjUgTCAyNDMuODAwMDAzIDIzNC43MDAwMTIgTCAyMzQuODk5OTk0IDI4NC4xMDAwMDYgTCAyNTYgMjk2Ljg5OTk5NCBMIDI3Ny4xMDAwMDYgMjg0LjEwMDAwNiBMIDI2OC4yMDAwMTIgMjM0LjcwMDAxMiBMIDMxNS44OTk5OTQgMjIyLjUgTCAzMjIuNjAwMDA2IDI4NC4xMDAwMDYgTCAzNTguMTAwMDA2IDM1NC42MDAwMDYgTCAzODcgMzI2Ljg5OTk5NCBDIDM4NyAzMjYuODk5OTk0IDQwMC4yOTk5ODggMzIyLjUgMzgyLjYwMDAwNiAyOTIuNSBMIDM1NyAyNDYuNzk5OTg4IEwgMzc2LjM5OTk5NCAyMTcuODk5OTk0IEMgNTIwLjIwMDAxMiAxNzMuNjAwMDA2IDQ5Ni44OTk5OTQgMTIwLjI5OTk4OCA0OTYuODk5OTk0IDEyMC4yOTk5ODggWiIvPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXJHcmFkaWVudDIiIHgxPSIxNTkuMDkxIiB5MT0iMzA3LjM2OTkiIHgyPSIzNjYuMzU3NiIgeTI9IjQwNC4yNTM3IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIxZS0wNSIgc3RvcC1jb2xvcj0iI2M4ZDBkOSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNzk4Y2IwIiBzdG9wLW9wYWNpdHk9IjEiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cGF0aCBpZD0icGF0aDEiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQyKSIgc3Ryb2tlPSJub25lIiBkPSJNIDI5OC4yMDAwMTIgMzAxLjIwMDAxMiBMIDI5OC4yMDAwMTIgMzYxLjEwMDAwNiBMIDI3Mi43MDAwMTIgMzcwIEwgMjcyLjcwMDAxMiAzNDEuMTAwMDA2IEwgMjU2LjEwMDAwNiAzNDEuMTAwMDA2IEwgMjM5LjUgMzQxLjEwMDAwNiBMIDIzOS41IDM3MCBMIDIxNCAzNjEuMTAwMDA2IEwgMjE0IDMwMS4yMDAwMTIgTCAxOTAuNjk5OTk3IDMwMS4yMDAwMTIgTCAxNjQuMTAwMDA2IDM2MS4xMDAwMDYgQyAxNjQuMTAwMDA2IDM2MS4xMDAwMDYgMjM5LjE5OTk5NyA0MjQuNzk5OTg4IDI0Mi44OTk5OTQgNDI4IEMgMjQ2LjYwMDAwNiA0MzEuMjAwMDEyIDI1MC41IDQzMC4zOTk5OTQgMjUwLjUgNDMwLjM5OTk5NCBMIDI1Ni4yMDAwMTIgNDMwLjM5OTk5NCBMIDI2MS44OTk5OTQgNDMwLjM5OTk5NCBDIDI2MS44OTk5OTQgNDMwLjM5OTk5NCAyNjUuNzk5OTg4IDQzMS4xMDAwMDYgMjY5LjUgNDI4IEMgMjczLjIwMDAxMiA0MjQuNzk5OTg4IDM0OC4yOTk5ODggMzYxLjEwMDAwNiAzNDguMjk5OTg4IDM2MS4xMDAwMDYgTCAzMjEuNzAwMDEyIDMwMS4yMDAwMTIgTCAyOTguMjAwMDEyIDMwMS4yMDAwMTIgWiIvPgo8L3N2Zz4K",
  account: undefined,
  provider: undefined,
  selectedAddress: undefined,
  chainId: undefined,
  isConnected: false,
  version: VERSION,
  request: async (call) => {
    // if (call.type === "wallet_watchAsset" && call.params.type === "ERC20") {
    //   return await handleAddTokenRequest(call.params);
    // } else if (call.type === "wallet_addStarknetChain") {
    //   return await handleAddNetworkRequest(call.params);
    // } else if (call.type === "wallet_switchStarknetChain") {
    //   return await handleSwitchNetworkRequest(call.params);
    // }
    // throw Error("Not implemented");
  },
  enable: async ({ starknetVersion = "v3" } = {}) => {
    const { starknet_guildly } = window;
    const guildAccountP = Promise.race([
      waitForMessage("CONNECT_GUILD_RES", 10 * 60 * 1000),
      waitForMessage("START_SESSION_RES", 10 * 60 * 1000, (x) =>
        Boolean(x.data)
      ),
    ]);
    sendMessage({
      type: "CONNECT_DAPP",
      data: { host: window.location.host },
    });
    if (!starknet_guildly) {
      throw Error("No starknet object detected");
    }

    const guildAccount = await guildAccountP;

    if (!guildAccount) {
      throw Error("No wallet account (should not be possible)");
    }

    // const { address, network } = guildAccount;

    if (starknetVersion === "v4") {
      const provider = getProvider(guildAccount.provider.baseUrl);
      starknet_guildly.starknetJsVersion = "v4";
      starknet_guildly.provider = provider;
      starknet_guildly.account = new GuildAccount(
        guildAccount.account.address,
        provider
      );
    } else {
      const provider = getProvider(guildAccount.provider.baseUrl);
      starknet_guildly.starknetJsVersion = "v3";
      starknet_guildly.provider = provider;
      starknet_guildly.account = new GuildAccount(
        guildAccount.account.address,
        provider
      );
    }
    starknet_guildly.selectedAddress = guildAccount.account.address;
    starknet_guildly.chainId = guildAccount.chainId;
    starknet_guildly.isConnected = true;

    const installedWallets = await getInstalledWallets();
    const currentWallet = installedWallets.find((obj) => {
      return obj.id === "argentX";
    });

    if (currentWallet?.account?.signer) {
      starknet_guildly.account.signer = currentWallet.account.signer;
    }

    console.log(starknet_guildly);

    return [starknet_guildly.account?.address];
  },
  isPreauthorized: async () => {
    // return getIsPreauthorized();
  },
  on: (event, handleEvent) => {
    // if (event === "accountsChanged") {
    //   userEventHandlers.push({
    //     type: event,
    //     handler: handleEvent as AccountChangeEventHandler,
    //   });
    // } else if (event === "networkChanged") {
    //   userEventHandlers.push({
    //     type: event,
    //     handler: handleEvent as NetworkChangeEventHandler,
    //   });
    // } else {
    //   assertNever(event);
    //   throw new Error(`Unknwown event: ${event}`);
    // }
  },
  off: (event, handleEvent) => {
    // if (event !== "accountsChanged" && event !== "networkChanged") {
    //   assertNever(event);
    //   throw new Error(`Unknwown event: ${event}`);
    // }
    // const eventIndex = userEventHandlers.findIndex(
    //   (userEvent) =>
    //     userEvent.type === event && userEvent.handler === handleEvent
    // );
    // if (eventIndex >= 0) {
    //   userEventHandlers.splice(eventIndex, 1);
    // }
  },
};
