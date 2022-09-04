export function getActiveTabURL() {
  let queryOptions = { currentWindow: true, active: true };
  chrome.tabs.query(queryOptions, function (tab) {
    chrome.tabs.sendMessage(tab[0].id, message);
  });
}
