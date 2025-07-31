import { supabase } from "../../lib/supabase";

export async function updateDailyStreak(userId: string) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Fetch the user's current streak
  const { data, error } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // Handle error (PGRST116 = no rows found, which is fine)
    return;
  }

  if (!data) {
    // No streak yet, create one
    await supabase.from("user_streaks").insert({
      user_id: userId,
      last_active_date: today,
      streak_count: 1,
    });
    return;
  }

  if (data.last_active_date === today) {
    // Already updated today, do nothing
    return;
  }

  let newStreak = 1;
  if (data.last_active_date === yesterday) {
    newStreak = data.streak_count + 1;
  }

  await supabase
    .from("user_streaks")
    .update({
      last_active_date: today,
      streak_count: newStreak,
    })
    .eq("user_id", userId);
}