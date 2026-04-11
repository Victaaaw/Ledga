import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopicsContent } from "./topics-content";

export default async function TopicsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch topics with insight counts
  const { data: topics } = await supabase
    .from("topics")
    .select("id, name, description, created_at, insights(count)")
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

  const topicsWithMeta = (topics || []).map((topic) => ({
    id: topic.id,
    name: topic.name,
    description: topic.description,
    created_at: topic.created_at,
    insight_count: (topic.insights as unknown as { count: number }[])?.[0]?.count ?? 0,
    last_mentioned: latestDateMap[topic.id] || topic.created_at,
  }));

  return <TopicsContent topics={topicsWithMeta} />;
}
