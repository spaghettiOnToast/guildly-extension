import { Network } from "./network";

export interface WalletAccountSigner {
  type: "local_secret";
  derivationPath: string;
}

export interface WithSigner {
  signer: WalletAccountSigner;
}

export interface BaseGuildAccount {
  address: string;
  networkId: string;
}

export interface GuildAccount extends BaseGuildAccount, WithSigner {
  network: Network;
  hidden?: boolean;
}

export type StoredGuildAccount = Omit<GuildAccount, "network">;
