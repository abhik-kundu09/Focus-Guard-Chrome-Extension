import { useEffect, useState } from "react";

export default function BlockedSites() {
  const [sites, setSites] = useState([]);
  const [input, setInput] = useState("");

  // Load sites on popup open
  useEffect(() => {
    chrome.storage.local.get("blockedSites", (data) => {
      setSites(data.blockedSites || []);
    });
  }, []);

  const addSite = () => {
    if (!input.trim()) return;

    const updatedSites = [...sites, input.trim()];
    setSites(updatedSites);
    setInput("");

    // Save to storage
    chrome.storage.local.set({ blockedSites: updatedSites });

    // 🔥 SEND TO BACKGROUND (CORRECT PLACE)
    chrome.runtime.sendMessage(
      {
        type: "BLOCK_SITES",
        sites: updatedSites
      },
      (response) => {
        console.log("✅ Background replied:", response);
      }
    );
  };

  return (
    <div>
      <h4>🚫 Blocked Sites</h4>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="example.com"
      />

      <button onClick={addSite}>Add</button>

      <ul>
        {sites.map((site, i) => (
          <li key={i}>{site}</li>
        ))}
      </ul>
    </div>
  );
}
