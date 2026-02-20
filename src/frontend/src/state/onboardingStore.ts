import { create } from 'zustand';
import type { RoomType, StylePreference, BudgetRange } from '../backend';

interface OnboardingState {
  roomType: RoomType | null;
  stylePreferences: StylePreference[];
  budget: BudgetRange | null;
  timeline: string;
  selectedPackage: string | null;
  lastSubmittedBriefId: string | null;
  preselectedDesignerId: string | null;
  setRoomType: (roomType: RoomType) => void;
  setStylePreferences: (styles: StylePreference[]) => void;
  setBudget: (budget: BudgetRange) => void;
  setTimeline: (timeline: string) => void;
  setSelectedPackage: (packageId: string | null) => void;
  setLastSubmittedBriefId: (briefId: string | null) => void;
  setPreselectedDesignerId: (designerId: string | null) => void;
  reset: () => void;
}

const initialState = {
  roomType: null,
  stylePreferences: [],
  budget: null,
  timeline: '',
  selectedPackage: null,
  lastSubmittedBriefId: null,
  preselectedDesignerId: null,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  setRoomType: (roomType) => set({ roomType }),
  setStylePreferences: (stylePreferences) => set({ stylePreferences }),
  setBudget: (budget) => set({ budget }),
  setTimeline: (timeline) => set({ timeline }),
  setSelectedPackage: (selectedPackage) => set({ selectedPackage }),
  setLastSubmittedBriefId: (lastSubmittedBriefId) => set({ lastSubmittedBriefId }),
  setPreselectedDesignerId: (preselectedDesignerId) => set({ preselectedDesignerId }),
  reset: () => set(initialState),
}));
