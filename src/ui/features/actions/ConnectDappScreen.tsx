import { FC, useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { ColumnCenter } from "../../components/Column";
import { Account } from "../accounts/Account";
import {
  useAccount,
  useSelectedAccountStore,
} from "../accounts/accounts.state";
import { ConfirmPageProps, ConfirmScreen } from "./ConfirmScreen";
import { DappIcon } from "./DappIcon";
import { useDappDisplayAttributes } from "./useDappDisplayAttributes";
import { BaseGuildAccount, GuildAccount } from "../../../shared/guild.model";

interface ConnectDappProps extends Omit<ConfirmPageProps, "onSubmit"> {
  onConnect: (selectedAccount: BaseGuildAccount) => void;
  onDisconnect: (selectedAccount: BaseGuildAccount) => void;
  host: string;
}

const DappIconContainer = styled.div`
  width: 64px;
  height: 64px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 17px;
  margin-top: 16px;
  text-align: center;
`;

const Host = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text2};
  margin-bottom: 8px;
  text-align: center;
`;

const HR = styled.div`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.bg2};
  margin: 16px 0;
`;

const SmallText = styled.div`
  font-size: 13px;
`;

const SelectContainer = styled.div`
  padding-top: 16px;
`;

const List = styled.ul`
  font-size: 15px;
  line-height: 20px;
  margin-top: 8px;
  list-style-position: inside;
`;

const Bullet = styled.li``;

const SmallGreyText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text2};
  margin-left: 20px;
`;

export const ConnectDappScreen: FC<ConnectDappProps> = ({
  onConnect: onConnectProp,
  onDisconnect: onDisconnectProp,
  onReject: onRejectProp,
  host,
  ...rest
}) => {
  const selectedAccount = useAccount();
  console.log(selectedAccount);

  const onConnect = useCallback(() => {
    selectedAccount && onConnectProp(selectedAccount);
  }, [onConnectProp, selectedAccount]);

  const dappDisplayAttributes = useDappDisplayAttributes(host);

  return (
    <ConfirmScreen
      confirmButtonText={"Connect"}
      rejectButtonText={"Reject"}
      onSubmit={onConnect}
      onReject={onRejectProp}
      {...rest}
    >
      <ColumnCenter gap={"4px"}>
        <DappIconContainer>
          <DappIcon host={host} />
        </DappIconContainer>
        <Title>Connect to {dappDisplayAttributes?.title}</Title>
        <Host>{host}</Host>
      </ColumnCenter>
      <HR />
      <SmallText>This dapp will be able to:</SmallText>
      <List>
        <Bullet>Read your wallet address</Bullet>
        <Bullet>Request transactions</Bullet>{" "}
        <SmallGreyText>
          You will still need to sign any new transaction
        </SmallGreyText>
      </List>
    </ConfirmScreen>
  );
};
