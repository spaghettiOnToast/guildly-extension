import { isArray } from "lodash-es";
import { FC, useState, useCallback, FormEvent } from "react";
import styled from "styled-components";
import { Call } from "starknet";
import { P, H1, H2 } from "../../components/Typography";
import { Button } from "../../components/Button";
import { Account } from "../accounts/Account";
import { ConfirmPageProps, ConfirmScreen } from "./ConfirmScreen";
import { formatTransaction } from "./transaction/formatTransaction";
import { useAppState } from "../../app.state";
import { TransactionsList } from "./transaction/TransactionsList";
import { AccountAddressField } from "./transaction/fields/AccountAddressField";
import {
  Field,
  FieldGroup,
  FieldKey,
  FieldValue,
} from "../../components/Fields";
import { guildStore } from "../../../shared/storage/guilds";

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
  const { switcherNetworkId } = useAppState();
  if (!selectedAccount) {
    // return <Navigate to={routes.accounts()} />
    return <P>No account connected</P>;
  }

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
        <TransactionsList
          networkId={switcherNetworkId}
          transactions={transactions}
        />
        <FieldGroup>
          <AccountAddressField
            title="Guild"
            // accountAddress={selectedAccount.address}
            // networkId={selectedAccount.network.id}
            accountAddress={selectedAccount.address}
            networkId={selectedAccount.networkId}
          />
          <Field>
            <FieldKey>Network</FieldKey>
            <FieldValue>{selectedAccount.networkId}</FieldValue>
          </Field>
        </FieldGroup>
        {/* <P>{selectedAccount?.address}</P> */}
      </ConfirmScreen>
    </>
  );
};
