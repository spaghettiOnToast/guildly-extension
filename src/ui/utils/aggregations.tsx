import { padAddress } from "./address";

export const aggregateJoined = (guildMembers) => {
  const newGuildMembers: any[] = [];

  if (guildMembers) {
    for (var i = 0; i < guildMembers.length; i++) {
      const member = guildMembers[i].arguments.find((obj) => {
        return obj.name === "account";
      });
      if (guildMembers[i].name == "mint_certificate") {
        newGuildMembers[i] = guildMembers[i];
      } else {
        const index = newGuildMembers.findIndex((obj) => {
          obj.member === padAddress(member.value);
        });
        newGuildMembers.splice(index, 1);
      }
    }
  }
  const formattedGuildMembers = newGuildMembers.filter((a) => a);
  return formattedGuildMembers;
};
