import { isArray } from "lodash-es";
import { Abi, Call } from "starknet";
import { getSelectorFromName } from "starknet/dist/utils/hash";
import { transformCallsToMulticallArrays } from "starknet/utils/transaction";
import { useStarknetCall, useContract } from "@starknet-react/core";
import GuildContract from "../../abis/guild_contract.json";
import { padAddress } from "../../ui/utils/address";
import { sendMessageToActiveTabsAndUi } from "../activeTabs";
import { waitForMessage } from "../../shared/messages";

export const formatTransaction = (
  guild: any,
  transactions: any,
  walletProvider: any,
  nonce: any
) => {
  const transactionsArray: Call[] = isArray(transactions)
    ? transactions
    : [transactions];
  const guildAddress = guild;

  // const output = guildAddress.toString(16);
  // const { contract: guildContract } = useContract({
  //   abi: GuildContract as Abi,
  //   address: /^0x/.test(output) ? output : "0x" + output,
  // });
  // const { data: nonceResult } = useStarknetCall({
  //   contract: guildContract,
  //   method: "get_nonce",
  //   args: [],
  // });

  const { callArray, calldata } =
    transformCallsToMulticallArrays(transactionsArray);
  const callArrayValues = Object.values(...callArray);
  const formattedTransaction = {
    calldata: [
      callArray.length.toString(),
      ...callArrayValues,
      calldata.length.toString(),
      ...calldata,
      nonce[0].toString(),
    ],
    entrypoint: "execute_transactions",
    contractAddress: guildAddress,
  };
  return formattedTransaction;
};
