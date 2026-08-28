import { NextResponse } from "next/server";
import { generateAIJson } from "@/app/components/llm/LLM";

export async function POST(req) {
  try {
    const { currentSections = [], currentPrompt = "" } = await req.json();

    const existingTypes = currentSections.map(s => s.type);

    // Heuristic + AI Suggestion Engine
    const promptText = `
You are an expert AI Conversion Rate Optimization (CRO) & UI/UX Design Architect.
Analyze the following existing website sections: ${JSON.stringify(existingTypes)}.
Current design goal: "${currentPrompt || 'Modern High-Conversion Web App'}".

Generate 3-4 intelligent, high-impact suggestions to elevate the website's design quality, conversion rate, and user experience.

Return JSON in this EXACT schema:
{
  "suggestions": [
    {
      "id": "sug-1",
      "category": "Conversion" | "UI/UX" | "Accessibility" | "Copywriting",
      "title": "Short punchy title (e.g. Add 3-Tier Pricing Matrix)",
      "impact": "e.g. +35% Conversions" | "WCAG AAA" | "+40% Trust",
      "explanation": "Brief 1-sentence reason why this improves quality.",
      "actionType": "inject_section" | "enhance_colors" | "optimize_copy",
      "payload": {
        "sectionType": "pricing" | "testimonials" | "faq" | "cta",
        "recommendedTitle": "string"
      }
    }
  ]
}
`;

    let result;
    try {
      result = await generateAIJson({ prompt: promptText });
    } catch (aiErr) {
      // Graceful fallback to heuristic CRO suggestions
    }

    return NextResponse.json({
      success: true,
      suggestions: result?.suggestions || [
        {
          id: "sug-default-1",
          category: "Trust",
          title: "Add Verified Social Proof & Reviews",
          impact: "+42% Conversion Rate",
          explanation: "Adding customer testimonials increases organic trust and credibility.",
          actionType: "inject_section",
          payload: { sectionType: "testimonials" }
        },
        {
          id: "sug-default-2",
          category: "UI/UX",
          title: "Introduce 4-Card Bento Feature Grid",
          impact: "Modern Visual Polish",
          explanation: "Bento grid layouts deliver high visual density and modern SaaS aesthetics.",
          actionType: "inject_section",
          payload: { sectionType: "features" }
        },
        {
          id: "sug-default-3",
          category: "Conversion",
          title: "Add Sticky Urgent CTA Ribbon",
          impact: "+28% Click-Throughs",
          explanation: "A high-visibility CTA keeps the primary conversion goal visible.",
          actionType: "inject_section",
          payload: { sectionType: "cta" }
        }
      ]
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      suggestions: [

        {
          id: "sug-fallback-1",
          category: "Trust",
          title: "Add Verified Social Proof & Reviews",
          impact: "+42% Conversion",
          explanation: "Customer testimonials provide social proof and credibility.",
          actionType: "inject_section",
          payload: { sectionType: "testimonials" }
        },
        {
          id: "sug-fallback-2",
          category: "Conversion",
          title: "Add Interactive FAQ Accordion",
          impact: "Reduces Drop-offs",
          explanation: "Answering common questions upfront eliminates buyer hesitation.",
          actionType: "inject_section",
          payload: { sectionType: "faq" }
        }
      ]
    });
  }
}
