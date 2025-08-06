"use client";

import Link from "next/link";
import { useLanguage } from "@/lang/LanguageContext"; // Only once!
import navbarTranslations from "@/lang/Navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import dashBoardTranslations from "@/lang/Dashboard";
import { LogOut, User, Settings, Sparkles, X, Globe } from "lucide-react"; // Remove Menu here
import { Menu } from "lucide-react"; // Or, if you want, just import Menu here and remove from above
import { usePathname } from "next/navigation";
import { SettingsModal } from "@/components/SettingsModal";

type NavbarProps = {
  isAuthenticated?: boolean;
  showDashboard?: boolean;
  showProgress?: boolean;
  showAccount?: boolean;
  showSettings?: boolean;
  showLogout?: boolean;
  customLinks?: Array<{ href: string; label: string; icon?: React.ReactNode }>;
};

export function Navbar({
  isAuthenticated = false,
  showDashboard,
  showProgress,
  showAccount,
  showSettings,
  showLogout = true,
  customLinks = [],
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { language, setLanguage } = useLanguage();
  const translated = dashBoardTranslations[language];
  const pathname = usePathname();
  
  // Check if we're on a dashboard page
  const isDashboardPage = pathname?.startsWith('/dashboard');
  
  // Check if we're on login or signup pages
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  const languageOptions = [
    { value: "en", label: "English"},
    { value: "es", label: "Español"},
    { value: "zh", label: "中文"}
  ];

  // Auth links for landing page
  const authLinks = [
    { href: "/login", label: "Sign In" },
    { href: "/signup", label: "Sign Up" },
  ];

  // Dashboard links for authenticated users
  const navLinks = [
    showDashboard && {
      href: "/dashboard",
      label: translated.navBar.dashboard,
      icon: <Sparkles className="h-4 w-4" />,
    },
    showProgress && {
      href: "/dashboard/progress",
      label: translated.navBar.progressDays,
      icon: <Sparkles className="h-4 w-4" />,
    },
    showAccount && {
      href: "/dashboard/account",
      label: translated.navBar.account,
      icon: <User className="h-4 w-4" />,
    },
    showSettings && {
      href: "/dashboard/settings",
      label: translated.navBar.settings,
      icon: <Settings className="h-4 w-4" />,
    },
    ...customLinks,
    showLogout && {
      href: "/",
      label: translated.navBar.logout,
      icon: <LogOut className="h-4 w-4" />,
    },
  ].filter(Boolean);

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-violet-500 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {isDashboardPage ? (
          <span className="text-2xl font-bold text-white cursor-default">
            Vocora
          </span>
        ) : (
          <Link href="/" className="text-2xl font-bold text-white">
            Vocora
          </Link>
        )}
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated && !isAuthPage
            ? authLinks.map((link, idx) => (
                <Link key={idx} href={link.href}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/30 bg-white/20 text-white hover:bg-white/30"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))
            : isAuthenticated && navLinks.map((link, idx) => 
                link && (
                  <Link key={idx} href={link.href}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/30 bg-white/20 text-white hover:bg-white/30 flex items-center gap-1"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Button>
                  </Link>
                )
              )}
          <div className="border-l border-white/20 pl-4 ml-2 flex items-center gap-3">
            {!isDashboardPage && !isAuthPage && (
              <Select value={language} onValueChange={(value: "en" | "es" | "zh") => setLanguage(value)}>
                <SelectTrigger className="w-[140px] bg-white/20 border-white/30 text-white">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span className="hidden sm:inline">{languageOptions.find(opt => opt.value === language)?.label}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!isDashboardPage && !isAuthPage && <ThemeToggle />}
            {isAuthenticated && isDashboardPage && (
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={() => setShowSettingsModal(true)}
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        {/* Mobile Nav Button */}
        <div className="flex md:hidden items-center gap-2">
          {!isDashboardPage && !isAuthPage && (
            <Select value={language} onValueChange={(value: "en" | "es" | "zh") => setLanguage(value)}>
              <SelectTrigger className="w-[60px] bg-white/20 border-white/30 text-white">
                <SelectValue>
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {!isDashboardPage && !isAuthPage && <ThemeToggle />}
          {isAuthenticated && isDashboardPage && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={() => setShowSettingsModal(true)}
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
          <button
            className="text-white p-1"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-purple-700 py-3 px-4 flex flex-col gap-3">
          {navLinks.map((link, idx) => 
            link && (
              <Link key={idx} href={link.href} className="py-2 flex items-center gap-2 text-white">
                {link.icon}
                <span>{link.label}</span>
              </Link>
            )
          )}
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal 
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </header>
  );
}
