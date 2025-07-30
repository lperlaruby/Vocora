"use client";

import Link from "next/link";
import { useLanguage } from "@/lang/LanguageContext"; // Import the useLanguage hook
import navbarTranslations from "@/lang/Navbar"; // Ensure the import is correct
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Menu } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const { language, setLanguage } = useLanguage(); // Get language and setter
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const translated = navbarTranslations[language]

  return (
    <nav className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-violet-500 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Vocora
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-white hover:text-purple-100 transition-colors">
            {translated.login}
          </Link>
          <Link href="/signup" className="text-white hover:text-purple-100 transition-colors">
            {translated.signup}
          </Link>
          <Select
            onValueChange={(val) => {
              if (val === "en" || val === "es" || val === "zh") {
                setLanguage(val);
                localStorage.setItem("language", val);
              }
            }}
            value={language}
          >
            <SelectTrigger className="w-[120px] bg-white/20 border-white/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
            </SelectContent>
          </Select>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button className="text-white p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-purple-700 py-3 px-4 flex flex-col gap-3">
          <Link
            href="/login"
            className="text-white hover:text-purple-100 transition-colors py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            {translated.login}
          </Link>
          <Link
            href="/signup"
            className="text-white hover:text-purple-100 transition-colors py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            {translated.signup}
          </Link>
          <Select 
            onValueChange={(val) => {
              if (val === "en" || val === "es" || val === "zh") {
                setLanguage(val);
                localStorage.setItem("language", val);
              }
            }}
            value={language}
          >
            <SelectTrigger className="w-full bg-white/20 border-white/30 text-white mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
            </SelectContent>
          </Select>
        </div>
        )
      }
    </nav>
  );
}
