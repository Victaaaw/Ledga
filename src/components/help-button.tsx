"use client";

import { useEffect, useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    title: "1. Upload a conversation",
    body: "Paste, type, or use voice recording to capture your AI conversation. Set the date and click Upload. NDLedger will automatically extract insights, decisions, tasks, and more.",
  },
  {
    title: "2. Voice recording",
    body: "Click the microphone icon to record directly in your browser. Speech is converted to text locally. Audio is never stored.",
  },
  {
    title: "3. Browse your topics",
    body: "The Topics page groups everything by conversation. Click any topic to see the insights extracted from it.",
  },
  {
    title: "4. Explore the mind map",
    body: 'The Mind Map visualises your knowledge. Start at "My Knowledge", click to expand categories, topics, and individual insights. Use zoom controls to navigate.',
  },
  {
    title: "5. Search your knowledge",
    body: "Use the Search page to find specific insights, decisions, or tasks across all your conversations.",
  },
  {
    title: "6. Delete data",
    body: "Delete individual transcripts from the Topics page (this removes all related topics and insights). Delete your entire account from Settings.",
  },
];

export function HelpButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label="Help"
        title="Help"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                How to use NDLedger
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="px-5 py-4 space-y-4 text-sm text-slate-700">
              {SECTIONS.map((section) => (
                <div key={section.title}>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {section.title}
                  </h3>
                  <p className="leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-600">
              Questions? Contact{" "}
              <a
                href="mailto:hobbesinvestments@gmail.com"
                className="text-[#0D9488] hover:underline"
              >
                hobbesinvestments@gmail.com
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
