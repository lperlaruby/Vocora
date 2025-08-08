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
        .select("practice_lang, preferred_lang")
        .eq("uid", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user preferences:", error);
        return;
      }

      if (data?.practice_lang && ["en", "es", "zh"].includes(data.practice_lang)) {
        setPracticeLang(data.practice_lang);
      } else {
        // If no user preferences exist, delete the incomplete user account
        console.log("No user preferences found, deleting incomplete user account");
        
        try {
          const response = await fetch('/api/delete-incomplete-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: session.user.id,
              reason: 'Incomplete language setup - accessed dashboard without preferences'
            }),
          });

          if (response.ok) {
            console.log("Successfully deleted incomplete user account");
          } else {
            console.error("Failed to delete incomplete user account");
          }
        } catch (deleteError) {
          console.error("Error calling delete API:", deleteError);
        }

        // Sign out the user and redirect to signup
        await supabase.auth.signOut();
        router.push("/signup?error=incomplete_account_deleted");
        return;
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
