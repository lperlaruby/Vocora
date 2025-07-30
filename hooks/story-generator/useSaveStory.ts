"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useSaveStory(practiceLang: "en" | "es" | "zh", language: string) {
  const [isStorySaved, setIsStorySaved] = useState(false);
  const [savedStories, setSavedStories] = useState<any[]>([]);
  const [savingMessage, setSavingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchSavedStories = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_stories")
        .select("*")
        .eq("uid", user.id)
        .eq("language", practiceLang)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching saved stories:", error);
        toast.error("Failed to load saved stories");
        return;
      }

      setSavedStories(data || []);
    } catch (err) {
      console.error("Error in fetchSavedStories:", err);
      toast.error("Failed to load saved stories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSavedStories([]);
    fetchSavedStories();
  }, [practiceLang]);

  const handleSaveStory = async (story: string, imageUrl: string | null, translated: any, translatedStory: string | null) => {
    if (!story || !imageUrl) {
      toast.error("No story or image to save");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (isStorySaved) {
      const { error: deleteError } = await supabase
        .from("user_stories")
        .delete()
        .eq("uid", user.id)
        .eq("story", story);

      if (deleteError) {
        console.error(deleteError);
      } else {
        setIsStorySaved(false);
        setSavingMessage(translated.saveStory);
        fetchSavedStories();
      }
    } else {
      try {
        let base64Image = imageUrl;
        if (!base64Image.startsWith("data:image")) {
          const response = await fetch(imageUrl);
          const blob = await response.blob();

          base64Image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              typeof reader.result === "string"
                ? resolve(reader.result)
                : reject(new Error("Invalid base64 image"));
            };
            reader.onerror = () => reject(new Error("Error reading image file"));
            reader.readAsDataURL(blob);
          });
        }

        const { error: saveError } = await supabase
          .from("user_stories")
          .upsert([
            {
              uid: user.id,
              story,
              translated_story: translatedStory,
              image: base64Image,
              language: practiceLang,
              created_at: new Date().toISOString(),
            },
          ]);

        if (saveError) throw saveError;

        setIsStorySaved(true);
        setSavingMessage(translated.savedStory);
        fetchSavedStories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteStory = async (id: number) => {
    try {
      const { error } = await supabase
        .from("user_stories")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting story:", error);
        toast.error("Failed to delete story");
        return;
      }

      setSavedStories((prev) => prev.filter((s) => s.id !== id));
      toast.success("Story deleted successfully");
    } catch (err) {
      console.error("Error in handleDeleteStory:", err);
      toast.error("Failed to delete story");
    }
  };

  return {
    savedStories,
    isStorySaved,
    savingMessage,
    setSavingMessage,
    fetchSavedStories,
    handleSaveStory,
    handleDeleteStory,
    isLoading,
  };
}
