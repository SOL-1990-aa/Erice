import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function moderateContent(text: string): Promise<{ isSafe: boolean; reason?: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform content moderation on the following text: "${text}".
      Analyze for:
      - Hate speech
      - Harassment
      - Explicit sexual content
      - Dangerous activities
      - Sensitive/Personal info leaks

      Return JSON: { "isSafe": boolean, "reason": "optional string if unsafe" }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ["isSafe"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"isSafe": true}');
    return result;
  } catch (error) {
    console.error("Moderation Error:", error);
    return { isSafe: true }; // Default to safe if API fails
  }
}
