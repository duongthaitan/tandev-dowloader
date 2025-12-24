
import { GoogleGenAI, Type } from "@google/genai";
import { MediaMetadata } from "./types";

export const analyzeMediaUrl = async (url: string): Promise<MediaMetadata> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY is not configured in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this social media URL and extract potential metadata: ${url}. 
    Identify if it's YouTube, TikTok, Instagram, or Facebook. 
    Provide a realistic title, author, and a wide range of format options including different video resolutions (1080p, 720p, 480p) and audio qualities (320kbps, 128kbps).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          author: { type: Type.STRING },
          platform: { 
            type: Type.STRING,
            description: "One of: youtube, tiktok, instagram, facebook, unknown" 
          },
          thumbnail: { type: Type.STRING },
          formats: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                quality: { type: Type.STRING },
                type: { 
                  type: Type.STRING,
                  description: "Must be 'video', 'audio', or 'image'"
                },
                ext: { type: Type.STRING },
                size: { type: Type.STRING }
              },
              required: ["id", "quality", "type", "ext"]
            }
          }
        },
        required: ["title", "author", "platform", "thumbnail", "formats"]
      }
    }
  });

  const text = response.text;
  if (typeof text !== 'string' || !text) {
    throw new Error("Empty or invalid response from AI");
  }
  
  return JSON.parse(text) as MediaMetadata;
};
