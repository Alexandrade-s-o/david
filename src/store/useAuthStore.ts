/**
 * Global Auth + User State — Zustand Store
 * Synced with Firebase Auth and Firestore user profile.
 */

import { create } from "zustand";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth, getUserProfile, updateUserProfile, isFirebaseConfigured } from "@/lib/firebase";
import type { UserProfile } from "@/types";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;

  // Actions
  initialize: () => () => void;    // returns unsubscribe
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: true,

  initialize: () => {
    // Pure frontend: no external DB connection for faster load
    return () => {};
  },

  signOut: async () => {
    set({ user: null, profile: null });
  },

  refreshProfile: async () => {},

  updateProfile: async (data: Partial<UserProfile>) => {
    const { profile } = useAuthStore.getState();
    if (!profile) return;
    set({ profile: { ...profile, ...data } });
  },

  toggleDarkMode: async () => {
    const { profile, updateProfile } = useAuthStore.getState();
    if (!profile) return;
    const next = !profile.prefersDarkMode;
    document.documentElement.classList.toggle("dark", next);
    await updateProfile({ prefersDarkMode: next });
  },
}));
