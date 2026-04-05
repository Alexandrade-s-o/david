import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth, type User as FirebaseUser } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  Timestamp,
  writeBatch,
  type QueryConstraint,
} from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// ── CONFIG ────────────────────────────────────────────────────
// Store these in .env.local / Vercel — NEVER hardcode secrets in repo
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const nonEmpty = (v: string | undefined) => Boolean(v && v.trim().length > 0);

/** False during `next build` on Vercel until you add env vars — avoids invalid-api-key at import time */
export const isFirebaseConfigured =
  nonEmpty(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) &&
  nonEmpty(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) &&
  nonEmpty(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) &&
  nonEmpty(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) &&
  nonEmpty(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) &&
  nonEmpty(process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

let firebaseApp: FirebaseApp | undefined;
if (isFirebaseConfigured) {
  firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

// Cast when missing so existing call sites type-check; guard with isFirebaseConfigured before server use
export const auth: Auth = firebaseApp ? getAuth(firebaseApp) : (null as unknown as Auth);
export const db: Firestore = firebaseApp ? getFirestore(firebaseApp) : (null as unknown as Firestore);
export const storage: FirebaseStorage = firebaseApp ? getStorage(firebaseApp) : (null as unknown as FirebaseStorage);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Analytics — client-side only
export const getFirebaseAnalytics = async () => {
  if (!firebaseApp || typeof window === "undefined" || !(await isSupported())) {
    return null;
  }
  return getAnalytics(firebaseApp);
};

// ── COLLECTION REFS ───────────────────────────────────────────
export const Collections = {
  USERS:           "users",
  COURSES:         "courses",
  LESSONS:         (courseId: string) => `courses/${courseId}/lessons`,
  LESSON_PROGRESS: "lessonProgress",
  COURSE_PROGRESS: "courseProgress",
  VOCAB_CARDS:     "vocabCards",
  LIVE_CLASSES:    "liveClasses",
  CHAT_MESSAGES:   (classId: string) => `liveClasses/${classId}/messages`,
  NOTIFICATIONS:   (userId: string) => `users/${userId}/notifications`,
  RANKINGS:        "rankings",
} as const;

// ── HELPER UTILITIES ──────────────────────────────────────────

/** Convert Firestore Timestamps to Dates recursively */
export function fromFirestore<T>(data: Record<string, unknown>): T {
  const converted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      converted[key] = value.toDate();
    } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      converted[key] = fromFirestore(value as Record<string, unknown>);
    } else {
      converted[key] = value;
    }
  }
  return converted as T;
}

// ── USER QUERIES ──────────────────────────────────────────────
export async function getUserProfile(uid: string) {
  if (!isFirebaseConfigured || !db) return null;
  const snap = await getDoc(doc(db, Collections.USERS, uid));
  if (!snap.exists()) return null;
  return fromFirestore<import("../types").UserProfile>({ id: snap.id, ...snap.data() });
}

