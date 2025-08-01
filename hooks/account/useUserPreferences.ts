import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function useUserPreferences(setPracticeLang: (val: "en" | "es" | "zh") => void) {
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("user_preferences")
        .select("practice_lang")
        .eq("uid", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user preferences:", error);
        return;
      }

      if (data?.practice_lang && ["en", "es", "zh"].includes(data.practice_lang)) {
        setPracticeLang(data.practice_lang);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    }
  }, [router, setPracticeLang]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const updatePracticeLang = async (val: "en" | "es" | "zh") => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No user session found");
      }

      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          uid: session.user.id,
          practice_lang: val
        }, {
          onConflict: 'uid'
        });

      if (error) {
        throw new Error(`Failed to update practice language: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating practice language:", error);
      throw error; // Re-throw so the calling component can handle it
    }
  };

  return { updatePracticeLang, fetchUserData };
}
