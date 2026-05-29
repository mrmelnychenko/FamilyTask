import { create } from "zustand";
import { FamilyMember } from "../services/family-service";

type FiltersToggle = {
  filterVisible: boolean;
  setFilterVisible: (v: boolean) => void;
};

export const useFiltersToggle = create<FiltersToggle>((set) => ({
  filterVisible: false,
  setFilterVisible: (v) => set({ filterVisible: v }),
}));


type MemberSheetState = {
  visible: boolean;
  member: FamilyMember | null;

  open: (member: FamilyMember) => void;
  close: () => void;
};

export const useMemberSheet = create<MemberSheetState>((set) => ({
  visible: false,
  member: null,

  open: (member) =>
      set({
          visible: true,
          member,
      }),

  close: () =>
      set({
          visible: false,
          member: null,
      }),
}));