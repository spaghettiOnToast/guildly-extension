import { isArray } from "lodash-es";
import { Call } from "starknet";
import { getSelectorFromName } from "starknet/dist/utils/hash";
import { transformCallsToMulticallArrays } from "starknet/utils/transaction";
import { padAddress } from "../../ui/utils/address";

export const formatTransaction = (guild: any, transactions: any) => {
  const transactionsArray: Call[] = isArray(transactions)
    ? transactions
    : [transactions];
  const guildAddress = guild;
  const { callArray, calldata } =
    transformCallsToMulticallArrays(transactionsArray);
  const callArrayValues = Object.values(...callArray);
  const formattedTransaction = {
    calldata: [
      callArray.length.toString(),
      ...callArrayValues,
      calldata.length.toString(),
      ...calldata,
      "0",
    ],
    entrypoint: "execute_transactions",
    contractAddress: guildAddress,
  };
  return formattedTransaction;
};
