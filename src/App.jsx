import { useState } from "react";
import Toggle from "./components/Toggle";
import Pomodoro from "./components/Pomodoro";
import BlockedSites from "./components/BlockedSites";

export default function App() {
  const [blockedSites, setBlockedSites] = useState([]);
  const [siteInput, setSiteInput] = useState("");
  const [dark, setDark] = useState(false);

  function toggleDarkMode() {
    chrome.storage.local.set({ darkMode: !dark });
    setDark(!dark);
  }

  const handleBlock = () => {
    if (!siteInput.trim()) return;

    const updatedSites = [...blockedSites, siteInput.trim()];
    setBlockedSites(updatedSites);

    chrome.runtime.sendMessage(
      {
        type: "BLOCK_SITES",
        sites: updatedSites
      },
      (response) => {
        console.log("✅ Background replied:", response);
      }
    );

    setSiteInput("");
  };

  return (
    <div className={dark ? "container dark" : "container"}>
      <h2>🧠 Focus Guard</h2>

      <button className="dark-toggle" onClick={toggleDarkMode}>
        {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <Toggle />
      <Pomodoro />

          {/* 🔽 LIST DISPLAY */}
      <BlockedSites sites={blockedSites} />
    </div>
  );
}
