import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lang/LanguageContext";
import { supabase } from "@/lib/supabase";

export function useSetLanguageFromURL() {
  const { language, setLanguage } = useLanguage();
  const searchParams = useSearchParams();
  const langFromURL = searchParams?.get("lang");
  const [languageReady, setLanguageReady] = useState(false);

  // Monitor language changes from URL parameters

  // If language is in URL, update the language context.
  useEffect(() => {
    if (langFromURL && ["en", "es", "zh"].includes(langFromURL)) {
      setLanguage(langFromURL as "en" | "es" | "zh");
    }
  }, [langFromURL, setLanguage]);

  // Set languageReady to true after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLanguageReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Initialize user preferences once when language is ready
  useEffect(() => {
    if (!languageReady) return;

    const initializeUserLanguage = async () => {
      // Gets the current user session.
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult.data.session;

      if (!session) {
        console.warn("No session found.");
        return;
      }

      // Extracts user's information.
      const user = session.user;
      
      // Check if user already has preferences
      const { data: existingData } = await supabase
        .from("user_preferences")
        .select("preferred_lang")
        .eq("uid", user.id)
        .single();

      // Only insert if no preferences exist
      if (!existingData) {
        const { error: insertError } = await supabase
          .from("user_preferences")
          .upsert({
            uid: user.id,
            preferred_lang: language,
          }, {
            onConflict: 'uid'
          });

        if (insertError) {
          console.error("Failed to initialize user preferences:", insertError.message);
        } else {
          console.log("User preferences initialized successfully!");
        }
      }
    };
    
    // Only runs once when language is ready, not on every language change
    initializeUserLanguage();
  }, [languageReady]);

  return languageReady;
};
