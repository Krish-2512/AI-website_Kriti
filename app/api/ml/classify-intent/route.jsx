import { NextResponse } from "next/server";
import { generateAIJson } from "@/app/components/llm/LLM";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemInstruction = `You are an expert Chief AI Web Architect and Machine Learning Intent Classifier.
Analyze the user's prompt and extract a comprehensive architectural blueprint for generating a high-end, responsive React website.
Return a structured JSON object with the following schema:
{
  "domain": "string (e.g. FinTech / SaaS, Luxury E-Commerce, Modern Portfolio, Healthcare, EdTech)",
  "intent": "string (one-sentence clear purpose)",
  "targetAudience": "string",
  "visualTone": "string (e.g. Sleek Cyberpunk Dark, Minimalist Nordic, Vibrant Gradient, Corporate Trust)",
  "componentGraph": [
    {
      "name": "string (e.g. NavbarWithCTA, HeroWithMetrics, BentoFeatures, InteractiveDemo, PricingMatrix, TestimonialCarousel, FAQSection, Footer)",
      "purpose": "string",
      "priority": "essential | recommended | optional"
    }
  ],
  "recommendedPalette": {
    "primary": "string (hex or tailwind class)",
    "secondary": "string",
    "accent": "string",
    "background": "string",
    "surface": "string",
    "text": "string"
  },
  "suggestedFeatures": ["string"],
  "blueprintSummary": "string"
}`;

    const classificationPrompt = `Analyze this website prompt and generate the architectural intent blueprint:
User Prompt: "${prompt}"`;

    let result;
    try {
      result = await generateAIJson({
        prompt: classificationPrompt,
        systemInstruction,
        temperature: 0.2,
      });
    } catch (aiErr) {
      console.warn("AI Classification fallback activated:", aiErr.message);
      // Heuristic Fallback
      const isEcom = /shop|store|product|buy|cart|commerce/i.test(prompt);
      const isPortfolio = /portfolio|resume|cv|personal|developer/i.test(prompt);
      const isSaaS = /saas|platform|dashboard|tool|app|manage/i.test(prompt);

      result = {
        domain: isEcom ? "Modern E-Commerce" : isPortfolio ? "Developer Portfolio" : isSaaS ? "B2B SaaS Platform" : "Modern Digital Web App",
        intent: `Build an interactive web application based on: "${prompt.slice(0, 80)}..."`,
        targetAudience: "Modern web & mobile users seeking an intuitive experience",
        visualTone: "Ultra-sleek Dark Mode with Glassmorphism & Vibrant Accents",
        componentGraph: [
          { name: "Navbar", purpose: "Responsive header with branding and action buttons", priority: "essential" },
          { name: "HeroSection", purpose: "Engaging headline, value proposition and CTA", priority: "essential" },
          { name: "FeatureGrid", purpose: "Bento-style showcases of key capabilities", priority: "essential" },
          { name: "InteractiveShowcase", purpose: "Live interactive demo / widget", priority: "recommended" },
          { name: "Testimonials", purpose: "Social proof and trust badges", priority: "recommended" },
          { name: "PricingOrCTA", purpose: "Conversion tier / lead magnet", priority: "essential" },
          { name: "Footer", purpose: "Links, copyright, and social icons", priority: "essential" }
        ],
        recommendedPalette: {
          primary: "#6366f1",
          secondary: "#a855f7",
          accent: "#06b6d4",
          background: "#0f172a",
          surface: "#1e293b",
          text: "#f8fafc"
        },
        suggestedFeatures: ["Dark/Light Theme Toggle", "Live Filtering", "Responsive Mobile Drawer", "Micro-Interactions"],
        blueprintSummary: "Multi-section responsive React web application with modern Tailwind styling and Lucide icons."
      };
    }

    return NextResponse.json({ success: true, blueprint: result });
  } catch (error) {
    console.error("Error in classify-intent API:", error);
    return NextResponse.json({ error: "Failed to classify intent" }, { status: 500 });
  }
}
