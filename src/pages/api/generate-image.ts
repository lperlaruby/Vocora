import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp"

const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;
const FIREWORKS_ENDPOINT = "https://api.fireworks.ai/inference/v1/image_generation/accounts/fireworks/models/stable-diffusion-xl-1024-v1-0";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Extract story text from the request body
    const { story } = req.body;

    // This statement ensures that a story is provided and is not empty
    if (!story || story.trim().length === 0) {
      return res.status(400).json({ error: "No story provided" });
    }

    // This calls Fireworks AI API to generate an image from the story
    const response = await fetch(FIREWORKS_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIREWORKS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Draw me an image MidJourney style for this story: ${story}`,
        width: 1024,
        height: 1024,
        steps: 20,
      }),
    });
  
    // Handles API errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Fireworks API Error:", errorData);
      return res.status(500).json({ error: "Fireworks API Error", details: errorData });
    }

    // Converts response into binary
    const arrayBuffer = await response.arrayBuffer();

    // Resizes image to 512x512
    const resizedImage = await sharp(Buffer.from(arrayBuffer))
      .resize(512, 512)
      .png()
      .toBuffer();
    
    res.setHeader("Content-Type", "image/png");

    // Sends the image data back to frontend
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    return res.status(500).json({ error: "Failed to connect to Fireworks AI" });
  }
}
