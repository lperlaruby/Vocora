"use client";

import { VocoraMascot } from "@/components/vocora-mascot"

export default function Footer() {
    return (
        <footer className="sticky-footer bg-slate-50 border-t border-purple-100 py-6 md:py-8 dark:bg-slate-800 dark:border-purple-900 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                            <VocoraMascot width={24} height={24} />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">
                            Vocora
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
