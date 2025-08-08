"use client";

import { VocoraMascot } from "@/components/vocora-mascot"

export default function Footer() {
    return (
        <footer className="mt-auto py-4">
            <div className="flex items-center justify-center gap-2">
                <VocoraMascot width={24} height={24} />
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">
                    Vocora
                </span>
            </div>
        </footer>
    );
}
