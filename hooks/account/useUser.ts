import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// useUser hook
export function useUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  return user;
}
