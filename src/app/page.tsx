"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Play, Globe, MessageCircle, Zap, Shield, Loader2, Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { SUBSCRIPTION_TIERS, PLANETS } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";

// ── ANIMATION VARIANTS ─────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  }),
};

const popIn = {
  hidden: { opacity: 0, scale: 0.5, rotate: -10 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { delay: custom * 0.1, duration: 0.8, type: "spring", bounce: 0.6 },
  }),
};

const floatingAnimation = {
  y: ["-3%", "3%", "-3%"],
  transition: {
    duration: 4,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

// ── PALETTE ────────────────────────────────────────────────────────
// NAVY  : #2E5782  (dark blue text, buttons, borders)
// ORANGE: #F56B1F  (primary accent — CTAs, highlights)
// WHITE : #FFFFFF  (backgrounds)
// LIGHT : #F4F4F4  (subtle dividers and card backgrounds)

const ButtonOrange = ({
  children,
  href,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}) => {
  const base =
    "inline-flex items-center justify-center font-black tracking-wide text-white bg-[#F56B1F] border-b-4 border-[#C4530D] hover:bg-[#E05C10] rounded-2xl active:border-b-0 active:translate-y-1 transition-all px-8 py-4 text-xl font-handwritten " +
    className;
  
  const inner = (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center w-full h-full">
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className={base} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={base} onClick={onClick}>
      {inner}
    </button>
  );
};

const ButtonNavy = ({ children, href, className = "" }: { children: React.ReactNode; href?: string; className?: string }) => {
  const base =
    "inline-flex items-center justify-center font-black tracking-wide text-white bg-[#2E5782] border-b-4 border-[#1D3D5C] hover:bg-[#141F57] rounded-2xl active:border-b-0 active:translate-y-1 transition-all px-8 py-4 text-xl font-handwritten " +
    className;
  const inner = (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center w-full h-full">
      {children}
    </motion.div>
  );
  if (href) return <Link href={href} className={base}>{inner}</Link>;
  return <button type="button" className={base}>{inner}</button>;
};

const ButtonGhost = ({
  children,
  href,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}) => {
  const base =
    "inline-flex items-center justify-center font-black tracking-wide text-[#AFAFAF] hover:bg-[#F4F4F4] hover:text-[#2E5782] rounded-2xl transition-all px-6 py-3 text-lg font-handwritten " +
    className;
  if (href) {
    return (
      <Link href={href} className={base} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={base} onClick={onClick}>
      {children}
    </button>
  );
};

const ButtonOutline = ({ children, href, className = "" }: { children: React.ReactNode; href?: string; className?: string }) => {
  const base =
    "inline-flex items-center justify-center font-black tracking-wide text-[#2E5782] border-2 border-[#E5E5E5] border-b-4 hover:bg-[#F4F4F4] hover:border-[#D4D4D4] rounded-2xl active:border-b-2 active:translate-y-[2px] transition-all px-8 py-4 text-xl font-handwritten " +
    className;
  if (href) return <Link href={href} className={base}>{children}</Link>;
  return <button type="button" className={base}>{children}</button>;
};


// ── NAVBAR ──────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const links = [
    ["#method", "Academia"],
    ["#curriculum", "Planetas"],
    ["#plans", "Precios"],
  ] as const;

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 right-0 top-0 z-50 border-b-2 border-[#E5E5E5] bg-white/80 backdrop-blur-xl"
      >
        <div
          className="mx-auto flex max-w-6xl items-center justify-between gap-2 py-2.5 sm:py-3"
          style={{
            paddingLeft: "max(0.75rem, env(safe-area-inset-left))",
            paddingRight: "max(0.75rem, env(safe-area-inset-right))",
            paddingTop: "max(0.25rem, env(safe-area-inset-top))",
          }}
        >
          <Link href="/" className="group flex min-w-0 items-center gap-2 sm:gap-2.5">
            <Image
              src="/hero-mascot.png"
              alt="Ling"
              width={40}
              height={40}
              className="h-9 w-9 shrink-0 object-contain transition-transform group-hover:scale-110 sm:h-10 sm:w-10"
            />
            <span className="truncate text-lg font-extrabold tracking-tight text-[#2E5782] sm:text-xl">Ling</span>
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="text-xl font-bold text-[#AFAFAF] transition-transform hover:text-[#2E5782] hover:scale-110 font-handwritten"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-2 sm:gap-3 md:flex">
            <ButtonGhost href="/login" className="px-3 py-2 sm:px-4">
              Ingresar
            </ButtonGhost>
            <ButtonOrange href="/register" className="px-4 py-2 text-xs sm:px-5 sm:text-sm">
              Empieza ya
            </ButtonOrange>
          </div>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#E5E5E5] text-[#2E5782] md:hidden"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" strokeWidth={2.5} /> : <Menu className="h-6 w-6" strokeWidth={2.5} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden" 
            role="dialog" aria-modal="true" aria-label="Menú"
          >
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#2E5782]/40 backdrop-blur-md"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%", skewX: 5 }}
              animate={{ x: 0, skewX: 0 }}
              exit={{ x: "100%", skewX: -5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.8 }}
              className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l-2 border-[#E5E5E5] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)]"
              style={{ paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}
            >
              <div className="flex h-16 items-center justify-between px-6 mb-6">
                <div className="flex items-center gap-2">
                  <Image src="/hero-mascot.png" alt="Ling" width={32} height={32} className="h-8 w-8 object-contain" />
                  <span className="text-xl font-black text-[#2E5782]">Ling</span>
                </div>
                <button 
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#E5E5E5] text-[#2E5782]"
                >
                  <X className="h-6 w-6" strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-4">
                {links.map(([href, label], i) => (
                  <motion.div
                    key={href}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={href}
                      className="group flex items-center justify-between rounded-2xl px-6 py-4 text-lg font-extrabold uppercase tracking-widest text-[#2E5782] hover:bg-[#F4F4F4] transition-all"
                      onClick={() => setOpen(false)}
                    >
                      {label}
                      <motion.span 
                        initial={{ x: -10, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                        className="text-[#F56B1F]"
                      >→</motion.span>
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 flex flex-col gap-3 border-t-2 border-[#E5E5E5] p-4"
                >
                  <ButtonGhost href="/login" className="w-full justify-center py-4 text-base" onClick={() => setOpen(false)}>
                    Ingresar
                  </ButtonGhost>
                  <ButtonOrange href="/register" className="w-full justify-center py-4 text-base shadow-[0_10px_20px_rgba(245,107,31,0.2)]" onClick={() => setOpen(false)}>
                    Empezar Ahora
                  </ButtonOrange>
                </motion.div>
              </div>

              <div className="p-8 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-[#AFAFAF]">
                  Aprende inglés con historias ✨
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── HERO ────────────────────────────────────────────────────────
// ── HERO ────────────────────────────────────────────────────────
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.8, 0]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const rotateImage = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <section ref={ref} className="relative border-b-2 border-[#E5E5E5] bg-white pb-32 pt-[calc(4rem+env(safe-area-inset-top))] sm:pb-28 sm:pt-40 md:pb-36 md:pt-48 overflow-hidden">
      <motion.div style={{ y: yBg }} className="absolute inset-0 bg-[#F4F4F4]/20 pointer-events-none" />
      
      {/* Dynamic Background Elements */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-[#F56B1F]/5 rounded-full blur-[100px] pointer-events-none" 
      />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 relative z-10">
        <div className="flex flex-col items-center gap-12 md:flex-row md:gap-24">
          <motion.div style={{ y: yText, opacity: opacityText }} className="flex-1 text-center md:text-left z-20">
            <motion.h1 
              initial={{ opacity: 0, x: -50, rotate: -2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 text-5xl font-black leading-[1] tracking-tight text-[#2E5782] sm:text-6xl md:text-7xl lg:text-8xl font-handwritten"
            >
              Aprende inglés <br />
              <span className="text-[#F56B1F] inline-block relative py-2">
                viviendo historias
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="absolute bottom-0 left-0 right-0 h-2 bg-[#FFC800]/40 origin-left"
                />
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-10 max-w-lg text-2xl font-bold leading-relaxed text-[#555555] sm:text-3xl font-handwritten"
            >
              Ling es la academia donde el idioma se aprende como un juego épico.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
            >
              <ButtonOrange href="/register" className="h-16 px-10 text-xl shadow-[0_15px_30px_rgba(245,107,31,0.3)] w-full sm:w-auto">
                Empezar aventura
              </ButtonOrange>
              <ButtonOutline href="#method" className="h-16 px-10 text-xl w-full sm:w-auto">
                Ver método
              </ButtonOutline>
            </motion.div>
          </motion.div>

          {/* Optimized Mascot for Mobile */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative flex flex-1 justify-center md:mt-0"
          >
            <div className="absolute -inset-10 bg-[#FFC800]/20 rounded-full blur-[80px] -z-10 mix-blend-multiply opacity-50" />
            <motion.div
              style={{ scale: scaleImage, rotate: rotateImage }}
              animate={floatingAnimation}
              drag
              dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
              className="relative w-40 sm:w-64 md:w-[480px] drop-shadow-2xl cursor-grab active:cursor-grabbing"
            >
              <Image
                src="/hero-mascot.png"
                alt="Mascota Ling"
                width={480}
                height={480}
                className="w-full h-auto object-contain pointer-events-none"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── MANIFESTO ───────────────────────────────────────────────────
function ManifestoSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scaleText = useTransform(scrollYProgress, [0.5, 1], [0.8, 1]);
  const opacityText = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);

  return (
    <section id="method" ref={ref} className="relative border-b-2 border-[#E5E5E5] bg-[#2E5782] text-white px-4 py-24 sm:px-6 sm:py-36 overflow-hidden font-handwritten">
      <motion.div 
        style={{ scale: scaleText, opacity: opacityText }}
        className="mx-auto max-w-4xl text-center flex flex-col items-center relative z-10"
      >
        <motion.span 
          animate={floatingAnimation}
          className="inline-flex items-center gap-2 mb-8 uppercase tracking-[0.2em] font-black text-[#AFAFAF] border-2 border-[#1D3D5C] bg-[#141F57] rounded-full px-6 py-3 text-base shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          ✨ Nuestra Filosofía
        </motion.span>
        <motion.h2 
          className="mb-10 text-4xl font-black leading-tight sm:text-5xl md:text-7xl"
        >
          Las reglas gramaticales no te dan fluidez.
          <br className="hidden sm:block" />
          <motion.span 
            initial={{ rotate: 10, scale: 0.5, opacity: 0 }} 
            whileInView={{ rotate: -2, scale: 1.1, opacity: 1 }} 
            whileHover={{ scale: 1.2, rotate: 2, textShadow: "0px 0px 15px rgba(245,107,31,0.6)" }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
            viewport={{ once: true }}
            className="text-[#FFC800] inline-block mt-4 text-[1.3em] px-4 cursor-default"
          >
            Las historias sí.
          </motion.span>
        </motion.h2>
        <motion.p 
          className="mx-auto max-w-2xl text-xl font-bold leading-relaxed text-[#D4D4D4] sm:text-2xl md:text-3xl"
        >
          Toda nuestra academia gira en torno a esta idea.
        </motion.p>
      </motion.div>
    </section>
  );
}

// ── FEATURES ────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      title: "Inmersión Total",
      desc: "Olvida las tablas de verbos. Aprende con diálogos reales y situaciones que te importan.",
      icon: <MessageCircle className="w-10 h-10 text-white fill-current" />,
      bg: "bg-[#2E5782]", border: "border-[#1D3D5C]"
    },
    {
      title: "Planetas Épicos",
      desc: "Cada nivel es un mundo nuevo por descubrir. Gana XP y desbloquea medallas únicas.",
      icon: <Globe className="w-10 h-10 text-white" />,
      bg: "bg-[#F56B1F]", border: "border-[#C4530D]"
    },
    {
      title: "Poder Neuronal",
      desc: "Ciencia avanzada aplicada al olvido. Las palabras se quedan en tu mente para siempre.",
      icon: <Zap className="w-10 h-10 text-white fill-current" />,
      bg: "bg-[#F56B1F]", border: "border-[#C4530D]"
    },
    {
      title: "Protagonismo Real",
      desc: "Nuestras lecciones son capítulos de una historia donde tú eres el héroe de la aventura.",
      icon: <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />,
      bg: "bg-[#2E5782]", border: "border-[#1D3D5C]"
    }
  ];

  return (
    <section className="border-b-2 border-[#E5E5E5] bg-white px-4 py-24 sm:px-6 sm:py-32 overflow-hidden">
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-20 text-center">
          <motion.h2 
            variants={fadeInUp} 
            className="mb-6 text-5xl font-black text-[#2E5782] sm:text-7xl font-handwritten"
          >
            ¿Por qué <span className="text-[#F56B1F]">Ling</span>?
          </motion.h2>
          <p className="mx-auto max-w-xl text-lg font-black uppercase tracking-[0.4em] text-[#AFAFAF] font-handwritten">
            El método definitivo
          </p>
        </div>
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              custom={i + 1}
              whileHover={{ y: -12, scale: 1.02, rotate: i % 2 === 0 ? 1 : -1, transition: { type: "spring", stiffness: 300 } }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.1}
              className="relative cursor-grab active:cursor-grabbing rounded-3xl border-2 border-[#E5E5E5] border-b-[12px] bg-white p-8 pt-16 transition-all hover:shadow-[0_30px_60px_rgba(46,87,130,0.2)] sm:p-10 sm:pt-20"
            >
              <div
                className={`absolute -top-8 left-8 flex h-16 w-16 items-center justify-center rounded-2xl border-b-6 sm:-top-10 sm:left-10 sm:h-20 sm:w-20 ${f.bg} ${f.border}`}
              >
                {f.icon}
              </div>
              <h3 className="mb-4 text-2xl font-black text-[#2E5782] sm:text-3xl font-handwritten">{f.title}</h3>
              <p className="text-lg font-bold leading-relaxed text-[#555555] sm:text-xl">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ── CURRICULUM ──────────────────────────────────────────────────
function CurriculumSection() {
  return (
    <section id="curriculum" className="border-b-2 border-[#E5E5E5] bg-[#F4F4F4]/50 px-4 py-24 sm:px-6 sm:py-32 overflow-hidden">
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        className="mx-auto max-w-5xl text-center"
      >
        <motion.h2 
          variants={fadeInUp} 
          className="mb-10 text-5xl font-black text-[#2E5782] sm:text-8xl font-handwritten"
        >
          6 Planetas. <motion.span className="text-[#F56B1F]" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} viewport={{ once:true }}>1 Destino.</motion.span>
        </motion.h2>
        <motion.p variants={fadeInUp} custom={1} className="mx-auto mb-24 max-w-2xl text-2xl font-bold text-[#555555] sm:text-3xl font-handwritten">Tu ruta hacia la maestría total.</motion.p>

        <div className="relative flex flex-col items-center gap-8 py-8">
          <motion.div 
            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} viewport={{ once: true }} style={{ transformOrigin: "top" }}
            className="absolute top-10 bottom-10 left-1/2 w-4 bg-[#E5E5E5] -mx-2 rounded-full z-0"
          />
          {PLANETS.map((planet, i) => {
            const offsetClass = i % 2 === 0 ? "md:-translate-x-32" : "md:translate-x-32";
            return (
              <motion.div 
                variants={popIn} custom={i + 2}
                key={planet.id} 
                animate={floatingAnimation}
                whileHover={{ scale: 1.25, rotate: i % 2 === 0 ? 5 : -5, transition: { type: "spring", stiffness: 400 } }}
                drag
                dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                dragElastic={0.4}
                className={`relative z-10 flex flex-col items-center cursor-grab active:cursor-grabbing ${offsetClass}`}
              >
                <motion.div 
                  whileHover={{ boxShadow: "0 0 30px rgba(46,87,130,0.6)" }}
                  className="w-24 h-24 mb-4 rounded-full bg-[#2E5782] border-b-4 border-[#1D3D5C] flex items-center justify-center text-5xl shadow-xl z-20 relative"
                >
                  {planet.icon}
                </motion.div>
                <div className="bg-white px-5 py-3 rounded-2xl border-2 border-[#E5E5E5] border-b-4 text-center min-w-[140px] shadow-md z-10 relative">
                  <span className="block text-sm font-extrabold text-[#F56B1F] uppercase tracking-widest mb-1">{planet.cefrLevel}</span>
                  <strong className="text-[#2E5782] text-xl font-extrabold">{planet.name}</strong>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

// ── PRICING ─────────────────────────────────────────────────────
function PricingSection() {
  const [yearly, setYearly] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuthStore();

  const handlePlanClick = async (tier: typeof SUBSCRIPTION_TIERS[number]) => {
    // Pure frontend: all plans lead to registration for now
    router.push("/register");
  };

  return (
    <section id="plans" className="border-b-2 border-[#E5E5E5] bg-white px-4 py-24 pb-32 sm:px-6 sm:py-32 sm:pb-40 overflow-hidden">
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-20 text-center">
          <motion.h2 
            variants={fadeInUp} 
            className="mb-6 text-4xl font-black text-[#2E5782] sm:text-6xl font-handwritten"
          >
            Nuestros <span className="text-[#F56B1F]">Planes</span>
          </motion.h2>
          <motion.div variants={fadeInUp} custom={1} className="inline-flex max-w-full rounded-2xl border-2 border-[#E5E5E5] bg-[#F4F4F4] p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`rounded-xl px-5 py-3 text-sm font-black uppercase tracking-widest transition-all ${
                !yearly ? "bg-[#2E5782] text-white shadow-lg" : "text-[#AFAFAF] hover:bg-white hover:text-[#2E5782]"
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`rounded-xl px-5 py-3 text-sm font-black uppercase tracking-widest transition-all ${
                yearly ? "bg-[#2E5782] text-white shadow-lg" : "text-[#AFAFAF] hover:bg-white hover:text-[#2E5782]"
              }`}
            >
              Anual -33%
            </button>
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SUBSCRIPTION_TIERS.map((tier, i) => {
            const recommended = tier.recommended;
            const borderCol = recommended ? "border-[#FFC800]" : "border-[#E5E5E5]";
            const btnClass = recommended
              ? "bg-[#F56B1F] border-[#C4530D] text-white hover:bg-[#E05C10] shadow-[0_10px_20px_rgba(245,107,31,0.2)]"
              : "bg-white border-[#E5E5E5] text-[#2E5782] hover:bg-[#F4F4F4]";
            return (
              <motion.div 
                key={tier.id} 
                variants={fadeInUp} custom={i + 2}
                whileHover={{ y: -15, scale: 1.05, rotate: i % 2 === 0 ? 1 : -1, zIndex: 10, transition: { type: "spring", stiffness: 300, damping: 15 } }}
                className={`bg-white rounded-3xl border-2 border-b-[12px] ${borderCol} overflow-hidden flex flex-col transition-all`}
              >
                {recommended && (
                  <div className="bg-[#FFC800] text-center font-black uppercase text-xs py-2.5 tracking-widest text-[#2E5782]">
                    Más Popular
                  </div>
                )}
                <div className="p-8 pb-6 text-center border-b-2 border-[#E5E5E5] bg-[#F4F4F4]/50">
                  <div className="text-6xl mb-4 flex justify-center drop-shadow-lg">{tier.icon}</div>
                  <h4 className="text-3xl font-black text-[#2E5782] mb-1 font-handwritten">{tier.name}</h4>
                  <p className="text-xs font-black uppercase tracking-widest text-[#AFAFAF]">{tier.tagline}</p>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="text-center mb-8">
                    <span className="text-5xl font-black text-[#2E5782]">
                       {tier.priceMonthly === 0 ? "¡Gratis!" : (
                        <span className="flex items-center justify-center gap-1">
                          <span className="text-3xl mt-1">$</span>
                          <span>{yearly ? Math.round(tier.priceYearly / 12) : tier.priceMonthly}</span>
                        </span>
                      )}
                    </span>
                    {tier.priceMonthly > 0 && <span className="text-[#F56B1F] font-black text-xl italic font-handwritten">/mes</span>}
                  </div>
                  <ul className="mb-10 space-y-5 flex-1">
                    {tier.features.slice(0, 4).map((feat, fi) => (
                      <li key={fi} className="flex gap-4 items-start">
                        <Check className={`w-6 h-6 shrink-0 ${recommended ? "text-[#F56B1F]" : "text-[#2E5782]"}`} strokeWidth={4} />
                        <span className="text-[#555555] font-bold leading-tight text-base">{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePlanClick(tier)}
                    className={`flex items-center justify-center gap-2 w-full rounded-2xl py-5 border-b-6 font-black uppercase tracking-widest active:border-b-0 active:translate-y-1 transition-all ${btnClass}`}
                  >
                    {tier.id === "free" ? "Empezar ya" : "Elegir plan"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

// ── FOOTER ──────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="border-t-2 border-[#E5E5E5] bg-[#F4F4F4]/30 px-4 py-20 sm:px-6 sm:py-24 md:px-10"
      style={{ paddingBottom: "max(4rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between gap-16 border-b-2 border-[#E5E5E5] pb-16 mb-12">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <Image src="/hero-mascot.png" alt="Ling" width={48} height={48} className="h-12 w-12 object-contain transition-transform group-hover:scale-110" />
              <span className="text-3xl font-black text-[#2E5782] tracking-tight font-handwritten">Ling</span>
            </Link>
            <p className="text-[#555555] font-bold text-lg leading-relaxed mb-6">Aprende inglés de forma divertida, gratis y 100% interactiva.</p>
            <div className="flex gap-4">
              {/* Placeholder for social links with consistent branding */}
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-xl bg-white border-2 border-[#E5E5E5] flex items-center justify-center text-[#AFAFAF] hover:text-[#2E5782] hover:border-[#2E5782] cursor-pointer transition-all">✨</div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { title: "Explora", links: ["Cursos", "Planetas", "Historias"] },
              { title: "Comunidad", links: ["Profesores", "Hubs", "Eventos"] },
              { title: "Nosotros", links: ["Misión", "Blog", "Prensa"] },
              { title: "Ayuda", links: ["Términos", "Privacidad", "FAQ"] },
            ].map((col) => (
              <div key={col.title}>
                <h5 className="font-black text-[#2E5782] uppercase tracking-[0.2em] mb-6 text-sm">{col.title}</h5>
                <ul className="space-y-4">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="font-bold text-[#777777] hover:text-[#F56B1F] transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-black text-[#AFAFAF] uppercase tracking-widest text-xs">© {new Date().getFullYear()} Ling — Hecho con ✨ por Alex Andrade</span>
          <div className="flex items-center gap-2 font-black text-[#2E5782] tracking-wider text-sm border-2 border-[#E5E5E5] bg-white rounded-2xl px-5 py-2.5 uppercase shadow-sm">
            <Globe className="w-4 h-4" />
            Español (Latam)
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── PAGE ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white font-handwritten text-[#4B4B4B] selection:bg-[#F56B1F] selection:text-white">
      <Navbar />
      <HeroSection />
      <ManifestoSection />
      <FeaturesSection />
      <CurriculumSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
