"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { HelpButton } from "@/components/help-button";

export default function SettingsPage() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeDialog = () => {
    if (deleting) return;
    setShowDialog(false);
    setConfirmText("");
    setError(null);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Delete failed (${res.status})`);
      }
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Settings</h1>
          <div className="ml-auto">
            <HelpButton />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This
              cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowDialog(true)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete My Account
            </Button>
          </CardContent>
        </Card>
      </main>

      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeDialog}
        >
          <div
            className="w-full max-w-md bg-white rounded-lg shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete account
            </h2>
            <p className="text-sm text-slate-700 mb-4">
              This will permanently delete your account and all your data
              (transcripts, topics, insights). This cannot be undone. Type{" "}
              <span className="font-mono font-bold">DELETE</span> to confirm.
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              disabled={deleting}
              autoFocus
            />
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={closeDialog}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || deleting}
                className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete forever"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
