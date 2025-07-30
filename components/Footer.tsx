"use client";

import { VocoraMascot } from "@/components/vocora-mascot"
import { useLanguage } from "@/lang/LanguageContext";
import Link from "next/link";
import footerTranslations from "@/lang/Footer"; // Ensure this is set up correctly

export default function Footer() {
    const { language, setLanguage } = useLanguage();
    const translated = footerTranslations[language]

    return (
        <footer className="bg-slate-50 border-t border-purple-100 py-6 md:py-8 dark:bg-slate-800 dark:border-purple-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <VocoraMascot width={24} height={24} />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">
                    Vocora
                    </span>
                </div>

                <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0">
                    <Link
                    href="#"
                    className="text-slate-600 hover:text-purple-600 transition-colors dark:text-slate-300 dark:hover:text-purple-400"
                    >
                    {translated.about}
                    </Link>
                    <Link
                    href="#"
                    className="text-slate-600 hover:text-purple-600 transition-colors dark:text-slate-300 dark:hover:text-purple-400"
                    >
                    {translated.privacy}
                    </Link>
                    <Link
                    href="#"
                    className="text-slate-600 hover:text-purple-600 transition-colors dark:text-slate-300 dark:hover:text-purple-400"
                    >
                    {translated.terms}
                    </Link>
                    <Link
                    href="#"
                    className="text-slate-600 hover:text-purple-600 transition-colors dark:text-slate-300 dark:hover:text-purple-400"
                    >
                    {translated.contact}
                    </Link>
                </div>
                </div>
            </div>
        </footer>
    );
}
