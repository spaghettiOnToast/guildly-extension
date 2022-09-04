import { GuildAccount } from "../guild.model";

export type PreAuthorisationMessage =
  | { type: "CONNECT_DAPP"; data: { host: string } }
  | { type: "CONNECT_DAPP_RES"; data: GuildAccount }
  | { type: "IS_PREAUTHORIZED"; data: string }
  | { type: "IS_PREAUTHORIZED_RES"; data: boolean }
  | {
      type: "REJECT_PREAUTHORIZATION";
      data: { host: string; actionHash: string };
    };
