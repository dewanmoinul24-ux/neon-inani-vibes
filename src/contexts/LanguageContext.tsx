import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { type Language, type StringKey, t as translate } from "@/i18n/strings";

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: StringKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return ((localStorage.getItem("preferred_lang") as Language) ?? "en");
  });

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem("preferred_lang", l);
  }, []);

  const t = useCallback((key: StringKey) => translate(key, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
