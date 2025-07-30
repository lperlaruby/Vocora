import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Initializes OpenAI client from the API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
type StoryLength = "short" | "medium" | "long";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const { words, length, practiceLang, userLang = "en" } = req.body;

  // This statement ensures that words are being provided and are not empty
  if (!words || words.length === 0) {
    return res.status(400).json({ error: "No words provided" });
  }

  const sentenceLengths = {
    short: 3,
    medium: 5,
    long: 8
  };

  const numSentences = sentenceLengths[length as StoryLength] || sentenceLengths.medium;

  try {
    // Generate the story in the practice language
    const completion = await openai.chat.completions.create({
      model: "o1-mini-2024-09-12",
      messages: [
        {
          role: "user",
          content: `Write a unique story with ${numSentences} sentences using elementary-level words and this list: ${words.join(", ")}.
          Each time the request is made, ensure the story is different by varying the setting, characters, or conflict. 
          Write the story in ${practiceLang === "es" ? "beginner Latin American Spanish" : practiceLang === "zh" ? "beginner Mandarin Chinese" : "beginner English"}.
          Do not include translations to other languages.`
        }
      ],
    });

    const originalStory = completion.choices[0].message.content;

    // Get the translation in the user's language
    const translationCompletion = await openai.chat.completions.create({
      model: "o1-mini-2024-09-12",
      messages: [
        {
          role: "user",
          content: `Translate this story to ${userLang === "es" ? "Spanish" : userLang === "zh" ? "Mandarin Chinese" : "English"}, maintaining the same meaning and tone:

          "${originalStory}"
          
          Provide only the translation, no additional comments.`
        }
      ],
    });

    const translation = translationCompletion.choices[0].message.content;
      
    // Send both the original story and its translation
    res.status(200).json({ 
      story: originalStory,
      translation: translation
    });
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ error: "Failed to generate story" });
  }
}