"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/story-generator/header";
import { useLanguage } from "@/lang/LanguageContext";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import router from "next/router";
import ReactMarkdown from "react-markdown";
import Translations from "@/lang/Dashboard/writing";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { List, MessageSquare, Plus, X } from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { useUserPreferences } from "@/hooks/account/useUserPreferences";
import languageDisplayNames from "@/lang/Dashboard/practiceLangDisplay";

function useSetLanguageFromURL() {
  const { language, setLanguage } = useLanguage();
  const searchParams = useSearchParams();
  const langFromURL = searchParams?.get("lang");
  const [languageReady, setLanguageReady] = useState(false);

  // If language is in URL, update the language context.
  useEffect(() => {
    if (langFromURL && ["en", "es", "zh"].includes(langFromURL)) {
      setLanguage(langFromURL as "en" | "es" | "zh");
    }
  }, [langFromURL, setLanguage]);

  // Markes language as "ready" once language matches URL.
  useEffect(() => {
    if (langFromURL && language === langFromURL) {
      setLanguageReady(true);
    }
  }, [langFromURL, language]);

  // Prevents all actions until language is "ready".
  useEffect(() => {
    if (!languageReady) return;

    const logUserLanguage = async () => {
      // Gets the current user session.
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult.data.session;

      if (!session) {
        console.warn("No session found.");
        return;
      }

      // Extracts user's information.
      const user = session.user;
      
      // Inserts user's preferences into Supabase table.
      const { error: insertError } = await supabase
        .from("user_preferences")
        .insert({
          uid: user.id,
          email: user.email,
          preferred_lang: language,
        })
        .select();
      
      // If row already exists, update it.
      if (insertError) {
        if (insertError.code === "23505" || insertError.message.includes("duplicate key")) {
          console.warn("Insert failed: row exists. Updating instead.");

          const { error: updateError } = await supabase
            .from("user_preferences")
            .update({
              preferred_lang: language,
            })
            .eq("uid", user.id);

          if (updateError) {
            console.error("User preferences update failed:", updateError.message);
          } else {
            console.log("User preferences updated successfully!");
          }
        } else {
          console.error("User preferences insert failed:", insertError.message);
        }
      } else {
        console.log("User preferences inserted successfully!");
      }
    };
    // Runs when language changes
    logUserLanguage();
  }, [languageReady]);

  return languageReady;
};

export default function SentencePage() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const [practiceLang, setPracticeLang] = useState<"en" | "es" | "zh">("en");
  const { fetchUserData } = useUserPreferences(setPracticeLang);
  
  useEffect(() => {
    fetchUserData();
  }, []);
    
  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setReply(""); // Clear old reply
    try {
      const response = await fetch("/api/writing_prac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, practiceLang, language }),
      });

      const data = await response.json();
      setReply(data.reply || "No feedback received.");
    } catch (err) {
      console.error(err);
      setReply("Error getting feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
    <Navbar/>

    <Card className="border-purple-100 shadow-lg dark:border-purple-800 dark:bg-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-purple-600 dark:text-purple-400" />
            {Translations[language].title}
          </CardTitle>
        </div>
      </CardHeader>

      <main className="flex-1 p-6 max-w-2xl mx-auto w-full flex flex-col items-center">
        <h2 className="text-base font-normal mb-6 text-center">{Translations[language].subheading}</h2>

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`${Translations[language].prompt} ${languageDisplayNames[language][practiceLang]}...`}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="mb-4"
        />

        <Button onClick={handleSend} disabled={loading}>
          {loading ? "Checking..." : "Submit"}
        </Button>

        {reply && (
          <div className="mt-6 w-full bg-purple-100 text-purple-900 p-4 rounded-xl shadow prose dark:prose-invert dark:bg-purple-900/20 dark:text-purple-100">
            <ReactMarkdown>{reply}</ReactMarkdown>
          </div>
        )}
      </main>
    
    </Card>
    </div>
  );
}
