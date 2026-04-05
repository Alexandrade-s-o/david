"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowLeft, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/courses", label: "Cursos" },
  { href: "/classes", label: "En vivo" },
  { href: "/#plans", label: "Precios" },
] as const;

function isLinkActive(href: string, pathname: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

export function LpaDashboardNav({ firstName }: { firstName: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b-2 border-landing-border bg-white font-handwritten">
        <div
          className="mx-auto flex max-w-7xl items-center justify-between gap-2 py-3 sm:gap-4 sm:py-4"
          style={{
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
          <Link href="/" className="group flex min-w-0 shrink items-center gap-2 sm:gap-4 transition-transform active:scale-95">
            <Image
              src="/hero-mascot.png"
              alt="Ling"
              width={48}
              height={48}
              className="h-10 w-10 shrink-0 object-contain transition-transform group-hover:scale-110 sm:h-12 sm:w-12"
            />
            <span className="truncate text-xl font-black text-landing-purple sm:text-2xl md:text-3xl">
              Ling
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-lg font-black text-landing-faint lg:flex xl:gap-10">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`transition-all hover:text-landing-purple hover:scale-110 ${
                  isLinkActive(href, pathname) ? "text-landing-purple" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/register"
              className="lpa-btn-gold hidden py-3 px-6 text-sm font-black lg:inline-flex"
            >
              Comenzar
            </Link>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-b-4 border-landing-yellowDark bg-landing-yellow text-sm font-black text-white sm:h-12 sm:w-12 sm:text-base shadow-sm">
              {firstName[0]}
            </div>
            <button
              type="button"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-landing-border text-landing-text transition-all active:scale-90 active:bg-landing-surface lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X className="h-7 w-7" strokeWidth={2.5} />
              ) : (
                <Menu className="h-7 w-7" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#2E5782]/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l-2 border-landing-border bg-white shadow-2xl will-change-transform"
              style={{ paddingTop: "max(2rem, env(safe-area-inset-top))" }}
            >
              <div className="flex items-center justify-between px-6 pb-6">
                 <div className="flex items-center gap-3">
                  <Image src="/hero-mascot.png" alt="Ling" width={36} height={36} className="h-9 w-9 object-contain" />
                  <span className="text-2xl font-black text-landing-purple font-handwritten">Menu</span>
                </div>
                <button 
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-landing-border text-landing-text transition-all active:scale-90"
                >
                  <X className="h-7 w-7" strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex items-center gap-4 border-b-2 border-landing-surface bg-landing-surface/30 px-6 py-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-b-4 border-landing-yellowDark bg-landing-yellow text-xl font-black text-white">
                  {firstName[0]}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-black text-landing-text font-handwritten">{firstName}</p>
                  <p className="text-sm font-bold text-landing-faint uppercase tracking-widest">Mi aventura</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-6">
                {NAV_LINKS.map(({ href, label }, i) => {
                  const active = isLinkActive(href, pathname);
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={href}
                        className={`group flex items-center justify-between rounded-3xl p-6 text-3xl font-black font-handwritten transition-all active:scale-95 ${
                          active
                            ? "bg-landing-purple/10 text-landing-purple"
                            : "text-[#AFAFAF] hover:text-landing-purple"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        <div className="flex items-center gap-6">
                          <span className="text-xl font-sans text-landing-faint/50">0{i+1}</span>
                          {label}
                        </div>
                        <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>→</motion.span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-auto border-t-2 border-landing-border bg-landing-surface/50 p-8">
                <Link
                  href="/register"
                  className="lpa-btn-gold w-full h-18 justify-center py-5 text-xl shadow-[0_15px_30px_rgba(245,107,31,0.2)]"
                  onClick={() => setOpen(false)}
                >
                  Continuar aventura
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function LpaSubNav({ backHref, title }: { backHref: string; title: string }) {
  return (
    <nav className="sticky top-0 z-50 border-b-2 border-landing-border bg-white font-handwritten">
      <div
        className="mx-auto flex max-w-7xl items-center gap-4 py-3 sm:gap-6 sm:py-4"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <Link
          href={backHref}
          className="lpa-link flex shrink-0 items-center gap-2 text-lg font-black transition-transform active:scale-90"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver</span>
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-center text-lg font-black text-landing-text sm:text-2xl">
          {title}
        </h1>
        <Link href="/" className="flex shrink-0 items-center gap-2 transition-transform active:scale-90" aria-label="Inicio">
          <Image
            src="/hero-mascot.png"
            alt="Ling"
            width={40}
            height={40}
            className="h-10 w-10 object-contain sm:h-12 sm:w-12"
          />
        </Link>
      </div>
    </nav>
  );
}
