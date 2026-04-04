"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { LpaSubNav } from "@/components/LpaNav";

const MOCK_CARDS = [
  { word: "journey", translation: "viaje", example: "The journey begins today." },
  { word: "wonder", translation: "asombro / maravilla", example: "She looked at the stars with wonder." },
  { word: "greeting", translation: "saludo", example: "A warm greeting opens every door." },
];

export default function VocabReviewPage() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = MOCK_CARDS[i % MOCK_CARDS.length];

  const next = () => {
    setFlipped(false);
    setI((n) => (n + 1) % MOCK_CARDS.length);
  };

  return (
    <div className="lpa-page flex flex-col">
      <LpaSubNav backHref="/dashboard" title="Vocab review" />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center p-6">
        <p className="lpa-muted mb-6 text-center">Tap the card to flip · sync comes with Firebase</p>

        <AnimatePresence mode="wait">
          <motion.button
            key={card.word}
            type="button"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={() => setFlipped(!flipped)}
            className="lpa-card-interactive flex min-h-[220px] w-full max-w-sm flex-col items-center justify-center border-[#fbbf24]/40 p-8 text-center focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
          >
            {!flipped ? (
              <>
                <span className="mb-4 text-[10px] font-black uppercase tracking-[0.35em] text-[#fbbf24]">
                  English
                </span>
                <span className="text-4xl font-black uppercase tracking-tight text-white">{card.word}</span>
                <span className="mt-6 text-[10px] font-black uppercase tracking-widest text-white/40">
                  Tap for translation
                </span>
              </>
            ) : (
              <>
                <span className="mb-4 text-[10px] font-black uppercase tracking-[0.35em] text-[#fbbf24]">
                  Translation
                </span>
                <span className="mb-4 text-3xl font-black uppercase tracking-tight text-white">{card.translation}</span>
                <p className="text-xs font-bold uppercase italic leading-relaxed text-white/60">
                  “{card.example}”
                </p>
              </>
            )}
          </motion.button>
        </AnimatePresence>

        <div className="mt-10 flex gap-3">
          <button type="button" onClick={next} className="lpa-btn-gold px-6 py-3 text-[10px]">
            Next word
          </button>
          <button
            type="button"
            onClick={() => setFlipped(false)}
            className="lpa-btn-outline px-4 py-3"
            title="Reset card"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
