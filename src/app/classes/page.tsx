"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Video } from "lucide-react";
import type { LiveClass } from "@/types";
import { LpaSubNav } from "@/components/LpaNav";

const mockRows: Partial<LiveClass>[] = [
  {
    id: "l1",
    title: "Travel Vocabulary Workshop",
    teacherName: "Ms. Emma Wells",
    type: "group",
    scheduledAt: new Date(Date.now() + 3600000 * 2),
    durationMinutes: 60,
    cefrLevel: "A2",
  },
  {
    id: "l2",
    title: "1-on-1 Conversation Practice",
    teacherName: "Mr. James Holt",
    type: "one_on_one",
    scheduledAt: new Date(Date.now() + 3600000 * 5),
    durationMinutes: 45,
    cefrLevel: "B1",
  },
];

export default function ClassesPage() {
  return (
    <div className="lpa-page">
      <LpaSubNav backHref="/dashboard" title="Live classes" />

      <div className="mx-auto max-w-2xl px-4 pb-16">
        <p className="lpa-muted mb-6 text-center">
          Join a session — classroom opens in preview if Agora is not configured.
        </p>
        <ul className="space-y-4">
          {mockRows.map((row, i) => (
            <motion.li
              key={row.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/classroom/${row.id}`}
                className="lpa-card-interactive flex items-center gap-4 rounded-[2rem] p-5"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[#fbbf24]/40 bg-[#2e1065]">
                  <Video className="h-7 w-7 text-[#fbbf24]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-black uppercase tracking-tight text-white">{row.title}</h2>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/45">
                    {row.teacherName} · {row.cefrLevel} · {row.durationMinutes} min
                  </p>
                </div>
                <span className="lpa-btn-gold shrink-0 py-2.5 px-4 text-[10px]">Join</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
