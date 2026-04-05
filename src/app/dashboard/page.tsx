"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  BookOpen, Star, Flame, Trophy, Video,
  ChevronRight, Play, Lock, CheckCircle, TrendingUp, Users, ArrowRight, Loader2,
} from "lucide-react";
import { PLANETS, type Course, type LiveClass } from "@/types";
import Link from "next/link";
import { LpaDashboardNav } from "@/components/LpaNav";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getPublishedCourses,
  getUpcomingClasses,
  getUserLessonProgress,
  isFirebaseConfigured,
} from "@/lib/firebase";

// ── STAT CARD ────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="flex items-center gap-3 rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white p-4 transition-all sm:gap-4 sm:p-5"
    >
      <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center border-b-2 ${accent ? "bg-[#F56B1F] border-[#C4530D] text-white" : "bg-[#F4F4F4] border-[#E5E5E5] text-[#2E5782]"}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black text-[#2E5782]">{value}</div>
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#AFAFAF]">{label}</div>
      </div>
    </motion.div>
  );
}

// ── XP PROGRESS ─────────────────────────────────────────────────
function XPProgress({ xp, level }: { xp: number; level: number }) {
  const xpForCurrentLevel = (level - 1) * 200;
  const xpForNextLevel = level * 200;
  const progress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 shrink-0 rounded-full bg-[#F56B1F] border-b-2 border-[#C4530D] text-white text-sm font-black flex items-center justify-center">
        {level}
      </div>
      <div className="flex-1">
        <div className="mb-1.5 flex flex-col gap-0.5 text-[10px] font-black uppercase tracking-wider text-[#AFAFAF] min-[380px]:flex-row min-[380px]:justify-between">
          <span className="truncate">{xp.toLocaleString()} XP</span>
          <span className="truncate text-right">Siguiente: {xpForNextLevel.toLocaleString()} XP</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-[#F4F4F4] border border-[#E5E5E5] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#F56B1F]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

// ── PLANET MAP ───────────────────────────────────────────────────
function PlanetMap({ currentPlanet }: { currentPlanet: string }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#AFAFAF]">Tu galaxia</h3>
        <Link href="/courses" className="text-[10px] font-black uppercase tracking-widest text-[#2E5782] hover:text-[#F56B1F] transition-colors flex items-center gap-1">
          Ver todo <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-hide">
        {PLANETS.map((planet, i) => {
          const isCurrent = planet.slug === currentPlanet;
          const isPast = PLANETS.findIndex((p) => p.slug === currentPlanet) > i;
          const isFuture = !isCurrent && !isPast;
          return (
            <div key={planet.id} className="flex shrink-0 items-center gap-3">
              <motion.div
                whileHover={!isFuture ? { scale: 1.08 } : {}}
                className="flex flex-col items-center gap-2 relative cursor-pointer"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl relative border-2 transition-all
                    ${isCurrent ? "border-[#F56B1F] border-b-4 shadow-sm" : "border-[#E5E5E5]"}
                    ${isFuture ? "opacity-35" : ""}
                    ${isPast ? "border-[#2E5782]" : ""}`}
                  style={{ background: isFuture ? "#F4F4F4" : `${planet.color}22` }}
                >
                  {isFuture ? <Lock className="w-5 h-5 text-[#AFAFAF]" /> : planet.icon}
                  {isPast && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#2E5782] flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#F56B1F] flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-[#AFAFAF]">{planet.cefrLevel}</span>
              </motion.div>
              {i < PLANETS.length - 1 && <div className="w-6 h-px bg-[#E5E5E5] shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── COURSE CARD ──────────────────────────────────────────────────
function CourseCard({ course, progress }: { course: Partial<Course>; progress: number }) {
  const planet = PLANETS.find((p) => p.cefrLevel === course.cefrLevel);
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl border-2 border-[#E5E5E5] border-b-4 overflow-hidden transition-all hover:border-[#F56B1F]/40">
      <div
        className="h-28 flex items-center justify-center text-5xl relative"
        style={{ background: `linear-gradient(135deg, ${planet?.color}22, ${planet?.color}08)` }}
      >
        <span>{planet?.icon}</span>
        <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-[0.15em] text-white bg-[#2E5782] rounded-lg px-2 py-1">
          {course.cefrLevel}
        </span>
      </div>
      <div className="p-4">
        <h4 className="text-sm font-black uppercase tracking-tight text-[#2E5782] mb-2 line-clamp-2">{course.title}</h4>
        <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider text-[#AFAFAF] mb-3">
          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-[#F56B1F]" />{course.totalLessons} lecciones</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3 text-[#F56B1F]" />{course.enrolledCount?.toLocaleString()}</span>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-[9px] font-black uppercase mb-1 text-[#AFAFAF]">
            <span>Progreso</span><span className="text-[#F56B1F]">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#F4F4F4] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#F56B1F]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            />
          </div>
        </div>
        <Link href={`/courses/${course.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#2E5782] border-b-2 border-[#1D3D5C] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#1D3D5C] active:border-b-0 active:translate-y-[1px] transition-all">
          <Play className="w-3 h-3 fill-current" />
          {progress > 0 ? "Continuar" : "Comenzar"}
        </Link>
      </div>
    </motion.div>
  );
}

// ── CLASS CARD ───────────────────────────────────────────────────
function ClassCard({ cls }: { cls: Partial<LiveClass> }) {
  const scheduledAt = cls.scheduledAt as Date;
  const timeUntil = scheduledAt.getTime() - Date.now();
  const hoursUntil = Math.floor(timeUntil / 3600000);
  const minutesUntil = Math.floor((timeUntil % 3600000) / 60000);

  return (
    <motion.div
      whileHover={{ x: 3 }}
      className="flex flex-col gap-3 rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white p-4 transition-all sm:flex-row sm:items-center sm:gap-4"
    >
      <div className="flex items-start gap-3 sm:contents">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#E5E5E5] bg-[#F4F4F4]">
          <Video className="h-4 w-4 text-[#2E5782]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-black uppercase tracking-tight text-[#2E5782]">{cls.title}</div>
          <div className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-wide text-[#AFAFAF]">
            {cls.teacherName} · {cls.cefrLevel} · {cls.durationMinutes}min
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center sm:gap-1.5">
        <div className="text-[9px] font-black text-[#F56B1F] sm:text-right">
          {hoursUntil > 0 ? `${hoursUntil}h ${minutesUntil}m` : `${minutesUntil}m`}
        </div>
        <Link
          href={`/classroom/${cls.id}`}
          className="inline-flex min-h-[44px] min-w-[5rem] items-center justify-center rounded-lg border-b-2 border-[#C4530D] bg-[#F56B1F] px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-[#E05C10] active:translate-y-[1px] active:border-b-0 sm:min-h-0 sm:min-w-0 sm:px-3 sm:py-1.5"
        >
          Unirse
        </Link>
      </div>
    </motion.div>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, profile, loading: authLoading, initialize } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [dataLoading, setDataLoading] = useState(true);

  // Iniciar listener de auth
  useEffect(() => {
    const unsub = initialize();
    return unsub;
  }, [initialize]);

  // Cargar datos de Firebase cuando auth esté listo
  useEffect(() => {
    if (authLoading) return;
    if (!isFirebaseConfigured) { setDataLoading(false); return; }

    async function load() {
      try {
        const [fetchedCourses, fetchedClasses] = await Promise.all([
          getPublishedCourses(),
          getUpcomingClasses(5),
        ]);
        setCourses(fetchedCourses.slice(0, 3));
        setClasses(fetchedClasses);

        if (user) {
          const entries = await Promise.all(
            fetchedCourses.slice(0, 3).map(async (c) => {
              const prog = await getUserLessonProgress(user.uid, c.id);
              const pct = c.totalLessons > 0 ? Math.round((prog.length / c.totalLessons) * 100) : 0;
              return [c.id, pct] as [string, number];
            })
          );
          setProgressMap(Object.fromEntries(entries));
        }
      } catch (err) {
        console.error("[Dashboard] load error:", err);
      } finally {
        setDataLoading(false);
      }
    }
    load();
  }, [authLoading, user]);

  const loading = authLoading || dataLoading;
  const firstName = profile?.displayName?.split(" ")[0] ?? user?.displayName?.split(" ")[0] ?? "Explorer";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  const xp     = profile?.xp ?? 0;
  const level  = profile?.level ?? 1;
  const streak = profile?.streak ?? 0;
  const badges = profile?.badges ?? [];
  const completedCount = profile?.completedLessons?.length ?? 0;
  const currentPlanet  = profile?.currentPlanet ?? "planet-rose";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E5782]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#4B4B4B] overflow-x-hidden">
      <LpaDashboardNav firstName={firstName} />

      <div className="mx-auto max-w-6xl space-y-6 px-3 py-6 sm:px-4 md:px-6 md:py-8">

        {/* ── WELCOME CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 rounded-3xl border-2 border-[#E5E5E5] border-b-4 bg-white p-5 sm:p-6 md:flex-row md:p-8"
        >
          <div className="w-full min-w-0 flex-1">
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-[#AFAFAF]">{greeting}</p>
            <h1 className="mb-4 text-2xl font-black uppercase tracking-tight text-[#2E5782] sm:text-3xl md:text-5xl">
              {firstName}!
            </h1>
            <div className="flex flex-wrap gap-2 mb-5">
              <div className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#E5E5E5] bg-[#FFF4EE] px-3 py-1.5">
                <Flame className="w-4 h-4 text-[#F56B1F]" />
                <span className="text-xs font-black uppercase tracking-wide text-[#F56B1F]">{streak} días seguidos</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#E5E5E5] bg-[#F0F4FF] px-3 py-1.5">
                <Star className="w-4 h-4 text-[#2E5782]" />
                <span className="text-xs font-black uppercase tracking-wide text-[#2E5782]">{xp.toLocaleString()} XP</span>
              </div>
            </div>
            <XPProgress xp={xp} level={level} />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="shrink-0 hidden md:block"
          >
            <Image src="/hero-mascot.png" alt="Ling" width={140} height={140} className="w-36 h-36 object-contain" />
          </motion.div>
        </motion.div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[
            { icon: <BookOpen className="w-5 h-5" />, label: "Lecciones", value: completedCount, accent: false },
            { icon: <Star className="w-5 h-5" />, label: "Insignias", value: badges.length, accent: false },
            { icon: <Trophy className="w-5 h-5" />, label: "Ranking", value: "—", accent: true },
            { icon: <TrendingUp className="w-5 h-5" />, label: "XP total", value: xp, accent: false },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {/* ── PLANET MAP ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <PlanetMap currentPlanet={currentPlanet} />
        </motion.div>

        {/* ── COURSES + SIDEBAR ── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Courses */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tight text-[#2E5782]">Tus cursos</h2>
              <Link href="/courses" className="text-[10px] font-black uppercase tracking-widest text-[#F56B1F] hover:text-[#C4530D] transition-colors flex items-center gap-1">
                Ver todos <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {courses.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-8 text-center text-[#AFAFAF] text-sm font-bold">
                No hay cursos disponibles aún.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} progress={progressMap[course.id] ?? 0} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Live Classes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black uppercase tracking-tight text-[#2E5782]">Clases en vivo</h2>
                <Link href="/classes" className="text-[10px] font-black uppercase tracking-widest text-[#F56B1F] hover:text-[#C4530D] transition-colors flex items-center gap-1">
                  Ver más <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {classes.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6 text-center text-[#AFAFAF] text-xs font-bold">
                  No hay clases programadas.
                </div>
              ) : (
                <div className="space-y-3">
                  {classes.map((cls) => <ClassCard key={cls.id} cls={cls} />)}
                </div>
              )}
            </div>

            {/* Vocab Review Widget */}
            <div className="bg-[#2E5782] rounded-2xl border-b-4 border-[#1D3D5C] p-5 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-1">Pendiente hoy</p>
              <h3 className="text-2xl font-black mb-1">Vocabulario</h3>
              <p className="text-sm font-bold text-white/70 mb-4 leading-snug">Tu revisión diaria de vocabulario está lista.</p>
              <Link href="/vocab-review"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F56B1F] border-b-2 border-[#C4530D] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#E05C10] active:border-b-0 active:translate-y-[1px] transition-all">
                Revisar ahora <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
