"use client";
import type React from "react"
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lang/LanguageContext"; // Import the useLanguage hook
import signupTranslations from "@/lang/signup"; // Import the signup translations
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import { motion } from "framer-motion"

function SignUpForm({
  isLoading,
  onSubmit,
}: { isLoading: boolean; onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> }) {
  const { language } = useLanguage(); // Get current language from context
  const [password, setPassword] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const PasswordReq = [
    (pw: string) => pw.length >= 6,
    (pw: string) => /[a-z]/.test(pw),
    (pw: string) => /[A-Z]/.test(pw),
    (pw: string) => /\d/.test(pw),
    (pw: string) => /[!@#$%^&*(),.?\":{}|<>]/.test(pw),
  ];

  const passwordReqLabels = signupTranslations[language].passwordRequirements;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="dark:text-slate-200">{signupTranslations[language].firstNameLabel}</Label>
            <Input id="firstName" name="firstName" type="text" required className="border-purple-200 focus-visible:ring-purple-500 dark:border-purple-800 dark:bg-slate-900"/>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName" className="dark:text-slate-200">{signupTranslations[language].lastNameLabel}</Label>
            <Input id="lastName" name="lastName" type="text" required className="border-purple-200 focus-visible:ring-purple-500 dark:border-purple-800 dark:bg-slate-900"/>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="dark:text-slate-200">{signupTranslations[language].emailLabel}</Label>
          <Input id="email" name="email" type="email" required placeholder={signupTranslations[language].emailPlaceholder} className="border-purple-200 focus-visible:ring-purple-500 dark:border-purple-800 dark:bg-slate-900" />
        </div>

        <div className="space-y-2 relative w-full">
          <Label htmlFor="password" className="dark:text-slate-200">{signupTranslations[language].passwordLabel}</Label>
          <div className="relative w-full">
            <Input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setShowTooltip(true)} onBlur={() => setTimeout(() => setShowTooltip(false), 200)} ref={inputRef}
              className="border-purple-200 focus-visible:ring-purple-500 dark:border-purple-800 dark:bg-slate-900 w-full"
            />
            {showTooltip && (
              <div className="absolute left-0 mt-2 w-full border border-slate-200 shadow-md rounded-md p-3 text-sm bg-white dark:bg-slate-800 dark:border-slate-700 z-10">
                <p className="mb-2 font-medium text-slate-700 dark:text-slate-300">
                {signupTranslations[language].passwordTitle}
                </p>
                <ul className="space-y-1">
                  {PasswordReq.map((testFn, index) => {
                    const isMet = testFn(password);
                    const icon = isMet ? "✅" : "❌";
                    return (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-300"
                      >
                        <span>{icon}</span> {passwordReqLabels[index]}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {signupTranslations[language].signUpButton}
        </Button>
    </form>
  );
}

export default function SignUpPage() {
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
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            display_name: `${firstName} ${lastName}`,
          },
        },
      });
      if (signUpError) throw new Error(signUpError.message);

      console.log("Sign-up successful.", signUpData);
      alert("Please verify your email!")
      router.push(`/login`);
    } catch (error) {
      setError(error instanceof Error ? error.message : signupTranslations[language].unexpectedError);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setIsLoading(true);
    setError(null);
    
    const googleLanguage = language === "es" ? "es-419" : language;
    const redirectURL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/dashboard?lang=${language}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectURL,
        queryParams: {
          hl: googleLanguage,
        }
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
                <CardTitle className="text-2xl font-bold text-center">{signupTranslations[language].title}</CardTitle>
                <CardDescription className="text-center dark:text-slate-400">
                  {signupTranslations[language].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <SignUpForm isLoading={isLoading} onSubmit={onSubmit} />
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-purple-200 dark:border-purple-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {signupTranslations[language].continueOption}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-purple-200 text-slate-700 hover:bg-purple-50 flex items-center gap-2 justify-center dark:border-purple-800 dark:text-slate-300 dark:hover:bg-purple-900/50"
                    onClick={handleGoogleSignUp}
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span> {signupTranslations[language].googleSignUp}</span>
                  </Button>

                  <div className="text-center text-sm mt-6">
                    <span className="text-slate-600 dark:text-slate-400">{signupTranslations[language].signInLink} </span>
                    <Link
                      href="/login"
                      className="text-purple-600 hover:text-purple-800 font-medium dark:text-purple-400 dark:hover:text-purple-300"
                    >
                       {signupTranslations[language].signIn}
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
            {signupTranslations[language].footerText}
          </div>
        </div>
      </footer>
    </div>
  )
}