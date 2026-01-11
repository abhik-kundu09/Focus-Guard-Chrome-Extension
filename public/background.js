function applyRules(blockedSites) {
  const rules = [];
  let id = 1;

  for (const site in blockedSites) {
    if (blockedSites[site]) {
      rules.push({
        id: id++,
        priority: 1,
        action: { type: "block" },
        condition: {
          urlFilter: site,
          resourceTypes: ["main_frame", "media"]
        }
      });
    }
  }

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 1),
    addRules: rules
  });
}

// Apply rules on startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("blockedSites", (data) => {
    applyRules(data.blockedSites || {});
  });
});

// Apply rules on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("blockedSites", (data) => {
    applyRules(data.blockedSites || {});
  });
});

// Watch for changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedSites) {
    applyRules(changes.blockedSites.newValue || {});
  }
});
