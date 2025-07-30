"use client";
import { useState} from "react";
import { useLanguage } from "@/lang/LanguageContext";
import { Settings, Sparkles, Menu, X,} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { LogOut, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import dashBoardTranslations from "@/lang/Dashboard";

export function Navbar() {
    const { language } = useLanguage();
    const translated = dashBoardTranslations[language];
  
    return (
        <header className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-violet-500 text-white">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div>
                        <Link href="/">
                            <h1 className="text-2xl font-bold text-white">Vocora</h1>
                        </Link>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    {/* <Link href="/dashboard/progress">
                        <Badge
                            variant="outline"
                            className="flex gap-1 items-center px-3 py-1.5 border-white/30 bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
                        >
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                            <span>{translated.navBar.progressDays}</span>
                        </Badge>
                    </Link> */}

                    {/* <Link href="/dashboard/account">
                        <Avatar>
                            <AvatarFallback className="bg-white/20 text-white">UV</AvatarFallback>
                        </Avatar>
                    </Link> */}

                    <div className="border-l border-white/20 pl-4 ml-2">
                        <ThemeToggle />
                    </div>

                    <div className="border-l border-white/20 pl-4 ml-2">
                        <Link href="/" passHref>
                            <Button variant="ghost" size="icon" className="rounded-full text-red-500 hover:bg-white/20" aria-label="Logout">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Button - Replaced with direct Logout Button */}
                <div className="flex md:hidden items-center gap-4">
                    <div className="border-l border-white/20 pl-4">
                        <ThemeToggle />
                    </div>
                    {/* Replaced hamburger menu with direct logout button for mobile */}
                    <div className="pl-1">
                        <Link href="/" passHref>
                            <Button variant="ghost" size="icon" className="rounded-full text-red-500 hover:bg-white/20" aria-label="Logout">
                                <LogOut className="h-6 w-6" /> {/* Adjusted icon size for mobile if necessary */}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation - Removed as it's no longer needed with direct logout button */}
            {/* 
            {mobileMenuOpen && (
                <div className="md:hidden bg-purple-700 py-3 px-4 flex flex-col gap-3">
                    
                    <Link href="/" className="py-2 flex items-center gap-2 text-white">
                        <LogOut size={16} />
                        <span>{translated.navBar.logout}</span>
                    </Link>
                </div>
            )}
            */}
      </header>
    );
}