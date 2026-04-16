import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MindMapContent } from "./mindmap-content";

export default async function MindMapPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: topics } = await supabase
    .from("topics")
    .select("id, name, description, transcript_id, category, insights(count)")
    .order("created_at", { ascending: false });

  const { data: insights } = await supabase
    .from("insights")
    .select("id, insight_type, content, topic_id, transcript_id")
    .order("created_at", { ascending: false });

  const { data: transcripts } = await supabase
    .from("transcripts")
    .select("id, title, created_at")
    .eq("processing_status", "completed")
    .order("created_at", { ascending: false });

  const topicsWithCount = (topics || []).map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    transcript_id: t.transcript_id,
    category: t.category || null,
    insight_count: (t.insights as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));

  return (
    <Suspense fallback={null}>
      <MindMapContent
        topics={topicsWithCount}
        insights={insights || []}
        transcripts={transcripts || []}
      />
    </Suspense>
  );
}
