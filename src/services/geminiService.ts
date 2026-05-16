import { GoogleGenAI } from "@google/genai";
import { DISCOVERY_ENTITIES } from "../constants";
import { getCachedInsight, cacheSearchInsight } from "./firebaseService";
import { moderateContent } from "./moderationService";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function performAISearch(query: string) {
  try {
    // Check cache first
    const cached = await getCachedInsight(query);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the AI brain for "Erce Explorer". 
      Given the user query: "${query}", analyze which of our entities it relates to.
      
      Our Entities:
      ${JSON.stringify(DISCOVERY_ENTITIES.map(e => ({ name: e.name, summary: e.summary, id: e.id })))}

      Return a JSON response with:
      1. "aiInsight": A brief, professional AI-generated insight about the search (max 2 sentences).
      2. "matchingIds": An array of IDs from the entities above that are most relevant.
      3. "suggestedCategory": The most likely category (fashion, textile, research, streetwear).

      Keep it objective and professional.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{}');
    let aiInsight = cached || result.aiInsight || "Exploring the Erce ecosystem...";

    // Moderate content
    const moderation = await moderateContent(aiInsight);
    if (!moderation.isSafe) {
      aiInsight = "Our AI generated an insight that did not pass our community safety standards. Please try a different query.";
    }

    if (!cached && result.aiInsight && moderation.isSafe) {
      await cacheSearchInsight(query, result.aiInsight);
    }

    return {
      aiInsight,
      matches: DISCOVERY_ENTITIES.filter(e => result.matchingIds?.includes(e.id)) || [],
      category: result.suggestedCategory || 'all'
    };
  } catch (error) {
    console.error("AI Search Error:", error);
    return {
      aiInsight: "Continuously indexing the Erce landscape...",
      matches: [],
      category: 'all'
    };
  }
}

export async function getDetailedAITummary(entityName: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a premium, luxury-style summary for the entity: "${entityName}" in the context of fashion or research discovery. Use sophisticated language.`
    });
    return response.text;
  } catch (error) {
    return "Refining detailed insights...";
  }
}
