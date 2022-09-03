import { FC, useState } from "react";
import styled from "styled-components";
import { Call } from "starknet";
import { P, H1, H2 } from "../../components/Typography";

const ApproveTransactionWrapper = styled.div`
  padding: 20px 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface ApproveTransactionProps {
  transactions: Call | Call[];
}

export const ApproveTransaction: FC<ApproveTransactionProps> = ({
  transactions,
}) => {
  return (
    <>
      <ApproveTransactionWrapper>
        <H2>Confirm Transaction</H2>
      </ApproveTransactionWrapper>
    </>
  );
};
