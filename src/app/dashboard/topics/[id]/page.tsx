import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopicDetailContent } from "./topic-detail-content";

export default async function TopicDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the topic
  const { data: topic, error: topicError } = await supabase
    .from("topics")
    .select("id, name, description, created_at, transcript_id")
    .eq("id", params.id)
    .single();

  if (topicError || !topic) {
    notFound();
  }

  // Fetch insights for this topic
  const { data: insights } = await supabase
    .from("insights")
    .select("id, insight_type, content, context, confidence_score, created_at")
    .eq("topic_id", topic.id)
    .order("created_at", { ascending: false });

  // Fetch the parent transcript title
  const { data: transcript } = await supabase
    .from("transcripts")
    .select("title")
    .eq("id", topic.transcript_id)
    .single();

  return (
    <TopicDetailContent
      topic={topic}
      insights={insights || []}
      transcriptTitle={transcript?.title || "Untitled"}
    />
  );
}
