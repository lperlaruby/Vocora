import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { PracticeTab } from "./PracticeTab"
import { VocabTab} from "./vocabTab";
// import { SettingsTab } from "./settingsTab"
import { useLanguage } from "@/lang/LanguageContext"; // Import the useLanguage hook
import headerTranslations from "@/lang/header"; // Import the login translations
// import settingsTranslations from '@/lang/SettingsTab';

export function Header() {
  const [showPractice, setShowPractice] = useState(false);
  // const [showSettings, setShowSettings] = useState(false);
  const [showVocab, setShowVocab] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const tabRef = useRef<HTMLDivElement>(null);

  // Fetch user session
  useEffect(() => {
    const fetchUserSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession(); 
      if (error) {
        console.error("Error fetching session:", error.message);
      } else {
        setUser(session?.user || null);
      }
    };
    
    fetchUserSession();
  },[]);
  
  // Toggle functions (only one tab at a time)
  const togglePractice = () => {
    setShowPractice((prev) => !prev);
    setShowVocab(false);
    // setShowSettings(false);
  };
  
  const toggleVocab = () => {
    setShowVocab((prev) => !prev);
    setShowPractice(false);
    // setShowSettings(false);
  };
  
  const toggleSettings = () => {
    // setShowSettings((prev) => !prev);
    setShowPractice(false);
    setShowVocab(false);
  };
  
  // Close tabs when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowPractice(false);
        setShowVocab(false);
        // setShowSettings(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Vocora
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4" ref={tabRef}>
          {/* Practice Button */}
          <div className="relative">
            <Button
              className="bg-[#FF9147] text-white hover:bg-[#E67E33]"
              onClick={togglePractice}
            >
              {headerTranslations[language].practice}
            </Button>
            {showPractice && <PracticeTab onClose={() => setShowPractice(false)} />}
          </div>

          {/* Vocab Button */}
          <div className="relative">
            <Button 
              className="bg-[#9747FF] text-white hover:bg-[#8A3DEE]"
              onClick={toggleVocab}
            >
              {headerTranslations[language].vocab}
            </Button>
            {showVocab && <VocabTab user = {user} onClose={() => setShowVocab(false)}/>}
          </div>

          {/* Settings Button */}
          {/* <div className="relative inline-block">
            <Button onClick={toggleSettings}>
              {settingsTranslations[language].title}
            </Button>

            {showSettings && (
              <div className="fixed mt-5 right-0 translate-x-[calc(100%-24rem)] z-50 w-[300px]">
                <SettingsTab onClose={() => setShowSettings(false)} />
              </div>
            )}
          </div> */}

          {/* Logout Button */}
          <Link href="/">
            <span className="text-sm text-red-600 hover:text-red-700" onClick={handleLogout}>
            {headerTranslations[language].logout}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
