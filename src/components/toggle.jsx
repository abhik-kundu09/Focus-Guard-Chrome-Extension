import { useEffect, useState } from "react";

export default function Toggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("focusMode", (data) => {
      setEnabled(data.focusMode);
    });
  }, []);

  const toggleFocus = () => {
    chrome.storage.local.set({ focusMode: !enabled });
    setEnabled(!enabled);
  };

  return (
    <button onClick={toggleFocus}>
      {enabled ? "Disable Focus Mode" : "Enable Focus Mode"}
    </button>
  );
}
