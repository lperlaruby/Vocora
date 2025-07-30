import { useState } from "react";

export function useAudio() {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const convertToSpeech = async (text: string) => {
    const response = await fetch("/api/generate-full-audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const blob = await response.blob();
    const audioURL = URL.createObjectURL(blob);
    setAudioSrc(audioURL);
  };

  return { audioSrc, setAudioSrc, convertToSpeech };
}
