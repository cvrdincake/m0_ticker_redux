import { StateCreator } from "zustand";

export type AppearanceState = {
  accentH: number; accentS: number; accentL: number;
  setAccent: (h:number,s:number,l:number) => void;
};

export const createAppearanceSlice: StateCreator<AppearanceState> = (set) => ({
  accentH: 210, accentS: 5, accentL: 30,
  setAccent: (accentH, accentS, accentL) => set({ accentH, accentS, accentL })
});
