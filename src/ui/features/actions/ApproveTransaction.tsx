import { isArray } from "lodash-es";
import { FC, useState, useCallback, FormEvent } from "react";
import styled from "styled-components";
import { Call } from "starknet";
import { P, H1, H2 } from "../../components/Typography";
import { Button } from "../../components/Button";
import { Account } from "../accounts/Account";
import { ConfirmPageProps, ConfirmScreen } from "./ConfirmScreen";
import { formatTransaction } from "./transaction/formatTransaction";

const ApproveTransactionWrapper = styled.div`
  padding: 20px 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface ApproveTransactionProps extends Omit<ConfirmPageProps, "onSubmit"> {
  actionHash: string;
  transactions: Call | Call[];
  onSubmit: (transactions: Call | Call[]) => void;
}

export const ApproveTransaction: FC<ApproveTransactionProps> = ({
  transactions,
  onSubmit,
  selectedAccount,
  actionHash,
  ...props
}) => {
  const transactionsArray: Call[] = isArray(transactions)
    ? transactions
    : [transactions];
  console.log(selectedAccount);
  const formattedTransaction = formatTransaction(transactionsArray);
  console.log(formattedTransaction);
  return (
    <>
      <ConfirmScreen
        title="Confirm Transaction"
        confirmButtonText="Approve"
        selectedAccount={selectedAccount}
        onSubmit={() => {
          onSubmit(transactions);
        }}
        showHeader={false}
        {...props}
      >
        {transactionsArray.map((transaction, index) => (
          <P key={index}>{transaction.entrypoint}</P>
        ))}
        <P>{selectedAccount?.address}</P>
      </ConfirmScreen>
    </>
  );
};
