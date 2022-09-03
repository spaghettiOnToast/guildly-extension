import { createTheme } from "@mui/material/styles";
import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

/**
 * Adds additional variables to the theme
 *
 * @see https://mui.com/material-ui/customization/theming/#custom-variables
 */

declare module "@mui/material/styles" {
  interface Theme {
    margin: {
      extensionInTab: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    margin?: {
      extensionInTab?: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
  margin: {
    extensionInTab: "10%",
  },
});

export interface GlobalStyleProps {
  extensionIsInTab: boolean;
}

export const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  ${normalize}

  body {
    font-family: Verdana, sans-serif;
    -webkit-font-smoothing: antialiased;
    background:     radial-gradient(at top 35% left 45%,
      #0d1a286c,
      transparent 35%),
    radial-gradient(at bottom center,
      #0d1d2852,
      transparent 35%),
    radial-gradient(circle at top -5% left 35%,
      #0d1d288a,
      transparent 25%),
    radial-gradient(circle at top 15% left 20%,
      #0d1e288a,
      transparent 25%),
    radial-gradient(at top 65% left 5%,
      rgba(71, 131, 187, 0.623),
      transparent 50%),
    radial-gradient(at top 10% left 80%,
      #0d1d288a,
      transparent 60%),
    radial-gradient(at top 80% left 75%,
      #0d19288a,
      transparent 40%),
    radial-gradient(circle at top 75% left 75%,
      #0d1a288a,
      transparent 25%),
    radial-gradient(at top 30% left 75%,
      rgba(69, 141, 207, 0.623),
      transparent 70%);
    background-color     : #0D1128;
    color: white;
  }

  html, body {
    min-width: 360px;
    min-height: 600px;

    width: ${({ extensionIsInTab }) => (extensionIsInTab ? "unset" : "360px")};
    height: ${({ extensionIsInTab }) => (extensionIsInTab ? "unset" : "600px")};
    
    overscroll-behavior: none;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    &::-webkit-scrollbar { /* Chrome, Safari, Opera */
      display: none;
    }
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    margin-block: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
