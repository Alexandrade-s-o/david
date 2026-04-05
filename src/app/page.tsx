"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Play, Globe, MessageCircle, Zap, Shield, Loader2, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  hidden: { opacity: 0, scale: 0.8 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: custom * 0.1, duration: 0.6, type: "spring", bounce: 0.5 },
  }),
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
    "inline-flex items-center justify-center font-extrabold uppercase tracking-widest text-white bg-[#F56B1F] border-b-4 border-[#C4530D] hover:bg-[#E05C10] rounded-2xl active:border-b-0 active:translate-y-1 transition-all px-6 py-3 " +
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

const ButtonNavy = ({ children, href, className = "" }: { children: React.ReactNode; href?: string; className?: string }) => {
  const base =
    "inline-flex items-center justify-center font-extrabold uppercase tracking-widest text-white bg-[#2E5782] border-b-4 border-[#1D3D5C] hover:bg-[#141F57] rounded-2xl active:border-b-0 active:translate-y-1 transition-all px-6 py-3 " +
    className;
  if (href) return <Link href={href} className={base}>{children}</Link>;
  return <button type="button" className={base}>{children}</button>;
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
    "inline-flex items-center justify-center font-extrabold uppercase tracking-widest text-[#AFAFAF] hover:bg-[#F4F4F4] hover:text-[#2E5782] rounded-2xl transition-all px-6 py-3 " +
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
    "inline-flex items-center justify-center font-extrabold uppercase tracking-widest text-[#2E5782] border-2 border-[#E5E5E5] border-b-4 hover:bg-[#F4F4F4] hover:border-[#D4D4D4] rounded-2xl active:border-b-2 active:translate-y-[2px] transition-all px-6 py-3 " +
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

          <div className="hidden items-center gap-6 md:flex">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-extrabold uppercase tracking-widest text-[#AFAFAF] transition-colors hover:text-[#2E5782]"
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
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute right-0 top-0 flex h-full w-[min(100%,19rem)] flex-col border-l-2 border-[#E5E5E5] bg-white shadow-2xl"
            style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
          >
            <div className="flex flex-1 flex-col gap-1 p-4">
              {links.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-xl px-4 py-3.5 text-sm font-extrabold uppercase tracking-widest text-[#2E5782] hover:bg-[#F4F4F4]"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t-2 border-[#E5E5E5] pt-4">
                <ButtonGhost href="/login" className="w-full justify-center py-3 text-sm" onClick={() => setOpen(false)}>
                  Ingresar
                </ButtonGhost>
                <ButtonOrange href="/register" className="w-full justify-center py-3 text-sm" onClick={() => setOpen(false)}>
                  Empieza ya
                </ButtonOrange>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}

// ── HERO ────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative border-b-2 border-[#E5E5E5] bg-white pb-16 pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pb-20 sm:pt-32 md:pb-24 md:pt-40 overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 relative z-10">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-20">
          <div className="flex-1 text-center md:text-left">
            <motion.h1 
              initial="hidden" animate="visible" variants={fadeInUp}
              className="mb-6 text-3xl font-extrabold leading-[1.12] tracking-tight text-[#2E5782] sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Aprende inglés de forma{" "}
              <motion.span 
                initial={{ rotate: -5, scale: 0.8, opacity: 0 }} 
                animate={{ rotate: 0, scale: 1, opacity: 1 }} 
                transition={{ delay: 0.3, type: "spring", bounce: 0.6 }} 
                className="text-[#F56B1F] inline-block font-handwritten italic text-[1.25em] -mb-2"
              >
                divertida
              </motion.span>{" "}
              y natural.
            </motion.h1>
            <motion.p 
              initial="hidden" animate="visible" custom={1} variants={fadeInUp}
              className="mx-auto mb-10 max-w-md text-base font-bold leading-relaxed text-[#777777] sm:text-lg md:mx-0 md:text-xl"
            >
              Aprender un idioma no debe ser aburrido. Sumérgete en historias, practica con profesores reales y sube de nivel todos los días.
            </motion.p>
            <motion.div 
              initial="hidden" animate="visible" custom={2} variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
            >
              <ButtonOrange href="/register" className="w-full sm:w-auto text-lg px-10 py-4">Empieza tu viaje</ButtonOrange>
              <ButtonOutline href="/dashboard" className="w-full sm:w-auto text-lg px-8 py-4">
                <Play className="h-5 w-5 mr-2 fill-current" />
                Ver demo
              </ButtonOutline>
            </motion.div>
          </div>

          <motion.div 
            initial="hidden" animate="visible" custom={3} variants={popIn}
            className="mt-2 flex flex-1 justify-center md:mt-0 relative"
          >
            <div className="absolute -inset-10 bg-[#FFC800]/20 rounded-full blur-[80px] -z-10 mix-blend-multiply opacity-50" />
            <div className="relative w-full max-w-[min(100%,20rem)] drop-shadow-xl sm:max-w-xs md:w-[420px] md:max-w-none">
              <Image
                src="/hero-mascot.png"
                alt="Mascota Ling"
                width={420}
                height={420}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── MANIFESTO ───────────────────────────────────────────────────
function ManifestoSection() {
  return (
    <section id="method" className="border-b-2 border-[#E5E5E5] bg-white px-4 py-16 sm:px-6 sm:py-24 overflow-hidden">
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-4xl text-center flex flex-col items-center"
      >
        <motion.span 
          variants={fadeInUp}
          className="inline-flex items-center gap-2 mb-6 uppercase tracking-[0.2em] font-extrabold text-[#777777] border-2 border-[#E5E5E5] bg-[#F4F4F4] rounded-full px-5 py-2 text-sm"
        >
          ✨ Nuestra Filosofía
        </motion.span>
        <motion.h2 
          variants={fadeInUp} custom={1}
          className="mb-8 text-2xl font-extrabold leading-tight text-[#2E5782] sm:text-3xl md:text-5xl"
        >
          Las reglas gramaticales no te dan fluidez.
          <br className="hidden sm:block" />
          <motion.span 
            initial={{ rotate: 5, scale: 0.9, opacity: 0 }} 
            whileInView={{ rotate: -2, scale: 1, opacity: 1 }} 
            transition={{ delay: 0.4, type: "spring", bounce: 0.6 }}
            viewport={{ once: true }}
            className="text-[#F56B1F] inline-block font-handwritten italic mt-2 text-[1.4em] px-2"
          >
            Las historias sí.
          </motion.span>
        </motion.h2>
        <motion.p 
          variants={fadeInUp} custom={2}
          className="mx-auto max-w-2xl text-base font-bold leading-relaxed text-[#777777] sm:text-lg md:text-xl"
        >
          Toda nuestra academia gira en torno a esta idea. Aprenderás inmerso en relatos donde cada decisión se siente como un juego real.
        </motion.p>
      </motion.div>
    </section>
  );
}

// ── FEATURES ────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      title: "Modo Historia",
      desc: "Toma decisiones en inglés dentro de relatos interactivos increíbles.",
      icon: <Globe className="w-10 h-10 text-white" />,
      bg: "bg-[#F56B1F]", border: "border-[#C4530D]"
    },
    {
      title: "Hubs en Vivo",
      desc: "Profesores reales en sesiones HD que te corrigen al instante de forma amigable.",
      icon: <MessageCircle className="w-10 h-10 text-white fill-current" />,
      bg: "bg-[#2E5782]", border: "border-[#1D3D5C]"
    },
    {
      title: "Flujo Neuronal",
      desc: "Las palabras regresan a ti antes de olvidarlas. Ciencia pura aplicada al inglés.",
      icon: <Zap className="w-10 h-10 text-white fill-current" />,
      bg: "bg-[#F56B1F]", border: "border-[#C4530D]"
    },
    {
      title: "Niveles CEFR",
      desc: "Seis planetas alineados con estándares internacionales, desde A1 hasta C2.",
      icon: <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />,
      bg: "bg-[#2E5782]", border: "border-[#1D3D5C]"
    }
  ];

  return (
    <section className="border-b-2 border-[#E5E5E5] bg-white px-4 py-16 sm:px-6 sm:py-24 overflow-hidden">
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-12 text-center sm:mb-16">
          <motion.h2 variants={fadeInUp} className="text-2xl font-extrabold text-[#2E5782] sm:text-3xl md:text-5xl">Por qué funciona</motion.h2>
        </div>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              custom={i + 1}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="relative cursor-default rounded-3xl border-2 border-[#E5E5E5] border-b-8 bg-white p-6 pt-12 transition-shadow hover:shadow-xl sm:p-8 sm:pt-14"
            >
              <div
                className={`absolute -top-6 left-6 flex h-14 w-14 items-center justify-center rounded-2xl border-b-4 sm:-top-8 sm:left-8 sm:h-16 sm:w-16 ${f.bg} ${f.border}`}
              >
                {f.icon}
              </div>
              <h3 className="mb-2 text-xl font-extrabold text-[#2E5782] sm:mb-3 sm:text-2xl">{f.title}</h3>
              <p className="text-base font-bold leading-relaxed text-[#777777] sm:text-lg">{f.desc}</p>
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
    <section id="curriculum" className="border-b-2 border-[#E5E5E5] bg-white px-4 py-16 sm:px-6 sm:py-24 overflow-hidden">
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        className="mx-auto max-w-4xl text-center"
      >
        <motion.h2 variants={fadeInUp} className="mb-4 text-2xl font-extrabold text-[#2E5782] sm:text-3xl md:text-5xl">
          6 Planetas. <motion.span className="font-handwritten italic text-[#F56B1F] text-[1.25em]" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} viewport={{ once:true }}>1 Destino.</motion.span>
        </motion.h2>
        <motion.p variants={fadeInUp} custom={1} className="mb-12 text-base font-bold text-[#777777] sm:mb-16 sm:text-lg md:text-xl">Tu ruta estructurada hacia el dominio del inglés.</motion.p>

        <div className="relative flex flex-col items-center gap-8 py-8">
          <motion.div 
            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} viewport={{ once: true }} style={{ transformOrigin: "top" }}
            className="absolute top-10 bottom-10 left-1/2 w-4 bg-[#E5E5E5] -mx-2 rounded-full z-0"
          />
          {PLANETS.map((planet, i) => {
            const offsetClass = i % 2 === 0 ? "md:-translate-x-24" : "md:translate-x-24";
            return (
              <motion.div 
                variants={popIn} custom={i + 2}
                key={planet.id} 
                className={`relative z-10 flex flex-col items-center cursor-default transition-transform hover:scale-110 ${offsetClass}`}
              >
                <div className="w-24 h-24 mb-4 rounded-full bg-[#2E5782] border-b-4 border-[#1D3D5C] flex items-center justify-center text-5xl shadow-lg">
                  {planet.icon}
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl border-2 border-[#E5E5E5] border-b-4 text-center min-w-[140px] shadow-sm">
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
    // Free plan → go to register
    if (tier.priceMonthly === 0) {
      router.push("/register");
      return;
    }

    // Paid plan → Stripe checkout
    const priceId = yearly ? tier.stripePriceIdYearly : tier.stripePriceIdMonthly;
    setLoadingPlan(tier.id);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, userId: user?.uid }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Error al crear sesión de pago");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("[Checkout]", err);
      alert("No se pudo iniciar el pago. Intenta de nuevo.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="plans" className="border-b-2 border-[#E5E5E5] bg-white px-4 py-16 pb-24 sm:px-6 sm:py-24 sm:pb-32 overflow-hidden">
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-10 text-center sm:mb-12">
          <motion.h2 variants={fadeInUp} className="mb-6 text-2xl font-extrabold text-[#2E5782] sm:mb-8 sm:text-3xl md:text-5xl">Nuestros Planes</motion.h2>
          <motion.div variants={fadeInUp} custom={1} className="inline-flex max-w-full rounded-2xl border-2 border-[#E5E5E5] bg-[#F4F4F4] p-1">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`rounded-xl px-3 py-2.5 text-xs font-extrabold uppercase tracking-widest transition-all sm:px-6 sm:py-3 sm:text-sm ${
                !yearly ? "bg-[#2E5782] text-white" : "text-[#AFAFAF] hover:bg-white hover:text-[#2E5782]"
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`rounded-xl px-3 py-2.5 text-xs font-extrabold uppercase tracking-widest transition-all sm:px-6 sm:py-3 sm:text-sm ${
                yearly ? "bg-[#2E5782] text-white" : "text-[#AFAFAF] hover:bg-white hover:text-[#2E5782]"
              }`}
            >
              Anual -33%
            </button>
          </motion.div>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {SUBSCRIPTION_TIERS.map((tier, i) => {
            const recommended = tier.recommended;
            const isLoading = loadingPlan === tier.id;
            const borderCol = recommended ? "border-[#F56B1F]" : "border-[#E5E5E5]";
            const btnClass = recommended
              ? "bg-[#F56B1F] border-[#C4530D] text-white hover:bg-[#E05C10]"
              : "bg-white border-[#E5E5E5] text-[#2E5782] hover:bg-[#F4F4F4]";
            return (
              <motion.div 
                key={tier.id} 
                variants={fadeInUp} custom={i + 2}
                whileHover={{ y: -8 }}
                className={`bg-white rounded-3xl border-2 border-b-8 ${borderCol} overflow-hidden flex flex-col hover:shadow-xl transition-shadow`}
              >
                {recommended && (
                  <div className="bg-[#F56B1F] text-center font-extrabold uppercase text-sm py-2 tracking-widest text-white">
                    Recomendado
                  </div>
                )}
                <div className="p-6 pb-4 text-center border-b-2 border-[#E5E5E5] bg-[#F4F4F4]">
                  <div className="text-5xl mb-4 flex justify-center">{tier.icon}</div>
                  <h4 className="text-2xl font-extrabold text-[#2E5782] mb-1">{tier.name}</h4>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-[#AFAFAF]">{tier.tagline}</p>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-center mb-8">
                    <span className="text-4xl font-extrabold text-[#2E5782]">
                       {tier.priceMonthly === 0 ? "Gratis" : (
                        <span className="flex items-center justify-center gap-1">
                          <span className="text-2xl mt-1">$</span>
                          <span>{yearly ? Math.round(tier.priceYearly / 12) : tier.priceMonthly}</span>
                        </span>
                      )}
                    </span>
                    {tier.priceMonthly > 0 && <span className="text-[#F56B1F] font-extrabold text-xl">/mes</span>}
                  </div>
                  <ul className="mb-8 space-y-4 flex-1">
                    {tier.features.slice(0, 4).map((feat, fi) => (
                      <li key={fi} className="flex gap-3 items-start">
                        <Check className={`w-6 h-6 shrink-0 ${recommended ? "text-[#F56B1F]" : "text-[#2E5782]"}`} strokeWidth={4} />
                        <span className="text-[#777777] font-bold leading-tight text-[15px]">{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePlanClick(tier)}
                    disabled={isLoading}
                    className={`flex items-center justify-center gap-2 w-full rounded-2xl py-4 border-b-4 font-extrabold uppercase tracking-widest active:border-b-0 active:translate-y-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${btnClass}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Procesando…
                      </>
                    ) : tier.priceMonthly === 0 ? "Comenzar gratis" : "Suscribirse"}
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
      className="border-t-2 border-[#E5E5E5] bg-white px-4 py-12 sm:px-6 sm:py-16 md:px-10"
      style={{ paddingBottom: "max(3rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between gap-12 border-b-2 border-[#E5E5E5] pb-12 mb-8">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image src="/hero-mascot.png" alt="Ling" width={40} height={40} className="h-10 w-10 object-contain" />
              <span className="text-xl font-extrabold text-[#2E5782] tracking-tight">Ling</span>
            </Link>
            <p className="text-[#777777] font-bold leading-relaxed">Aprende idiomas de forma divertida, gratis y 100% interactiva.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Aprende", links: ["Cursos", "Clases", "Niveles"] },
              { title: "Comunidad", links: ["Foros", "Profesores", "Hubs"] },
              { title: "Compañía", links: ["Nosotros", "Blog", "Empleos"] },
              { title: "Legal", links: ["Términos", "Privacidad", "Seguridad"] },
            ].map((col) => (
              <div key={col.title}>
                <h5 className="font-extrabold text-[#AFAFAF] uppercase tracking-widest mb-4">{col.title}</h5>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="font-bold text-[#777777] hover:text-[#1A2A6C] transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-extrabold text-[#AFAFAF] uppercase tracking-widest text-sm">© {new Date().getFullYear()} Ling</span>
          <span className="font-extrabold text-[#1A2A6C] tracking-wider text-sm border-2 border-[#E5E5E5] bg-[#F4F4F4] rounded-xl px-4 py-2 uppercase">Español</span>
        </div>
      </div>
    </footer>
  );
}

// ── PAGE ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-[#4B4B4B] selection:bg-[#F56B1F] selection:text-white">
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
