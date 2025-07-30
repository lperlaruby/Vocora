import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { splitIntoWords, cleanWord } from "@/lib/utils";

interface PracticeTabProps {
  onClose: () => void;
}

export const PracticeTab: React.FC<PracticeTabProps> = ({ onClose }) => {
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");
  const [hoveredWord, setHoveredWord] = useState<{ word: string; index: number } | null>(null);
  const [definitions, setDefinitions] = useState<{ [key: string]: { definition: string; partOfSpeech: string } }>({});


  useEffect(() => {
    const fetchWords = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (sessionError || !session) {
        console.error("User session not found:", sessionError?.message);
        return;
      }

      const userId = session.user.id;

      const { data: preferenceData, error: prefError } = await supabase
      .from("user_preferences")
      .select("practice_lang")
      .eq("uid", userId)
      .single();

      if (prefError || !preferenceData?.practice_lang) {
        console.error("Failed to fetch preferred language:", prefError?.message);
        return;
      }

      const practiceLang = preferenceData.practice_lang;

      // Fetch words by user + language
      const { data, error } = await supabase
        .from("vocab_words")
        .select("word")
        .eq("uid", userId)
        .eq("language", practiceLang);

      if (error) {
        console.error("Error fetching words:", error.message);
      } else {
        setWords(data.map((row) => row.word));
      }
    };

    fetchWords();
  }, []);

  const handlePracticeAllWords = async () => {
    if (words.length === 0) return alert("No words available to practice.");

    setLoading(true);

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words }),
      });

      const data = await response.json();
      if (data?.story) {
        setStory(data.story);
      } else {
        alert("Failed to generate story.");
      }
    } catch (error) {
      console.error("Error generating story:", error);
      alert("An error occurred while generating the story.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoveredWord = async () => {
    if (!hoveredWord?.word || words.includes(hoveredWord.word)) return;

    const { error } = await supabase.from("vocab_words").insert([{ word: hoveredWord.word }]);
    if (error) {
      console.error("Error adding hovered word:", error);
    } else {
      setWords([...words, hoveredWord.word]);
    }
  };

  useEffect(() => {
    if (!hoveredWord || definitions[hoveredWord.word]) return;

    const fetchDefinition = async () => {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${hoveredWord.word}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setDefinitions((prev) => ({
            ...prev,
            [hoveredWord.word]: {
              definition: data[0].meanings[0].definitions[0].definition,
              partOfSpeech: data[0].meanings[0].partOfSpeech,
            },
          }));
        } else {
          setDefinitions((prev) => ({
            ...prev,
            [hoveredWord.word]: { definition: "Definition not found.", partOfSpeech: "unknown" },
          }));
        }
      } catch (error) {
        console.error("Error fetching definition:", error);
        setDefinitions((prev) => ({
          ...prev,
          [hoveredWord.word]: { definition: "Error fetching definition.", partOfSpeech: "unknown" },
        }));
      }
    };

    fetchDefinition();
  }, [hoveredWord]);

  return (
    <div
      className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[500px] max-h-[80vh] p-4 bg-white shadow-lg rounded-md overflow-visible"
      style={{
        left: `min(50%, calc(100vw - 500px - 16px))`,
        transform: `translateX(-50%)`,
      }}
    >
      <h2 className="text-lg font-semibold mb-4">Practice Tab</h2>

      <div className="mb-4 text-gray-700 font-roboto">
        <h3 className="text-md font-semibold">Words:</h3>
        <p>
          {words.map((word, index) => (
            <span
              key={index}
              className="cursor-pointer hover:underline text-blue-600"
              onMouseEnter={() => setHoveredWord({ word, index })}
              onMouseLeave={() => setHoveredWord(null)}
            >
              {word}
              {index < words.length - 1 && ", "}
            </span>
          ))}
        </p>
      </div>

      <Button
        className="mb-4 bg-blue-500 text-white hover:bg-blue-600"
        onClick={handlePracticeAllWords}
        disabled={loading}
      >
        {loading ? "Generating..." : "Practice All Words"}
      </Button>

      {story && (
        <div className="mt-4">
          <h3 className="text-md font-semibold">Generated Story:</h3>
          <p className="text-gray-700 relative text-lg leading-6">
            {splitIntoWords(story).map((word, index) => {
              const cleanedWord = cleanWord(word);

              return cleanedWord ? (
                <span
                  key={index}
                  className={`relative inline-block cursor-pointer hover:underline ${
                    words.includes(cleanedWord) ? "bg-yellow-300" : ""
                  }`}
                  onMouseEnter={() => setHoveredWord({ word: cleanedWord, index })}
                  onMouseLeave={() => setHoveredWord(null)}
                >
                  {word}
                  {hoveredWord && hoveredWord.word === cleanedWord && hoveredWord.index === index && definitions[cleanedWord] && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 bg-gray-100 border border-gray-300 shadow-lg rounded-lg p-3 text-sm overflow-visible">
                      <p className="font-bold text-black">{cleanedWord}</p>
                      <p className="text-gray-500 italic">{definitions[cleanedWord]?.partOfSpeech || "noun"}</p>
                      <p className="text-gray-700">{definitions[cleanedWord]?.definition || "No definition found."}</p>

                      <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-4 h-4 bg-gray-100 rotate-45 border border-gray-300"></div>
                    </div>
                  )}
                </span>
              ) : (
                word
              );
            })}
          </p>
        </div>
      )}

      <Button className="mt-4" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};
