"use client";

import { motion } from "framer-motion";
import {
  BookOpen, Star, Flame, Trophy, Video,
  ChevronRight, Play, Lock, CheckCircle, TrendingUp, Users,
} from "lucide-react";
import { PLANETS, type UserProfile, type Course, type LiveClass } from "@/types";
import Link from "next/link";
import { LpaDashboardNav } from "@/components/LpaNav";

const mockUser: Partial<UserProfile> = {
  displayName: "Sophie Martin",
  photoURL: null,
  xp: 1240,
  level: 8,
  currentPlanet: "planet-fox",
  streak: 14,
  badges: ["first-lesson", "streak-7", "planet-rose-complete"],
  subscription: "astronaut",
};

const mockCourses: Partial<Course>[] = [
  { id: "c1", title: "Planet Rose: First Words", cefrLevel: "A1", coverImage: "/planets/planet-rose.svg", totalLessons: 12, enrolledCount: 3200, rating: 4.9 },
  { id: "c2", title: "Planet Fox: Grammar Basics", cefrLevel: "A2", coverImage: "/planets/planet-fox.svg", totalLessons: 16, enrolledCount: 2100, rating: 4.8 },
  { id: "c3", title: "Planet King: Conversations", cefrLevel: "B1", coverImage: "/planets/planet-king.svg", totalLessons: 20, enrolledCount: 1500, rating: 4.7 },
];

const mockClasses: Partial<LiveClass>[] = [
  { id: "l1", title: "Travel Vocabulary Workshop", teacherName: "Ms. Emma Wells", type: "group", scheduledAt: new Date(Date.now() + 3600000 * 2), durationMinutes: 60, cefrLevel: "A2", enrolledStudents: ["a","b","c","d","e"], maxStudents: 8 },
  { id: "l2", title: "1-on-1 Conversation Practice", teacherName: "Mr. James Holt", type: "one_on_one", scheduledAt: new Date(Date.now() + 3600000 * 5), durationMinutes: 45, cefrLevel: "B1", enrolledStudents: [], maxStudents: 1 },
];

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="lpa-card-interactive flex items-center gap-4 p-5"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#fbbf24] text-[#2e1065]">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24]/80">{label}</div>
      </div>
    </motion.div>
  );
}

