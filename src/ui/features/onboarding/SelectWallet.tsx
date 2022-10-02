import { useEffect, useState } from "react";
import { FC } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { P, H1, H2 } from "../../components/Typography";
import { routes } from "../../routes";
import {
  getInstalledWallets,
  connectWallet,
  getWallet,
} from "../../services/getMessages";
import { Header } from "../../components/Header";
import { BackButton } from "../../components/BackButton";
import { storeAccount } from "../../../shared/storage/accounts";
import Spinner from "../../components/spinner";
import { approveAction, rejectAction } from "../../services/backgroundActions";
import { getWallets } from "../../../shared/wallets/store";

const SelectWalletWrapper = styled.div`
  padding: 40px 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const WalletButtonsArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const WalletButton = styled.button`
  all: unset;
  color: white;
  background-color: #293b55;
  border: 2px #4595d6 solid;
  display: flex;
  align-items: center;
  border-radius: 15px;
  height: 40px;
  margin-left: 7.5px;
  padding: 20px;
  cursor: pointer;
`;

const WalletButtonIcon = styled.img`
  width: 50px;
`;

const LoadingIcon = styled.div`
  height: 50px;
`;

export const SelectWallet: FC = () => {
  const navigate = useNavigate();

  const [executedGetWallets, setExecutedGetWallets] = useState(false);
  const [executedConnectWallet, setExecutedConnectWallet] = useState(false);

  const [wallets, setWallets] = useState(null);

  // if (!executedGetWallets) {
  //   const getWallets = async () => {
  //     const wallets = await getInstalledWallets().then((msg) => {
  //   for (var i = 0; i < msg.data.length; i++) {
  //     if (msg.data[i].id == "guildly") {
  //       msg.data.splice(i, 1);
  //     }
  //   }
  //   return msg.data;
  // });
  //     return setWallets(wallets);
  //   };
  //   getWallets();
  //   setExecutedGetWallets(true);
  // }

  if (!executedGetWallets) {
    const getInstalledWallets = async () => {
      const wallets = await getWallets().then((data) => {
        for (var i = 0; i < data.length; i++) {
          if (data[i].id == "guildly") {
            data.splice(i, 1);
          }
        }
        return data;
      });
      return setWallets(wallets);
    };
    getInstalledWallets();
    setExecutedGetWallets(true);
  }

  console.log(wallets);

  return (
    <>
      <Header>
        <BackButton />
      </Header>
      <SelectWalletWrapper>
        <H2>Select Wallet</H2>
        <WalletButtonsArea>
          {wallets ? (
            wallets.map((wallet, key) => (
              <WalletButton
                key={key}
                onClick={async () => {
                  const currentWallet = await connectWallet(wallet);
                  storeAccount(currentWallet);
                  navigate(routes.selectGuilds());
                }}
              >
                <WalletButtonIcon src={wallet.icon} />
                <P>Connect to {wallet.name}</P>
              </WalletButton>
            ))
          ) : (
            <LoadingIcon>
              <Spinner color={"#a9d1ff"} />
            </LoadingIcon>
          )}
        </WalletButtonsArea>
      </SelectWalletWrapper>
    </>
  );
};
