import { NextResponse } from "next/server";
import { generateAIJson } from "@/app/components/llm/LLM";

export async function POST(req) {
  try {
    const { brandName = "Modern Brand", industry = "Digital Products", tone = "Persuasive & Modern", currentCopy = "" } = await req.json();

    const systemInstruction = `You are a world-class Conversion Rate Optimization (CRO) Copywriter and Brand Strategist.
Generate high-converting, magnetic marketing copy for a modern web product.

Schema:
{
  "heroVariants": [
    {
      "headline": "string (Punchy, 6-10 words, high impact)",
      "subheadline": "string (1-2 sentences outlining the unique value proposition)",
      "primaryCTA": "string (Action-oriented, e.g., 'Claim Your Free Access')",
      "secondaryCTA": "string (Low friction, e.g., 'Explore Live Demo')"
    }
  ],
  "featureHighlights": [
    {
      "iconName": "string (Lucide icon name e.g. Zap, Shield, Sparkles, TrendingUp, Lock)",
      "title": "string",
      "description": "string (Crisp, benefits-driven explanation)"
    }
  ],
  "socialProof": [
    {
      "author": "string",
      "role": "string",
      "company": "string",
      "quote": "string",
      "rating": 5
    }
  ],
  "faqList": [
    {
      "question": "string",
      "answer": "string"
    }
  ]
}`;

    const promptText = `Generate high-converting conversion copy for:
Brand Name: "${brandName}"
Industry / Niche: "${industry}"
Tone: "${tone}"
Existing Context: "${currentCopy.slice(0, 500)}"`;

    let result;
    try {
      result = await generateAIJson({
        prompt: promptText,
        systemInstruction,
        temperature: 0.7,
      });
    } catch (err) {
      console.warn("AI Copy Optimizer fallback used:", err.message);
      result = {
        heroVariants: [
          {
            headline: "Elevate Your Digital Experience with Intelligent Design",
            subheadline: "Empower your workflow with cutting-edge tools designed for creators, teams, and visionaries.",
            primaryCTA: "Get Started Free",
            secondaryCTA: "Watch Interactive Demo"
          },
          {
            headline: "The Modern Platform for Seamless Creation",
            subheadline: "Transform your ideas into stunning digital realities in minutes without complex setup.",
            primaryCTA: "Launch Your Project",
            secondaryCTA: "Explore Ecosystem"
          }
        ],
        featureHighlights: [
          { iconName: "Zap", title: "Lightning Fast Velocity", description: "Built on modern architectures optimized for speed, instant rendering, and silky smooth transitions." },
          { iconName: "Shield", title: "Enterprise Grade Security", description: "End-to-end data encryption with automated backup protocols and role-based permissions." },
          { iconName: "Sparkles", title: "AI-Powered Intelligence", description: "Automated assistance and predictive workflows that amplify your productivity tenfold." }
        ],
        socialProof: [
          { author: "Alex Mercer", role: "Product Director", company: "Apex Dynamics", quote: "This platform cut our design-to-launch cycle by over 70%. It is hands-down the best tool we've adopted this year.", rating: 5 },
          { author: "Elena Rostova", role: "Founder", company: "Lumina Labs", quote: "The aesthetics, responsiveness, and AI capabilities are simply unmatched. A total game changer.", rating: 5 }
        ],
        faqList: [
          { question: "How easy is it to get started?", answer: "You can create and launch your first live interactive interface in under 2 minutes with zero setup required." },
          { question: "Can I export the source code?", answer: "Yes! You have 100% code ownership and can download full production-ready Vite React repositories at any time." }
        ]
      };
    }

    return NextResponse.json({ success: true, copy: result });
  } catch (error) {
    console.error("Error in copy-optimizer API:", error);
    return NextResponse.json({ error: "Failed to optimize copy" }, { status: 500 });
  }
}
