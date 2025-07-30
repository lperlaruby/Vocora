import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { word, story, userLang } = req.body;

  if (!word || !story || !userLang) {
    return res.status(400).json({ error: "Missing word or story" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `In the story below, analyze the use of the word "${word}".

            Story:
            "${story}"

            Instructions:
            - Determine how "${word}" is used in **this specific story**, not its general dictionary meaning.
            - Return a JSON object like this:
            {
                "translatedWord": "<translated word in ${userLang}>",
                "partOfSpeech": "<translated part of speech in ${userLang}>",
                "definition": "<translated definition in ${userLang}>"
            }
            - Translate all fields to "${userLang}".
            - If "${word}" refers to a person, explain it clearly as a name (proper noun).
            - Avoid mentioning any specific story characters or sentences. Focus on what the word means in general **based on this usage**.`
        },
      ],      
    });

    const raw = response.choices[0].message.content?.trim();

    try {
    const parsed = JSON.parse(raw || "");
    res.status(200).json({
        definition: parsed.definition || "No definition found.",
        partOfSpeech: parsed.partOfSpeech || "Unknown",
        translatedWord: parsed.translatedWord || "",
    });
    } catch (err) {
    console.error("Failed to parse AI response:", raw);
    res.status(500).json({ error: "Invalid JSON format from OpenAI." });
    }
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
