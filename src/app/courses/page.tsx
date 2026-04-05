"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, Star, Users, Loader2 } from "lucide-react";
import { getPlanetForLevel } from "@/data/mock-courses";
import { LpaSubNav } from "@/components/LpaNav";
import { getPublishedCourses, isFirebaseConfigured } from "@/lib/firebase";
import type { Course } from "@/types";

export default function CoursesIndexPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    getPublishedCourses()
      .then(setCourses)
      .catch((err) => console.error("[Courses]", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="lpa-page">
      <LpaSubNav backHref="/dashboard" title="All courses" />

      <div className="mx-auto max-w-5xl px-4 pb-16">
        <p className="lpa-muted mx-auto mb-8 max-w-xl text-center">
          Pick a planet path — each course links to lessons and the interactive player.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#2E5782]" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-[#AFAFAF] font-bold text-sm">
            No hay cursos disponibles aún.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => {
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
                    style={{ background: `linear-gradient(135deg, ${planet.color}55, ${planet.color}22)` }}
                  >
                    <span className="animate-float">{planet.icon}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-6">
                    <span className="lpa-pill-tag mb-3 self-start">{course.cefrLevel}</span>
                    <h2 className="mb-2 font-black uppercase tracking-tight text-landing-text">{course.title}</h2>
                    <p className="mb-4 flex-1 text-xs font-bold uppercase leading-relaxed text-landing-muted">
                      {course.description}
                    </p>
                    <div className="mb-5 flex flex-wrap gap-4 text-xs font-black uppercase tracking-wider text-landing-faint">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-landing-purple" />
                        {course.totalLessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-landing-purple" />
                        {course.estimatedHours}h
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-landing-purple" />
                        {course.enrolledCount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-landing-yellow text-landing-yellow" />
                        {course.rating}
                      </span>
                    </div>
                    <Link href={`/courses/${course.id}`} className="lpa-btn-gold justify-center py-3 min-h-[44px] text-xs">
                      Open course
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
