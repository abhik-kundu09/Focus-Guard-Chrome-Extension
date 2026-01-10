import { useEffect, useState } from "react";

export default function BlockedSites() {
  const [sites, setSites] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    chrome.storage.local.get("blockedSites", (data) => {
      setSites(data.blockedSites || []);
    });
  }, []);

  const addSite = () => {
    if (!input) return;
    const updated = [...sites, input];
    chrome.storage.local.set({ blockedSites: updated });
    setSites(updated);
    setInput("");
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
