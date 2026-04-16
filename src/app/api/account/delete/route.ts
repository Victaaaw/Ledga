import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Hard-deletes the authenticated user and all their data.
// Order matters only if there are FK constraints without ON DELETE CASCADE:
// insights → topics → transcripts → auth.users.
export async function POST() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Server misconfigured: missing service role key" },
      { status: 500 },
    );
  }

  // Admin client bypasses RLS so the deletes apply across all of the
  // user's rows even if RLS policies don't permit DELETE for end users.
  const admin = createAdminClient(supabaseUrl, serviceRoleKey);

  const { error: insightsError } = await admin
    .from("insights")
    .delete()
    .eq("user_id", user.id);
  if (insightsError) {
    return NextResponse.json(
      { error: `Failed to delete insights: ${insightsError.message}` },
      { status: 500 },
    );
  }

  const { error: topicsError } = await admin
    .from("topics")
    .delete()
    .eq("user_id", user.id);
  if (topicsError) {
    return NextResponse.json(
      { error: `Failed to delete topics: ${topicsError.message}` },
      { status: 500 },
    );
  }

  const { error: transcriptsError } = await admin
    .from("transcripts")
    .delete()
    .eq("user_id", user.id);
  if (transcriptsError) {
    return NextResponse.json(
      { error: `Failed to delete transcripts: ${transcriptsError.message}` },
      { status: 500 },
    );
  }

  const { error: deleteUserError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteUserError) {
    return NextResponse.json(
      { error: `Failed to delete user: ${deleteUserError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
