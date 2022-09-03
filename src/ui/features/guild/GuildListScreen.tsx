import { FC, useState } from "react";
import { Header } from "../../components/Header";
import styled from "styled-components";
import { H1, P } from "../../components/Typography";
import { IconButton } from "../../components/IconButton";
import { makeClickable } from "../../services/a11y";
import { SettingsIcon } from "../../components/Icons/MuiIcons";

// const AccountListWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   position: relative;

//   ${H1} {
//     text-align: center;
//   }

//   > ${GuildList} {
//     width: 100%;
//   }
// `;

export const GuildListScreen: FC = () => {
  return (
    <Header>
      <IconButton
        size={36}
        // {...makeClickable(() => navigate(routes.settings()), {
        //   label: "Settings",
        //   tabIndex: 99,
        // })}
      >
        <SettingsIcon />
      </IconButton>
    </Header>;
  )
};
