import { useEffect, useState } from "react";

export default function BlockedSites() {
  const [sites, setSites] = useState({});
  const [input, setInput] = useState("");

useEffect(() => {
  chrome.storage.local.get("blockedSites", (data) => {
    let stored = data.blockedSites;

    // 🧹 MIGRATION: if old array format exists
    if (Array.isArray(stored)) {
      const migrated = {};
      stored.forEach((site) => {
        migrated[site] = true;
      });

      chrome.storage.local.set({ blockedSites: migrated });
      setSites(migrated);
    } 
    // ✅ correct object format
    else if (typeof stored === "object" && stored !== null) {
      setSites(stored);
    } 
    // 🆕 nothing stored yet
    else {
      setSites({});
    }
  });
}, []);


  const addSite = () => {
    if (!input.trim()) return;

    const domain = input
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "");

    const updated = { ...sites, [domain]: true };
    setSites(updated);
    chrome.storage.local.set({ blockedSites: updated });
    setInput("");
  };

  const toggleSite = (site) => {
    const updated = { ...sites, [site]: !sites[site] };
    setSites(updated);
    chrome.storage.local.set({ blockedSites: updated });
  };

  return (
    <div>
      <h4>🌐 Website Control</h4>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="example.com"
      />

      <button onClick={addSite}>Add</button>

      <ul>
  {Object.entries(sites)
    .filter(([site]) => site.includes(".")) // 🛡️ ignore 0,1,etc
    .map(([site, blocked]) => (
      <li key={site}>
        {site}
        <button onClick={() => toggleSite(site)}>
          {blocked ? "Unblock" : "Block"}
        </button>
      </li>
    ))}
</ul>

    </div>
  );
}
