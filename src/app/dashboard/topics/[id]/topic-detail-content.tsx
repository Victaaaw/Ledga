"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, GitBranch } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Topic {
  id: string;
  name: string;
  description: string;
  created_at: string;
  transcript_id: string;
}

interface Insight {
  id: string;
  insight_type: string;
  content: string;
  context: string;
  confidence_score: number;
  created_at: string;
}

interface TopicDetailContentProps {
  topic: Topic;
  insights: Insight[];
  transcriptTitle: string;
}

const insightIcons: Record<string, string> = {
  decision: "\u{1F3AF}",
  commitment: "\u2705",
  insight: "\u{1F4A1}",
  pivot: "\u{1F504}",
};

export function TopicDetailContent({
  topic,
  insights,
  transcriptTitle,
}: TopicDetailContentProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-start gap-3">
          <Link href="/dashboard/topics" className="shrink-0 mt-0.5">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Topics</span>
            </Button>
          </Link>
          <Link href="/dashboard/mindmap" className="shrink-0 mt-0.5">
            <Button variant="ghost" size="sm">
              <GitBranch className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Mind Map</span>
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{topic.name}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
              <FileText className="h-3 w-3 shrink-0" />
              From: {transcriptTitle}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-sm text-slate-700">{topic.description}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Created {formatDate(topic.created_at)}
            </p>
          </CardContent>
        </Card>

        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Insights ({insights.length})
        </h2>

        {insights.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No insights for this topic.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex flex-wrap items-center justify-between gap-1">
                    <span className="flex items-center gap-2">
                      <span>{insightIcons[insight.insight_type] || "\u{1F4DD}"}</span>
                      <span className="text-xs font-medium uppercase text-muted-foreground">
                        {insight.insight_type}
                      </span>
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {Math.round(insight.confidence_score * 100)}% confidence
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{insight.content}</p>
                  {insight.context && (
                    <blockquote className="border-l-2 border-slate-200 pl-3 text-xs text-muted-foreground italic">
                      {insight.context}
                    </blockquote>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    {formatDate(insight.created_at)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
