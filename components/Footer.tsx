"use client";

import { VocoraMascot } from "@/components/vocora-mascot"

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-center p-2 hidden md:flex" style={{ borderTop: 'none', outline: 'none', boxShadow: 'none', margin: '0', background: 'transparent' }}>
            <div className="flex items-center justify-center gap-2">
                <VocoraMascot width={20} height={20} />
                <span className="text-base font-bold bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">
                    Vocora
                </span>
            </div>
        </footer>
    );
}
