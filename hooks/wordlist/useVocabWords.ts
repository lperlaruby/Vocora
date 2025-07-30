import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useVocabWords(language: string) {
  const [words, setWords] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchWords = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const sharedUserId = process.env.NEXT_PUBLIC_SHARED_USER_ID;

      const { data: wordsData, error } = await supabase
        .from("vocab_words")
        .select("word")
        .in("uid", [sharedUserId, user?.id])
        .eq("language", language);

      if (!error && wordsData) {
        setWords(Array.from(new Set(wordsData.map(row => row.word))));
      }
    };
    fetchWords();
  }, [language]);

  const addWord = async (newWord: string, language: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No user" };

    const { error } = await supabase.from("vocab_words").insert([
      { word: newWord.trim(), language, uid: user.id },
    ]);

    if (!error) setWords(prev => [...prev, newWord.trim()]);
    return { error };
  };

  const deleteWord = async (wordToDelete: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("vocab_words")
      .delete()
      .eq("word", wordToDelete)
      .eq("language", language)
      .eq("uid", user.id);

    setWords(prev => prev.filter(word => word !== wordToDelete));
  };

  const deleteAllWords = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No user" };

    const { error } = await supabase
      .from("vocab_words")
      .delete()
      .eq("uid", user.id)
      .eq("language", language);

    if (!error) setWords([]);
    return { error };
  };

  return { words, setWords, addWord, deleteWord, deleteAllWords };
}
