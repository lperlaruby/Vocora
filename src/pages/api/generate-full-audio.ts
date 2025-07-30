import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { Readable } from "stream";

// Initializes OpenAI client from the API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    // Convert text to speech using OpenAI's TTS API
    const audioResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "shimmer", // Options: alloy, echo, fable, onyx, nova, shimmer
      input: text,
    });

    if (!audioResponse.body) {
        console.error("Error: No audio data received from OpenAI.");
        return res.status(500).json({ error: "Failed to generate audio." });
    }


    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

    // Stream the MP3 file to the frontend
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "inline; filename=story.mp3");
    //stream.pipe(res);
    res.send(audioBuffer);
  } catch (error) {
    console.error("Error generating speech:", error);
    //res.status(500).json({ error: "Failed to generate speech" });
    return res.status(500).json({ error: "Failed to generate speech", details: error });
  }
}
