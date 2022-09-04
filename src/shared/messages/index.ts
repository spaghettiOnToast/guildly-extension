import { getMessage } from "@extend-chrome/messages";

import { SessionMessage } from "./SessionMessage";
import { MiscenalleousMessage } from "./MiscellaneousMessage";
import { PreAuthorisationMessage } from "./PreAuthorisationMessage";

export const [sendMessage, messageStream, _waitForMessage] =
  getMessage<MessageType>("GUILDLY");

type WalletsMessage =
  | { type: "INSTALLED_WALLETS_RES"; data: any }
  | { type: "GET_INSTALLED_WALLETS_RES" }
  | { type: "GET_INSTALLED_WALLETS" }
  | { type: "CONNECTED_WALLET_RES"; data: any }
  | { type: "EXECUTED_TRANSACTION"; data: any }
  | { type: "OPEN_UI" }
  | { type: "IS_PREAUTHORIZED"; data: any }
  | { type: "EXECUTE_TRANSACTION"; data: any }
  | { type: "EXECUTE_TRANSACTION_RES"; data: any }
  | { type: "GET_ACTIONS_RES"; data: any }
  | { type: "SIGN_MESSAGE_RES"; data: any }
  | { type: "CONNECT_ACCOUNT_RES"; data: any }
  | { type: "GET_NETWORK_STATUSES_RES"; data: any }
  | { type: "DISCONNECT_ACCOUNT" };

export type MessageType =
  | WalletsMessage
  | SessionMessage
  | PreAuthorisationMessage;

export type WindowMessageType = MessageType & {
  forwarded?: boolean;
  extensionId: string;
};

export async function waitForMessage<
  K extends MessageType["type"],
  T extends { type: K } & MessageType
>(
  type: K,
  predicate: (x: T) => boolean = () => true
): Promise<T extends { data: infer S } ? S : undefined> {
  return _waitForMessage(
    ([msg]: any) => msg.type === type && predicate(msg)
  ).then(([msg]: any) => msg.data);
}
