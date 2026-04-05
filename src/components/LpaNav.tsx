"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/courses", label: "Cursos" },
  { href: "/classes", label: "En vivo" },
  { href: "/#plans", label: "Precios" },
] as const;

export function LpaDashboardNav({ firstName }: { firstName: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b-2 border-landing-border bg-white font-bold">
        <div
          className="mx-auto flex max-w-7xl items-center justify-between gap-2 py-2.5 sm:gap-4 sm:py-3"
          style={{
            paddingLeft: "max(0.75rem, env(safe-area-inset-left))",
            paddingRight: "max(0.75rem, env(safe-area-inset-right))",
          }}
        >
          <Link href="/" className="group flex min-w-0 shrink items-center gap-2 sm:gap-3">
            <Image
              src="/hero-mascot.png"
              alt="Ling"
              width={40}
              height={40}
              className="h-9 w-9 shrink-0 object-contain transition-transform group-hover:scale-110 sm:h-10 sm:w-10"
            />
            <span className="truncate text-base font-black uppercase tracking-tight text-landing-purple sm:text-lg md:text-2xl">
              Ling
            </span>
          </Link>

          <div className="hidden items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-landing-faint lg:flex xl:gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="transition-colors hover:text-landing-text">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/register"
              className="lpa-btn-gold hidden py-2.5 text-[10px] sm:inline-flex sm:px-5"
            >
              Comenzar
            </Link>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-b-4 border-landing-yellowDark bg-landing-yellow text-xs font-black text-white sm:h-10 sm:w-10 sm:text-sm">
              {firstName[0]}
            </div>
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-landing-border text-landing-text lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-6 w-6" strokeWidth={2.5} /> : <Menu className="h-6 w-6" strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-0 flex h-full w-[min(100%,18rem)] flex-col border-l-2 border-landing-border bg-white shadow-2xl"
            style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
          >
            <div className="flex flex-1 flex-col gap-1 p-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-xl px-4 py-3.5 text-sm font-black uppercase tracking-widest text-landing-text hover:bg-landing-surface"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/register"
                className="lpa-btn-gold mt-4 justify-center py-3.5 text-xs"
                onClick={() => setOpen(false)}
              >
                Comenzar
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function LpaSubNav({ backHref, title }: { backHref: string; title: string }) {
  return (
    <nav className="sticky top-0 z-50 border-b-2 border-landing-border bg-white font-bold">
      <div
        className="mx-auto flex max-w-7xl items-center gap-2 sm:gap-4 sm:py-3"
        style={{
          paddingLeft: "max(0.75rem, env(safe-area-inset-left))",
          paddingRight: "max(0.75rem, env(safe-area-inset-right))",
          paddingTop: "max(0.5rem, env(safe-area-inset-top))",
          paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
        }}
      >
        <Link href={backHref} className="lpa-link max-w-[28%] shrink-0 truncate sm:max-w-none">
          ← Volver
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-center text-[11px] font-black uppercase tracking-tight text-landing-text sm:text-sm">
          {title}
        </h1>
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Inicio">
          <Image
            src="/hero-mascot.png"
            alt="Ling"
            width={36}
            height={36}
            className="h-8 w-8 object-contain sm:h-9 sm:w-9"
          />
        </Link>
      </div>
    </nav>
  );
}
