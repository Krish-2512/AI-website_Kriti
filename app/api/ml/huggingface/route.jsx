import { NextResponse } from "next/server";
import { runHFZeroShotClassification, getHFSentenceEmbedding } from "@/lib/huggingface";

export async function POST(req) {
  try {
    const { prompt = "Make an Anime Merchandise E-Commerce Store with Dark Mode" } = await req.json();

    const [classification, embedding] = await Promise.all([
      runHFZeroShotClassification(prompt),
      getHFSentenceEmbedding(prompt)
    ]);

    return NextResponse.json({
      success: true,
      huggingface: {
        activeModel: "sentence-transformers/all-MiniLM-L6-v2",
        zeroShotModel: "facebook/bart-large-mnli",
        library: "@huggingface/inference & ONNX Runtime",
        embeddingDimension: embedding.length,
        embeddingSample: embedding.slice(0, 8).map(v => Math.round(v * 1000) / 1000),
        classification
      }
    });
  } catch (error) {
    console.error("Error in Hugging Face API:", error);
    return NextResponse.json({ error: "Failed to run Hugging Face inference" }, { status: 500 });
  }
}
