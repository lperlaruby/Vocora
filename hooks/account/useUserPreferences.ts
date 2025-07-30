import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function useUserPreferences(setPracticeLang: (val: "en" | "es" | "zh") => void) {
  const router = useRouter();

  const fetchUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("user_preferences")
      .select("practice_lang")
      .eq("uid", session.user.id)
      .single();

    if (data?.practice_lang && ["en", "es", "zh"].includes(data.practice_lang)) {
      setPracticeLang(data.practice_lang);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [router, setPracticeLang]);

  const updatePracticeLang = async (val: "en" | "es" | "zh") => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase
      .from("user_preferences")
      .update({ practice_lang: val })
      .eq("uid", session.user.id);
  };

  return { updatePracticeLang, fetchUserData};
}
