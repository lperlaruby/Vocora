import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// Hook to determine if user is fully authenticated (has session + language preferences)
export function useAuthenticatedUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullyAuthenticated, setIsFullyAuthenticated] = useState(false);

  useEffect(() => {
    const checkUserAndPreferences = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);

        if (sessionUser) {
          // Check if user has completed language preferences
          const { data: preferences } = await supabase
            .from("user_preferences")
            .select("preferred_lang, practice_lang")
            .eq("uid", sessionUser.id)
            .maybeSingle();

          // User is fully authenticated only if they have both language preferences
          const hasPreferences = preferences?.preferred_lang && preferences?.practice_lang;
          setIsFullyAuthenticated(!!hasPreferences);
        } else {
          setIsFullyAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking user authentication status:", error);
        setUser(null);
        setIsFullyAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserAndPreferences();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);

        if (sessionUser) {
          // Re-check preferences when auth state changes
          try {
            const { data: preferences } = await supabase
              .from("user_preferences")
              .select("preferred_lang, practice_lang")
              .eq("uid", sessionUser.id)
              .maybeSingle();

            const hasPreferences = preferences?.preferred_lang && preferences?.practice_lang;
            setIsFullyAuthenticated(!!hasPreferences);
          } catch (error) {
            console.error("Error checking preferences after auth change:", error);
            setIsFullyAuthenticated(false);
          }
        } else {
          setIsFullyAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { 
    user, 
    loading, 
    isFullyAuthenticated, // Only true if user has session AND language preferences
    hasSession: !!user // True if user has session (regardless of preferences)
  };
}
