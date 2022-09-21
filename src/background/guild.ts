import browser from "webextension-polyfill";

import {
  Network,
  defaultNetwork,
  defaultNetworks,
  getProvider,
} from "../shared/network";
import {
  IArrayStorage,
  IKeyValueStorage,
  IObjectStorage,
  KeyValueStorage,
  ObjectStorage,
} from "../shared/storage";
import { BaseGuildAccount, GuildAccount } from "../shared/guild.model";

const isDev = process.env.NODE_ENV === "development";

export const SESSION_DURATION = isDev ? 24 * 60 * 60 : 30 * 60; // 30 mins in prod, 24 hours in dev

export interface WalletSession {
  secret: string;
}

export const guildStore = new ObjectStorage<BaseGuildAccount | null>(null, {
  namespace: "core:wallet",
  areaName: "local",
});

export const sessionStore = new ObjectStorage<WalletSession | null>(null, {
  namespace: "core:wallet:session",
  areaName: "session",
});

export type GetNetwork = (networkId: string) => Promise<Network>;

export class Guild {
  constructor(
    private readonly guildStore: IObjectStorage<BaseGuildAccount | null>,
    private readonly sessionStore: IObjectStorage<WalletSession | null>
  ) {}

  public async isSessionOpen(): Promise<boolean> {
    return (await this.sessionStore.get()) !== null;
  }

  public async startSession(): Promise<boolean> {
    // session has already started
    const session = await this.sessionStore.get();
    if (session) {
      return true;
    }
    console.log(session);

    try {
      await this.setSession("123");

      return true;
    } catch {
      return false;
    }
  }

  public async addAccount(
    address: string
  ): Promise<{ account: BaseGuildAccount }> {
    const session = await this.sessionStore.get();
    if (!this.isSessionOpen() || !session) {
      throw Error("no open session");
    }

    const account: BaseGuildAccount = {
      address: address,
      networkId: "",
    };

    await this.guildStore.set(account);

    return { account };
  }

  public async getAccount(): Promise<BaseGuildAccount> {
    const account = await this.guildStore.get();
    return account;
  }

  public async getSelectedAccount(): Promise<BaseGuildAccount | undefined> {
    if (!this.isSessionOpen()) {
      return;
    }
    const account = await this.guildStore.get();
    return account;
  }

  public async lock() {
    await this.sessionStore.set(this.sessionStore.defaults);
  }

  private async setSession(secret: string) {
    await this.sessionStore.set({ secret });

    browser.alarms.onAlarm.addListener(async (alarm) => {
      if (alarm.name === "session_timeout") {
        return this.lock();
      }
    });

    const alarm = await browser.alarms.get("session-timeout");
    if (alarm?.name !== "session-timeout") {
      browser.alarms.create("session_timeout", {
        delayInMinutes: SESSION_DURATION,
      });
    }
  }
}
