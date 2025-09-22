
import { GoogleGenAI, Type } from "@google/genai";
import { CuriosityItem, DeepDiveItem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const feedItemSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A compelling, short title for the topic.",
    },
    blurb: {
      type: Type.STRING,
      description: "A one-sentence, intriguing summary or fact.",
    },
    source: {
      type: Type.STRING,
      description: "A fictional but plausible source URL (e.g., 'nature.com/articles/...')",
    },
  },
  required: ["title", "blurb", "source"],
};

const deepDiveSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A detailed summary of the topic, at least 3 paragraphs long. Use bullet points with asterisks (* list item) to list key facts or details for better readability.",
        },
        relatedTopics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 3 distinct but related topic titles for further exploration.",
        },
        sources: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The title of the source article or page." },
                    url: { type: Type.STRING, description: "A plausible, fictional URL for the source." }
                },
                required: ["title", "url"]
            },
            description: "An array of 2-3 fictional but plausible sources for the information provided."
        }
    },
    required: ["summary", "relatedTopics", "sources"],
};


export const getFeedItems = async (category: string, count: number = 6): Promise<CuriosityItem[]> => {
  try {
    const prompt = `Generate ${count} random, quirky, and interesting facts or research highlights from the category of '${category}'. Ensure high diversity in topics.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: feedItemSchema,
        },
      },
    });

    const jsonText = response.text.trim();
    const items = JSON.parse(jsonText) as Omit<CuriosityItem, 'id' | 'category'>[];
    return items.map(item => ({ ...item, id: self.crypto.randomUUID(), category: category }));

  } catch (error) {
    console.error("Error fetching feed items:", error);
    // Return mock data on failure to avoid app crash
    return Array.from({ length: count }).map((_, i) => ({
        id: `error-${i}`,
        title: `Error: Could not fetch item for ${category}`,
        blurb: "There was an issue connecting to the content generation service. Please try again later.",
        source: "curiodive.com/error",
        category: category,
    }));
  }
};

export const getDeepDive = async (topicTitle: string): Promise<DeepDiveItem | null> => {
    try {
        const prompt = `For the topic "${topicTitle}", provide a detailed summary using paragraphs and bullet points, suggest related topics, and list some plausible sources.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: deepDiveSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText) as Omit<DeepDiveItem, 'title'>;
        return { ...data, title: topicTitle };

    } catch (error) {
        console.error("Error fetching deep dive:", error);
        return {
            title: topicTitle,
            summary: "We couldn't dive deeper into this topic due to an error. The rabbit hole ends here, for now. Please try another topic or come back later.",
            relatedTopics: [],
            sources: []
        };
    }
};