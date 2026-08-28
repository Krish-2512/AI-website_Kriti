import { NextResponse } from "next/server";
import { generateAIJson } from "@/app/components/llm/LLM";

export async function POST(req) {
  try {
    const { code, files, errorMessage = "Syntax or rendering issue" } = await req.json();

    const currentCode = code || files?.["/App.js"]?.code || "";

    if (!currentCode) {
      return NextResponse.json({ error: "Code is required for self-healing" }, { status: 400 });
    }

    const systemInstruction = `You are a Senior React Compiler Engineer and Automated AST Auto-Healing Specialist.
Your job is to inspect broken or imperfect React code, diagnose syntax errors, missing imports, unclosed tags, or dependency clashes in Sandpack, and produce a 100% working, self-contained React component with Tailwind CSS and Lucide React icons.

RULES:
1. Ensure all React hooks (useState, useEffect, useMemo, useRef) are properly imported from 'react'.
2. Ensure all used Lucide icons are correctly imported from 'lucide-react'.
3. Do NOT import non-existent external libraries.
4. Output clean, valid JSX with proper closing tags.
5. Export default function App() as the root component.

Return strictly JSON:
{
  "fixed": true,
  "explanation": "string (brief summary of what was healed)",
  "files": {
    "/App.js": {
      "code": "string (the complete healed React code)"
    }
  },
  "generatedFiles": ["/App.js"]
}`;

    const promptText = `Analyze and self-heal this React code:
Reported Error: "${errorMessage}"

Source Code:
\`\`\`jsx
${currentCode.slice(0, 6000)}
\`\`\``;

    let result;
    try {
      result = await generateAIJson({
        prompt: promptText,
        systemInstruction,
        temperature: 0.1,
      });
    } catch (err) {
      console.warn("AI Self-Healing fallback used:", err.message);

      // Automated regex patch fallback
      let patchedCode = currentCode;

      // Ensure React import
      if (!patchedCode.includes("import React")) {
        patchedCode = `import React, { useState, useEffect } from 'react';\n` + patchedCode;
      }

      // Ensure export default
      if (!patchedCode.includes("export default")) {
        patchedCode += `\nexport default App;\n`;
      }

      result = {
        fixed: true,
        explanation: "Automated standard import and export closure applied to React component.",
        files: {
          "/App.js": {
            code: patchedCode
          }
        },
        generatedFiles: ["/App.js"]
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in self-heal API:", error);
    return NextResponse.json({ error: "Self-healing failed" }, { status: 500 });
  }
}
