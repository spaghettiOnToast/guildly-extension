import { FC, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { H1, H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { Header } from "../../components/Header";
import { BackButton } from "../../components/BackButton";
import { useQuery } from "@apollo/client";
import { getAccountGuilds, getGuildNames } from "../../../graphql/queries";
import { indexAddress } from "../../utils/address";
import deploymentsConfig from "../../../../deployments-config.json";
import { exposeGuild } from "../../services/getMessages";
import { accountStore } from "../../../shared/storage/accounts";
import { useDisplayName } from "../../utils/address";
import { storeGuild } from "../../../shared/storage/guilds";
import { aggregateJoined } from "../../utils/aggregations";
import { toBN } from "starknet/dist/utils/number";
import { feltToString } from "../../utils/felt";
import { getImage } from "../getImage";
import Spinner from "../../components/spinner";
import { startSession } from "../../services/backgroundSessions";
import { connectAccount } from "../../services/backgroundAccounts";
import {
  useAccounts,
  useSelectedAccountStore,
} from "../accounts/accounts.state";
import {
  getInstalledWallets,
  connectWallet,
  getWallet,
} from "../../services/getMessages";
import cloneDeep from "lodash.clonedeep";

const SelectGuildsWrapper = styled.div`
  padding: 40px 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GuildButtonsArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const GuildButton = styled.button`
  all: unset;
  color: white;
  background-color: #293b55;
  border: 2px rgb(252, 193, 105) solid;
  display: flex;
  align-items: center;
  border-radius: 15px;
  height: 40px;
  margin-left: 7.5px;
  padding: 20px;
  cursor: pointer;
`;

const GuildDisplay = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const GuildImage = styled.img`
  border-radius: 12px;
  clip-path: circle(50% at 50% 50%);
  height: 50px;
  will-change: transform;
`;

const GuildNameDisplay = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingIcon = styled.div`
  height: 50px;
`;

export const SelectGuild: FC = () => {
  const navigate = useNavigate();

  console.log(accountStore);

  const {
    loading: accountGuildLoading,
    error: accountGuildsError,
    data: accountGuildsData,
    refetch: accountGuildsRefetch,
    fetchMore: accountGuildsFetchMore,
  } = useQuery(getAccountGuilds, {
    variables: {
      certificate: indexAddress(
        deploymentsConfig["networks"]["goerli"]["guild_certificate"]
      ),
      account: accountStore
        ? accountStore[accountStore.length - 1].account.address
        : "0x0",
    },
    pollInterval: 10000,
  });

  const accountGuilds = accountGuildsData ? accountGuildsData.event : [];

  const aggregatedGuilds = aggregateJoined(accountGuilds);

  const guilds: any[] = [];

  if (accountGuildsData) {
    for (var i = 0; i < aggregatedGuilds.length; i++) {
      guilds[i] = aggregatedGuilds[i].arguments[1].value;
    }
  }

  const formattedGuilds: any[] = [];

  for (var i = 0; i < guilds.length; i++) {
    formattedGuilds[i] = JSON.stringify(guilds[i]);
  }

  const {
    loading: accountGuildNamesLoading,
    error: accountGuildNamesError,
    data: accountGuildNamesData,
    refetch: accountGuildNamesRefetch,
    fetchMore: accountGuildNamesFetchMore,
  } = useQuery(getGuildNames, {
    variables: {
      manager: indexAddress(
        deploymentsConfig["networks"]["goerli"]["guild_manager"]
      ),
      guilds: formattedGuilds,
    },
  });

  // const guildAccount = {
  //   account: {

  //   }
  // }

  const guildNames = accountGuildNamesData ? accountGuildNamesData.event : [];

  // if (accountGuilds.length > 0) {
  //   for (var i = 0; i < accountGuilds.length; i++) {
  //     storeGuild(accountGuilds[i]);
  //   }
  // }

  return (
    <>
      <Header>
        <BackButton />
      </Header>
      <SelectGuildsWrapper>
        <H2>Select Guild</H2>
        <GuildButtonsArea>
          {accountGuildsData ? (
            guildNames.length > 0 ? (
              guildNames.map((guild, key) => (
                <GuildButton
                  key={key}
                  onClick={async () => {
                    const currentGuild = cloneDeep(
                      accountStore[accountStore.length - 1]
                    );
                    currentGuild.account.address =
                      guild.arguments[2].value.toLowerCase();
                    await startSession();
                    console.log("made it");
                    connectAccount(currentGuild);
                    console.log("and here");
                    storeGuild(currentGuild);
                    navigate(routes.home());
                  }}
                >
                  <GuildDisplay>
                    <GuildImage src={getImage()} alt="A warrior" />
                    <GuildNameDisplay>
                      <P>{feltToString(toBN(guild.arguments[0].value))}</P>
                      <P>
                        {useDisplayName(guild.arguments[2].value.toLowerCase())}
                      </P>
                    </GuildNameDisplay>
                  </GuildDisplay>
                </GuildButton>
              ))
            ) : (
              <P>No guilds found.</P>
            )
          ) : accountGuildsError ? (
            <P>{accountGuildsError.message}</P>
          ) : (
            <LoadingIcon>
              <Spinner color={"#a9d1ff"} />
            </LoadingIcon>
          )}
        </GuildButtonsArea>
      </SelectGuildsWrapper>
    </>
  );
};
