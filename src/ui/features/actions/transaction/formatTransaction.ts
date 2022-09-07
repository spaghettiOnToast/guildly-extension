import { isArray } from "lodash-es";
import { Call } from "starknet";
import { guildStore } from "../../../../shared/storage/guilds";
import { getSelectorFromName } from "starknet/dist/utils/hash";

export const formatTransaction = async (transactions: any) => {
  // const currentGuild = await guildStore.getSelectedAccount();
  const transactionsArray: any[] = isArray(transactions)
    ? transactions
    : [transactions];
  const currentGuild =
    "0x3fde9d8999c9fddd73a5a0d3515408f74f12935465beaa27943d64ffd6abd06";
  const newTransactionArray = <any[]>[];
  for (var i = 0; i < transactionsArray.length; i++) {
    newTransactionArray.push(transactionsArray[i].contractAddress);
    newTransactionArray.push(
      getSelectorFromName(transactionsArray[i].entrypoint)
    );
    newTransactionArray.push(...transactionsArray[i].calldata);
  }
  const formattedTransaction = {
    calldata: newTransactionArray,
    entrypoint: "execute_transactions",
    contractAddress: currentGuild,
  };
  return formattedTransaction;
};
