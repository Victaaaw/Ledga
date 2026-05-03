"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
      } else if (res.status === 409) {
        setStatus("idle");
        setErrorMsg("That email is already on the waitlist.");
      } else {
        setStatus("idle");
        setErrorMsg("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("idle");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="text-[#0D9488] font-semibold text-sm">
        You are on the list. We will be in touch.
      </p>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrorMsg(null); }}
          placeholder="your@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 px-4 py-3 rounded-lg border-[1.5px] border-slate-200 text-sm text-slate-900 bg-white outline-none focus:border-[#0D9488] transition-colors disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-3 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-semibold whitespace-nowrap transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "Joining…" : "Join the Waitlist"}
        </button>
      </form>
      {errorMsg && (
        <p className="mt-3 text-sm text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}
