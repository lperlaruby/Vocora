import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export function useDailyStreak(userId: string) {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStreak() {
      const { data, error } = await supabase
        .from("user_streaks")
        .select("streak_count")
        .eq("user_id", userId)
        .single();
      if (!error && data) setStreak(data.streak_count);
      else setStreak(0);
    }
    if (userId) fetchStreak();
  }, [userId]);

  return streak;
}