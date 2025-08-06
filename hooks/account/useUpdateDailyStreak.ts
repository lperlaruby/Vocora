import { supabase } from "../../lib/supabase";

export async function updateDailyStreak(userId: string) {
  try {
    console.log("Updating streak for user:", userId);
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    // Fetch the user's current streak
    const { data, error } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("uid", userId) // Changed from user_id to uid
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching streak:", error);
      return;
    }

    if (!data) {
      // No streak yet, create one
      console.log("Creating new streak");
      const { error: insertError } = await supabase.from("user_streaks").insert({
        uid: userId, // Changed from user_id to uid
        last_active_date: today,
        streak_count: 1,
      });
      
      if (insertError) {
        console.error("Error creating streak:", insertError);
      } else {
        console.log("New streak created successfully");
      }
      return;
    }

    if (data.last_active_date === today) {
      console.log("Streak already updated today");
      return;
    }

    let newStreak = 1;
    if (data.last_active_date === yesterday) {
      newStreak = data.streak_count + 1;
    }

    console.log("Updating streak from", data.streak_count, "to", newStreak);

    const { error: updateError } = await supabase
      .from("user_streaks")
      .update({
        last_active_date: today,
        streak_count: newStreak,
      })
      .eq("uid", userId); // Changed from user_id to uid

    if (updateError) {
      console.error("Error updating streak:", updateError);
    } else {
      console.log("Streak updated successfully");
    }
  } catch (error) {
    console.error("Unexpected error in updateDailyStreak:", error);
  }
}