function XPProgress({ xp, level }: { xp: number; level: number }) {
  const xpForCurrentLevel = (level - 1) * 200;
  const xpForNextLevel = level * 200;
  const progress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#fbbf24] bg-[#fbbf24] text-sm font-black text-[#2e1065] shadow-lg">
        {level}
      </div>
      <div className="flex-1">
        <div className="mb-1 flex justify-between text-[10px] font-black uppercase tracking-wider text-white/70">
          <span>{xp} XP</span>
          <span>Next: {xpForNextLevel} XP</span>
        </div>
        <div className="lpa-progress-track">
          <motion.div
            className="lpa-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

function PlanetMap({ currentPlanet }: { currentPlanet: string }) {
  return (
    <div className="lpa-card relative overflow-hidden p-6">
      <div className="stars-bg absolute inset-0 opacity-40" />
      <div className="relative z-10">
        <h3 className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-[#fbbf24]">Your galaxy</h3>
        <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto pb-2">
          {PLANETS.map((planet, i) => {
            const isCurrent = planet.slug === currentPlanet;
            const isPast = PLANETS.findIndex((p) => p.slug === currentPlanet) > i;
            const isFuture = !isCurrent && !isPast;

            return (
              <div key={planet.id} className="flex flex-shrink-0 items-center gap-2">
                <motion.div
                  whileHover={!isFuture ? { scale: 1.12 } : {}}
                  className={`relative flex cursor-pointer flex-col items-center ${isFuture ? "opacity-40" : ""}`}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-all ${
                      isCurrent ? "shadow-lg ring-4 ring-[#fbbf24] animate-float" : ""
                    }`}
                    style={{ background: `radial-gradient(circle at 35% 35%, ${planet.color}cc, ${planet.color}44)` }}
                  >
                    {isFuture ? <Lock className="h-5 w-5 text-white" /> : planet.icon}
                  </div>
                  {isPast && (
                    <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#fbbf24]">
                      <Star className="h-3 w-3 fill-[#2e1065] text-[#2e1065]" />
                    </div>
                  )}
                  <span className="mt-1.5 text-[10px] font-black uppercase tracking-wider text-white/90">
                    {planet.cefrLevel}
                  </span>
                </motion.div>
                {i < PLANETS.length - 1 && (
                  <div className="mx-1 h-px w-6 flex-shrink-0 bg-[#fbbf24]/30" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, progress }: { course: Partial<Course>; progress: number }) {
  const planet = PLANETS.find((p) => p.cefrLevel === course.cefrLevel);

  return (
    <motion.div whileHover={{ y: -4 }} className="lpa-card-interactive overflow-hidden">
      <div
        className="relative flex h-32 items-center justify-center text-5xl"
        style={{ background: `linear-gradient(135deg, ${planet?.color}55, ${planet?.color}22)` }}
      >
        <span className="animate-float">{planet?.icon}</span>
        <div className="absolute right-3 top-3">
          <span className="lpa-pill-tag bg-[#2e1065]/60">{course.cefrLevel}</span>
        </div>
      </div>

      <div className="p-5">
        <h4 className="mb-2 line-clamp-2 text-sm font-black uppercase tracking-tight text-white">{course.title}</h4>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-wider text-white/50">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3 text-[#fbbf24]" /> {course.totalLessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 text-[#fbbf24]" /> {course.enrolledCount?.toLocaleString()}
          </span>
        </div>

        <div className="mb-4">
          <div className="mb-1.5 flex justify-between text-[10px] font-black uppercase tracking-wider text-white/60">
            <span>Progress</span>
            <span className="text-[#fbbf24]">{progress}%</span>
          </div>
          <div className="lpa-progress-track">
            <motion.div
              className="lpa-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            />
          </div>
        </div>

        <Link href={`/courses/${course.id}`} className="lpa-btn-gold w-full justify-center py-2.5 text-[10px]">
          <Play className="h-3.5 w-3.5" />
          {progress > 0 ? "Continue" : "Start"} learning
        </Link>
      </div>
    </motion.div>
  );
}

function ClassCard({ cls }: { cls: Partial<LiveClass> }) {
  const scheduledAt = cls.scheduledAt as Date;
  const timeUntil = scheduledAt.getTime() - Date.now();
  const hoursUntil = Math.floor(timeUntil / 3600000);
  const minutesUntil = Math.floor((timeUntil % 3600000) / 60000);

  return (
    <motion.div whileHover={{ x: 4 }} className="lpa-card-interactive flex items-center gap-4 rounded-[2rem] p-4">
      <div
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-[#fbbf24]/30 ${
          cls.type === "one_on_one" ? "bg-[#2e1065]" : "bg-[#2e1065]"
        }`}
      >
        <Video className="h-5 w-5 text-[#fbbf24]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-black uppercase tracking-tight text-white">{cls.title}</div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">
          {cls.teacherName} · {cls.cefrLevel} · {cls.durationMinutes}min
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <div className="text-[10px] font-black text-[#fbbf24]">
          {hoursUntil > 0 ? `${hoursUntil}h ${minutesUntil}m` : `${minutesUntil}m`}
        </div>
        <div className="text-[10px] font-black uppercase tracking-wider text-white/40">from now</div>
      </div>
      <Link href={`/classroom/${cls.id}`} className="lpa-btn-gold flex-shrink-0 py-2 px-3 text-[10px]">
        Join
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const user = mockUser;
  const firstName = user.displayName?.split(" ")[0] ?? "Explorer";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="lpa-page">
      <LpaDashboardNav firstName={firstName} />

      <div className="mx-auto max-w-7xl px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lpa-card mb-8 p-6 md:p-8"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="mb-1 text-xs font-black uppercase tracking-[0.3em] text-[#fbbf24]">{greeting}</div>
              <h1 className="mb-4 text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
                {firstName}!
              </h1>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#fbbf24]/40 bg-[#2e1065] px-3 py-1.5">
                  <Flame className="h-4 w-4 text-[#fbbf24]" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#fbbf24]">
                    {user.streak} day streak
                  </span>
                </div>
                <div className="lpa-pill-tag gap-1">
                  <Star className="h-3 w-3" />
                  {user.xp?.toLocaleString()} XP
                </div>
              </div>
              <XPProgress xp={user.xp ?? 0} level={user.level ?? 1} />
            </div>
            <div className="flex-shrink-0 text-7xl animate-float">
              {PLANETS.find((p) => p.slug === user.currentPlanet)?.icon ?? "⭐"}
            </div>
          </div>
        </motion.div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={<BookOpen className="h-5 w-5" />} label="Lessons done" value={34} />
          <StatCard icon={<Star className="h-5 w-5" />} label="Badges earned" value={(user.badges ?? []).length} />
          <StatCard icon={<Trophy className="h-5 w-5" />} label="Weekly rank" value="#12" />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="This week XP" value={320} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <PlanetMap currentPlanet={user.currentPlanet ?? "planet-rose"} />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="lpa-section-title">Your courses</h2>
              <Link href="/courses" className="lpa-link flex items-center gap-1 text-xs">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {mockCourses.map((course, i) => (
                <CourseCard key={course.id} course={course} progress={[75, 30, 0][i]} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="lpa-section-title">Live classes</h2>
                <Link href="/classes" className="lpa-link flex items-center gap-1 text-xs">
                  Browse <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {mockClasses.map((cls) => (
                  <ClassCard key={cls.id} cls={cls} />
                ))}
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} className="lpa-card-interactive relative cursor-pointer overflow-hidden p-5">
              <div className="stars-bg absolute inset-0 opacity-30" />
              <div className="relative z-10">
                <div className="mb-2 text-3xl">🔁</div>
                <h3 className="mb-1 font-black uppercase tracking-tight text-white">Vocab review</h3>
                <p className="mb-4 text-xs font-bold uppercase leading-relaxed text-white/70">
                  You have <strong className="text-[#fbbf24]">12 words</strong> due today.
                </p>
                <Link href="/vocab-review" className="lpa-btn-gold inline-flex py-2 px-4 text-[10px]">
                  Review now
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
