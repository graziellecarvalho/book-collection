import { create } from 'zustand';

interface AppState {
  isLightModeoOn: boolean;
  drawerMode: 'form' | 'settings' | 'filter' | null;
  setLightModeOn: () => void
  setDrawerMode: (val: 'form' | 'settings' | 'filter' | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isLightModeoOn: false,
  drawerMode: null,
  setLightModeOn: () => {
    const val = get().isLightModeoOn
    set({ isLightModeoOn: !val })
  },
  setDrawerMode: (val) => set({ drawerMode: val })
}));
