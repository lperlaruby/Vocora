import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export function useDailyStreak(userId: string | null | undefined) {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStreak() {
      if (!userId) {
        setStreak(0);
        return;
      }
      
      const { data, error } = await supabase
        .from("user_streaks")
        .select("streak_count")
        .eq("user_id", userId)
        .single();
      if (!error && data) setStreak(data.streak_count);
      else setStreak(0);
    }
    fetchStreak();
  }, [userId]);

  return streak;
}