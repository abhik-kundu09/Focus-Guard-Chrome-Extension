import { useEffect, useState } from "react";
import Toggle from "./components/Toggle";
import Pomodoro from "./components/Pomodoro";
import BlockedSites from "./components/BlockedSites";

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("darkMode", (data) => {
      setDark(data.darkMode || false);
    });
  }, []);

  function toggleDarkMode() {
    chrome.storage.local.set({ darkMode: !dark });
    setDark(!dark);
  }

  return (
    <div className={dark ? "container dark" : "container"}>
      <h2>🧠 Focus Guard</h2>

      <button className="dark-toggle" onClick={toggleDarkMode}>
        {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <Toggle />
      <Pomodoro />
      <BlockedSites />
    </div>
  );
}
