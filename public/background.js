chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    focusMode: false,
    blockedSites: ["youtube.com", "instagram.com"]
  });
});

chrome.storage.onChanged.addListener(() => {
  updateBlockingRules();
});

function updateBlockingRules() {
  chrome.storage.local.get(["focusMode", "blockedSites"], (data) => {
    const rules = [];

    if (data.focusMode) {
      data.blockedSites.forEach((site, index) => {
        rules.push({
          id: index + 1,
          priority: 1,
          action: {
            type: "redirect",
            redirect: { extensionPath: "/blocked.html" }
          },
          condition: {
            urlFilter: site,
            resourceTypes: ["main_frame"]
          }
        });
      });
    }

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 1),
      addRules: rules
    });
  });
}
updateBlockingRules();