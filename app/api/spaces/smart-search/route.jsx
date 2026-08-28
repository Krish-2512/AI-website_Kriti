import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateAIContent } from "@/app/components/llm/LLM";

export async function POST(req) {
  try {
    const { spaceId, query } = await req.json();

    if (!spaceId || !query) {
      return NextResponse.json({ error: "spaceId and query are required" }, { status: 400 });
    }

    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: {
        workspaces: {
          include: { user: true },
        },
      },
    });

    if (!space || !space.workspaces || space.workspaces.length === 0) {
      return NextResponse.json({ success: true, results: [] });
    }

    // Prepare project summaries for semantic search
    const projectSummaries = space.workspaces.map((w, idx) => {
      let prompt = "Website Application";
      try {
        const msgs = JSON.parse(w.messages || "[]");
        prompt = msgs[0]?.content || "Website Application";
      } catch (e) {}

      return {
        id: w.id,
        index: idx,
        title: w.title || "Kriti Web App",
        author: w.user?.name || "Team Member",
        prompt: prompt,
        updatedAt: w.updatedAt,
      };
    });

    // Use AI / semantic matching to find the top matching projects
    const systemInstruction = `You are a semantic search and component ranking engine.
Given a user query and a list of team projects, rank and filter the projects that best match the semantic intent.
Return ONLY a valid JSON array of objects:
[
  {
    "id": "workspace-id",
    "relevanceScore": 95,
    "matchReason": "Contains a modern dark glassmorphic hero section and interactive pricing table."
  }
]`;

    let matchedResults = [];
    try {
      const aiResponse = await generateAIContent({
        prompt: `User Query: "${query}"\n\nTeam Projects:\n${JSON.stringify(projectSummaries, null, 2)}`,
        systemInstruction,
        temperature: 0.2,
      });

      const cleanJson = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      matchedResults = parsed.map((item) => {
        const fullProj = projectSummaries.find((p) => p.id === item.id);
        return {
          ...fullProj,
          relevanceScore: item.relevanceScore,
          matchReason: item.matchReason,
        };
      });
    } catch (err) {
      console.warn("Semantic AI search fallback:", err.message);
      // Fallback simple fuzzy string matching
      const q = query.toLowerCase();
      matchedResults = projectSummaries
        .filter((p) => p.title.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q))
        .map((p) => ({
          ...p,
          relevanceScore: 85,
          matchReason: `Matches keyword search "${query}"`,
        }));
    }

    return NextResponse.json({ success: true, results: matchedResults });
  } catch (error) {
    console.error("Error in space smart-search API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
