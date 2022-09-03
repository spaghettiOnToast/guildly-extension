import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

export const extensionIsInTab = async () => {
  return Boolean(await browser.tabs.getCurrent());
};

export const useExtensionIsInTab = () => {
  const [isInTab, setIsInTab] = useState(false);
  useEffect(() => {
    const init = async () => {
      const inTab = await extensionIsInTab();
      setIsInTab(inTab);
    };
    init();
  }, []);
  return isInTab;
};
