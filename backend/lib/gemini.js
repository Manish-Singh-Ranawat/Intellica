// import fetch from "node-fetch"; // or your preferred fetch
import { GoogleGenAI, Modality } from "@google/genai";
import { ENV_VARS } from "./envVars.js";

const ai = new GoogleGenAI({ apiKey: ENV_VARS.GEMINI_API_KEY });

const safetySettings = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
];

//Fetch image, validate type, and return base64 + mimeType
const fetchImageData = async (url) => {
  const res = await fetch(url);
  const mimeType = res.headers.get("content-type")?.split(";")[0];
  if (!["image/jpeg", "image/png"].includes(mimeType)) {
    throw new Error(`Unsupported image type: ${mimeType}`);
  }
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return { base64, mimeType };
};

// Build Gemini-ready content and get AI response text
export const generateAIResponse = async (
  newText,
  imageUrl = "",
  history = []
) => {
  // Block Image Generation Prompts
  const forbiddenPhrases = [
    /\b(generate|create|make|draw|render|illustrate|visualize)\b.*\b(image|picture|photo|art|scene|graphic|drawing)\b/i,
  ];

  if (forbiddenPhrases.some((pattern) => pattern.test(newText))) {
    return "Image generation is currently not supported.";
  }

  const POLICY_INSTRUCTION = {
    role: "user",
    parts: [
      {
        text: `Important: If the user asks for image generation or drawing of any kind, respond with "Sorry, I'm not able to generate or create images." Do not attempt to generate visual content.`,
      },
    ],
  };
  const formatted = [POLICY_INSTRUCTION];
  for (const msg of history) {
    const parts = [];
    for (const p of msg.parts) {
      if (p.text) parts.push({ text: p.text });
      if (p.image?.url) {
        const { base64, mimeType } = await fetchImageData(p.image.url);
        parts.push({ inlineData: { mimeType, data: base64 } });
      }
    }
    formatted.push({ role: msg.role, parts });
  }

  const newParts = [{ text: newText }];
  if (imageUrl) {
    const { base64, mimeType } = await fetchImageData(imageUrl);
    newParts.push({ inlineData: { mimeType, data: base64 } });
  }
  formatted.push({ role: "user", parts: newParts });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: formatted,
    config: { safetySettings, responseModalities: [Modality.TEXT] },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text;
};
