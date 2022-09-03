import { FC, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { H1, H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { Header } from "../../components/Header";
import { BackButton } from "../../components/BackButton";
import { accountStore } from "../../../shared/storage/accounts";
import { guildStore } from "../../../shared/storage/guilds";
import { useDisplayName } from "../../utils/address";
import { toBN } from "starknet/dist/utils/number";
import { getImage } from "../getImage";

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
  return (
    <>
      <Header>
        <Link role="button" aria-label="Show guild list" to={routes.guilds()}>
          <ProfilePicture src={getImage()} />
        </Link>
      </Header>
      <HomeWrapper>
        <H2>Wallet {useDisplayName(accountStore[0].account.address)}</H2>
        <P>Connected to guild {useDisplayName(guildStore[0])}</P>
      </HomeWrapper>
    </>
  );
};
