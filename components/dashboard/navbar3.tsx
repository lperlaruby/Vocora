import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/lang/LanguageContext";
import dashBoardTranslations from "@/lang/Dashboard";

export function Navbar3() {
    const { language } = useLanguage();
    const translated = dashBoardTranslations[language];

    return (
        <header className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-violet-500 text-white">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              Vocora
            </Link>
  
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="border-white/30 bg-white/20 text-white hover:bg-white/30">
                  {translated.navBar.dashboard}
                </Button>
              </Link>
            </div>
          </div>
        </header>
    );
}