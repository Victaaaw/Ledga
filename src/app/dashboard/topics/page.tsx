import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopicsContent } from "./topics-content";

export default async function TopicsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch topics with insight counts and parent transcript metadata
  const { data: topics } = await supabase
    .from("topics")
    .select(
      "id, name, description, created_at, transcript_id, transcripts(title, conversation_date, created_at), insights(count)"
    )
    .order("created_at", { ascending: false });

  // Fetch the latest insight date per topic
  const { data: latestInsights } = await supabase
    .from("insights")
    .select("topic_id, created_at")
    .order("created_at", { ascending: false });

  // Build a map of topic_id -> latest insight date
  const latestDateMap: Record<string, string> = {};
  if (latestInsights) {
    for (const insight of latestInsights) {
      if (insight.topic_id && !latestDateMap[insight.topic_id]) {
        latestDateMap[insight.topic_id] = insight.created_at;
      }
    }
  }

  const topicsWithMeta = (topics || []).map((topic) => {
    const transcript = topic.transcripts as unknown as {
      title: string | null;
      conversation_date: string | null;
      created_at: string;
    } | null;
    return {
      id: topic.id,
      name: topic.name,
      description: topic.description,
      created_at: topic.created_at,
      transcript_id: topic.transcript_id as string,
      transcript_title: transcript?.title ?? null,
      transcript_date:
        transcript?.conversation_date ?? transcript?.created_at ?? topic.created_at,
      insight_count: (topic.insights as unknown as { count: number }[])?.[0]?.count ?? 0,
      last_mentioned: latestDateMap[topic.id] || topic.created_at,
    };
  });

  return <TopicsContent topics={topicsWithMeta} />;
}
