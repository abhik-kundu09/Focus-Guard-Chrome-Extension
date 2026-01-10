import { useEffect, useRef, useState } from "react";

export default function Pomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  const intervalRef = useRef(null);

  // Reset time when minutes change (only if not running)
  useEffect(() => {
    if (!running) {
      setTimeLeft(minutes * 60);
    }
  }, [minutes, running]);

  // Timer logic
  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          alert("🎉 Times's up !");
          return minutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, minutes]);

  // Progress percentage
  const progress =
    ((minutes * 60 - timeLeft) / (minutes * 60)) * 100;

  return (
    <div>
      <h4>⏱ Set Timer</h4>

      {/* Minutes input */}
      <input
        type="number"
        min="1"
        value={minutes}
        disabled={running}
        onChange={(e) => setMinutes(Number(e.target.value))}
      />

      {/* Time display */}
      <p>
        {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </p>

      {/* 🔥 Progress Bar (THIS replaces popup.html part) */}
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Controls */}
      {!running ? (
        <button onClick={() => setRunning(true)}>Start</button>
      ) : (
        <button onClick={() => setRunning(false)}>Pause</button>
      )}

      <button onClick={() => {
        setRunning(false);
        setTimeLeft(minutes * 60);
      }}>
        Reset
      </button>
    </div>
  );
}
