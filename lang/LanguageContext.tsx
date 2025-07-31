"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

// Define a type for the supported languages
type Language = "en" | "es" | "zh";

// Create the context with the correct type
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  reloadFromDatabase: () => Promise<void>;
} | null>(null);

// Create provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(true);

  // Function to reload language preference from database
  const reloadFromDatabase = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data } = await supabase
        .from("user_preferences")
        .select("preferred_lang")
        .eq("uid", session.user.id)
        .single();
        
      if (data?.preferred_lang) {
        setLanguage(data.preferred_lang as Language);
        // Update localStorage to stay in sync
        if (typeof window !== "undefined") {
          localStorage.setItem("language", data.preferred_lang);
        }
      }
    }
  };

  useEffect(() => {
    const loadUserLanguagePreference = async () => {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Load from database for authenticated users
        const { data } = await supabase
          .from("user_preferences")
          .select("preferred_lang")
          .eq("uid", session.user.id)
          .single();
          
        if (data?.preferred_lang) {
          setLanguage(data.preferred_lang as Language);
          // Update localStorage to stay in sync
          if (typeof window !== "undefined") {
            localStorage.setItem("language", data.preferred_lang);
          }
          setIsLoading(false);
          return;
        }
      }
      
      // Fallback to localStorage
      if (typeof window !== "undefined") {
        const savedLanguage = localStorage.getItem("language");
        const validLanguages = ["en", "es", "zh"];
        if (savedLanguage && validLanguages.includes(savedLanguage)) {
          setLanguage(savedLanguage as Language);
        }
      }
      
      setIsLoading(false);
    };

    loadUserLanguagePreference();
  }, []);

  // Save language to localStorage when it changes
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, reloadFromDatabase }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for using the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
