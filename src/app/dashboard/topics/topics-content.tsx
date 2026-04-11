"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Hash, Lightbulb, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TopicItem {
  id: string;
  name: string;
  description: string;
  created_at: string;
  insight_count: number;
  last_mentioned: string;
}

interface TopicsContentProps {
  topics: TopicItem[];
}

export function TopicsContent({ topics }: TopicsContentProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Topics</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {topics.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Hash className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No topics yet. Upload a conversation to extract topics.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <Link key={topic.id} href={`/dashboard/topics/${topic.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Hash className="h-4 w-4 text-primary" />
                      {topic.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {topic.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" />
                        {topic.insight_count} insight{topic.insight_count !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(topic.last_mentioned)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
