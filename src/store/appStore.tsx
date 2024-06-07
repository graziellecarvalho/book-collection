import { create } from 'zustand';

interface AppState {
  drawerMode: 'form' | 'settings' | null;
  setDrawerMode: (val: 'form' | 'settings' | null) => void;
}

export const useAppStore = create<AppState>(set => ({
  drawerMode: null,
  setDrawerMode: (val) => set({ drawerMode: val })
}));
