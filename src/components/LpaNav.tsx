"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

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
              <Link
                key={href}
                href={href}
                className={`transition-colors hover:text-landing-text ${
                  isLinkActive(href, pathname) ? "text-landing-text" : ""
                }`}
              >
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
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-landing-border text-landing-text transition-colors active:bg-landing-surface lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X className="h-6 w-6" strokeWidth={2.5} />
              ) : (
                <Menu className="h-6 w-6" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer — always rendered so exit animation plays */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <button
          type="button"
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          aria-label="Cerrar menú"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />

        {/* Slide-in panel */}
        <div
          className={`absolute right-0 top-0 flex h-full w-[min(100%,18rem)] flex-col border-l-2 border-landing-border bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
        >
          {/* User info */}
          <div className="flex items-center gap-3 border-b border-landing-border px-4 pb-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-b-4 border-landing-yellowDark bg-landing-yellow text-sm font-black text-white">
              {firstName[0]}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-landing-text">{firstName}</p>
              <p className="text-xs font-semibold text-landing-faint">Mi cuenta</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-1 flex-col gap-1 p-4">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isLinkActive(href, pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-xl px-4 py-3.5 text-sm font-black uppercase tracking-widest transition-colors ${
                    active
                      ? "bg-landing-purple/10 text-landing-purple"
                      : "text-landing-text hover:bg-landing-surface active:bg-landing-surface"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
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
    </>
  );
}

export function LpaSubNav({ backHref, title }: { backHref: string; title: string }) {
  return (
    <nav className="sticky top-0 z-50 border-b-2 border-landing-border bg-white font-bold">
      <div
        className="mx-auto flex max-w-7xl items-center gap-2 py-2.5 sm:gap-4 sm:py-3"
        style={{
          paddingLeft: "max(0.75rem, env(safe-area-inset-left))",
          paddingRight: "max(0.75rem, env(safe-area-inset-right))",
        }}
      >
        <Link
          href={backHref}
          className="lpa-link flex shrink-0 items-center gap-1 text-sm active:opacity-70 sm:max-w-none"
        >
          ← Volver
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-center text-[11px] font-black uppercase tracking-tight text-landing-text sm:text-sm">
          {title}
        </h1>
        <Link href="/" className="flex shrink-0 items-center gap-2 active:opacity-70" aria-label="Inicio">
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
