"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Plus, Trash2} from 'lucide-react'
import {Navbar3} from "@/components/dashboard/navbar3"
import { useLanguage } from "@/lang/LanguageContext";
import wordLists from "@/lang/Dashboard/wordLists";

interface Word {
  id: string;
  word: string;
  translation?: string;
  language: string;
}

export default function WordListPage() {
  const wordList: Word[] = []
  const { language} = useLanguage();
  const translated = wordLists[language];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar3/>
      <main className="flex-1 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900 dark:text-white">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-purple-100 shadow-md dark:border-purple-800 dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                  {translated.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {wordList.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400 mb-6">{translated.empty}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 gap-2">
                        <Plus className="h-4 w-4" />
                        {translated.add}
                      </Button>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50 gap-2">
                        <Trash2 className="h-4 w-4" />
                        {translated.delete}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {wordList.map((word, index) => (
                        <motion.div
                          key={word.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge
                            variant="outline"
                            className="px-3 py-1.5 border-purple-200 text-purple-800 bg-purple-50 hover:bg-purple-100 cursor-pointer dark:border-purple-700 dark:text-purple-300 dark:bg-purple-900/50 dark:hover:bg-purple-900"
                          >
                            {word.word}
                            {word.translation && (
                              <span className="ml-2 text-slate-500 dark:text-slate-400">
                                ({word.translation})
                              </span>
                            )}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <Button className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 gap-2">
                        <Plus className="h-4 w-4" />
                        {translated.add}
                      </Button>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50 gap-2">
                        <Trash2 className="h-4 w-4" />
                        {translated.delete}
                      </Button>
                    </div>
                  </>
                )}

                <div className="mt-8 p-4 md:p-6 bg-purple-50 rounded-lg border border-purple-100 dark:bg-purple-900/30 dark:border-purple-800">
                  <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">{translated.success}</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {translated.successDescription}
                  </p>
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
