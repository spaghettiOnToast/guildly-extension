import browser from "webextension-polyfill";
import { sendMessage, messageStream } from "./shared/messages";

const container = document.head || document.documentElement;
const script = document.createElement("script");

script.src = browser.runtime.getURL("inpage.js");
const guildlyExtensionId = browser.runtime.id;
script.id = "guildly-extension";
script.setAttribute("data-extension-id", guildlyExtensionId);

container.insertBefore(script, container.children[0]);

const argentExtensionId = document
  .getElementById("argent-x-extension")
  ?.getAttribute("data-extension-id");

chrome.runtime.onMessage.addListener((obj, sender, response) => {
  window.postMessage(
    { ...obj, forwarded: true, extensionId: guildlyExtensionId },
    window.location.origin
  );
});

window.addEventListener("message", function (event: any) {
  if (
    !event.data?.forwarded &&
    event.data?.extensionId === guildlyExtensionId
  ) {
    sendMessage({ ...event.data });
  }
});

messageStream.subscribe(([msg]: any) => {
  window.postMessage(
    { ...msg, forwarded: true, extensionId: guildlyExtensionId },
    window.location.origin
  );
});
