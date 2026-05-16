import { GoogleGenAI, Type } from "@google/genai";
import { DISCOVERY_ENTITIES } from "../constants";
import { EntityDiscovery } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getRecommendations(history: string[]): Promise<EntityDiscovery[]> {
  if (history.length === 0) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the user's recent search and browsing history: [${history.join(', ')}], 
      recommend 3 relevant entities from our collection.
      
      Entities:
      ${JSON.stringify(DISCOVERY_ENTITIES.map(e => ({ id: e.id, name: e.name, category: e.category })))}

      Return JSON: { "recommendedIds": string[] }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedIds: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
          },
          required: ["recommendedIds"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"recommendedIds": []}');
    return DISCOVERY_ENTITIES.filter(e => result.recommendedIds?.includes(e.id));
  } catch (error) {
    console.error("Recommendation Error:", error);
    return [];
  }
}
