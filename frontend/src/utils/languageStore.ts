import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'no' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'no', // Default to Norwegian
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'no' ? 'en' : 'no' })),
    }),
    {
      name: 'language-storage',
    }
  )
);
