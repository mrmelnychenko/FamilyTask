import { create } from "zustand";

type FiltersToggle = {
  filterVisible: boolean;
  setFilterVisible: (v: boolean) => void;
};

export const useFiltersToggle = create<FiltersToggle>((set) => ({
  filterVisible: false,
  setFilterVisible: (v) => set({ filterVisible: v }),
}));