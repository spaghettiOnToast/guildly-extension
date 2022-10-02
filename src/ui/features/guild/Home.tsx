import { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { H1, H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { Header } from "../../components/Header";
import { LockButton } from "../../components/LockButton";
import { BackButton } from "../../components/BackButton";
import { accountStore } from "../../../shared/storage/accounts";
import { guildStore } from "../../../shared/storage/guilds";
import { useDisplayName } from "../../utils/address";
import { toBN } from "starknet/dist/utils/number";
import { ProfilePicture } from "./ProfilePicture";
import { getImage } from "../getImage";
import {
  useAccount,
  useSelectedAccountStore,
} from "../accounts/accounts.state";
import { getSelectedAccount } from "../../services/backgroundAccounts";
import { getAccount } from "../../../shared/account/store";

const HomeWrapper = styled.div`
  padding: 20px 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GuildImage = styled.img`
  border-radius: 12px;
  clip-path: circle(50% at 50% 50%);
  height: 100px;
  will-change: transform;
`;

export const Home: FC = () => {
  const [account, setAccount] = useState<any>(null);
  const [executedGetAccount, setExecutedGetAccount] = useState<any>(null);

  if (!executedGetAccount) {
    const getSelectedAccount = async () => {
      const account = await getAccount().then((data) => {
        return data;
      });
      console.log(account);
      return setAccount(account);
    };
    getSelectedAccount();
    setExecutedGetAccount(true);
  }
  console.log(account);

  const formatAccount = account
    ? account
    : {
        address: "",
        account: "",
        network: "",
      };
  return (
    <>
      <Header>
        <Link role="button" aria-label="Show guild list" to={routes.guilds()}>
          <ProfilePicture src={getImage()} />
        </Link>
        <LockButton to={routes.welcome()} />
      </Header>
      <HomeWrapper>
        <H2>Wallet {useDisplayName(formatAccount.account)}</H2>
        <P>Connected to guild {useDisplayName(formatAccount.address)}</P>
      </HomeWrapper>
    </>
  );
};
