import type { NextApiRequest, NextApiResponse } from "next";
import ReactMarkdown from "react-markdown";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message, language, practiceLang, history } = req.body;

  if (!message || !language) {
    return res.status(400).json({ error: "Missing message or language" });
  }

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
              text: `You are a friendly language tutor. You are texting someone learning ${practiceLang} and helping them learn as you both text. Keep replies short and simple and teach them as you go, treat them like an intermediate novice. Respond in ${practiceLang} the old chat history is provided for context:\n\n${message}`,
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
