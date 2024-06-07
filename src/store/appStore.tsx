import { create } from 'zustand';

interface AppState {
  displayForm: boolean;
  setDisplayForm: (val: boolean) => void
}

export const useAppStore = create<AppState>(set => ({
  displayForm: false,
  setDisplayForm: (val) => set(({ displayForm: val })),
}));
