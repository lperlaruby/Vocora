import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message, practiceLang, language, history, } = req.body;

  if (!message || !practiceLang) {
    return res.status(400).json({ error: "Missing message or language" });
  }

   const langLabels: Record<string, string> = {
    en: "English",
    es: "Español",
    zh: "中文",
  };

  const practiceLangLabel = langLabels[practiceLang];
  const nativeLangLabel = langLabels[language];

  try {
    const formattedHistory =
    Array.isArray(history) && history.length > 0
      ? history.map((msg: { role: "user" | "ai"; content: string }) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }))
      : [];

      const contents = [
        ...formattedHistory,
        {
          role: "user",
          parts: [
            {
              text: `You are a friendly grammar tutor. You will receive a sentence from a student practicing ${practiceLangLabel}. The user's native language is in ${nativeLangLabel}.
              
                Step 1: Check if the student's sentence is written in ${practiceLangLabel}.  
                  - If it is NOT, reply ONLY in ${nativeLangLabel} telling them:
                    - 'Your sentence must be written in ${practiceLangLabel}'.
                
                Do **not** provide any feedback, corrections, or guesses. Just a gentle reminder.

                Step 2: Only if the sentence is in ${practiceLangLabel}, respond using three SEPERATE new lines:
                  1. Start with a short verbal rating in ${practiceLangLabel} of the sentence”.
                  2. Provide a sentence of simple grammatical feedback in ${nativeLangLabel}.
                  3. If the sentence they sent was rated not quite or almost there, then on a new line in ${practiceLangLabel} return the revised sentence only — **without any labels**
                
                This is not a chat message, just feedback. It must follow this **exact three-line structure** Each response must be on its own line, separated by a visible line break.

                \n\nStudent's sentence: ${message}`,
            },
          ],
        },
      ];

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const responseData = await geminiRes.json();

    console.log("Gemini raw response:", JSON.stringify(responseData, null, 2));

    const reply = responseData?.candidates?.[0]?.content?.parts
        ?.map((p: { text: string }) => p.text)
        ?.join("\n") || "No reply received.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
}
