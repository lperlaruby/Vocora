import { useState } from "react";

export function useStoryGenerator() {
  const [story, setStory] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [highlightedStory, setHighlightedStory] = useState<string>("");

  const generateStory = async (words: string[], length: string = "medium", practiceLang: "en" | "es" | "zh", userLang: "en" | "es" | "zh" = "en") => {
    try {
      setLoading(true);
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words, length, practiceLang, userLang }),
      });

      const data = await response.json();
      if (data?.story) {
        setStory(data.story);
        setTranslation(data.translation);
        return data.story;
      }
      return null;
    } catch (error) {
      console.error("Error generating story:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateImageFromStory = async (story: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });

      const blob = await response.blob();
      const imageObjectURL = URL.createObjectURL(blob);
      setImageUrl(imageObjectURL);
    } catch (e) {
      console.error("Failed to generate image", e);
    } finally {
      setLoading(false);
    }
  };

  const applyHighlighting = (text: string, selectedWords: Set<string>) => {
    let highlighted = text;
    
    Array.from(selectedWords).forEach((word) => {
      // Escape special regex characters
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Check if the word contains Chinese characters
      const isChineseWord = /[\u4e00-\u9fff]/.test(word);
      
      if (isChineseWord) {
        // For Chinese text, handle each character independently
        const chars = Array.from(word);
        chars.forEach(char => {
          const escapedChar = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedChar, "g");
          highlighted = highlighted.replace(
            regex,
            `<span class="bg-yellow-300 font-bold px-1 rounded">${char}</span>`
          );
        });
      } else {
        // For non-Chinese text, use standard word boundaries
        const regex = new RegExp(`\\b${escapedWord}\\b`, "gi");
        highlighted = highlighted.replace(
          regex,
          `<span class="bg-yellow-300 font-bold px-1 rounded">${word}</span>`
        );
      }
    });
    
    setHighlightedStory(highlighted);
  };

  return {
    story,
    setStory,
    translation,
    setTranslation,
    imageUrl,
    setImageUrl,
    highlightedStory,
    setHighlightedStory,
    loading,
    generateStory,
    generateImageFromStory,
    applyHighlighting,
  };
}
