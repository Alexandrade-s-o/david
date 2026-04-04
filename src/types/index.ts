// ============================================================
// CORE DOMAIN TYPES — Le Petit Anglais
// ============================================================

// ── USER ──────────────────────────────────────────────────────
export type UserRole = "student" | "teacher" | "admin";

export type SubscriptionPlan = "free" | "explorer" | "astronaut" | "universe";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  subscription: SubscriptionPlan;
  subscriptionExpiresAt: Date | null;
  stripeCustomerId: string | null;

  // Gamification
  xp: number;
  level: number;
  currentPlanet: string; // planet slug
  streak: number;        // days in a row
  lastActivityAt: Date;
  badges: string[];      // badge IDs earned

  // Progress
  enrolledCourses: string[];  // course IDs
  completedLessons: string[]; // lesson IDs

  // Settings
  prefersDarkMode: boolean;
  notificationsEnabled: boolean;
  timezone: string;
  language: "es" | "en" | "pt"; // UI language

  createdAt: Date;
  updatedAt: Date;
}

// ── COURSE ────────────────────────────────────────────────────
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  planet: Planet;
  cefrLevel: CEFRLevel;
  totalLessons: number;
  totalXP: number;
  estimatedHours: number;
  isPremium: boolean;
  isPublished: boolean;
  tags: string[];
  enrolledCount: number;
  rating: number;
  createdBy: string; // teacher uid
  createdAt: Date;
  updatedAt: Date;
}

// ── PLANET (gamification world) ────────────────────────────────
export interface Planet {
  id: string;
  slug: string;
  name: string;
  description: string;
  cefrLevel: CEFRLevel;
  color: string;         // hex color for UI
  icon: string;          // emoji or icon name
  illustration: string;  // image path
  order: number;
  unlocksAtXP: number;
}

export const PLANETS: Planet[] = [
  {
    id: "planet-rose",
    slug: "planet-rose",
    name: "Planet Rose",
    description: "Where every word blooms like a flower — your first steps in English.",
    cefrLevel: "A1",
    color: "#E8509A",
    icon: "🌹",
    illustration: "/planets/planet-rose.svg",
    order: 1,
    unlocksAtXP: 0,
  },
  {
    id: "planet-fox",
    slug: "planet-fox",
    name: "Planet Fox",
    description: "Learn to tame language — grammar patterns become your friend.",
    cefrLevel: "A2",
    color: "#F5A623",
    icon: "🦊",
    illustration: "/planets/planet-fox.svg",
    order: 2,
    unlocksAtXP: 500,
  },
  {
    id: "planet-king",
    slug: "planet-king",
    name: "Planet King",
    description: "Command conversations — B1 confidence in every sentence.",
    cefrLevel: "B1",
    color: "#4A90E2",
    icon: "👑",
    illustration: "/planets/planet-king.svg",
    order: 3,
    unlocksAtXP: 1500,
  },
  {
    id: "planet-lamplighter",
    slug: "planet-lamplighter",
    name: "Planet Lamplighter",
    description: "Illuminate complex ideas — B2 fluency shines through.",
    cefrLevel: "B2",
    color: "#7B4F8E",
    icon: "🕯️",
    illustration: "/planets/planet-lamplighter.svg",
    order: 4,
    unlocksAtXP: 3500,
  },
  {
    id: "planet-geographer",
    slug: "planet-geographer",
    name: "Planet Geographer",
    description: "Map the full landscape of English — C1 mastery awaits.",
    cefrLevel: "C1",
    color: "#27AE60",
    icon: "🗺️",
    illustration: "/planets/planet-geographer.svg",
    order: 5,
    unlocksAtXP: 7000,
  },
  {
    id: "planet-stars",
    slug: "planet-stars",
    name: "Among the Stars",
    description: "You've reached the stars — C2 native-level English.",
    cefrLevel: "C2",
    color: "#F5C842",
    icon: "⭐",
    illustration: "/planets/planet-stars.svg",
    order: 6,
    unlocksAtXP: 12000,
  },
];

// ── LESSON ────────────────────────────────────────────────────
export type LessonType = "vocabulary" | "grammar" | "listening" | "speaking" | "story" | "review";

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: LessonType;
  order: number;
  xpReward: number;
  estimatedMinutes: number;
  isPublished: boolean;
  content: LessonContent;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonContent {
  introduction?: string;
  blocks: ContentBlock[];
  exercises: Exercise[];
}

// ── CONTENT BLOCKS ─────────────────────────────────────────────
export type ContentBlockType =
  | "text"
  | "audio"
  | "image"
  | "video"
  | "vocabulary_card"
  | "dialogue"
  | "grammar_rule"
  | "story_panel";

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  data: Record<string, unknown>;
  order: number;
}

// ── EXERCISES ─────────────────────────────────────────────────
export type ExerciseType =
  | "multiple_choice"
  | "fill_blank"
  | "drag_drop"
  | "matching"
  | "speaking_prompt"
  | "listening_comprehension"
  | "reorder_sentence";

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  instruction: string;
  data: Record<string, unknown>;
  correctAnswer: string | string[];
  explanation: string;
  xpReward: number;
  audioUrl?: string;
  imageUrl?: string;
}

