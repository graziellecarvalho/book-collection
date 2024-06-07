import { create } from 'zustand';

interface AppState {
  drawerMode: 'form' | 'settings' | 'filter' | null;
  setDrawerMode: (val: 'form' | 'settings' | 'filter' | null) => void;
}

export const useAppStore = create<AppState>(set => ({
  drawerMode: null,
  setDrawerMode: (val) => set({ drawerMode: val })
}));
