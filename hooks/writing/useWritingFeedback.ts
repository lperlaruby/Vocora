import { useState, useEffect } from "react";

export function useWritingFeedback(practiceLang: string, language: string) {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setReply("");
    setInput("");
  }, [practiceLang, language]);
  
  const sendForFeedback = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setReply("");

    try {
      const response = await fetch("/api/writing_prac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, practiceLang, language }),
      });

      const data = await response.json();
      setReply(data.reply || "No feedback received.");
    } catch (err) {
      console.error(err);
      setReply("Error getting feedback.");
    } finally {
      setLoading(false);
    }
  };

  return { input, setInput, reply, loading, sendForFeedback };
}
