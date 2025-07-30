"use client";

// lang/navbarTranslations.ts
export const navbarTranslations = {
  en: {
    login: "Log In",
    signup: "Sign Up",
    language: "Language",
  },
  es: {
    login: "Iniciar sesión",
    signup: "Registrarse",
    language: "Idioma",
  },
  zh: {
    login: "登录",
    signup: "注册",
    language: "语言",
  },
} as const;

export type NavbarTranslations = typeof navbarTranslations;


export default navbarTranslations;
