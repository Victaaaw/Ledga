"use client";

import { useMemo, useCallback, useState, memo } from "react";
import Link from "next/link";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, X, ExternalLink } from "lucide-react";

interface TopicData {
  id: string;
  name: string;
  description: string;
  transcript_id: string;
  category: string | null;
  insight_count: number;
}

interface InsightData {
  id: string;
  insight_type: string;
  content: string;
  topic_id: string | null;
  transcript_id: string;
}

interface TranscriptData {
  id: string;
  title: string | null;
  created_at: string;
}

interface MindMapContentProps {
  topics: TopicData[];
  insights: InsightData[];
  transcripts: TranscriptData[];
}

const insightColors: Record<string, string> = {
  decision: "#DBEAFE",
  commitment: "#DCFCE7",
  insight: "#FEF9C3",
  pivot: "#FFEDD5",
};

const insightBorders: Record<string, string> = {
  decision: "#3B82F6",
  commitment: "#22C55E",
  insight: "#EAB308",
  pivot: "#F97316",
};

const insightIcons: Record<string, string> = {
  decision: "\u{1F3AF}",
  commitment: "\u2705",
  insight: "\u{1F4A1}",
  pivot: "\u{1F504}",
};

const categoryColors: Record<string, { bg: string; border: string }> = {
  "Product & Features": { bg: "#EDE9FE", border: "#8B5CF6" },
  Technical: { bg: "#DBEAFE", border: "#3B82F6" },
  "Business & Monetization": { bg: "#DCFCE7", border: "#22C55E" },
  "Legal & Compliance": { bg: "#FEF3C7", border: "#F59E0B" },
  "Go-To-Market": { bg: "#FFE4E6", border: "#F43F5E" },
  "Personal & Ideas": { bg: "#F0FDFA", border: "#14B8A6" },
  Learning: { bg: "#F3E8FF", border: "#9333EA" },
  Uncategorized: { bg: "#F1F5F9", border: "#94A3B8" },
};

// --- Custom node components ---

