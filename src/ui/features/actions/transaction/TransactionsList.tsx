import { isArray } from "lodash-es";
import { FC, useMemo } from "react";
import { Call } from "starknet";

import { TransactionDetails } from "./TransactionDetails";

export interface ITransactionsList {
  networkId: string;
  transactions: Call | Call[];
}

/** Renders one or more transactions with review if available */

export const TransactionsList: FC<ITransactionsList> = ({
  networkId,
  transactions,
}) => {
  const transactionsArray: Call[] = useMemo(
    () => (isArray(transactions) ? transactions : [transactions]),
    [transactions]
  );
  return transactionsArray.map((transaction, index) => (
    <TransactionDetails key={index} transaction={transaction} />
  ));
};
