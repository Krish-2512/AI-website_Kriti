import { NextResponse } from "next/server";
import { findNearestArchetype, UI_ARCHETYPES } from "@/lib/vectorRag";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const { match, confidence, matchedArchetypeId } = findNearestArchetype(prompt);

    return NextResponse.json({
      success: true,
      ragResult: {
        matchedArchetype: match,
        confidenceScore: Math.round(confidence * 100) / 100,
        matchedId: matchedArchetypeId,
        allArchetypes: UI_ARCHETYPES.map(a => ({ id: a.id, title: a.title, category: a.category }))
      }
    });
  } catch (error) {
    console.error("Error in vector-rag API:", error);
    return NextResponse.json({ error: "Vector RAG retrieval failed" }, { status: 500 });
  }
}
