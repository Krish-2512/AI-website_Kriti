import { NextResponse } from "next/server";
import { generateAIJson } from "@/app/components/llm/LLM";
import { synthesizeCodeFromPrompt } from "@/lib/codeSynthesizer";

export async function POST(req) {
  try {
    const { prompt, palette, blueprint } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemInstruction = `You are an elite Principal React Developer and UI/UX Designer creating award-winning websites.
Generate a complete, fully functional, multi-section React application using Vite/React conventions, Tailwind CSS for styling, and 'lucide-react' for icons.

DESIGN EXCELLENCE REQUIREMENTS:
1. Visuals: Dark/Light sophisticated themes, glassmorphism (backdrop-blur), smooth gradients, subtle borders, high contrast, clean typography.
2. Structure: 
   - Interactive Navigation Bar with logo, links, search/action button, mobile hamburger drawer.
   - High-impact Hero section with badges, bold typography, dynamic CTA buttons, and interactive metric stats.
   - Bento-style Feature Grid with distinct cards, icons, and hover highlights.
   - Interactive demo section, interactive calculator/filter, or dynamic tabs.
   - Social proof / Testimonials marquee / Review cards with avatar placeholders and 5-star ratings.
   - Pricing tiers or Contact / FAQ accordion section.
   - Modern comprehensive Footer with newsletter signup and copyright.
3. State & Reactivity: Use React useState/useEffect for functional toggles (e.g. mobile menu toggle, tab switching, interactive filter, modal preview).
4. Self-Contained: All component code must be in /App.js (or clean sub-components in the same file), properly importing React and Lucide icons.
5. Placeholder Images: Use high quality Unsplash photo URLs (e.g. https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60) with proper alt text.

Return your response strictly in the following JSON format:
{
  "projectTitle": "string",
  "explanation": "string (one concise paragraph describing the structure and design decisions)",
  "files": {
    "/App.js": {
      "code": "string (the complete React application code for App.js)"
    }
  },
  "generatedFiles": ["/App.js"]
}`;

    const enrichedPrompt = `User Prompt: ${prompt}
${palette ? `Use this Color Palette Theme: Primary ${palette.primary}, Accent ${palette.accent}, Background ${palette.background}, Surface ${palette.surface}, Text ${palette.text}` : ''}
${blueprint ? `Architectural Blueprint: Domain ${blueprint.domain}, Components: ${blueprint.componentGraph?.map(c => c.name).join(', ')}` : ''}

Generate the complete React website now. Return ONLY valid JSON matching the schema.`;

    let parsedData;
    try {
      parsedData = await generateAIJson({
        prompt: enrichedPrompt,
        systemInstruction,
        temperature: 0.7,
      });

      // Ensure valid files structure in AI response
      if (!parsedData?.files?.["/App.js"]?.code) {
        throw new Error("Invalid AI structure returned, using procedural synthesis fallback");
      }
    } catch (aiErr) {
      console.warn("AI generation fallback triggered, synthesizing custom tailored website:", aiErr.message);
      // Domain-specific tailored procedural synthesis
      parsedData = synthesizeCodeFromPrompt(prompt, palette, blueprint);
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Error in website-code API:", error);
    const fallback = synthesizeCodeFromPrompt("Modern React Platform", null, null);
    return NextResponse.json(fallback);
  }
}
