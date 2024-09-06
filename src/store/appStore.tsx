import { create } from 'zustand';

interface AppState {
  drawerMode: 'form' | 'settings' | 'filter' | 'user' | null;
  setDrawerMode: (val: 'form' | 'settings' | 'filter' | 'user' | null) => void;
}

export const useAppStore = create<AppState>(set => ({
  drawerMode: null,
  setDrawerMode: (val) => set({ drawerMode: val })
}));
