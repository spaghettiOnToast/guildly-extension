import { guildStore } from "../../../../shared/storage/guilds";

export const formatTransaction = async (transaction: any) => {
  const currentGuild = await guildStore.getSelectedAccount();
  const formattedTransaction = {};
};
