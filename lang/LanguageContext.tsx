"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define a type for the supported languages
type Language = "en" | "es" | "zh";

// Create the context with the correct type
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
} | null>(null);

// Create provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize state to "en" and set it to the saved language from localStorage if available
  const [language, setLanguage] = useState<Language>("en"); // Default to English

  useEffect(() => {
    // Check if the window object is available before accessing localStorage
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language");
      const validLanguages = ["en", "es", "zh"];
      if (savedLanguage && validLanguages.includes(savedLanguage)) {
        setLanguage(savedLanguage as Language);
      }
    }
  }, []);

  // Save language to localStorage when it changes
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
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
