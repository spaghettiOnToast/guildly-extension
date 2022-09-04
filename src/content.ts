import browser from "webextension-polyfill";
import { sendMessage, messageStream } from "./shared/messages";

const container = document.head || document.documentElement;
const script = document.createElement("script");

script.src = browser.runtime.getURL("inpage.js");
const guildlyExtensionId = browser.runtime.id;
script.id = "guildly-extension";
script.setAttribute("data-extension-id", guildlyExtensionId);

container.insertBefore(script, container.children[0]);

chrome.runtime.onMessage.addListener((obj, sender, response) => {
  // console.log(obj);
  window.postMessage(
    { ...obj, forwarded: true, extensionId: guildlyExtensionId },
    window.location.origin
  );
});

window.addEventListener("message", function (event: any) {
  console.log(event.data);
  if (
    !event.data?.forwarded &&
    event.data?.extensionId === guildlyExtensionId
  ) {
    sendMessage({ ...event.data });
  }
});

messageStream.subscribe(([msg]: any) => {
  // console.log(msg);
  window.postMessage(
    { ...msg, forwarded: true, extensionId: guildlyExtensionId },
    window.location.origin
  );
});