/** Crea el documento de usuario en Firestore si no existe (p. ej. primer login con Google). */
export async function ensureStudentProfile(user: FirebaseUser) {
  if (!isFirebaseConfigured || !db) return;
  const ref = doc(db, Collections.USERS, user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;
  await setDoc(ref, {
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName ?? "Usuario",
    photoURL: user.photoURL ?? null,
    role: "student",
    subscription: "free",
    subscriptionExpiresAt: null,
    stripeCustomerId: null,
    xp: 0,
    level: 1,
    currentPlanet: "planet-rose",
    streak: 0,
    lastActivityAt: serverTimestamp(),
    badges: [],
    enrolledCourses: [],
    completedLessons: [],
    prefersDarkMode: false,
    notificationsEnabled: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: "es",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserProfile(uid: string, data: Partial<import("../types").UserProfile>) {
  if (!isFirebaseConfigured || !db) return;
  await updateDoc(doc(db, Collections.USERS, uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function awardXP(uid: string, xp: number) {
  await updateDoc(doc(db, Collections.USERS, uid), {
    xp: increment(xp),
    updatedAt: serverTimestamp(),
  });
}

// ── COURSE QUERIES ────────────────────────────────────────────
export async function getPublishedCourses() {
  const q = query(
    collection(db, Collections.COURSES),
    where("isPublished", "==", true),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromFirestore<import("../types").Course>({ id: d.id, ...d.data() }));
}

export async function getCourse(courseId: string) {
  const snap = await getDoc(doc(db, Collections.COURSES, courseId));
  if (!snap.exists()) return null;
  return fromFirestore<import("../types").Course>({ id: snap.id, ...snap.data() });
}

export async function getLessons(courseId: string) {
  const q = query(
    collection(db, Collections.LESSONS(courseId)),
    where("isPublished", "==", true),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromFirestore<import("../types").Lesson>({ id: d.id, ...d.data() }));
}

// ── PROGRESS QUERIES ──────────────────────────────────────────
export async function saveLessonProgress(
  progress: Omit<import("../types").LessonProgress, "id" | "createdAt" | "updatedAt">
) {
  const id = `${progress.userId}_${progress.lessonId}`;
  await setDoc(doc(db, Collections.LESSON_PROGRESS, id), {
    ...progress,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, { merge: true });
}

export async function getUserLessonProgress(userId: string, courseId: string) {
  const q = query(
    collection(db, Collections.LESSON_PROGRESS),
    where("userId", "==", userId),
    where("courseId", "==", courseId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    fromFirestore<import("../types").LessonProgress>({ id: d.id, ...d.data() })
  );
}

// ── SPACED REPETITION ─────────────────────────────────────────
export async function getDueVocabCards(userId: string, limitCount = 20) {
  const now = new Date();
  const q = query(
    collection(db, Collections.VOCAB_CARDS),
    where("userId", "==", userId),
    where("nextReviewAt", "<=", now),
    orderBy("nextReviewAt", "asc"),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    fromFirestore<import("../types").VocabCard>({ id: d.id, ...d.data() })
  );
}

/** SM-2 spaced repetition algorithm */
export function calculateNextReview(
  card: Pick<import("../types").VocabCard, "easeFactor" | "interval" | "repetitions">,
  quality: 0 | 1 | 2 | 3 | 4 | 5 // 0–2 fail, 3–5 pass
): { interval: number; easeFactor: number; repetitions: number; nextReviewAt: Date } {
  let { easeFactor, interval, repetitions } = card;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return { interval, easeFactor, repetitions, nextReviewAt };
}

// ── LIVE CLASSES ──────────────────────────────────────────────
export async function getUpcomingClasses(limitCount = 10) {
  const now = new Date();
  const q = query(
    collection(db, Collections.LIVE_CLASSES),
    where("scheduledAt", ">=", now),
    where("status", "==", "scheduled"),
    orderBy("scheduledAt", "asc"),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    fromFirestore<import("../types").LiveClass>({ id: d.id, ...d.data() })
  );
}

export function subscribeToClassMessages(
  classId: string,
  callback: (messages: import("../types").ChatMessage[]) => void
) {
  const q = query(
    collection(db, Collections.CHAT_MESSAGES(classId)),
    orderBy("sentAt", "asc"),
    limit(200)
  );
  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map((d) =>
      fromFirestore<import("../types").ChatMessage>({ id: d.id, ...d.data() })
    );
    callback(messages);
  });
}

// ── RANKINGS ──────────────────────────────────────────────────
export async function getWeeklyRanking(topN = 20) {
  const q = query(
    collection(db, Collections.RANKINGS),
    orderBy("weeklyXP", "desc"),
    limit(topN)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d, i) => ({ rank: i + 1, ...d.data() }));
}

// Re-export Firestore utilities for use in services
export {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, addDoc,
  deleteDoc, query, where, orderBy, limit, onSnapshot, serverTimestamp,
  increment, writeBatch, Timestamp,
};
