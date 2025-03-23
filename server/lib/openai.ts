import OpenAI from "openai";
import type { Idea } from "@shared/schema";

// Get the OpenAI API key from environment variables
const apiKey = process.env.OPENAI_API_KEY || "";

// Initialize OpenAI
const openai = new OpenAI({ apiKey });

type GenerationStyle = "detailed" | "concise" | "poetic";

/**
 * Generates story content based on a prompt, active ideas, and style preference
 */
export async function generateStoryContent(
  prompt: string,
  activeIdeas: Idea[] = [],
  style: GenerationStyle = "detailed"
): Promise<string> {
  try {
    if (!apiKey) {
      console.warn("OpenAI API key is not set. Using mock content generation.");
      return getMockGeneratedContent();
    }

    // Group ideas by category
    const ideaGroups: Record<string, string[]> = {};
    activeIdeas.forEach(idea => {
      if (!ideaGroups[idea.category]) {
        ideaGroups[idea.category] = [];
      }
      ideaGroups[idea.category].push(`${idea.name}: ${idea.description}`);
    });

    // Construct system message with active ideas
    let systemMessage = "You are a creative writing assistant that helps craft engaging stories.";
    
    if (activeIdeas.length > 0) {
      systemMessage += " Please incorporate the following key elements into your response:";
      
      Object.entries(ideaGroups).forEach(([category, ideas]) => {
        systemMessage += `\n\n${category}:\n`;
        ideas.forEach(idea => {
          systemMessage += `- ${idea}\n`;
        });
      });
    }

    // Add style guidance
    switch (style) {
      case "detailed":
        systemMessage += "\n\nWrite in a detailed, descriptive style with rich imagery.";
        break;
      case "concise":
        systemMessage += "\n\nWrite in a concise, clear style focusing on plot advancement.";
        break;
      case "poetic":
        systemMessage += "\n\nWrite in a poetic, lyrical style with metaphors and beautiful language.";
        break;
    }

    // Make the API request
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || getMockGeneratedContent();
  } catch (error) {
    console.error("Error generating content with OpenAI:", error);
    return getMockGeneratedContent();
  }
}

/**
 * Returns mock generated content when OpenAI API is unavailable
 */
function getMockGeneratedContent(): string {
  return "Suddenly, a rustling sound caught Lyra's attention. She turned, her hand instinctively reaching for the dagger at her belt. From between the trees emerged a figure unlike any she had seen before - tall and lithe with skin that seemed to shimmer like moonlight on water.";
}
