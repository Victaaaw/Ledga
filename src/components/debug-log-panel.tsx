"use client";

import { useEffect, useRef, useState } from "react";

// Temporary diagnostic overlay for on-phone debugging.
// Captures console.log calls and displays them in a floating panel.
// Safe to strip when mobile recording bug is resolved.
export function DebugLogPanel() {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const originalLogRef = useRef<typeof console.log | null>(null);

  useEffect(() => {
    // Stash the real console.log and wrap it so every call also lands in state.
    if (originalLogRef.current) return;
    originalLogRef.current = console.log;

    const capture = (...args: unknown[]) => {
      const timestamp = new Date().toLocaleTimeString("en-GB", { hour12: false });
      const serialised = args
        .map((a) => {
          if (typeof a === "string") return a;
          try {
            return JSON.stringify(a);
          } catch {
            return String(a);
          }
        })
        .join(" ");
      setLogs((prev) => {
        const next = [...prev, `[${timestamp}] ${serialised}`];
        // Keep only the last 30 lines so the panel stays readable.
        return next.slice(-30);
      });
      originalLogRef.current?.(...args);
    };

    console.log = capture;

    return () => {
      if (originalLogRef.current) {
        console.log = originalLogRef.current;
      }
    };
  }, []);

  const clearLogs = () => setLogs([]);

  return (
    <>
      {/* Floating toggle button, bottom-right */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 9999,
          background: open ? "#dc2626" : "#0d9488",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          fontSize: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}
        aria-label={open ? "Close debug panel" : "Open debug panel"}
      >
        {open ? "×" : "🐛"}
      </button>

      {/* Log panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "16px",
            left: "16px",
            maxHeight: "50vh",
            background: "rgba(0,0,0,0.92)",
            color: "#86EFAC",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "11px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            overflow: "auto",
            zIndex: 9998,
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <strong style={{ color: "#5EEAD4" }}>Debug Log ({logs.length})</strong>
            <button
              onClick={clearLogs}
              style={{
                background: "transparent",
                color: "#5EEAD4",
                border: "1px solid #5EEAD4",
                borderRadius: "4px",
                padding: "2px 8px",
                fontSize: "10px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
          {logs.length === 0 ? (
            <div style={{ color: "#888" }}>No logs yet. Start recording to capture events.</div>
          ) : (
            logs.map((line, i) => (
              <div key={i} style={{ marginBottom: "4px", wordBreak: "break-word" }}>
                {line}
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}