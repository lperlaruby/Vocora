import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to properly split text into words, handling Unicode characters correctly
export function splitIntoWords(text: string): string[] {
  const pattern = /([A-Za-zÀ-ÿ\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]+|[\u4e00-\u9fff]|[0-9]+|[^A-Za-zÀ-ÿ\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF0-9\u4e00-\u9fff]+)/g;
  return text.match(pattern) || [];
}

// Function to clean a word (remove punctuation, etc.) while preserving accents and Chinese characters
export function cleanWord(word: string): string {
  return word.replace(/[^A-Za-zÀ-ÿ\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF0-9\u4e00-\u9fff]/g, '').toLowerCase();
}
