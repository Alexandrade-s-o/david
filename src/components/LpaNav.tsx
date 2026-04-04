"use client";

import Link from "next/link";
import { Star } from "lucide-react";

export function LpaDashboardNav({ firstName }: { firstName: string }) {
  return (
    <nav className="sticky top-0 z-50 px-4 py-6 font-bold">
      <div className="mx-auto max-w-7xl lpa-nav-shell">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fbbf24] shadow-lg transition-transform group-hover:rotate-12">
            <Star className="h-6 w-6 fill-[#2e1065] text-[#2e1065]" />
          </div>
          <span className="hidden text-lg font-black uppercase tracking-tight text-white sm:inline md:text-2xl">
            Le Petit Anglais
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white lg:flex">
          <Link href="/courses" className="transition-colors hover:text-[#fbbf24]">
            Courses
          </Link>
          <Link href="/classes" className="transition-colors hover:text-[#fbbf24]">
            Live
          </Link>
          <Link href="/#plans" className="transition-colors hover:text-[#fbbf24]">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="lpa-btn-gold hidden py-2.5 text-[10px] sm:inline-flex sm:px-5"
          >
            Start now
          </Link>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#fbbf24]/50 bg-[#fbbf24] text-sm font-black text-[#2e1065]">
            {firstName[0]}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function LpaSubNav({ backHref, title }: { backHref: string; title: string }) {
  return (
    <nav className="sticky top-0 z-50 px-4 py-6 font-bold">
      <div className="mx-auto max-w-7xl lpa-nav-shell">
        <Link href={backHref} className="lpa-link shrink-0">
          ← Back
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-center text-xs font-black uppercase tracking-tight text-white sm:text-sm">
          {title}
        </h1>
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Home">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fbbf24]">
            <Star className="h-4 w-4 fill-[#2e1065] text-[#2e1065]" />
          </div>
        </Link>
      </div>
    </nav>
  );
}
