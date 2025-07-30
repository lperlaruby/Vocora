"use client";

import type React from "react"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lang/LanguageContext"; // Import the useLanguage hook
import loginTranslations from "@/lang/login"; // Import the login translations
import Link from "next/link"
import { motion } from "framer-motion"
import { FcGoogle } from "react-icons/fc"

function LoginForm({
  isLoading,
  onSubmit,
}: { isLoading: boolean; onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> }) {
 const { language } = useLanguage(); 

  return (
    <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="dark:text-slate-200">{loginTranslations[language].emailLabel}</Label>
          <Input id="email" name="email" type="email" placeholder={loginTranslations[language].emailPlaceholder} required className="border-purple-200 focus-visible:ring-purple-500 dark:border-purple-800 dark:bg-slate-900" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="dark:text-slate-200">{loginTranslations[language].passwordLabel}</Label>
          <Input id="password" name="password" type="password" required className="border-purple-200 focus-visible:ring-purple-500 dark:border-purple-800 dark:bg-slate-900" />
        </div>

        <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {loginTranslations[language].signInButton}
        </Button>
    </form>
  );
}

export default function LoginPage() {
  const { language } = useLanguage(); // Get current language from context
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data: loginData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        // Update error message for email not confirmed
        if (signInError.message.includes("Email not confirmed")) {
          throw new Error(loginTranslations[language].errorEmailNotConfirmed);
        } else {
          throw new Error(signInError.message);
        }
      }

      console.log("Authentication successful.", loginData);
      router.push(`/dashboard?lang=${language}`);
      // For right now : 
      // router.push(`/success`);
    } catch (error) {
      console.error("Error during form submission:", error);
      setError(error instanceof Error ? error.message : loginTranslations[language].unexpectedError);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError(null);

    const googleLang = language === "es" ? "es-419" : language;
    const redirectURL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/dashboard?lang=${language}`;
    // For right now: 
    // const redirectURL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/success`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectURL,
        queryParams: {
          // Changes the Google OAuth login screen language
          hl: googleLang,
        },
      },
    });

    if (error) {
      console.error("Google OAuth Error:", error.message);
      setError(error.message);
    }
    setIsLoading(false);
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
                <CardTitle className="text-2xl font-bold text-center">{loginTranslations[language].title}</CardTitle>
                <CardDescription className="text-center dark:text-slate-400">
                  {loginTranslations[language].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
                  <LoginForm isLoading={isLoading} onSubmit={onSubmit} />
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-purple-200 dark:border-purple-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {loginTranslations[language].continueOption}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-purple-200 text-slate-700 hover:bg-purple-50 flex items-center gap-2 justify-center dark:border-purple-800 dark:text-slate-300 dark:hover:bg-purple-900/50"
                    onClick={handleGoogleSignIn}
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span>{loginTranslations[language].googleSignIn}</span>
                  </Button>

                  <div className="text-center text-sm mt-4">
                    <span className="text-slate-600 dark:text-slate-400">{loginTranslations[language].signUpLink} </span>
                    <Link
                      href="/signup"
                      className="text-purple-600 hover:text-purple-800 font-medium dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      {loginTranslations[language].signupButton}
                    </Link>
                  </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <footer className="bg-white border-t border-purple-100 py-4 dark:bg-slate-800 dark:border-purple-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-center text-sm text-slate-500 dark:text-slate-400">
            {loginTranslations[language].footerText}
          </div>
        </div>
      </footer>
    </div>
  )
}
