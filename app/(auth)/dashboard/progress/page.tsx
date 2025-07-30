"use client"

import { Construction} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {Navbar2} from "@/components/dashboard/navbar2"
import { useLanguage } from "@/lang/LanguageContext";
import underConstruction from "@/lang/Dashboard/underConstruction";

export default function ProgressPage() {
  const { language} = useLanguage();
  const translated = underConstruction[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900 dark:text-white">
      <Navbar2/>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                <Construction className="h-8 w-8 text-purple-500" />
                {translated.progress.title}
              </CardTitle>
              <CardDescription className="text-lg dark:text-slate-400">
                {translated.comingSoon}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-300 mb-8">
                <p>{translated.progress.progressDescription}</p>
                <p>{translated.description}</p>
              </p>
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/50"
                >
                  {translated.return}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 