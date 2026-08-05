import { create } from "zustand";

type Theme = "light" | "dark";
interface ThemeState { theme: Theme; toggle: () => void; set: (t: Theme) => void; }

const apply = (t: Theme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", t === "dark");
  root.classList.toggle("light", t === "light");
};

const initial: Theme = (typeof window !== "undefined" && localStorage.getItem("vn-theme") as Theme) || "light";
if (typeof window !== "undefined") apply(initial);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initial,
  toggle: () => set((s) => {
    const t = s.theme === "light" ? "dark" : "light";
    apply(t); localStorage.setItem("vn-theme", t);
    return { theme: t };
  }),
  set: (t) => { apply(t); localStorage.setItem("vn-theme", t); set({ theme: t }); },
}));
