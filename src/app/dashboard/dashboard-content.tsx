"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { LogOut, Upload, FileText, Lightbulb, Clock, Hash, Search, GitBranch, Menu, X, Trash2, ChevronDown, ChevronRight, Mic, Square, Settings } from "lucide-react";
import Link from "next/link";
import { formatDate, formatDateTime } from "@/lib/utils";
import { HelpButton } from "@/components/help-button";
import { DebugLogPanel } from "@/components/debug-log-panel";
interface Transcript {
  id: string;
  title: string | null;
  processing_status: string;
  created_at: string;
  conversation_date: string | null;
  word_count: number | null;
}

interface Insight {
  id: string;
  insight_type: string;
  content: string;
  created_at: string;
  topics: { name: string } | null;
}

interface DashboardContentProps {
  user: User;
  transcripts: Transcript[];
  insights: Insight[];
}

export function DashboardContent({ user, transcripts, insights }: DashboardContentProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [conversationDate, setConversationDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const WARN_WORDS = 50000;
  const MAX_WORDS = 100000;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const overLimit = wordCount > MAX_WORDS;
  const showWarning = wordCount >= WARN_WORDS && wordCount <= MAX_WORDS;

  // --- Voice recording (Web Speech API) ---
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  // Refs that survive re-renders without triggering them. recognitionRef
  // holds the live SpeechRecognition instance; baseContentRef snapshots
  // whatever was already in the textarea when recording started so live
  // transcription appends instead of overwriting; finalTranscriptRef
  // accumulates finalised chunks across multiple onresult events.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const baseContentRef = useRef("");
  const finalTranscriptRef = useRef("");
  // Tracks whether onend was triggered by user action (Stop/Cancel/error)
  // or by mobile browser auto-stopping on silence. If auto-stopped mid-
  // recording, we transparently restart the session so finalTranscriptRef
  // continues accumulating.
  const userStoppedRef = useRef(false);
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Cleanup on unmount: ensure no orphan recognition session or timer
  // survives if the user navigates away mid-recording.
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, []);

  const composeContent = (base: string, addition: string) => {
    if (!addition) return base;
    if (!base) return addition;
    const needsSpace = !base.endsWith(" ") && !base.endsWith("\n");
    return base + (needsSpace ? " " : "") + addition;
  };

  const startRecording = () => {
    if (!speechSupported || isRecording) return;
    setRecordingError(null);

    baseContentRef.current = content;
    finalTranscriptRef.current = "";
    userStoppedRef.current = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-GB";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      // Walk only the results that changed since the last event.
      // Final results are appended to finalTranscriptRef once and never
      // re-fire (resultIndex advances past them). Interim results are
      // recomputed each event — they can refine across multiple fires
      // before becoming final.
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          finalTranscriptRef.current += transcript;
        } else {
          interim += transcript;
        }
      }
      setContent(
        composeContent(baseContentRef.current, finalTranscriptRef.current + interim),
      );
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      // Real errors should NOT trigger auto-restart in onend.
      userStoppedRef.current = true;
      setRecordingError(
        event.error === "not-allowed"
          ? "Microphone permission denied. Enable mic access in your browser."
          : `Recording error: ${event.error}`,
      );
    };

   recognition.onend = () => {
      console.log("[onend] fired. userStopped:", userStoppedRef.current, "finalRef:", JSON.stringify(finalTranscriptRef.current), "baseRef:", JSON.stringify(baseContentRef.current));
      if (!userStoppedRef.current) {
        try {
          recognition.start();
          console.log("[onend] restarted successfully");
          return;
        } catch (e) {
          console.log("[onend] restart failed:", e);
        }
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      console.log("[onend] final setContent with:", JSON.stringify(composeContent(baseContentRef.current, finalTranscriptRef.current)));
      setContent(composeContent(baseContentRef.current, finalTranscriptRef.current));
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch {
      setRecordingError("Could not start recording");
      recognitionRef.current = null;
    }
  };

const stopRecording = () => {
    if (!recognitionRef.current) return;
    userStoppedRef.current = true;
    try { recognitionRef.current.stop(); } catch {}
    // onend will finalise content and reset isRecording.
  };

  const cancelRecording = () => {
    userStoppedRef.current = true;
    // Wipe the accumulator first so onend's recompute restores baseContent.
    finalTranscriptRef.current = "";
    setContent(baseContentRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }
  };

  const formatRecordingTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // Navigating Dashboard → Mind Map should land on the default centered
  // "My Knowledge" view, not the viewport restored from a prior session.
  const resetMindmapViewport = () => {
    try {
      sessionStorage.removeItem("mindmap-viewport");
    } catch {}
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setMessage({ type: "error", text: "Please paste your conversation content" });
      return;
    }

    if (overLimit) {
      setMessage({ type: "error", text: `Transcript too large (max ${MAX_WORDS.toLocaleString()} words)` });
      return;
    }

    setUploading(true);
    setMessage(null);

    const supabase = createClient();

    const { data, error } = await supabase
      .from("transcripts")
      .insert({
        user_id: user.id,
        title: title.trim() || `Conversation ${formatDate(new Date())}`,
        raw_content: content,
        source_type: "manual",
        processing_status: "pending",
        word_count: wordCount,
        conversation_date: conversationDate
          ? new Date(conversationDate).toISOString()
          : new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      setMessage({ type: "error", text: error.message });
      setUploading(false);
      return;
    }

    setMessage({ type: "success", text: "Transcript uploaded! Extracting insights..." });
    setContent("");
    setTitle("");
    setConversationDate("");
    router.refresh();

    // Trigger extraction in the background
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptId: data.id }),
      });

      if (res.ok) {
        const result = await res.json();
        setMessage({
          type: "success",
          text: `Extraction complete! Found ${result.topicsExtracted} topics and ${result.insightsExtracted} insights.`,
        });
      } else {
        setMessage({ type: "error", text: "Transcript saved but extraction failed. You can retry later." });
      }
    } catch {
      setMessage({ type: "error", text: "Transcript saved but extraction failed. You can retry later." });
    }

    router.refresh();
    setUploading(false);
  };

  const handleDelete = async (transcriptId: string) => {
    if (!confirm("Delete this transcript and all its topics/insights?")) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("transcripts")
      .delete()
      .eq("id", transcriptId)
      .select();

    if (error) {
      setMessage({ type: "error", text: `Failed to delete: ${error.message}` });
      return;
    }
    if (!data || data.length === 0) {
      setMessage({
        type: "error",
        text: "Delete returned 0 rows — RLS policy is blocking DELETE.",
      });
      return;
    }
    router.refresh();
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "decision": return "🎯";
      case "commitment": return "✅";
      case "insight": return "💡";
      case "pivot": return "🔄";
      case "task": return "☑️";
      default: return "📝";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Processed</span>;
      case "processing":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Processing</span>;
      case "failed":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Failed</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">NDLedger</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 hidden sm:inline">{user.email}</span>
              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-1">
                <Link href="/dashboard/topics">
                  <Button variant="ghost" size="sm">
                    <Hash className="h-4 w-4 mr-2" />
                    Topics
                  </Button>
                </Link>
                <Link href="/dashboard/search">
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </Link>
                <Link href="/dashboard/mindmap" onClick={resetMindmapViewport}>
                  <Button variant="ghost" size="sm">
                    <GitBranch className="h-4 w-4 mr-2" />
                    Mind Map
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <HelpButton />
              </nav>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:inline-flex">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
              {/* Mobile hamburger */}
              <Button variant="ghost" size="sm" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          {/* Mobile nav dropdown */}
          {menuOpen && (
            <nav className="md:hidden flex flex-col gap-1 pt-3 pb-1 border-t border-slate-100 mt-3">
              <Link href="/dashboard/topics" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Hash className="h-4 w-4 mr-2" />
                  Topics
                </Button>
              </Link>
              <Link href="/dashboard/search" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </Link>
              <Link
                href="/dashboard/mindmap"
                onClick={() => {
                  resetMindmapViewport();
                  setMenuOpen(false);
                }}
              >
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Mind Map
                </Button>
              </Link>
              <Link href="/dashboard/settings" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <div className="w-full" onClick={() => setMenuOpen(false)}>
                <HelpButton />
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Conversation
                </CardTitle>
                <CardDescription>
                  Paste your AI conversation transcript below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Conversation title (optional)"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={uploading}
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Paste your conversation here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      disabled={uploading || isRecording}
                      className="min-h-[200px]"
                    />
                    {wordCount > 0 && !showWarning && !overLimit && (
                      <p className="text-xs mt-1 text-muted-foreground">
                        {wordCount.toLocaleString()} words
                      </p>
                    )}
                    {showWarning && (
                      <p className="text-xs mt-1 text-yellow-600">
                        {wordCount.toLocaleString()} words — Large transcript, extraction may be slower
                      </p>
                    )}
                    {overLimit && (
                      <p className="text-xs mt-1 text-red-600 font-medium">
                        {wordCount.toLocaleString()} words — Transcript too large (max {MAX_WORDS.toLocaleString()} words)
                      </p>
                    )}
                  </div>

                  <div>
                    {!isRecording ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={startRecording}
                          disabled={uploading || !speechSupported}
                          title={
                            speechSupported
                              ? "Record voice and live-transcribe into the textarea"
                              : "Voice recording not supported in this browser (requires Chrome / Edge)"
                          }
                        >
                          <Mic className="h-4 w-4 mr-2" />
                          Record Voice
                        </Button>
                        {!speechSupported && (
                          <p className="text-xs mt-1 text-muted-foreground">
                            Voice recording requires a Chromium-based browser (Chrome, Edge).
                          </p>
                        )}
                        {recordingError && (
                          <p className="text-xs mt-1 text-red-600">{recordingError}</p>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3 p-3 rounded-md border border-red-200 bg-red-50">
                        <span className="flex items-center gap-2 text-sm font-medium text-red-700">
                          <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
                          Recording {formatRecordingTime(recordingSeconds)}
                        </span>
                        <div className="flex items-center gap-2 ml-auto">
                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={stopRecording}
                          >
                            <Square className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={cancelRecording}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="conversation-date"
                      className="text-sm font-medium text-slate-700 block mb-1"
                    >
                      When did this conversation happen? (optional)
                    </label>
                    <Input
                      id="conversation-date"
                      type="datetime-local"
                      value={conversationDate}
                      onChange={(e) => setConversationDate(e.target.value)}
                      disabled={uploading}
                      className="sm:w-auto"
                    />
                  </div>

                  {message && (
                    <div
                      className={`p-3 rounded-md text-sm ${
                        message.type === "success"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <Button type="submit" disabled={uploading || overLimit} className="w-full sm:w-auto">
                    {uploading ? "Uploading..." : "Upload & Process"}
                  </Button>
                </form>
              </CardContent>
            </Card>

          {/* Recent Transcripts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Transcripts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transcripts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No transcripts yet. Upload your first conversation above.</p>
              ) : (
                <div className="space-y-3">
                  {transcripts.map((transcript) => (
                    <div
                      key={transcript.id}
                      className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{transcript.title || "Untitled"}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3 shrink-0" />
                          {formatDateTime(transcript.conversation_date ?? transcript.created_at)}
                          {transcript.word_count && ` • ${transcript.word_count} words`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {getStatusBadge(transcript.processing_status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transcript.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete transcript"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          </div>

          {/* Recent Insights — button that opens a card, right column */}
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowInsights((v) => !v)}
              className="w-full justify-start"
              aria-expanded={showInsights}
            >
              {showInsights ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              <Lightbulb className="h-4 w-4 mr-2" />
              Recent Insights
              <span className="ml-2 text-muted-foreground">
                ({insights.length})
              </span>
            </Button>

            {showInsights && (
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Recent Insights
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Extracted from your conversations
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInsights(false)}
                    className="h-8 w-8 p-0 shrink-0"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {insights.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No insights yet. Upload a conversation to get started.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {insights.map((insight) => (
                        <div key={insight.id} className="border-l-2 border-primary pl-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{getInsightIcon(insight.insight_type)}</span>
                            <span className="text-xs font-medium uppercase text-muted-foreground">
                              {insight.insight_type}
                            </span>
                          </div>
                          <p className="text-sm">{insight.content}</p>
                          {insight.topics && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Topic: {insight.topics.name}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <DebugLogPanel />
    </div>
  );
}
