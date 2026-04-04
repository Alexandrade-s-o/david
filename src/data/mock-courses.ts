import { PLANETS, type CEFRLevel } from "@/types";

export type MockCourseListItem = {
  id: string;
  title: string;
  description: string;
  cefrLevel: CEFRLevel;
  totalLessons: number;
  enrolledCount: number;
  rating: number;
  estimatedHours: number;
};

export const MOCK_COURSES: MockCourseListItem[] = [
  {
    id: "c1",
    title: "Planet Rose: First Words",
    description: "Your first orbit — greetings, numbers, and the words that open every door.",
    cefrLevel: "A1",
    totalLessons: 12,
    enrolledCount: 3200,
    rating: 4.9,
    estimatedHours: 8,
  },
  {
    id: "c2",
    title: "Planet Fox: Grammar Basics",
    description: "Tame the patterns — present simple, questions, and useful structures.",
    cefrLevel: "A2",
    totalLessons: 16,
    enrolledCount: 2100,
    rating: 4.8,
    estimatedHours: 12,
  },
  {
    id: "c3",
    title: "Planet King: Conversations",
    description: "Command real dialogues — travel, work, and everyday confidence.",
    cefrLevel: "B1",
    totalLessons: 20,
    enrolledCount: 1500,
    rating: 4.7,
    estimatedHours: 18,
  },
];

export type MockLessonOutline = { id: string; title: string; minutes: number; locked: boolean };

export const MOCK_LESSONS_BY_COURSE: Record<string, MockLessonOutline[]> = {
  c1: [
    { id: "lesson-1", title: "Greetings & Introductions", minutes: 10, locked: false },
    { id: "lesson-2", title: "Numbers & Time", minutes: 12, locked: false },
    { id: "lesson-3", title: "Family & Friends", minutes: 15, locked: true },
  ],
  c2: [
    { id: "lesson-1", title: "Present Simple Mastery", minutes: 14, locked: false },
    { id: "lesson-2", title: "Questions & Negations", minutes: 16, locked: true },
  ],
  c3: [
    { id: "lesson-1", title: "At the Airport", minutes: 18, locked: false },
    { id: "lesson-2", title: "Small Talk at Work", minutes: 20, locked: true },
  ],
};

export function getPlanetForLevel(level: CEFRLevel) {
  return PLANETS.find((p) => p.cefrLevel === level) ?? PLANETS[0];
}