// ── PROGRESS ──────────────────────────────────────────────────
export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  status: "not_started" | "in_progress" | "completed";
  score: number;           // 0-100
  xpEarned: number;
  attempts: number;
  timeSpentSeconds: number;
  completedAt: Date | null;
  exerciseResults: ExerciseResult[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseResult {
  exerciseId: string;
  isCorrect: boolean;
  userAnswer: string | string[];
  timeSpentSeconds: number;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedLessons: string[];
  totalXPEarned: number;
  overallScore: number;
  completedAt: Date | null;
}

// ── SPACED REPETITION ─────────────────────────────────────────
export interface VocabCard {
  id: string;
  userId: string;
  word: string;
  translation: string;
  audioUrl: string;
  imageUrl?: string;
  exampleSentence: string;
  // SM-2 algorithm fields
  easeFactor: number;      // default 2.5
  interval: number;        // days until next review
  repetitions: number;
  nextReviewAt: Date;
  lastReviewedAt: Date | null;
  courseId: string;
  lessonId: string;
}

// ── LIVE CLASSES (VIDEO) ───────────────────────────────────────
export type ClassType = "one_on_one" | "group";
export type ClassStatus = "scheduled" | "live" | "completed" | "cancelled";

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  type: ClassType;
  status: ClassStatus;
  maxStudents: number;
  enrolledStudents: string[]; // user UIDs
  scheduledAt: Date;
  durationMinutes: number;
  agoraChannelName: string;
  agoraToken?: string;
  recordingUrl?: string;
  cefrLevel: CEFRLevel;
  isPremium: boolean;
  price: number; // 0 if included in plan
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  classId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  type: "text" | "correction" | "system";
  sentAt: Date;
}

// ── BADGES ────────────────────────────────────────────────────
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string; // human-readable
  xpBonus: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const BADGES: Badge[] = [
  { id: "first-lesson", name: "First Step", description: "Completed your first lesson", icon: "🌱", condition: "Complete 1 lesson", xpBonus: 50, rarity: "common" },
  { id: "streak-7", name: "Week Warrior", description: "7-day streak", icon: "🔥", condition: "7 day streak", xpBonus: 100, rarity: "rare" },
  { id: "streak-30", name: "Stellar", description: "30-day streak", icon: "⭐", condition: "30 day streak", xpBonus: 500, rarity: "epic" },
  { id: "planet-rose-complete", name: "Rose Keeper", description: "Completed Planet Rose", icon: "🌹", condition: "Finish A1 planet", xpBonus: 200, rarity: "rare" },
  { id: "perfect-score", name: "Perfectionist", description: "100% on any lesson", icon: "💯", condition: "Score 100% in a lesson", xpBonus: 75, rarity: "common" },
  { id: "first-call", name: "Voice of the Stars", description: "Attended your first live class", icon: "📡", condition: "Join 1 live class", xpBonus: 150, rarity: "rare" },
  { id: "vocabulary-50", name: "Word Collector", description: "Learned 50 vocabulary words", icon: "📖", condition: "Learn 50 words", xpBonus: 100, rarity: "common" },
  { id: "top-10", name: "Galaxy Brain", description: "Reached top 10 on the leaderboard", icon: "🏆", condition: "Top 10 weekly ranking", xpBonus: 300, rarity: "epic" },
];

// ── SUBSCRIPTIONS ─────────────────────────────────────────────
export interface SubscriptionTier {
  id: SubscriptionPlan;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  features: string[];
  liveLessonsPerMonth: number;
  maxCourses: number | "unlimited";
  color: string;
  icon: string;
  recommended: boolean;
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: "free",
    name: "Little Prince",
    tagline: "Begin your journey",
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceIdMonthly: "",
    stripePriceIdYearly: "",
    features: ["3 free lessons/month", "Basic vocabulary", "Progress tracking", "Community forum"],
    liveLessonsPerMonth: 0,
    maxCourses: 1,
    color: "#27AE60",
    icon: "🌱",
    recommended: false,
  },
  {
    id: "explorer",
    name: "Explorer",
    tagline: "Explore the planets",
    priceMonthly: 14.99,
    priceYearly: 119.99,
    stripePriceIdMonthly: "price_explorer_monthly",
    stripePriceIdYearly: "price_explorer_yearly",
    features: ["All courses A1–B1", "Unlimited lessons", "Spaced repetition", "2 live group classes/month", "Badges & rankings"],
    liveLessonsPerMonth: 2,
    maxCourses: "unlimited",
    color: "#4A90E2",
    icon: "🚀",
    recommended: false,
  },
  {
    id: "astronaut",
    name: "Astronaut",
    tagline: "Reach for the stars",
    priceMonthly: 29.99,
    priceYearly: 239.99,
    stripePriceIdMonthly: "price_astronaut_monthly",
    stripePriceIdYearly: "price_astronaut_yearly",
    features: ["All courses A1–C1", "8 live 1-on-1 classes/month", "Unlimited group classes", "AI conversation partner", "Priority support", "Certificate on completion"],
    liveLessonsPerMonth: 8,
    maxCourses: "unlimited",
    color: "#F5A623",
    icon: "👨‍🚀",
    recommended: true,
  },
  {
    id: "universe",
    name: "Universe",
    tagline: "Own the galaxy",
    priceMonthly: 59.99,
    priceYearly: 479.99,
    stripePriceIdMonthly: "price_universe_monthly",
    stripePriceIdYearly: "price_universe_yearly",
    features: ["All courses A1–C2", "Unlimited 1-on-1 classes", "Dedicated teacher", "Custom learning path", "Downloadable materials", "Official CEFR prep", "White-glove support"],
    liveLessonsPerMonth: 999,
    maxCourses: "unlimited",
    color: "#7B4F8E",
    icon: "🌌",
    recommended: false,
  },
];

// ── NOTIFICATIONS ─────────────────────────────────────────────
export type NotificationType =
  | "lesson_reminder"
  | "streak_warning"
  | "new_badge"
  | "class_starting"
  | "class_scheduled"
  | "ranking_update"
  | "subscription_expiring";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}
