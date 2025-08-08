"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lang/LanguageContext";
import { useUser } from "@/hooks/account/useUser";
import { useUserPreferences } from "@/hooks/account/useUserPreferences";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Globe, Languages, Palette } from "lucide-react";
import settingsTranslations from "@/lang/SettingsTab";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, reloadFromDatabase } = useLanguage();
  const { user, loading: userLoading } = useUser();
  
  // Get translations for current language
  const t = settingsTranslations[language];
  
  // State for password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // State for practice language
  const [practiceLang, setPracticeLang] = useState<"en" | "es" | "zh">("en");
  const [originalPracticeLang, setOriginalPracticeLang] = useState<"en" | "es" | "zh">("en");
  const [isUpdatingPracticeLang, setIsUpdatingPracticeLang] = useState(false);
  
  // Use useCallback to prevent unnecessary re-renders of useUserPreferences
  const setPracticeLangCallback = useCallback((val: "en" | "es" | "zh") => {
    setPracticeLang(val);
    setOriginalPracticeLang(val);
  }, []);
  
  const { updatePracticeLang, fetchUserData } = useUserPreferences(setPracticeLangCallback);
  
  // State for language preferences with save button
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es" | "zh">("en");
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);
  
  // State for combined save functionality
  const [isSavingAllSettings, setIsSavingAllSettings] = useState(false);
  
  // State for theme preferences with save button
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");
  
  // Language options using translations
  const languageOptions = [
    { value: "en", label: t.languages.english },
    { value: "es", label: t.languages.spanish},
    { value: "zh", label: t.languages.mandarin}
  ];

  // Practice language options using translations
  const practiceLanguageOptions = [
    { value: "en", label: t.languages.english },
    { value: "es", label: t.languages.spanish },
    { value: "zh", label: t.languages.mandarin }
  ];

  // Initialize selectedLanguage with current language
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  // Initialize selectedTheme with current theme
  useEffect(() => {
    setSelectedTheme(theme === "dark" ? "dark" : "light");
  }, [theme]);

  // Fetch user data on mount
  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen, fetchUserData]);

  // Handle password change
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error("Failed to change password: " + error.message);
      } else {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error("An error occurred while changing password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle language preference change (just update local state)
  const handleLanguageChange = (newLang: "en" | "es" | "zh") => {
    setSelectedLanguage(newLang);
  };

  // Save language preference to database
  const saveLanguagePreference = async () => {
    if (userLoading) {
      toast.error("Please wait for authentication to complete");
      return;
    }

    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsSavingLanguage(true);
    
    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          uid: user.id,
          preferred_lang: selectedLanguage
        }, {
          onConflict: 'uid'
        });

      if (error) {
        console.error("Error saving language preference:", error);
        toast.error("Failed to save language preference");
      } else {
        // Update language immediately and also reload from database for consistency
        setLanguage(selectedLanguage);
        console.log("Language updated immediately to:", selectedLanguage);
        await reloadFromDatabase();
        toast.success("Language preference saved successfully!");
      }
    } catch (error) {
      console.error("Error saving language preference:", error);
      toast.error("An error occurred while saving language preference");
    } finally {
      setIsSavingLanguage(false);
    }
  };

  // Handle practice language change (just update local state, don't save immediately)
  const handlePracticeLanguageChange = (newLang: "en" | "es" | "zh") => {
    setPracticeLang(newLang);
  };

  // Handle theme change (just update local state, don't apply immediately)
  const handleThemeChange = (isDark: boolean) => {
    setSelectedTheme(isDark ? "dark" : "light");
  };

  // Combined save function for both interface and practice language
  const saveAllSettings = async () => {
    if (userLoading) {
      toast.error("Please wait for authentication to complete");
      return;
    }

    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsSavingAllSettings(true);
    
    try {
      // Save interface language preference
      const { error: langError } = await supabase
        .from("user_preferences")
        .upsert({
          uid: user.id,
          preferred_lang: selectedLanguage
        }, {
          onConflict: 'uid'
        });

      if (langError) {
        console.error("Error saving language preference:", langError);
        toast.error("Failed to save language preference");
        return;
      }

      // Save practice language preference
      try {
        await updatePracticeLang(practiceLang);
        setOriginalPracticeLang(practiceLang);
      } catch (error) {
        console.error("Failed to update practice language:", error);
        toast.error("Failed to update practice language");
        return;
      }

      // Apply theme change
      setTheme(selectedTheme);

      // Update language immediately and reload from database for consistency
      setLanguage(selectedLanguage);
      console.log("Language updated immediately to:", selectedLanguage);
      await reloadFromDatabase();
      toast.success("Settings saved successfully!");
      
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("An error occurred while saving settings");
    } finally {
      setIsSavingAllSettings(false);
    }
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = selectedLanguage !== language || practiceLang !== originalPracticeLang || selectedTheme !== (theme === "dark" ? "dark" : "light");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900 border-purple-200 dark:border-purple-800 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <span>{t.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Email Section */}
          <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {t.accountInfo.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>{t.accountInfo.emailLabel}</Label>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-md">
                  {user?.email || t.accountInfo.loading}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change Section */}
          <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {t.changePassword.title}
              </CardTitle>
              <CardDescription>
                {t.changePassword.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t.changePassword.currentPassword}</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t.changePassword.currentPasswordPlaceholder}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t.changePassword.newPassword}</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t.changePassword.newPasswordPlaceholder}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.changePassword.confirmPassword}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t.changePassword.confirmPasswordPlaceholder}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800"
              >
                {isChangingPassword ? t.changePassword.changingButton : t.changePassword.changeButton}
              </Button>
            </CardContent>
          </Card>

          {/* Theme Section */}
          <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t.appearance.title}
              </CardTitle>
              <CardDescription>
                {t.appearance.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t.appearance.darkMode}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t.appearance.toggleDescription}
                  </p>
                </div>
                <Switch
                  checked={selectedTheme === "dark"}
                  onCheckedChange={handleThemeChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Preferences Section */}
          <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t.languagePreferences.title}
              </CardTitle>
              <CardDescription>
                {t.languagePreferences.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t.languagePreferences.interfaceLanguage}</Label>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.languagePreferences.selectLanguage} />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Practice Language Section */}
          <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                {t.practiceLanguageSection.title}
              </CardTitle>
              <CardDescription>
                {t.practiceLanguageSection.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>{t.practiceLanguageSection.title}</Label>
                <Select 
                  value={practiceLang} 
                  onValueChange={handlePracticeLanguageChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.practiceLanguageSection.selectPracticeLanguage} />
                  </SelectTrigger>
                  <SelectContent>
                    {practiceLanguageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between pt-4">
          {hasUnsavedChanges && (
            <span className="text-sm text-orange-600 dark:text-orange-400">
              {t.saveAllSettings.unsavedChanges}
            </span>
          )}
          <div className="flex gap-3 ml-auto">
            <Button 
              onClick={saveAllSettings}
              disabled={isSavingAllSettings || !hasUnsavedChanges || userLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800"
            >
              {isSavingAllSettings ? t.saveAllSettings.savingButton : t.saveAllSettings.saveButton}
            </Button>
            <Button 
              onClick={onClose} 
              variant="outline"
              className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/50"
            >
              {t.close}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}