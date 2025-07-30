import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { createHash } from "crypto";

export function useHoverWord(
  practiceLang: string,
  words: string[],
  setWords: React.Dispatch<React.SetStateAction<string[]>>,
  story: string,
  userLang: "en" | "es" | "zh"
) {
  const [hoveredWord, setHoveredWord] = useState<{ word: string; index: number } | null>(null);
  const [definitions, setDefinitions] = useState<{
    [key: string]: {
      translatedWord: string;
      partOfSpeech: string;
      definition: string;
    };
  }>({});

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const storyHash = createHash("sha256").update(story).digest("hex");

  useEffect(() => {
    if (!hoveredWord || definitions[hoveredWord.word]) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const fetchDefinition = async () => {
        const word = hoveredWord.word.toLowerCase();
        console.log("[DEBUG] Hovered word:", word);

        // 1. Check Supabase cache
        try {
          const { data: cached, error: fetchError } = await supabase
            .from("cached_definitions")
            .select("definition, part_of_speech, translated_word")
            .eq("word", word)
            .eq("lang", userLang)
            .single();

          if (cached && !fetchError) {
            console.log("[DEBUG] Found cached definition in Supabase:", cached);
            setDefinitions((prev) => ({
              ...prev,
              [word]: {
                definition: cached.definition,
                partOfSpeech: cached.part_of_speech || "Unknown",
                translatedWord: cached.translated_word || "",
              },
            }));
            return;
          }

          if (fetchError) {
            console.warn("[DEBUG] Supabase cache fetch error:", fetchError.message);
          } else {
            console.log("[DEBUG] No cached definition found for:", word);
          }
        } catch (err) {
          console.error("[ERROR] Unexpected error during Supabase cache fetch:", err);
        }

        // 2. Fetch from OpenAI
        try {
          console.log("[DEBUG] Sending POST to /api/generate-definitions...");
          const response = await fetch("/api/generate-definitions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word, story, userLang }),
          });

          const data = await response.json();
          console.log("[DEBUG] AI response:", data);

          const newDef = {
            definition: data.definition || "No definition found.",
            partOfSpeech: data.partOfSpeech || "Unknown",
            translatedWord: data.translatedWord || "",
          };

          // 3. Cache result in Supabase
          await supabase.from("cached_definitions").insert([{
            word,
            definition: newDef.definition,
            part_of_speech: newDef.partOfSpeech,
            translated_word: newDef.translatedWord,
            story_hash: storyHash,
            lang: userLang,
          }]);

          console.log("[DEBUG] Cached new definition to Supabase");

          setDefinitions((prev) => ({
            ...prev,
            [word]: newDef,
          }));
        } catch (error) {
          console.error("[ERROR] Failed fetching/generating definition:", error);
          setDefinitions((prev) => ({
            ...prev,
            [word]: {
              definition: "Error retrieving definition.",
              partOfSpeech: "Unknown",
              translatedWord: "",
            },
          }));
        }
      };

      fetchDefinition();
    }, 1500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hoveredWord, story]);

  const handleAddHoveredWord = async () => {
    if (!hoveredWord?.word) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!words.includes(hoveredWord.word)) {
      const { error } = await supabase
        .from("vocab_words")
        .insert([{ word: hoveredWord.word, language: practiceLang, uid: user.id }]);

      if (error) {
        console.error("Error adding hovered word:", error);
      } else {
        console.log("[DEBUG] Hovered word added to vocab list:", hoveredWord.word);
        setWords([...words, hoveredWord.word]);
      }
    }
  };

  return {
    hoveredWord,
    setHoveredWord,
    definitions,
    handleAddHoveredWord,
  };
}
