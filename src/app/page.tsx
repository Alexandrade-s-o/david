"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import { 
  Star, Rocket, BookOpen, Video, Trophy, 
  ChevronDown, Check, ArrowRight, Play, 
  Globe, Sparkles, Shield, User, Zap, GraduationCap, Languages, 
  ArrowUpRight, Info, LayoutTemplate, MessageSquare
} from "lucide-react";
import { SUBSCRIPTION_TIERS, PLANETS } from "@/types";

// ── UTILS: MOTION ───────────────────────────────────────────
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

// ── COMPONENTS: UI ──────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 font-bold">
      <div className={`max-w-7xl mx-auto flex items-center justify-between px-10 py-5 rounded-full transition-all duration-300 ${scrolled ? "bg-[#3b1482] shadow-2xl border-4 border-[#fbbf24]" : "bg-transparent"}`}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#fbbf24] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <Star className="w-6 h-6 text-[#2e1065] fill-[#2e1065]" />
          </div>
          <span className="text-white text-2xl font-black uppercase tracking-tight">Le Petit Anglais</span>
        </Link>

        <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-white">
          <Link href="/dashboard" className="hover:text-[#fbbf24] transition-colors">
            Dashboard
          </Link>
          <Link href="#method" className="hover:text-[#fbbf24] transition-colors relative group">
             The Academy
          </Link>
          <Link href="#curriculum" className="hover:text-[#fbbf24] transition-colors relative group">
             Planets
          </Link>
          <Link href="#plans" className="hover:text-[#fbbf24] transition-colors relative group">
             Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/register" className="bg-[#fbbf24] text-[#2e1065] text-xs font-black px-8 py-3.5 rounded-full hover:bg-white transition-all shadow-lg active:scale-95 uppercase tracking-widest">
            START NOW
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── SECTION: HERO (SOLID PURPLE) ─────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-32 pb-20 bg-[#2e1065] overflow-hidden font-bold">
      <div className="max-w-7xl mx-auto w-full relative z-10 text-center">
        <motion.div 
          {...fadeInUp}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-4 border-[#fbbf24] bg-transparent mb-16 text-[10px] font-black uppercase tracking-[0.5em] text-[#fbbf24] shadow-2xl"
        >
          <Sparkles className="w-5 h-5" />
          <span>Professional Academy — Version 2026.0</span>
        </motion.div>

        <motion.h1 
          {...fadeInUp}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-white text-6xl md:text-[11.5rem] font-black leading-[0.8] tracking-[-0.05em] mb-12 uppercase"
        >
          ENGLISH <br /> 
          <span className="text-[#fbbf24]">SPOKEN.</span>
        </motion.h1>

        <motion.p
          {...fadeInUp}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-white text-xl md:text-5xl max-w-5xl mx-auto mb-20 leading-tight font-black uppercase tracking-tighter italic"
        >
          No patterns. No noise. <br /> 
          Just the pure science of storytelling.
        </motion.p>

        <motion.div
           {...fadeInUp}
           transition={{ delay: 0.3, duration: 0.8 }}
           className="flex flex-col sm:flex-row items-center justify-center gap-8"
        >
           <Link href="/register" className="bg-[#fbbf24] text-[#2e1065] text-3xl font-black px-20 py-8 rounded-full hover:scale-105 transition-all shadow-3xl uppercase tracking-tighter">
             Initialize
           </Link>
           <Link href="/dashboard" className="flex items-center justify-center gap-4 px-12 py-8 rounded-full border-4 border-[#fbbf24] bg-transparent text-white font-black text-xl transition-all hover:bg-[#fbbf24] hover:text-[#2e1065] uppercase tracking-widest">
             <Play className="w-8 h-8 fill-current" />
             Demo
           </Link>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#fbbf24]"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-12 h-12" />
      </motion.div>
    </section>
  );
}

// ── SECTION: THE ARCHITECTURE (SOLID BOXES) ──────────────────

function ArchitectureSection() {
  const features = [
    { icon: <BookOpen className="w-8 h-8" />, title: "Story Mode", desc: "Master every planet through a galactic narrative. 100% Immersive. 100% Contextual." },
    { icon: <Video className="w-8 h-8" />, title: "Live Hubs", desc: "Speak directly with certified masters in HD satellite classrooms. Professional results." },
    { icon: <Globe className="w-8 h-8" />, title: "Global Lab", desc: "A connected galaxy of wanderers. Collaborate, learn, and grow your vocabulary every day." },
    { icon: <Trophy className="w-8 h-8" />, title: "Star XP", desc: "Gamify your progress. Climb the leaderboards, win stars, and unlock exclusive rewards." },
    { icon: <Shield className="w-8 h-8" />, title: "CEFR Orbit", desc: "A certified path from Rosetta (A1) to Earth (C2). Industry-standard tracking." },
    { icon: <Zap className="w-8 h-8" />, title: "Neural Flow", desc: "Spaced Repetition built-in. Review words exactly when your brain retention needs them." }
  ];

  return (
    <section className="py-60 px-6 bg-[#2e1065]" id="method">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-40 gap-10">
          <div>
            <h2 className="text-[#fbbf24] text-xs font-black uppercase tracking-[0.5em] mb-10 block underline decoration-4">The System</h2>
            <h3 className="text-white text-5xl md:text-[9rem] font-black leading-[0.85] tracking-tighter uppercase mb-4 italic">ACADEMY <br /> <span className="text-[#fbbf24]">BUILT.</span></h3>
          </div>
          <p className="text-white text-2xl font-black uppercase tracking-tighter md:text-right">
             SOLID PURPLE. <br /> SOLID IMPACT. // 2026.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {features.map((f, i) => (
             <motion.div 
               key={i}
               {...fadeInUp}
               className="p-12 rounded-[5rem] bg-[#3b1482] border-4 border-[#fbbf24]/20 group hover:border-[#fbbf24] transition-all shadow-3xl flex flex-col items-center text-center"
             >
                <div className="w-24 h-24 rounded-full bg-[#fbbf24] flex items-center justify-center mb-10 shadow-2xl group-hover:scale-110 transition-transform">
                   <div className="text-[#2e1065]">{f.icon}</div>
                </div>
                <h4 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">{f.title}</h4>
                <p className="text-white text-lg leading-relaxed font-black uppercase tracking-tight opacity-70">{f.desc}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}

// ── SECTION: CURRICULUM (PLANETS) ───────────────────────────

function CurriculumSection() {
  return (
    <section className="py-60 px-6 bg-[#2e1065]" id="curriculum">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-40">
           <h2 className="text-white text-6xl md:text-[10rem] font-black leading-none tracking-tighter uppercase italic shadow-black/20">STAGES OF <br /> <span className="text-[#fbbf24]">MASTERY.</span></h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
          {PLANETS.map((planet, i) => (
            <motion.div
              key={planet.id}
              whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 8 : -8 }}
              className="p-10 rounded-full bg-[#3b1482] border-4 border-[#fbbf24]/20 flex flex-col items-center hover:bg-[#fbbf24] group transition-all duration-300 shadow-3xl aspect-square justify-center"
            >
              <div className="text-7xl mb-8 group-hover:scale-110 transition-transform duration-500">
                {planet.icon}
              </div>
              <div className="text-center">
                <span className="text-[10px] font-black text-[#fbbf24] group-hover:text-[#2e1065] uppercase mb-1 block">{planet.cefrLevel}</span>
                <h4 className="text-white group-hover:text-[#2e1065] font-black text-[11px] uppercase tracking-widest">{planet.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SECTION: PRICING (SOLID & YELLOW) ────────────────────────

function PricingSection() {
  const [yearly, setYearly] = useState(true);

  return (
    <section className="py-60 px-6 bg-[#2e1065] border-t-4 border-[#fbbf24]" id="plans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-40">
          <h2 className="text-white text-5xl md:text-[12rem] font-black tracking-tighter uppercase mb-20 leading-none">THE PRICE <br /> <span className="text-[#fbbf24]">RANK.</span></h2>
          <div className="inline-flex p-3 bg-[#3b1482] rounded-full border-4 border-[#fbbf24]/20 shadow-3xl">
             <button onClick={() => setYearly(false)} className={`px-16 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all ${!yearly ? "bg-[#fbbf24] text-[#2e1065]" : "text-white"}`}>Monthly</button>
             <button onClick={() => setYearly(true)} className={`px-16 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all ${yearly ? "bg-[#fbbf24] text-[#2e1065]" : "text-white"}`}>Yearly (-33%)</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <motion.div 
              key={tier.id}
              whileHover={{ y: -20 }}
              className={`p-12 rounded-[5rem] flex flex-col items-center text-center transition-all duration-300 shadow-3xl border-4 ${
                tier.recommended ? "bg-white text-[#2e1065] border-[#fbbf24] scale-110 z-10" : "bg-[#3b1482] text-white border-[#fbbf24]/20"
              }`}
            >
              <div className="text-5xl mb-10">{tier.icon}</div>
              <h4 className="text-2xl font-black uppercase mb-1 tracking-tight">{tier.name}</h4>
              <p className={`text-[9px] font-black uppercase tracking-widest mb-14 opacity-50 ${tier.recommended ? "text-[#2e1065]" : "text-white"}`}>{tier.tagline}</p>
              
              <div className="mb-14">
                <span className="text-5xl font-black uppercase tracking-tighter leading-none">
                   {tier.priceMonthly === 0 ? "FREE" : `$${yearly ? Math.round(tier.priceYearly / 12) : tier.priceMonthly}`}
                </span>
                {tier.priceMonthly > 0 && <span className="text-xs font-black opacity-50 ml-1">/MO</span>}
              </div>

              <ul className="space-y-6 mb-24 flex-1 text-xs font-black uppercase tracking-tighter">
                {tier.features.slice(0, 4).map((f, fi) => (
                  <li key={fi} className="flex items-start justify-center gap-3">
                    <Check className={`w-5 h-5 shrink-0 mt-0.5 ${tier.recommended ? "text-blue-600" : "text-[#fbbf24]"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/register" 
                className={`w-full py-6 rounded-3xl font-black text-xs text-center uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                  tier.recommended 
                  ? "bg-[#2e1065] text-white hover:bg-[#fbbf24] hover:text-[#2e1065]" 
                  : "bg-[#fbbf24] text-[#2e1065] hover:bg-white"
                }`}
              >
                Join Now
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ──────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#2e1065] text-white py-60 px-10 border-t-8 border-[#fbbf24]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-40 mb-40 text-center md:text-left">
         <div className="max-w-md mx-auto md:mx-0">
            <div className="w-24 h-24 rounded-full bg-[#fbbf24] flex items-center justify-center mb-12 rotate-12 shadow-2xl mx-auto md:mx-0">
               <Star className="w-12 h-12 text-[#2e1065] fill-[#2e1065]" />
            </div>
            <h4 className="text-white text-8xl font-black mb-12 italic uppercase leading-none tracking-tighter">LPA <br /> <span className="text-[#fbbf24]">ACADEMY.</span></h4>
            <p className="text-white text-2xl font-black uppercase tracking-tighter leading-tight italic">
               THE INVISIBLE NOW VOICED. <br /> CORE SYSTEM ACTIVE // 2026.
            </p>
         </div>
         
         <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-16 text-left">
           {[
             { title: "Programs", links: ["All Courses", "Satellite क्लासेस", "Star Program", "Safety"] },
             { title: "Network", links: ["Community Hub", "Teachers", "For Teams", "Status"] },
             { title: "Company", links: ["Our Story", "The Fox Blog", "Careers", "Rose Lab"] },
             { title: "Legal", links: ["Privacy Policy", "Star Laws", "Security Hub", "Terms"] },
           ].map((col) => (
             <div key={col.title}>
               <h4 className="text-[#fbbf24] text-[10px] font-black uppercase tracking-[0.4em] mb-12">{col.title}</h4>
               <ul className="space-y-6">
                 {col.links.map((l) => (
                   <li key={l}>
                     <a href="#" className="font-black text-white hover:underline decoration-[#fbbf24] transition-all text-xs uppercase tracking-widest">{l}</a>
                   </li>
                 ))}
               </ul>
             </div>
           ))}
         </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 font-black uppercase text-[12px] tracking-[0.5em] text-[#fbbf24]">
         <p>© {new Date().getFullYear()} STARDUST LEARNING. PURE SOLID SYSTEM.</p>
         <div className="flex gap-16">
            <p>LATENCY: 12MS</p>
            <p>PLANET: EARTH (HQ)</p>
         </div>
      </div>
    </footer>
  );
}

// ── PAGE ───────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#2e1065] selection:bg-[#fbbf24] selection:text-[#2e1065] overflow-x-hidden font-bold">
      <Navbar />
      <HeroSection />
      <ArchitectureSection />
      <CurriculumSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
