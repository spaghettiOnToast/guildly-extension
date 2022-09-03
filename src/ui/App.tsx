import { ThemeProvider } from "@mui/material";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { FC, Suspense } from "react";

import { AppRoutes } from "./AppRoutes";
import { useExtensionIsInTab } from "./features/browser/tabs";
import { GlobalStyle, theme } from "./theme";

const client = new ApolloClient({
  uri: "https://starknet-archive.hasura.app/v1/graphql",
  cache: new InMemoryCache(),
});

export const App: FC = () => {
  const extensionIsInTab = useExtensionIsInTab();
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
        <GlobalStyle extensionIsInTab={extensionIsInTab} />
        <AppRoutes />
      </ApolloProvider>
    </ThemeProvider>
  );
};
