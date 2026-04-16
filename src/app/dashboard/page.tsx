import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "./dashboard-content";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's transcripts
  const { data: transcripts } = await supabase
    .from("transcripts")
    .select("*")
    .order("conversation_date", { ascending: false, nullsFirst: false })
    .limit(10);

  // Fetch recent insights
  const { data: insights } = await supabase
    .from("insights")
    .select("*, topics(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <DashboardContent 
      user={user} 
      transcripts={transcripts || []} 
      insights={insights || []} 
    />
  );
}
