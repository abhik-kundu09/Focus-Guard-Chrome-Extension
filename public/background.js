chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📩 Message received:", message);

  if (message.type !== "BLOCK_SITES") {
    sendResponse({ success: false });
    return;
  }

  const sites = message.sites;

  if (!Array.isArray(sites) || sites.length === 0) {
    console.error("❌ Invalid sites:", sites);
    sendResponse({ success: false });
    return;
  }

  // 🔥 CLEAR ALL OLD RULES FIRST
  chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
    const removeIds = existingRules.map(r => r.id);

    const newRules = sites.map((site, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: `||${site}^`,
        resourceTypes: ["main_frame"]
      }
    }));

    chrome.declarativeNetRequest.updateDynamicRules(
      {
        removeRuleIds: removeIds,
        addRules: newRules
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error("❌ DNR Error:", chrome.runtime.lastError.message);
          sendResponse({ success: false });
        } else {
          console.log("✅ Blocking rules applied:", newRules);
          sendResponse({ success: true });
        }
      }
    );
  });

  return true; // REQUIRED
});
