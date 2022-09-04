import { getNetwork } from "../network";
import { StoredGuildAccount, GuildAccount } from "../guild.model";

export function serialize(accounts: GuildAccount[]): StoredGuildAccount[] {
  return accounts.map((account) => {
    const { network, ...accountWithoutNetwork } = account;
    return accountWithoutNetwork;
  });
}

export async function deserialize(
  accounts: StoredGuildAccount[]
): Promise<GuildAccount[]> {
  return Promise.all(
    accounts.map(async (account) => {
      const network = await getNetwork(account.networkId);
      return {
        ...account,
        network,
      };
    })
  );
}
