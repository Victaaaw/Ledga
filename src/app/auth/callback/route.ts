import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");

  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/dashboard";

  if (!code) {
    console.error("[auth/callback] missing code parameter");
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession failed:", error);

    // PKCE failure — user clicked the magic link in a different browser
    // context from where it was requested. The code-verifier cookie only
    // exists in the originating browser, so the exchange can't complete.
    // Surface a specific error so the login page can show useful guidance.
    const isPkceError =
      error.message?.toLowerCase().includes("code verifier") ||
      error.message?.toLowerCase().includes("code_verifier") ||
      error.message?.toLowerCase().includes("pkce");

    const errorParam = isPkceError ? "link_expired" : "auth_failed";
    return NextResponse.redirect(`${origin}/login?error=${errorParam}`);
  }

  return response;
}