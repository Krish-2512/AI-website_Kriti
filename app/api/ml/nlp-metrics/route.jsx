import { NextResponse } from "next/server";
import { naiveBayesModel } from "@/lib/naiveBayesClassifier";
import { analyzeNLPReadability } from "@/lib/nlpReadabilitySentiment";
import { runKMeansClustering } from "@/lib/kmeansClustering";
import { findNearestArchetype } from "@/lib/vectorRag";

export async function POST(req) {
  try {
    const { prompt = "", code = "" } = await req.json();

    const textToAnalyze = prompt || code.slice(0, 2000) || "Build a high performance web application";

    // 1. Run Naive Bayes Probabilistic Model
    const bayesPrediction = naiveBayesModel.predict(textToAnalyze);

    // 2. Run NLP Sentiment & Flesch-Kincaid Readability Model
    const nlpMetrics = analyzeNLPReadability(textToAnalyze);

    // 3. Run Vector RAG Cosine Similarity Matcher
    const ragResult = findNearestArchetype(textToAnalyze);

    // 4. Run K-Means Color Centroid Vector Clustering
    const defaultPixels = [
      { r: 99, g: 102, b: 241 },
      { r: 168, g: 85, b: 247 },
      { r: 6, g: 182, b: 212 },
      { r: 15, g: 23, b: 42 },
      { r: 248, g: 250, b: 252 }
    ];
    const kmeans = runKMeansClustering(defaultPixels, 5);

    return NextResponse.json({
      success: true,
      models: {
        naiveBayes: bayesPrediction,
        nlpReadability: nlpMetrics,
        vectorRag: ragResult,
        kmeansClustering: kmeans
      }
    });
  } catch (error) {
    console.error("Error in nlp-metrics API:", error);
    return NextResponse.json({ error: "Failed to compute ML metrics" }, { status: 500 });
  }
}