const TopicNode = memo(({ data }: NodeProps) => {
  const isSelected = data.isSelected as boolean;
  const isExpanded = data.isExpanded as boolean;
  const insightCount = data.insightCount as number;
  const onToggle = data.onToggle as () => void;

  const borderWeight = isSelected ? 4 : Math.min(2 + insightCount, 5);
  const borderColor = isSelected ? "#4F46E5" : "#6366F1";

  return (
    <div
      style={{
        background: isSelected ? "#EEF2FF" : "#FFFFFF",
        fontWeight: 600,
        fontSize: 16,
        borderRadius: 10,
        padding: "14px 16px",
        border: `${borderWeight}px solid ${borderColor}`,
        width: 280,
        textAlign: "center",
        cursor: "pointer",
        boxShadow: isSelected ? "0 3px 12px rgba(79,70,229,0.25)" : "none",
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {data.label as string}
      </div>
      {insightCount > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: isExpanded ? "#6366F1" : "#94A3B8",
            color: "#FFF",
            fontSize: 15,
            fontWeight: 700,
            border: "2px solid #FFF",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          {isExpanded ? "\u2212" : "+"}
        </button>
      )}
      {!isExpanded && insightCount > 0 && (
        <div style={{ fontSize: 11, color: "#6366F1", marginTop: 3 }}>
          {insightCount} insight{insightCount !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
});
TopicNode.displayName = "TopicNode";

const nodeTypes = { topicNode: TopicNode };

// --- Hover CSS ---
const hoverStyles = `
  .react-flow__node {
    transition: transform 0.15s ease, filter 0.15s ease;
  }
  .react-flow__node:hover {
    transform: scale(1.2);
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.18));
    z-index: 10 !important;
  }
`;

// --- Layout constants ---
const ROOT_WIDTH = 280;
const CATEGORY_WIDTH = 240;
const TOPIC_WIDTH = 280;
const INSIGHT_WIDTH = 240;

const TOPIC_NODE_HEIGHT = 60;
const TOPIC_COLLAPSED_HEIGHT = 80;
const INSIGHT_NODE_HEIGHT = 50;
const CATEGORY_NODE_HEIGHT = 50;

const CATS_PER_ROW = 3;
const CAT_COL_X = 350;       // category x offset from root
const TOPIC_COL_X = 650;     // topics x offset from root
const INSIGHT_COL_X = 1010;  // insights x offset from root

const TOPIC_GAP_Y = 40;
const INSIGHT_GAP_Y = 14;
const LANE_PAD_Y = 15;       // padding between lanes in same grid row
const GRID_ROW_GAP = 30;     // gap between grid rows

// --- Build graph with grid layout ---

function buildGraph(
  topics: TopicData[],
  insights: InsightData[],
  selectedTopicId: string | null,
  expandedCategories: Set<string>,
  expandedTopics: Set<string>,
  toggleCategory: (name: string) => void,
  toggleTopic: (id: string) => void,
) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Group insights by topic_id
  const insightsByTopic: Record<string, InsightData[]> = {};
  for (const ins of insights) {
    if (!ins.topic_id) continue;
    if (!insightsByTopic[ins.topic_id]) insightsByTopic[ins.topic_id] = [];
    insightsByTopic[ins.topic_id].push(ins);
  }

  // Group topics by category
  const topicsByCategory: Record<string, TopicData[]> = {};
  for (const topic of topics) {
    const cat = topic.category || "Uncategorized";
    if (!topicsByCategory[cat]) topicsByCategory[cat] = [];
    topicsByCategory[cat].push(topic);
  }

  const categoryNames = Object.keys(topicsByCategory).sort();

  // Split categories into grid rows
  const catRows: string[][] = [];
  for (let i = 0; i < categoryNames.length; i += CATS_PER_ROW) {
    catRows.push(categoryNames.slice(i, i + CATS_PER_ROW));
  }

  // Calculate lane heights for each category
  const laneHeights: Record<string, number> = {};
  for (const catName of categoryNames) {
    if (!expandedCategories.has(catName)) {
      // Collapsed: just the category node
      laneHeights[catName] = CATEGORY_NODE_HEIGHT + LANE_PAD_Y;
      continue;
    }
    let h = 0;
    for (const topic of topicsByCategory[catName]) {
      const isExpanded = expandedTopics.has(topic.id);
      const insCount = (insightsByTopic[topic.id] || []).length;
      const blockH = isExpanded
        ? Math.max(TOPIC_NODE_HEIGHT, insCount * (INSIGHT_NODE_HEIGHT + INSIGHT_GAP_Y))
        : TOPIC_COLLAPSED_HEIGHT;
      h += blockH + TOPIC_GAP_Y;
    }
    laneHeights[catName] = Math.max(h, CATEGORY_NODE_HEIGHT + LANE_PAD_Y);
  }

  // Calculate grid row heights (max lane height in each row)
  const gridRowHeights = catRows.map((row) =>
    row.reduce((sum, catName) => sum + laneHeights[catName] + LANE_PAD_Y, 0)
  );

  const totalHeight = gridRowHeights.reduce((sum, h) => sum + h + GRID_ROW_GAP, 0);

  // Root node — centered vertically
  nodes.push({
    id: "root",
    position: { x: 0, y: totalHeight / 2 - 35 },
    data: { label: "My Knowledge" },
    style: {
      background: "#0F172A",
      color: "#FFFFFF",
      fontWeight: 700,
      fontSize: 18,
      borderRadius: 12,
      padding: "18px 28px",
      border: "none",
      width: ROOT_WIDTH,
      textAlign: "center" as const,
    },
    draggable: true,
  });

  // Place each grid row
  let gridY = 0;

  for (let rowIdx = 0; rowIdx < catRows.length; rowIdx++) {
    const catsInRow = catRows[rowIdx];
    // Horizontal offset for each category column in this grid row
    const colWidth = INSIGHT_COL_X + INSIGHT_WIDTH + 80;

    let laneY = gridY;

    for (let colIdx = 0; colIdx < catsInRow.length; colIdx++) {
      const catName = catsInRow[colIdx];
      const catTopics = topicsByCategory[catName];
      const colors = categoryColors[catName] || categoryColors.Uncategorized;
      const catId = `cat-${catName}`;
      const xOffset = colIdx * colWidth;

      // Category node — centered in its lane
      const catCenterY = laneY + laneHeights[catName] / 2 - CATEGORY_NODE_HEIGHT / 2;

      const isCatExpanded = expandedCategories.has(catName);

      nodes.push({
        id: catId,
        position: { x: CAT_COL_X + xOffset, y: catCenterY },
        data: {
          label: `${isCatExpanded ? "−" : "+"} ${catName} (${catTopics.length})`,
          catName,
          onToggleCategory: () => toggleCategory(catName),
        },
        style: {
          background: colors.bg,
          fontWeight: 600,
          fontSize: 15,
          borderRadius: 10,
          padding: "12px 16px",
          border: `3px solid ${colors.border}`,
          width: CATEGORY_WIDTH,
          textAlign: "center" as const,
          cursor: "pointer",
          overflow: "hidden" as const,
          textOverflow: "ellipsis" as const,
          whiteSpace: "nowrap" as const,
        },
        draggable: true,
      });

      edges.push({
        id: `root-${catId}`,
        source: "root",
        target: catId,
        type: "smoothstep",
        style: { stroke: colors.border, strokeWidth: 2 },
      });

      // Topics within this lane (only when category is expanded)
      let topicY = laneY;

      if (!isCatExpanded) {
        laneY += laneHeights[catName] + LANE_PAD_Y;
        continue;
      }

      for (const topic of catTopics) {
        const topicInsights = insightsByTopic[topic.id] || [];
        const isExpanded = expandedTopics.has(topic.id);
        const insBlockH = isExpanded
          ? topicInsights.length * (INSIGHT_NODE_HEIGHT + INSIGHT_GAP_Y)
          : 0;
        const blockH = isExpanded
          ? Math.max(TOPIC_NODE_HEIGHT, insBlockH)
          : TOPIC_COLLAPSED_HEIGHT;

        const tY = topicY + blockH / 2 - TOPIC_NODE_HEIGHT / 2;
        const isSelected = selectedTopicId === topic.id;

        nodes.push({
          id: `topic-${topic.id}`,
          type: "topicNode",
          position: { x: TOPIC_COL_X + xOffset, y: tY },
          data: {
            label: topic.name,
            topicId: topic.id,
            isSelected,
            isExpanded,
            insightCount: topicInsights.length,
            onToggle: () => toggleTopic(topic.id),
          },
          draggable: true,
        });

        edges.push({
          id: `${catId}-topic-${topic.id}`,
          source: catId,
          target: `topic-${topic.id}`,
          type: "smoothstep",
          style: { stroke: "#94A3B8", strokeWidth: 1.5 },
        });

        // Insights when expanded
        if (isExpanded) {
          topicInsights.forEach((ins, insIdx) => {
            const icon = insightIcons[ins.insight_type] || "\u{1F4DD}";
            const label =
              icon +
              " " +
              (ins.content.length > 55
                ? ins.content.slice(0, 55) + "..."
                : ins.content);

            nodes.push({
              id: `insight-${ins.id}`,
              position: {
                x: INSIGHT_COL_X + xOffset,
                y: topicY + insIdx * (INSIGHT_NODE_HEIGHT + INSIGHT_GAP_Y),
              },
              data: { label },
              style: {
                background: insightColors[ins.insight_type] || "#F1F5F9",
                border: `2px solid ${insightBorders[ins.insight_type] || "#94A3B8"}`,
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 14,
                width: INSIGHT_WIDTH,
                textAlign: "center" as const,
                overflow: "hidden" as const,
                textOverflow: "ellipsis" as const,
                whiteSpace: "nowrap" as const,
              },
              draggable: true,
            });

            edges.push({
              id: `topic-${topic.id}-insight-${ins.id}`,
              source: `topic-${topic.id}`,
              target: `insight-${ins.id}`,
              type: "smoothstep",
              style: {
                stroke: insightBorders[ins.insight_type] || "#94A3B8",
                strokeWidth: 1,
              },
            });
          });
        }

        topicY += blockH + TOPIC_GAP_Y;
      }

      // Advance laneY for the next category in this column
      laneY += laneHeights[catName] + LANE_PAD_Y;
    }

    gridY += gridRowHeights[rowIdx] + GRID_ROW_GAP;
  }

  return { nodes, edges };
}

// --- Component ---

export function MindMapContent({ topics, insights, transcripts }: MindMapContentProps) {
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [filterTranscriptId, setFilterTranscriptId] = useState<string>("all");

  const toggleCategory = useCallback((name: string) => {
    setExpandedCategories((prev) => {
      if (prev.has(name)) {
        // Collapse this category
        return new Set();
      }
      // Expand this one, collapse others
      return new Set([name]);
    });
  }, []);

  const toggleTopic = useCallback((id: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const filteredTopics = useMemo(
    () =>
      filterTranscriptId === "all"
        ? topics
        : topics.filter((t) => t.transcript_id === filterTranscriptId),
    [topics, filterTranscriptId]
  );

  const filteredInsights = useMemo(
    () =>
      filterTranscriptId === "all"
        ? insights
        : insights.filter((i) => i.transcript_id === filterTranscriptId),
    [insights, filterTranscriptId]
  );

  const insightsByTopicMap = useMemo(() => {
    const map: Record<string, InsightData[]> = {};
    for (const ins of filteredInsights) {
      if (!ins.topic_id) continue;
      if (!map[ins.topic_id]) map[ins.topic_id] = [];
      map[ins.topic_id].push(ins);
    }
    return map;
  }, [filteredInsights]);

  const { nodes, edges } = useMemo(
    () => buildGraph(filteredTopics, filteredInsights, selectedTopic?.id ?? null, expandedCategories, expandedTopics, toggleCategory, toggleTopic),
    [filteredTopics, filteredInsights, selectedTopic, expandedCategories, expandedTopics, toggleCategory, toggleTopic]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      // Category node click → toggle expand
      const catName = node.data?.catName as string | undefined;
      if (catName) {
        toggleCategory(catName);
        return;
      }
      // Topic node click → open sidebar
      const topicId = node.data?.topicId as string | undefined;
      if (topicId) {
        const topic = filteredTopics.find((t) => t.id === topicId);
        if (topic) setSelectedTopic(topic);
      }
    },
    [filteredTopics, toggleCategory]
  );

  const selectedInsights = selectedTopic
    ? insightsByTopicMap[selectedTopic.id] || []
    : [];

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <style dangerouslySetInnerHTML={{ __html: hoverStyles }} />
      <header className="bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-wrap items-center gap-2 sm:gap-4">
          <Link href="/dashboard" className="shrink-0">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Mind Map</h1>
          <select
            value={filterTranscriptId}
            onChange={(e) => {
              setFilterTranscriptId(e.target.value);
              setSelectedTopic(null);
            }}
            className="h-11 sm:h-9 w-full sm:w-auto rounded-md border border-input bg-background px-3 text-base sm:text-sm order-last sm:order-none"
          >
            <option value="all">All Transcripts</option>
            {transcripts.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title || new Date(t.created_at).toISOString().split("T")[0]}
              </option>
            ))}
          </select>
          <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
            {filteredTopics.length} topics, {filteredInsights.length} insights
          </span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          {filteredTopics.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                No topics yet. Upload a conversation to see your mind map.
              </p>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              minZoom={0.1}
              maxZoom={2}
              defaultEdgeOptions={{ animated: false }}
            >
              <Background />
              <Controls showInteractive={false} />
            </ReactFlow>
          )}
        </div>

        {selectedTopic && (
          <div className="absolute inset-0 sm:static sm:inset-auto w-full sm:w-96 bg-white border-l border-slate-200 overflow-y-auto shrink-0 z-20">
            <div className="p-4 border-b border-slate-200 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-900 truncate">
                  {selectedTopic.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {selectedTopic.category || "Uncategorized"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedTopic.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="shrink-0 p-1 rounded hover:bg-slate-100"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4">
              <Link href={`/dashboard/topics/${selectedTopic.id}`}>
                <Button variant="outline" size="sm" className="w-full mb-4">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View full details
                </Button>
              </Link>

              <h3 className="text-sm font-medium text-slate-700 mb-3">
                Insights ({selectedInsights.length})
              </h3>

              {selectedInsights.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No insights for this topic.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedInsights.map((ins) => (
                    <Card key={ins.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">
                            {insightIcons[ins.insight_type] || "\u{1F4DD}"}
                          </span>
                          <span className="text-xs font-medium uppercase text-muted-foreground">
                            {ins.insight_type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">{ins.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
