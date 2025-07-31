"use client";

import { useState, useEffect } from "react";
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

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, reloadFromDatabase } = useLanguage();
  const user = useUser();
  
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
  const { updatePracticeLang, fetchUserData } = useUserPreferences(setPracticeLang);
  
  // State for language preferences with save button
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es" | "zh">("en");
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);
  
  // Language options
  const languageOptions = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "es", label: "Español", flag: "🇪🇸" },
    { value: "zh", label: "中文", flag: "🇨🇳" }
  ];

  // Practice language options
  const practiceLanguageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "zh", label: "中文" }
  ];

  // Initialize selectedLanguage with current language
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

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
        // Reload language preference from database to ensure consistency
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

  // Handle practice language change
  const handlePracticeLanguageChange = async (newLang: "en" | "es" | "zh") => {
    setPracticeLang(newLang);
    await updatePracticeLang(newLang);
    toast.success("Practice language updated");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900 border-purple-200 dark:border-purple-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <span>Settings</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Email Section */}
          <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-md">
                  {user?.email || "Loading..."}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change Section */}
          <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
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
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
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
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
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
                {isChangingPassword ? "Changing Password..." : "Change Password"}
              </Button>
            </CardContent>
          </Card>

          {/* Theme Section */}
          <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Choose between light and dark mode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Toggle between light and dark theme
                  </p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Preferences Section */}
          <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language Preferences
              </CardTitle>
              <CardDescription>
                Set your preferred interface language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Interface Language</Label>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <span>{option.flag}</span>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={saveLanguagePreference}
                  disabled={isSavingLanguage || selectedLanguage === language}
                  className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800"
                >
                  {isSavingLanguage ? "Saving..." : "Save Language Preference"}
                </Button>
                {selectedLanguage !== language && (
                  <span className="text-sm text-orange-600 dark:text-orange-400">
                    Unsaved changes
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Practice Language Section */}
          <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Practice Language
              </CardTitle>
              <CardDescription>
                Choose the language you want to practice and learn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Practice Language</Label>
                <Select value={practiceLang} onValueChange={handlePracticeLanguageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select practice language" />
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

        <div className="flex justify-end pt-4">
          <Button 
            onClick={onClose} 
            variant="outline"
            className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/50"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}