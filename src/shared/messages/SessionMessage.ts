import { BaseGuildAccount, GuildAccount } from "../guild.model";

export type SessionMessage =
  | { type: "STOP_SESSION" }
  | { type: "HAS_SESSION" }
  | { type: "HAS_SESSION_RES"; data: boolean }
  | { type: "IS_INITIALIZED" }
  | {
      type: "IS_INITIALIZED_RES";
      data: { initialized: boolean };
    }
  | { type: "START_SESSION" }
  | { type: "START_SESSION_REJ" }
  | { type: "START_SESSION_RES"; data?: BaseGuildAccount };
