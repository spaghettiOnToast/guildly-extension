import { FC, useEffect, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import { routes } from "./routes";
import { actionStore } from "../shared/storage/actionStore";
import { useActions } from "./features/actions/action.state";
import { useEntryRoute } from "./useEntryRoute";
import { SelectWallet } from "./features/onboarding/SelectWallet";
import { SelectGuild } from "./features/onboarding/SelectGuild";
import { WelcomeScreen } from "./features/onboarding/WelcomeScreen";
import { ActionScreen } from "./features/actions/ActionScreen";
import { SettingsScreen } from "./features/settings/SettingsScreen";

import { Home } from "./features/guild/Home";

export const ScrollBehaviour = styled.div`
  height: 100vh;
  overflow-y: auto;

  overscroll-behavior: none;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

export const ResponsiveBehaviour = styled.div`
  ${(props) => props.theme.breakpoints.up("sm")} {
    margin: 0 ${(props) => props.theme.margin.extensionInTab};
  }
`;

const Viewport: FC = () => (
  <ScrollBehaviour>
    <ResponsiveBehaviour>
      <Outlet />
    </ResponsiveBehaviour>
  </ScrollBehaviour>
);

const onboardRoutes = (
  <>
    <Route path={routes.welcome.path} element={<WelcomeScreen />} />
    <Route path={routes.selectWallets.path} element={<SelectWallet />} />
    <Route path={routes.selectGuilds.path} element={<SelectGuild />} />
  </>
);

const guildRoutes = <Route path={routes.home.path} element={<Home />} />;

export const AppRoutes: FC = () => {
  useEntryRoute();
  const actions = useActions();

  console.log(actions[0]);

  return (
    <Routes>
      <Route element={<Viewport />}>
        {onboardRoutes}
        {actions[0] ? (
          <Route path="*" element={<ActionScreen />} />
        ) : (
          guildRoutes
        )}
      </Route>
    </Routes>
  );
};
