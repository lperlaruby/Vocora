"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import homeTranslations from "@/lang/app-page"; // Ensure this is set up correctly
import { useLanguage } from "@/lang/LanguageContext"; // Use the Language context
import { motion } from "framer-motion"
import { VocoraMascot } from "@/components/vocora-mascot"
import Footer from "@/components/Footer";

export default function HomePage() {
  const { language } = useLanguage(); // Get the current language from context
  const translated = homeTranslations[language as keyof typeof homeTranslations];
  return (
    <div className="page-layout">
      <Navbar/>
      <main className="main-content bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900 dark:text-white">
        <div className="container mx-auto px-4 py-2 h-full flex flex-col justify-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-[180px] md:max-w-[280px]"
            >
              <div className="w-full h-auto bg-purple-100 dark:bg-purple-900 rounded-full p-4 md:p-6 flex items-center justify-center">
                <VocoraMascot className="w-full h-auto" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-3 md:gap-4 text-center md:text-left max-w-[500px]"
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">
                {translated.heading}
              </h1>
              <p className="text-base md:text-lg text-slate-700 dark:text-slate-300">
                {translated.description}
              </p>
              <div className="flex justify-center md:justify-start">
                <Link href="/signup">
                  <Button
                    size="default"
                    className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600"
                  >
                    {translated.buttonText}
                  </Button>
                </Link>
                {/* <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
                  >
                    {translated.buttonText2}
                  </Button>
                </Link> */}
              </div>
            </motion.div>
          </div>

          <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              {
                title: translated.feature1,
                description: translated.feature1description,
                icon: "📚",
              },
              {
                title: translated.feature2,
                description: translated.feature2description,
                icon: "💬",
              },
              {
                title: translated.feature3,
                description: translated.feature3description,
                icon: "📒",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl p-3 shadow-md border border-purple-100 hover:shadow-lg hover:border-purple-200 transition-all dark:bg-slate-800 dark:border-purple-800 dark:hover:border-purple-700"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-purple-800 dark:text-purple-300">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 md:mt-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent inline-block">
                {translated.join}
              </h2>
              <div className="flex justify-center">
                <Link href="/signup">
                  <Button
                    size="default"
                    className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600"
                  >
                    {translated.signUp}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
