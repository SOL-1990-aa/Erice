import { GoogleGenAI } from "@google/genai";

export async function generateProductImage(description: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `High-end luxury product photography: ${description}. Professional studio lighting, clean background, 4k detail, editorial aesthetic.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      },
    });

    // Find the image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }

    throw new Error("No image generated in the response");
  } catch (error: any) {
    console.error("Image Generation Error Details:", error);
    // Re-throw to be caught by the component
    throw error;
  }
}
