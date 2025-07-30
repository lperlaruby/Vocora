import { NextApiRequest, NextApiResponse } from "next";

const practiceWords = async (words: string[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Practice session completed!");
    }, 1000); // Simulates a 1-second delay
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { words } = req.body;

  if (!words || words.length === 0) {
    return res.status(400).json({ error: "No words provided" });
  }

  try {
    const result = await practiceWords(words);
    res.status(200).json({ success: true, message: result });
  } catch (error) {
    console.error("Error practicing words:", error);
    res.status(500).json({ error: "Failed to practice words" });
  }
}
