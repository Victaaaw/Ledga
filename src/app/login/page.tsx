"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthMode = "magic-link" | "sign-in" | "sign-up";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    if (mode === "magic-link") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Check your email for the magic link!" });
      }
    } else if (mode === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setMessage({ type: "error", text: signUpError.message });
      } else {
        // Auto sign-in after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setMessage({
            type: "success",
            text: "Account created! Check your email to confirm, then sign in.",
          });
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }
    }

    setLoading(false);
  };

  const buttonLabel = {
    "magic-link": loading ? "Sending..." : "Send magic link",
    "sign-in": loading ? "Signing in..." : "Sign in",
    "sign-up": loading ? "Creating account..." : "Create account",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Ledga</CardTitle>
          <CardDescription>
            Your AI conversation knowledge library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {mode !== "magic-link" && (
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            )}

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

            <Button type="submit" className="w-full" disabled={loading}>
              {buttonLabel[mode]}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
            {mode === "magic-link" ? (
              <>
                <p>No password needed. We&apos;ll email you a secure link.</p>
                <button
                  type="button"
                  onClick={() => { setMode("sign-in"); setMessage(null); }}
                  className="text-primary hover:underline"
                >
                  Use password instead
                </button>
              </>
            ) : mode === "sign-in" ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => { setMode("magic-link"); setPassword(""); setMessage(null); }}
                  className="text-primary hover:underline"
                >
                  Use magic link instead
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("sign-up"); setMessage(null); }}
                  className="text-primary hover:underline"
                >
                  Don&apos;t have an account? Sign up
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => { setMode("sign-in"); setMessage(null); }}
                  className="text-primary hover:underline"
                >
                  Already have an account? Sign in
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("magic-link"); setPassword(""); setMessage(null); }}
                  className="text-primary hover:underline"
                >
                  Use magic link instead
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
