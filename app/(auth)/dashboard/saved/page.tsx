"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Construction, Bookmark } from "lucide-react"
import { motion } from "framer-motion"
import {Navbar3} from "@/components/dashboard/navbar3"
import { useLanguage } from "@/lang/LanguageContext";
import underConstruction from "@/lang/Dashboard/underConstruction";

export default function SavedItemsPage() {
  const { language} = useLanguage();
  const translated = underConstruction[language];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900 dark:text-white">
      <Navbar3/>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {translated.return2}
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-purple-100 shadow-md dark:border-purple-800 dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-300 flex items-center gap-2">
                  <Bookmark className="h-6 w-6" />
                  {translated.saved.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Construction className="h-16 w-16 text-purple-500 mb-4" />
                  <h2 className="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">{translated.underConstruction}</h2>
                  <p className="text-slate-600 dark:text-slate-300 max-w-md mb-6">
                    {translated.saved.savedDescription}
                  </p>
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600">
                      {translated.return}
                    </Button>
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
            {translated.footerText}
          </div>
        </div>
      </footer>
    </div>
  )
}
