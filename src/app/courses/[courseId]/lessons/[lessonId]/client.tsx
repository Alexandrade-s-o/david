"use client";

/**
 * Interactive Lesson Player
 * Renders lesson content blocks and exercises dynamically.
 * Tracks progress and awards XP on completion.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Star, Volume2, Check, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

// ── MOCK LESSON (replace with Firestore fetch) ─────────────────
const MOCK_LESSON = {
  id: "lesson-1",
  title: "Greetings & Introductions",
  type: "vocabulary" as const,
  xpReward: 50,
  estimatedMinutes: 10,
  content: {
    introduction: "On Planet Rose, every conversation begins with a smile. Let's learn how to greet people in English.",
    blocks: [
      { id: "b1", type: "story_panel", data: { text: "The Little Prince landed on a new planet. A kind stranger approached him...", image: "/illustrations/greeting.svg" }, order: 1 },
      { id: "b2", type: "vocabulary_card", data: { word: "Hello", translation: "Hola", pronunciation: "/həˈloʊ/", example: "Hello! My name is Sophie.", audioUrl: "/audio/hello.mp3" }, order: 2 },
      { id: "b3", type: "vocabulary_card", data: { word: "Goodbye", translation: "Adiós", pronunciation: "/ˌɡʊdˈbaɪ/", example: "Goodbye! See you tomorrow.", audioUrl: "/audio/goodbye.mp3" }, order: 3 },
      { id: "b4", type: "grammar_rule", data: { rule: "To introduce yourself in English:", examples: ["My name is ___.", "I am ___.", "Nice to meet you!"] }, order: 4 },
    ],
    exercises: [
      {
        id: "ex1",
        type: "multiple_choice" as const,
        question: "Which is the correct greeting in English?",
        instruction: "Choose the correct answer.",
        data: { options: ["Hola", "Hello", "Bonjour", "Ciao"] },
        correctAnswer: "Hello",
        explanation: "'Hello' is the standard English greeting. 'Hola' is Spanish, 'Bonjour' is French, and 'Ciao' is Italian.",
        xpReward: 10,
      },
      {
        id: "ex2",
        type: "fill_blank" as const,
        question: "Complete: ___ name is Sophie.",
        instruction: "Type the missing word.",
        data: { hint: "possessive pronoun" },
        correctAnswer: "my",
        explanation: "We use 'My' to say our name: 'My name is...'",
        xpReward: 10,
      },
      {
        id: "ex3",
        type: "fill_blank" as const,
        question: "Complete the phrase: Nice to ___ you!",
        instruction: "Type the missing word (lowercase).",
        data: { hint: "verb" },
        correctAnswer: "meet",
        explanation: "The polite phrase when you first meet someone is 'Nice to meet you!'",
        xpReward: 15,
      },
    ],
  },
};

// ── VOCAB CARD ─────────────────────────────────────────────────
function VocabCard({ data }: { data: { word: string; translation: string; pronunciation: string; example: string; audioUrl: string } }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="cursor-pointer perspective-1000"
      onClick={() => setFlipped(!flipped)}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="relative w-full h-48 preserve-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center rounded-3xl border-2 border-landing-yellowDark border-b-8 bg-gradient-to-br from-landing-yellow to-amber-400 p-6 shadow-md">
          <div className="mb-2 font-display text-4xl font-black uppercase text-landing-text">{data.word}</div>
          <div className="font-handwritten text-xl text-landing-text/80">{data.pronunciation}</div>
          <button
            onClick={(e) => { e.stopPropagation(); /* play audio */ }}
            className="mt-3 rounded-full bg-white/40 p-3 transition-colors hover:bg-white/60 active:bg-white/80"
          >
            <Volume2 className="h-5 w-5 text-landing-purple" />
          </button>
          <div className="absolute bottom-3 right-4 text-xs font-black uppercase tracking-wider text-landing-text/70">Tap to flip</div>
        </div>

        <div
          className="absolute inset-0 backface-hidden flex flex-col items-center justify-center rounded-3xl border-2 border-landing-border border-b-8 bg-white p-6 shadow-card"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="mb-2 font-display text-3xl font-black text-landing-text">{data.translation}</div>
          <p className="text-center text-sm font-bold uppercase italic text-landing-muted">&quot;{data.example}&quot;</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MULTIPLE CHOICE EXERCISE ──────────────────────────────────
