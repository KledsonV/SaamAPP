// src/store/ConfigStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConfigState {
  whatsapp: string | null;
  rememberWhatsapp: boolean;
  setWhatsapp: (phone: string, remember?: boolean) => void;
  clearWhatsapp: () => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      whatsapp: null,
      rememberWhatsapp: true,
      setWhatsapp: (phone, remember = true) =>
        set({ whatsapp: phone, rememberWhatsapp: remember }),
      clearWhatsapp: () => set({ whatsapp: null }),
    }),
    {
      name: "config-storage",
      partialize: (s) => ({
        whatsapp: s.whatsapp,
        rememberWhatsapp: s.rememberWhatsapp,
      }),
    }
  )
);
