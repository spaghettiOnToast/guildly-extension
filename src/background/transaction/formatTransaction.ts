import { isArray } from "lodash-es";
import { Call } from "starknet";
import { getSelectorFromName } from "starknet/dist/utils/hash";

export const formatTransaction = (guild: any, transactions: any) => {
  const transactionsArray: Call[] = isArray(transactions)
    ? transactions
    : [transactions];
  const guildAddress = guild;
  const newTransactionArray = <any[]>[];
  for (var i = 0; i < transactionsArray.length; i++) {
    newTransactionArray.push(transactionsArray[i].contractAddress);
    newTransactionArray.push(
      getSelectorFromName(transactionsArray[i].entrypoint)
    );
    newTransactionArray.push(...[transactionsArray[i].calldata]);
  }
  const formattedTransaction = {
    calldata: newTransactionArray,
    entrypoint: "execute_transactions",
    contractAddress: guildAddress,
  };
  return formattedTransaction;
};
