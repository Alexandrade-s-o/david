"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, Star, Users } from "lucide-react";
import { MOCK_COURSES, getPlanetForLevel } from "@/data/mock-courses";
import { LpaSubNav } from "@/components/LpaNav";

export default function CoursesIndexPage() {
  return (
    <div className="lpa-page">
      <LpaSubNav backHref="/dashboard" title="All courses" />

      <div className="mx-auto max-w-5xl px-4 pb-16">
        <p className="lpa-muted mx-auto mb-8 max-w-xl text-center">
          Pick a planet path — each course links to lessons and the interactive player.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_COURSES.map((course, i) => {
            const planet = getPlanetForLevel(course.cefrLevel);
            return (
              <motion.article
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="lpa-card-interactive flex flex-col overflow-hidden"
              >
                <div
                  className="flex h-36 items-center justify-center text-6xl"
                  style={{
                    background: `linear-gradient(135deg, ${planet.color}55, ${planet.color}22)`,
                  }}
                >
                  <span className="animate-float">{planet.icon}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="lpa-pill-tag mb-3 self-start">{course.cefrLevel}</span>
                  <h2 className="mb-2 font-black uppercase tracking-tight text-white">{course.title}</h2>
                  <p className="mb-4 flex-1 text-xs font-bold uppercase leading-relaxed text-white/60">
                    {course.description}
                  </p>
                  <div className="mb-5 flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-wider text-white/45">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-[#fbbf24]" />
                      {course.totalLessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#fbbf24]" />
                      {course.estimatedHours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-[#fbbf24]" />
                      {course.enrolledCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-[#fbbf24] text-[#fbbf24]" />
                      {course.rating}
                    </span>
                  </div>
                  <Link href={`/courses/${course.id}`} className="lpa-btn-gold justify-center py-3 text-[10px]">
                    Open course
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