function MultipleChoiceExercise({
  exercise,
  onAnswer,
}: {
  exercise: typeof MOCK_LESSON.content.exercises[0];
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const options = (exercise.data as any).options as string[];

  const handleSelect = (option: string) => {
    if (submitted) return;
    setSelected(option);
  };

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    const correct = selected === exercise.correctAnswer;
    setTimeout(() => onAnswer(correct), 1200);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-black uppercase tracking-tight text-landing-text md:text-xl">{exercise.question}</h3>
      <p className="text-xs font-black uppercase tracking-wider text-landing-muted">{exercise.instruction}</p>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selected === option;
          const isCorrect  = submitted && option === exercise.correctAnswer;
          const isWrong    = submitted && isSelected && option !== exercise.correctAnswer;

          return (
            <motion.button
              key={option}
              whileTap={!submitted ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(option)}
              className={`rounded-2xl border-4 p-4 text-left text-sm font-black uppercase tracking-tight transition-all ${
                isCorrect
                  ? "border-green-400 bg-green-500/20 text-green-200"
                  : isWrong
                  ? "border-red-400 bg-red-500/20 text-red-200"
                  : isSelected
                  ? "border-landing-purple bg-landing-surface text-landing-purple"
                  : "border-landing-border bg-white text-landing-text hover:border-landing-purple/50"
              }`}
            >
              <span className="flex items-center gap-2">
                {isCorrect && <Check className="w-4 h-4 text-green-500" />}
                {isWrong && <X className="w-4 h-4 text-red-500" />}
                {option}
              </span>
            </motion.button>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="lpa-btn-gold mt-2 w-full justify-center disabled:opacity-40"
        >
          Check answer
        </button>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border-4 p-4 ${
            selected === exercise.correctAnswer
              ? "border-green-400/60 bg-green-500/15"
              : "border-red-400/60 bg-red-500/15"
          }`}
        >
          <div className={`mb-1 text-sm font-black uppercase ${selected === exercise.correctAnswer ? "text-green-200" : "text-red-200"}`}>
            {selected === exercise.correctAnswer ? "Correct!" : "Keep going!"}
          </div>
          <p className="text-xs font-bold uppercase leading-relaxed text-landing-muted">{exercise.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}

// ── FILL IN THE BLANK ─────────────────────────────────────────
function FillBlankExercise({
  exercise,
  onAnswer,
}: {
  exercise: typeof MOCK_LESSON.content.exercises[0];
  onAnswer: (correct: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!value.trim()) return;
    setSubmitted(true);
    const correct = value.trim().toLowerCase() === (exercise.correctAnswer as string).toLowerCase();
    setTimeout(() => onAnswer(correct), 1200);
  };

  const isCorrect = submitted && value.trim().toLowerCase() === (exercise.correctAnswer as string).toLowerCase();

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-black uppercase tracking-tight text-landing-text md:text-xl">{exercise.question}</h3>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={submitted}
        placeholder="Your answer..."
        className={`lpa-input text-center text-lg font-black uppercase ${
          submitted
            ? isCorrect
              ? "border-green-400 bg-green-500/10"
              : "border-amber-400 bg-amber-500/10"
            : ""
        }`}
      />

      {!submitted && (
        <button onClick={handleSubmit} disabled={!value.trim()} className="lpa-btn-gold w-full justify-center disabled:opacity-40">
          Check answer
        </button>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border-4 p-4 ${isCorrect ? "border-green-400/60 bg-green-500/15" : "border-amber-400/60 bg-amber-500/15"}`}
        >
          <div className={`mb-1 text-sm font-black uppercase ${isCorrect ? "text-green-200" : "text-amber-200"}`}>
            {isCorrect ? "Perfect!" : `Answer: "${exercise.correctAnswer}"`}
          </div>
          <p className="text-xs font-bold uppercase leading-relaxed text-landing-muted">{exercise.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}

// ── MAIN LESSON PAGE ──────────────────────────────────────────
export default function LessonPage({
  params: { courseId, lessonId },
}: {
  params: { courseId: string; lessonId: string };
}) {
  const lesson = MOCK_LESSON;

  const [step, setStep]           = useState(0); // 0 = content blocks, then exercises
  const [xpEarned, setXpEarned]   = useState(0);
  const [score, setScore]         = useState(0);
  const [correct, setCorrect]     = useState(0);
  const [completed, setCompleted] = useState(false);

  const totalSteps = lesson.content.blocks.length + lesson.content.exercises.length;
  const progress   = Math.round((step / totalSteps) * 100);
  const isOnBlock  = step < lesson.content.blocks.length;
  const exerciseIndex = isOnBlock ? -1 : step - lesson.content.blocks.length;
  const currentExercise = !isOnBlock ? lesson.content.exercises[exerciseIndex] : null;
  const currentBlock    = isOnBlock ? lesson.content.blocks[step] : null;

  const handleExerciseAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      const ex = lesson.content.exercises[exerciseIndex];
      setXpEarned(prev => prev + ex.xpReward);
      setCorrect(prev => prev + 1);
      toast.success(`+${ex.xpReward} XP! ⭐`, { duration: 1500 });
    }
    // Advance
    if (step + 1 >= totalSteps) {
      const finalScore = Math.round(((correct + (isCorrect ? 1 : 0)) / lesson.content.exercises.length) * 100);
      setScore(finalScore);
      setCompleted(true);
    } else {
      setStep(prev => prev + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, exerciseIndex, correct, totalSteps, lesson.content.exercises.length]);

  // ── COMPLETION SCREEN ─────────────────────────────────────────
  if (completed) {
    return (
      <div className="lpa-page relative flex items-center justify-center p-4">
        <div className="stars-bg pointer-events-none absolute inset-0 opacity-25" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 max-w-sm text-center"
        >
          <motion.div
            className="mb-6 text-8xl"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            🎉
          </motion.div>
          <h2 className="mb-2 font-display text-3xl font-black uppercase tracking-tight text-landing-text">Lesson complete</h2>
          <p className="mb-8 text-xs font-black uppercase tracking-wider text-landing-muted">One step closer to the stars</p>

          <div className="lpa-card mb-8 space-y-4 p-6 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-landing-faint">Score</span>
              <span className="text-lg font-black text-landing-purple">{score}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-landing-faint">XP earned</span>
              <span className="rounded-full border-2 border-landing-yellow px-3 py-1 text-xs font-black text-landing-purple">
                +{xpEarned} XP
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-landing-faint">Correct</span>
              <span className="font-black text-landing-text">
                {correct}/{lesson.content.exercises.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href={`/courses/${courseId}`} className="lpa-btn-gold justify-center py-3.5">
              Next lesson <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="lpa-btn-outline justify-center py-3.5">
              Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── LESSON UI ─────────────────────────────────────────────────
  return (
    <div className="lpa-page flex flex-col">
      <header className="sticky top-0 z-40 border-b-2 border-landing-border bg-white px-4 py-3 font-bold">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <Link href={`/courses/${courseId}`} className="shrink-0 text-landing-purple transition-colors hover:text-landing-purpleDark" aria-label="Back">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="mb-1 truncate text-xs font-black uppercase tracking-widest text-landing-muted">{lesson.title}</div>
            <div className="lpa-progress-track">
              <motion.div
                className="lpa-progress-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full border-2 border-landing-yellow bg-landing-surface px-2.5 py-1 text-xs font-black text-landing-purple">
            <Star className="h-3 w-3" />
            {xpEarned} XP
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            {/* Content block */}
            {isOnBlock && currentBlock && (
              <div className="space-y-6">
                {currentBlock.type === "story_panel" && (
                  <div className="lpa-card relative overflow-hidden p-8 text-center">
                    <div className="stars-bg absolute inset-0 opacity-30" />
                    <div className="relative z-10">
                      <div className="mb-4 text-5xl animate-float">📖</div>
                      <p className="font-handwritten text-2xl leading-relaxed text-landing-text">
                        {(currentBlock.data as any).text}
                      </p>
                    </div>
                  </div>
                )}

                {currentBlock.type === "vocabulary_card" && (
                  <div className="max-w-sm mx-auto">
                    <VocabCard data={currentBlock.data as any} />
                  </div>
                )}

                {currentBlock.type === "grammar_rule" && (
                  <div className="lpa-card p-6">
                    <div className="mb-3 text-2xl">📝</div>
                    <h3 className="mb-4 font-display text-lg font-black uppercase tracking-tight text-landing-text">
                      {(currentBlock.data as any).rule}
                    </h3>
                    <ul className="space-y-2">
                      {((currentBlock.data as any).examples as string[]).map((ex: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-bold uppercase italic text-landing-muted">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-b-2 border-landing-yellowDark bg-landing-yellow text-xs font-black text-landing-text">
                            {i + 1}
                          </span>
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => setStep(prev => prev + 1)}
                  className="lpa-btn-gold w-full justify-center py-4"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Exercise */}
            {!isOnBlock && currentExercise && (
              <div className="lpa-card p-6">
                <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-widest text-landing-faint">
                  <span className="rounded-full border-2 border-landing-border px-2 py-0.5 text-landing-purple">
                    Exercise {exerciseIndex + 1}/{lesson.content.exercises.length}
                  </span>
                  <span className="text-landing-purple">+{currentExercise.xpReward} XP</span>
                </div>

                {currentExercise.type === "multiple_choice" && (
                  <MultipleChoiceExercise exercise={currentExercise} onAnswer={handleExerciseAnswer} />
                )}
                {currentExercise.type === "fill_blank" && (
                  <FillBlankExercise exercise={currentExercise} onAnswer={handleExerciseAnswer} />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
