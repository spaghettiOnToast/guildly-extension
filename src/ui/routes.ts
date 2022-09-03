import { isString } from "lodash-es";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const route = <T extends (..._: any[]) => string>(
  ...[value, path]: [routeAndPath: string] | [routeWithParams: T, path: string]
): T & { path: string } => {
  if (isString(value)) {
    return Object.defineProperty((() => value) as any, "path", { value });
  }
  return Object.defineProperty(value as any, "path", { value: path });
};

/** a route function with a `returnTo` query parameter */

export const routeWithReturnTo = (route: string) => {
  const returnTo = (returnTo?: string) =>
    returnTo ? `${route}?returnTo=${encodeURIComponent(returnTo)}` : route;
  returnTo.path = route;
  return returnTo;
};

/** hook that builds on useLocation to parse query string */

export const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

/** hook to get the `returnTo` query parameter */

export const useReturnTo = () => {
  /** get() returns null for missing value, cleaner to return undefined */
  return useQuery().get("returnTo") || undefined;
};

export const routes = {
  welcome: route("/index.html"),
  selectWallets: route("/wallet"),
  selectGuilds: route("/guilds"),
  home: route("/home"),
  guilds: route("/guilds"),
};
