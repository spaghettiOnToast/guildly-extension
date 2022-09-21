import { createTheme } from "@mui/material/styles";
import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";
import { colord } from "colord";

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

const white = "#FFFFFF";
const black = "#000000";

export const colors = {
  white,
  black,

  bg1: "#161616",
  bg2: "#333332",
  bg3: "#474747",
  bg4: "#5f5e5c",
  bg5: "#fafafa",
  bg6: "#393939",

  text1: white,
  text2: "#8f8e8c",
  text3: "#5c5b59",
  text4: "#c2c0be",

  red1: "#c12026",
  red2: "#ff675c",
  red3: "#ff875b",
  red4: "#f36a3d",

  blue0: "#0078a4",
  blue1: "#29c5ff",
  blue2: "#94e2ff",

  yellow1: "#ffbf3d",

  green1: "#02bba8",
  green2: "#02a697",
};

export const components = {
  button: {
    default: {
      fg: {
        base: colors.text1,
        disabled: colord(colors.text1).alpha(0.5).toRgbString(),
      },
      bg: {
        base: "rgba(255, 255, 255, 0.15)",
        hover: "rgba(255, 255, 255, 0.25)",
        disabled: "rgba(255, 255, 255, 0.15)",
      },
    },
    "warn-high": {
      bg: {
        base: colors.red4,
        hover: colord(colors.red4).saturate(1).lighten(0.075).toRgbString(),
        disabled: colord(colors.red4).alpha(0.5).toRgbString(),
      },
    },
    warn: {
      bg: {
        base: colors.yellow1,
        hover: colord(colors.yellow1).saturate(1).lighten(0.075).toRgbString(),
        disabled: colord(colors.yellow1).alpha(0.5).toRgbString(),
      },
    },
    danger: {
      bg: {
        base: colors.red1,
        hover: colord(colors.red1).lighten(0.075).toRgbString(),
        disabled: colord(colors.red1).alpha(0.5).toRgbString(),
      },
    },
    info: {
      bg: {
        base: colors.blue0,
        hover: colord(colors.blue0).lighten(0.075).toRgbString(),
        disabled: colord(colors.blue0).alpha(0.5).toRgbString(),
      },
    },
    transparent: {
      bg: {
        base: "transparent",
        hover: "rgba(255, 255, 255, 0.075)",
        disabled: "transaprent",
      },
    },
    radius: "500px",
    transition: "color 200ms ease-in-out, background-color 200ms ease-in-out",
  },
};

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
  margin: {
    extensionInTab: "10%",
  },
  ...components,
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
