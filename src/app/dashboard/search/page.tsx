"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { HelpButton } from "@/components/help-button";

const INSIGHT_TYPES = ["all", "decision", "commitment", "insight", "pivot", "task"] as const;
type InsightFilter = (typeof INSIGHT_TYPES)[number];

const insightIcons: Record<string, string> = {
  decision: "\u{1F3AF}",
  commitment: "\u2705",
  insight: "\u{1F4A1}",
  pivot: "\u{1F504}",
  task: "\u2611\uFE0F",
};

const filterLabels: Record<InsightFilter, string> = {
  all: "All",
  decision: "Decisions",
  commitment: "Commitments",
  insight: "Insights",
  pivot: "Pivots",
  task: "Tasks",
};

interface InsightResult {
  id: string;
  insight_type: string;
  content: string;
  created_at: string;
  topics: { name: string }[] | null;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<InsightFilter>("all");
  const [results, setResults] = useState<InsightResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        setAuthed(false);
      }
    });
  }, [router]);

  useEffect(() => {
    if (!authed) return;

    const timeout = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter, authed]);

  async function fetchResults() {
    setLoading(true);
    const supabase = createClient();

    let q = supabase
      .from("insights")
      .select("id, insight_type, content, created_at, topics(name)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (query.trim()) {
      q = q.ilike("content", `%${query.trim()}%`);
    }

    if (filter !== "all") {
      q = q.eq("insight_type", filter);
    }

    const { data } = await q;
    setResults(data || []);
    setLoading(false);
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Search Insights</h1>
          <div className="ml-auto">
            <HelpButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Search input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search insights..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {INSIGHT_TYPES.map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type)}
            >
              {type !== "all" && (
                <span className="mr-1">{insightIcons[type]}</span>
              )}
              {filterLabels[type]}
            </Button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-sm text-muted-foreground">Searching...</p>
        ) : results.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {query.trim() || filter !== "all"
                  ? "No insights match your search."
                  : "Start typing to search your insights."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((insight) => (
              <Card key={insight.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span>{insightIcons[insight.insight_type] || "\u{1F4DD}"}</span>
                    <span className="text-xs font-medium uppercase text-muted-foreground">
                      {insight.insight_type}
                    </span>
                    {insight.topics?.[0] && (
                      <span className="text-xs font-normal text-primary ml-auto">
                        {insight.topics[0].name}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{insight.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
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
