import { create } from "zustand";

export type ToastVariant = "default" | "success" | "error" | "warning";
export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, "id"> & { id?: string }) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (t) => {
    const id = t.id ?? Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, {  ...t, id }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 4200);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

export const toast = {
  success: (title: string, description?: string) => useToastStore.getState().push({ title, description, variant: "success" }),
  error: (title: string, description?: string) => useToastStore.getState().push({ title, description, variant: "error" }),
  warning: (title: string, description?: string) => useToastStore.getState().push({ title, description, variant: "warning" }),
  info: (title: string, description?: string) => useToastStore.getState().push({ title, description, variant: "default" }),
};
