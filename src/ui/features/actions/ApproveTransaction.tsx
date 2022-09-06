import { isArray } from "lodash-es";
import { FC, useState, useCallback, FormEvent } from "react";
import styled from "styled-components";
import { Call } from "starknet";
import { P, H1, H2 } from "../../components/Typography";
import { Button } from "../../components/Button";
import { Account } from "../accounts/Account";

const ApproveTransactionWrapper = styled.div`
  padding: 20px 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface ApproveTransactionProps {
  transactions: Call | Call[];
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  onReject?: () => void;
  selectedAccount?: Account;
}

export const ApproveTransaction: FC<ApproveTransactionProps> = ({
  transactions,
  onSubmit,
  onReject,
  selectedAccount,
}) => {
  const transactionsArray: Call[] = isArray(transactions)
    ? transactions
    : [transactions];
  console.log(selectedAccount);
  return (
    <>
      <ApproveTransactionWrapper>
        <H2>Confirm Transaction</H2>
        {transactionsArray.map((transaction, index) => (
          <P key={index}>{transaction.entrypoint}</P>
        ))}
        <P>{selectedAccount?.address}</P>
        <Button onClick={onReject} type="button">
          Reject
        </Button>
      </ApproveTransactionWrapper>
    </>
  );
};
