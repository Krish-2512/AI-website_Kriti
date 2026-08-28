import { NextResponse } from "next/server";
import { generateAIJson } from "@/app/components/llm/LLM";

// Precomputed curated palette presets for immediate instant response and fallback
const CURATED_PALETTES = [
  {
    name: "Cyberpunk Neon",
    theme: "dark",
    primary: "#8b5cf6",
    secondary: "#06b6d4",
    accent: "#ec4899",
    background: "#090d16",
    surface: "#131b2e",
    text: "#f1f5f9",
    contrastScore: 98,
    badge: "Ultra Modern"
  },
  {
    name: "Obsidian Luxe",
    theme: "dark",
    primary: "#eab308",
    secondary: "#f59e0b",
    accent: "#10b981",
    background: "#0a0a0a",
    surface: "#171717",
    text: "#fafafa",
    contrastScore: 96,
    badge: "Luxury & Elegance"
  },
  {
    name: "Nordic Frost",
    theme: "dark",
    primary: "#38bdf8",
    secondary: "#818cf8",
    accent: "#34d399",
    background: "#0b132b",
    surface: "#1c2541",
    text: "#ffffff",
    contrastScore: 99,
    badge: "Clean Tech"
  },
  {
    name: "Sunset Crimson",
    theme: "dark",
    primary: "#f43f5e",
    secondary: "#fb923c",
    accent: "#fbbf24",
    background: "#180d12",
    surface: "#2c1520",
    text: "#fff1f2",
    contrastScore: 95,
    badge: "Dynamic & Bold"
  },
  {
    name: "Emerald Forest",
    theme: "dark",
    primary: "#10b981",
    secondary: "#14b8a6",
    accent: "#84cc16",
    background: "#051610",
    surface: "#0f2e22",
    text: "#ecfdf5",
    contrastScore: 97,
    badge: "Nature & FinTech"
  },
  {
    name: "Vibrant Indigo",
    theme: "dark",
    primary: "#6366f1",
    secondary: "#3b82f6",
    accent: "#a855f7",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f8fafc",
    contrastScore: 100,
    badge: "Enterprise SaaS"
  }
];

export async function POST(req) {
  try {
    const { prompt, mood } = await req.json();

    const systemInstruction = `You are an AI Color Theory Specialist and Accessibility (WCAG 2.1 AAA) Engineer.
Generate 4-6 diverse, visually stunning, modern color palettes tailored to the user's website prompt or mood.
Every palette must have high contrast, harmonious color relations (analogous, triadic, complementary, monochromatic with punchy accent), and look premium on modern web apps.

Schema:
{
  "palettes": [
    {
      "name": "string (Creative Name)",
      "theme": "dark" | "light",
      "primary": "hex color e.g. #6366f1",
      "secondary": "hex color e.g. #a855f7",
      "accent": "hex color e.g. #06b6d4",
      "background": "hex color e.g. #0f172a",
      "surface": "hex color e.g. #1e293b",
      "text": "hex color e.g. #f8fafc",
      "contrastScore": number (0-100, calculated contrast rating),
      "badge": "string (e.g. Recommended, High Contrast, Playful, Luxury)"
    }
  ]
}`;

    let data;
    try {
      if (prompt || mood) {
        data = await generateAIJson({
          prompt: `Generate intelligent aesthetic color palettes for: Prompt: "${prompt || 'modern interactive website'}", Desired Mood: "${mood || 'sleek modern'}"`,
          systemInstruction,
          temperature: 0.5,
        });
      }
    } catch (err) {
      console.warn("AI Palette Generator fallback used:", err.message);
    }

    const palettes = (data && Array.isArray(data.palettes) && data.palettes.length > 0)
      ? data.palettes
      : CURATED_PALETTES;

    return NextResponse.json({ success: true, palettes });
  } catch (error) {
    console.error("Error in color-palette API:", error);
    return NextResponse.json({ success: true, palettes: CURATED_PALETTES });
  }
}
