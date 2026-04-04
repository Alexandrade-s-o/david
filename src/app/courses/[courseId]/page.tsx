"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Play, Sparkles } from "lucide-react";
import {
  MOCK_COURSES,
  MOCK_LESSONS_BY_COURSE,
  getPlanetForLevel,
} from "@/data/mock-courses";
import { notFound } from "next/navigation";

export default function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = MOCK_COURSES.find((c) => c.id === params.courseId);
  if (!course) notFound();

  const lessons = MOCK_LESSONS_BY_COURSE[course.id] ?? MOCK_LESSONS_BY_COURSE.c1;
  const planet = getPlanetForLevel(course.cefrLevel);

  return (
    <div className="lpa-page">
      <nav className="sticky top-0 z-50 px-4 py-6 font-bold">
        <div className="mx-auto max-w-3xl lpa-nav-shell">
          <Link href="/courses" className="lpa-link">
            ← Courses
          </Link>
          <span className="truncate text-center text-[10px] font-black uppercase tracking-widest text-white/90">
            Course
          </span>
          <Link href="/dashboard" className="lpa-link text-right">
            Hub →
          </Link>
        </div>
      </nav>

      <header className="relative overflow-hidden border-b-4 border-[#fbbf24] bg-[#2e1065] px-4 pb-14 pt-4">
        <div className="stars-bg absolute inset-0 opacity-35" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="flex items-start gap-6">
            <div className="text-7xl drop-shadow-lg">{planet.icon}</div>
            <div>
              <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-[#fbbf24]">
                <Sparkles className="h-3.5 w-3.5" />
                Academy track
              </p>
              <h1 className="mb-2 text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
                {course.title}
              </h1>
              <p className="max-w-xl text-xs font-bold uppercase leading-relaxed text-white/70">
                {course.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="lpa-pill-tag">{course.cefrLevel}</span>
                <span className="rounded-full border-2 border-[#fbbf24]/40 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
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
          <ol className="space-y-3">
            {lessons.map((lesson, index) => (
              <li key={lesson.id}>
                {lesson.locked ? (
                  <div className="flex items-center gap-4 rounded-3xl border-4 border-dashed border-[#fbbf24]/25 bg-[#2e1065]/50 p-4 opacity-75">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#fbbf24]/30 bg-[#3b1482]">
                      <Lock className="h-4 w-4 text-[#fbbf24]/60" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-black uppercase tracking-tight text-white/80">
                        {index + 1}. {lesson.title}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-white/40">
                        {lesson.minutes} min · Locked
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/courses/${course.id}/lessons/${lesson.id}`}
                    className="lpa-card-interactive flex items-center gap-4 rounded-[1.75rem] border-4 border-[#fbbf24]/20 bg-[#3b1482] p-4 transition-all hover:border-[#fbbf24] group"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fbbf24] text-[#2e1065] transition-transform group-hover:scale-105">
                      <Play className="h-4 w-4 fill-current" />
                    </div>
                    <div className="flex-1">
                      <div className="font-black uppercase tracking-tight text-white">
                        {index + 1}. {lesson.title}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-white/45">
                        {lesson.minutes} min
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24] opacity-0 transition-opacity group-hover:opacity-100">
                      Start →
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </motion.div>
      </main>
    </div>
  );
}
