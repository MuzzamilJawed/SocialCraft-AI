import { GoogleGenAI, Type } from "@google/genai";
import { PostResult, SocialPlatform, GenerationOptions } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSocialContent(title: string, context: string, platform: SocialPlatform, options: GenerationOptions): Promise<PostResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Title: ${title}
      Context: ${context}
      Target Platform: ${platform}
      Tone Requested: ${options.tone}
      Generate Text: ${options.generateText}
      Generate Image Needs: ${options.generateImage}
    `,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: `
        You are an AI-powered Social Media Content Strategist and Writer.
        Your goal is to generate HIGH-QUALITY, ENGAGING, and SHAREABLE social media posts.

        FOLLOW THESE STEPS:
        1. UNDERSTAND INTENT: Analyze the title and context. Identify topic category, audience, and purpose.
        2. RESEARCH: Use Google Search to retrieve relevant, up-to-date insights (trends, facts, statistics).
        3. CONTENT STRATEGY: Decide format based on ${platform}. Tone MUST be ${options.tone}.
        4. GENERATE POST: Polished, clean formatting, natural human-like tone.

        CONTENT DIRECTION:
        - If generateText is false, provide minimal placeholders.
        - If generateImage is true, focus the content on being visual-ready.

        PLATFORM CONSTRAINTS:
        - linkedin: Professional, insightful, allows long-form storytelling, focus on industry impact.
        - x: Concise, use threads if needed, punchy hooks, strict character limit awareness (under 280 for main post).
        - instagram: Visual-first tone, punchy lead, emoji-friendly, lifestyle/relatability focus.

        STYLE RULES:
        - Tone: ${options.tone}
        - Avoid generic AI phrases.
        - Be concise but impactful.
        - Strong scroll-stopping HOOK (first 1-2 lines).

        OUTPUT JSON FORMAT:
        {
          "postContent": "Main post content with line breaks",
          "hashtags": ["tag1", "tag2"],
          "captionVariation": "Short variation (e.g. for a story or tweet)",
          "insights": ["Insight 1", "Insight 2"],
          "platform": "${platform}"
        }
      `,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          postContent: { type: Type.STRING },
          hashtags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          captionVariation: { type: Type.STRING },
          insights: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          platform: { type: Type.STRING }
        },
        required: ["postContent", "hashtags", "captionVariation", "platform"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  const result = JSON.parse(response.text);
  return {
    ...result,
    platform
  };
}
