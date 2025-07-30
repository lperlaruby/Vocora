"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lang/LanguageContext";
import vocabTabTranslations from "@/lang/VocabularyTab";

interface VocabTabProps {
  user: any;
  onClose: () => void;
}

export const VocabTab: React.FC<VocabTabProps> = ({ user, onClose}) => {
  const [vocabLists, setVocabLists] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newWord, setNewWord] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const { language } = useLanguage();

  // Fetches user's voacabulary lists from the database.
  const fetchVocabLists = async () => {
    if (user?.id) {
      console.log("Fetching vocab lists for user:", user.id);
      const { data, error } = await supabase
        .from("vocab_lists")
        .select("list_id, name, language")
        .eq("uid", user.id)
        .eq("language", language);

      if (error) {
        console.error("Error fetching vocab lists:", error.message);
      } else {
        setVocabLists(data || []);
      }
    }
  };

  // Fetch vocab lists when the component mounts
  useEffect(() => {
    fetchVocabLists();
  }, [user?.id, language]);

  // Creates a new vocabulary list in the database.
  const handleCreateVocabList = async () => {
    if (!newListName) return alert(vocabTabTranslations[language].listName);

    if (!user?.id) {
      alert(vocabTabTranslations[language].userError);
      return;
    }

    const { data, error } = await supabase
      .from("vocab_lists")
      .insert([{
        uid: user.id,
        name: newListName,
        language: language
      }]);

    if (error) {
      console.error("Error creating vocab list:", error.message);
    } else {
      setNewListName("");
      await fetchVocabLists();
    }
  };

  // Handles selecting a vocab list to display words
  const handleSelectList = (listId: number) => {
    console.log("Selected list ID:", listId);
    if (selectedListId === listId) {
      setSelectedListId(null);
      setWords([]);
    } else {
      setSelectedListId(listId);
      fetchWordsForList(listId);
    }
  };

  // Fetches words for the selected vocabulary list from the database.
  const fetchWordsForList = async (listId: number) => {
    const { data, error } = await supabase
      .from("vocab_words")
      .select("word")
      .eq("list_id", listId)
      .eq("uid", user?.id)
      .eq("language", language);
  
    if (error) {
      console.error("Error fetching words:", error.message);
    } else {
      const wordList = data.map((entry) => entry.word);
      setWords(wordList);
    }
  };
  
  // Handles adding a word to a selected vocab list
  const handleAddWord = async () => {
    if (!newWord || !selectedListId) return alert(vocabTabTranslations[language].addWordError);

    const { error } = await supabase
      .from("vocab_words")
      .insert([{
        word: newWord,
        list_id: selectedListId,
        uid: user?.id,
        language: language
      }]);

    if (error) {
      console.error("Error adding word:", error.message);
    } else {
      setNewWord("");
      await fetchWordsForList(selectedListId);
    }
  };

  return (
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[500px] max-h-[80vh] p-4 bg-white shadow-lg rounded-md overflow-visible"
      style={{
        left: `min(50%, calc(100vw - 500px - 16px))`,
        transform: `translateX(-50%)`,
      }}
    >
      <h2 className="text-lg font-semibold mb-4">{vocabTabTranslations[language].vocabTab}</h2>

      {/* Create vocab list form */}
      <div className="mb-4">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder={vocabTabTranslations[language].addListNamePlaceholder}
          className="mb-2 p-2 border rounded"
        />
        <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleCreateVocabList}>
          {vocabTabTranslations[language].createList}
        </Button>
      </div>

      {/* Display user's vocab lists */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">{vocabTabTranslations[language].vocabLists}</h3>
        {vocabLists.length > 0 ? (
          <ul>
            {vocabLists.map((list) => (
              <li key={list.list_id} className="mb-2">
                <Button
                  className={`${ 
                    selectedListId === list.list_id
                      ? "bg-purple-600 text-white hover:bg-purple-600 hover:text-white"
                      : "hover:bg-purple-600 hover:text-white bg-white text-black"
                    }`}
                  onClick={() => handleSelectList(list.list_id)}
                >
                  {list.name}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>{vocabTabTranslations[language].noVocabLists}</p>
        )}
      </div>

      {/* Drag word to selected vocab list */}
      {selectedListId && (
        <div
          className="mb-4 p-4 border-2 border-dashed border-purple-500 rounded text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={async (e) => {
            e.preventDefault();
            const draggedWord = e.dataTransfer.getData("text/plain");
            if (!draggedWord) return;

            const { error } = await supabase
              .from("vocab_words")
              .insert([{
                word: draggedWord,
                list_id: selectedListId,
                uid: user?.id,
                language: language
              }]);

            if (error) {
              console.error("Error adding dragged word:", error.message);
            } else {
              await fetchWordsForList(selectedListId);
            }
          }}
        >
          {words.length === 0 ? (
            <p className="text-black">{vocabTabTranslations[language].dragWords}</p>
          ):(
            <div className="flex flex-wrap gap-2 justify-center">
              {words.map((word, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full shadow-sm border border-purple-300"
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Close button */}
      <Button className="mt-4" onClick={onClose}>
        {vocabTabTranslations[language].close}
      </Button>
    </div>
  );
};
