"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Chrome, Rocket, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const goDemo = () => {
    toast.success("Welcome to the design preview!");
    router.push("/dashboard");
  };

  return (
    <div className="lpa-page relative flex items-center justify-center p-4">
      <div className="stars-bg pointer-events-none absolute inset-0 opacity-40" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="lpa-card p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#fbbf24] shadow-lg">
              <Star className="h-8 w-8 fill-[#2e1065] text-[#2e1065]" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">Sign in</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/55">
              Firebase later — demo opens the full UI.
            </p>
          </div>

          <button type="button" onClick={goDemo} className="lpa-btn-gold mb-4 w-full justify-center py-3.5 text-sm">
            <Rocket className="h-5 w-5" />
            Open dashboard (demo)
          </button>

          <button
            type="button"
            disabled
            className="mb-6 w-full cursor-not-allowed rounded-full border-4 border-[#fbbf24]/25 py-3 text-xs font-black uppercase tracking-widest text-white/35"
          >
            <span className="flex items-center justify-center gap-2">
              <Chrome className="h-5 w-5" />
              Google (Firebase first)
            </span>
          </button>

          <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/50">
            New here?{" "}
            <Link href="/register" className="text-[#fbbf24] transition-colors hover:text-white">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
