import { create } from "zustand";
interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileNavOpen: boolean;
  setMobileNav: (o: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (o: boolean) => void;
}
export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  mobileNavOpen: false,
  setMobileNav: (o) => set({ mobileNavOpen: o }),
  searchOpen: false,
  setSearchOpen: (o) => set({ searchOpen: o }),
}));
