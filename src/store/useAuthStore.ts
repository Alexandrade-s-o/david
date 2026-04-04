/**
 * Global Auth + User State — Zustand Store
 * Synced with Firebase Auth and Firestore user profile.
 */

import { create } from "zustand";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth, getUserProfile, updateUserProfile } from "@/lib/firebase";
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

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          set({ user, profile, loading: false, initialized: true });
        } catch (err) {
          console.error("Failed to load user profile:", err);
          set({ user, profile: null, loading: false, initialized: true });
        }
      } else {
        set({ user: null, profile: null, loading: false, initialized: true });
      }
    });
    return unsubscribe;
  },

  signOut: async () => {
    await signOut(auth);
    set({ user: null, profile: null });
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    const profile = await getUserProfile(user.uid);
    set({ profile });
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const { user, profile } = get();
    if (!user || !profile) return;
    await updateUserProfile(user.uid, data);
    set({ profile: { ...profile, ...data } });
  },

  toggleDarkMode: async () => {
    const { profile, updateProfile } = get();
    if (!profile) return;
    const next = !profile.prefersDarkMode;
    // Apply to DOM immediately for snappy UX
    document.documentElement.classList.toggle("dark", next);
    await updateProfile({ prefersDarkMode: next });
  },
}));
