"use client";

import { VocoraMascot } from "@/components/vocora-mascot"

export default function Footer() {
    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center gap-2">
                <VocoraMascot width={24} height={24} />
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">
                    Vocora
                </span>
            </div>
        </div>
    );
}
