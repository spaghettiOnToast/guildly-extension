import { FC } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../../components/Button";
import { P } from "../../components/Typography";
import { Greetings, GreetingsWrapper } from "./Greetings";

import { routes } from "../../routes";

const WelcomeScreenWrapper = styled.div`
  padding: 70px 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > ${GreetingsWrapper} {
    text-align: center;
  }

  > ${Button} {
    margin-top: 64px;
  }
`;

const LogoWrapper = styled.img`
  width: 100px;
`;

const greetings = [
  "gm m'lord",
  "greetings traveller",
  "who goes there?",
  "friendly?",
  "hail fellow, well met",
];

export const WelcomeScreen: FC = () => {
  const navigate = useNavigate();

  return (
    <WelcomeScreenWrapper>
      <LogoWrapper src={"assets/logo.svg"} />
      <P>Implementing guilds on StarkNet</P>
      <Greetings greetings={greetings} />
      <Button
        onClick={() => {
          navigate(routes.selectWallets());
        }}
      >
        Connect wallet
      </Button>
    </WelcomeScreenWrapper>
  );
};
