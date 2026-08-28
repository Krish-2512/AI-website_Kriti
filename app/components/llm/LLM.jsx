import { GoogleGenerativeAI } from "@google/generative-ai";

const PRIMARY_MODEL = "gemini-2.0-flash";
const FALLBACK_MODELS = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"];

export function getGeminiModel(customKey = null, modelName = PRIMARY_MODEL, config = {}) {
  const apiKey = customKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    ...config,
  });
}

/**
 * Robust stateless text generation with automatic model fallback
 */
export async function generateAIContent({
  prompt,
  systemInstruction = "",
  responseMimeType = "text/plain",
  temperature = 0.7,
  maxOutputTokens = 8192,
  apiKey = null,
}) {
  const effectiveKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
  if (!effectiveKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = getGeminiModel(effectiveKey, modelName, {
        generationConfig: {
          temperature,
          maxOutputTokens,
          responseMimeType,
        },
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (err) {
      console.warn(`Model ${modelName} failed, attempting next fallback... Reason:`, err.message);
      lastError = err;
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
}

/**
 * Robust JSON generation helper with automatic cleaning of markdown codeblocks
 */
export async function generateAIJson({
  prompt,
  systemInstruction = "",
  temperature = 0.4,
  apiKey = null,
}) {
  const effectiveKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
  if (!effectiveKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = getGeminiModel(effectiveKey, modelName, {
        generationConfig: {
          temperature,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleaned = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      return JSON.parse(cleaned);
    } catch (err) {
      console.warn(`JSON generation with ${modelName} failed, trying fallback... Reason:`, err.message);
      lastError = err;
    }
  }

  throw new Error(`JSON generation failed across all models. Last error: ${lastError?.message}`);
}

/**
 * Vision Multimodal analyzer (accepts base64 image data)
 */
export async function generateVisionAI({
  prompt,
  base64Image,
  mimeType = "image/png",
  apiKey = null,
}) {
  const effectiveKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
  if (!effectiveKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  let lastError = null;

  const imagePart = {
    inlineData: {
      data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
      mimeType: mimeType,
    },
  };

  for (const modelName of modelsToTry) {
    try {
      const model = getGeminiModel(effectiveKey, modelName);
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (err) {
      console.warn(`Vision model ${modelName} failed, trying next... Reason:`, err.message);
      lastError = err;
    }
  }

  throw new Error(`Vision AI failed. Last error: ${lastError?.message}`);
}