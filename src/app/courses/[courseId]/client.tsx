"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Play, Sparkles, Loader2 } from "lucide-react";
import { getPlanetForLevel } from "@/data/mock-courses";
import { notFound } from "next/navigation";
import { getCourse, getLessons, isFirebaseConfigured } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import type { Course, Lesson } from "@/types";

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const { user, profile } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) { setLoading(false); return; }

    async function load() {
      try {
        const [fetchedCourse, fetchedLessons] = await Promise.all([
          getCourse(params.courseId),
          getLessons(params.courseId),
        ]);
        setCourse(fetchedCourse);
        setLessons(fetchedLessons);
      } catch (err) {
        console.error("[CourseDetail]", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.courseId]);

  if (loading) {
    return (
      <div className="lpa-page flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E5782]" />
      </div>
    );
  }

  if (!course) return notFound();

  const planet = getPlanetForLevel(course.cefrLevel);
  const completedLessons = profile?.completedLessons ?? [];

  // A lesson is locked if the user's plan is free and it's not the first lesson
  const isPremium = profile?.subscription !== "free";

  return (
    <div className="lpa-page">
      <nav className="sticky top-0 z-50 border-b-2 border-landing-border bg-white font-bold">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/courses" className="lpa-link">← Courses</Link>
          <span className="truncate text-center text-[10px] font-black uppercase tracking-widest text-landing-text">Course</span>
          <Link href="/dashboard" className="lpa-link text-right">Hub →</Link>
        </div>
      </nav>

      <header className="relative overflow-hidden border-b-2 border-landing-border bg-landing-surface px-4 pb-14 pt-6">
        <div className="stars-bg pointer-events-none absolute inset-0 opacity-20" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="flex items-start gap-6">
            <div className="text-7xl drop-shadow-sm">{planet.icon}</div>
            <div>
              <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-landing-purple">
                <Sparkles className="h-3.5 w-3.5" />
                Academy track
              </p>
              <h1 className="mb-2 text-3xl font-black uppercase tracking-tight text-landing-text md:text-5xl">
                {course.title}
              </h1>
              <p className="max-w-xl text-xs font-bold uppercase leading-relaxed text-landing-muted">
                {course.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="lpa-pill-tag">{course.cefrLevel}</span>
                <span className="rounded-full border-2 border-landing-border bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-landing-text">
                  {course.totalLessons} lessons
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-20 mx-auto max-w-3xl -mt-8 px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lpa-card p-6 md:p-8"
        >
          <h2 className="lpa-section-title mb-6">Lessons</h2>

          {lessons.length === 0 ? (
            <p className="text-center text-landing-muted text-sm py-8">No lessons published yet.</p>
          ) : (
            <ol className="space-y-3">
              {lessons.map((lesson, index) => {
                const done = completedLessons.includes(lesson.id);
                const locked = lesson.order > 1 && !isPremium;

                return (
                  <li key={lesson.id}>
                    {locked ? (
                      <div className="flex items-center gap-4 rounded-3xl border-2 border-dashed border-landing-border bg-landing-surface/80 p-4 opacity-90">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-landing-border bg-white">
                          <Lock className="h-4 w-4 text-landing-faint" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-black uppercase tracking-tight text-landing-text/80">
                            {index + 1}. {lesson.title}
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-landing-faint">
                            {lesson.estimatedMinutes} min · Premium
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={`/courses/${course.id}/lessons/${lesson.id}`}
                        className="lpa-card-interactive group flex items-center gap-4 rounded-[1.75rem] p-4"
                      >
                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border-b-4 transition-transform group-hover:scale-105 ${done ? "bg-green-500 border-green-700 text-white" : "bg-landing-yellow border-landing-yellowDark text-landing-text"}`}>
                          <Play className="h-4 w-4 fill-current" />
                        </div>
                        <div className="flex-1">
                          <div className="font-black uppercase tracking-tight text-landing-text">
                            {index + 1}. {lesson.title}
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-landing-faint">
                            {lesson.estimatedMinutes} min · {lesson.type}
                          </div>
                        </div>
                        {done && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-green-500">
                            ✓ Done
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </motion.div>
      </main>
    </div>
  );
}
