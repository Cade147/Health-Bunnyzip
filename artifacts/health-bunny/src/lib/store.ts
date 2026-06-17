import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SymptomInput, HealthGuidance } from "@workspace/api-client-react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  onboardingCompleted: boolean;
  ageGroup?: string;
  interests?: string[];
  source?: string;
}

export interface HistoryEntry {
  id: string;
  date: string;
  symptomName: string;
  severity: string;
  summary: string;
}

interface AppState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateUser: (data: Partial<UserProfile>) => void;
  
  history: HistoryEntry[];
  addHistory: (entry: HistoryEntry) => void;
  
  currentAnalysisInput: SymptomInput | null;
  setCurrentAnalysisInput: (input: SymptomInput | null) => void;
  
  currentAnalysisResult: HealthGuidance | null;
  setCurrentAnalysisResult: (result: HealthGuidance | null) => void;

  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
      
      history: [
        {
          id: "1",
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          symptomName: "Headache",
          severity: "Mild",
          summary: "Recommended rest and hydration."
        },
        {
          id: "2",
          date: new Date(Date.now() - 86400000 * 15).toISOString(),
          symptomName: "Sore Throat",
          severity: "Moderate",
          summary: "Suggested warm tea and lozenges."
        }
      ],
      addHistory: (entry) => set((state) => ({ history: [entry, ...state.history] })),
      
      currentAnalysisInput: null,
      setCurrentAnalysisInput: (input) => set({ currentAnalysisInput: input }),
      
      currentAnalysisResult: null,
      setCurrentAnalysisResult: (result) => set({ currentAnalysisResult: result }),
      
      logout: () => set({ user: null, history: [], currentAnalysisInput: null, currentAnalysisResult: null }),
    }),
    {
      name: "health-bunny-storage",
    }
  )
);
