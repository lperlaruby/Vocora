"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lang/LanguageContext";
import signupTranslations from "@/lang/signup";
import { motion } from "framer-motion";
import { Icons } from "@/components/ui/icons";

export default function LanguageSetupPage() {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interfaceLanguage, setInterfaceLanguage] = useState<"en" | "es" | "zh">("en");
  const [practiceLanguage, setPracticeLanguage] = useState<"en" | "es" | "zh">("en");
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No session found");
      }

      console.log("Saving preferences for user:", session.user.id);
      console.log("Interface language:", interfaceLanguage);
      console.log("Practice language:", practiceLanguage);

      // Remove the email field since it doesn't exist in the table schema
      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .upsert({
          uid: session.user.id,
          preferred_lang: interfaceLanguage,
          practice_lang: practiceLanguage,
        }, {
          onConflict: 'uid'
        });

      if (preferencesError) {
        console.error("Failed to save language preferences:", preferencesError);
        throw new Error(`Failed to save preferences: ${preferencesError.message}`);
      }

      console.log("Preferences saved successfully, redirecting to dashboard...");
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Language setup error:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <Card className="border-purple-100 shadow-md dark:border-purple-800 dark:bg-slate-800">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Language Preferences</CardTitle>
                <CardDescription className="text-center dark:text-slate-400">
                  Let's set up your language preferences to personalize your experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Interface Language */}
                  <div className="space-y-2">
                    <Label className="dark:text-slate-200">{signupTranslations[language].interfaceLanguageLabel}</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{signupTranslations[language].interfaceLanguageDescription}</p>
                    <Select value={interfaceLanguage} onValueChange={(value: "en" | "es" | "zh") => setInterfaceLanguage(value)}>
                      <SelectTrigger className="border-purple-200 focus-visible:ring-purple-500 dark:border-purple-800 dark:bg-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">{signupTranslations[language].languageOptions.english}</SelectItem>
                        <SelectItem value="es">{signupTranslations[language].languageOptions.spanish}</SelectItem>
                        <SelectItem value="zh">{signupTranslations[language].languageOptions.chinese}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Practice Language */}
                  <div className="space-y-2">
                    <Label className="dark:text-slate-200">{signupTranslations[language].practiceLanguageLabel}</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{signupTranslations[language].practiceLanguageDescription}</p>
                    <Select value={practiceLanguage} onValueChange={(value: "en" | "es" | "zh") => setPracticeLanguage(value)}>
                      <SelectTrigger className="border-purple-200 focus-visible:ring-purple-500 dark:border-purple-800 dark:bg-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">{signupTranslations[language].languageOptions.english}</SelectItem>
                        <SelectItem value="es">{signupTranslations[language].languageOptions.spanish}</SelectItem>
                        <SelectItem value="zh">{signupTranslations[language].languageOptions.chinese}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600" 
                    disabled={isLoading}
                  >
                    {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Saving..." : "Continue to Dashboard"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 