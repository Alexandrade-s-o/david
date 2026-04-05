"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Rocket, Chrome, Star } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ── VALIDATION ─────────────────────────────────────────────────
const registerSchema = z.object({
  displayName: z.string().min(2, "At least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "At least 8 characters").regex(/[A-Z]/, "Include an uppercase letter").regex(/[0-9]/, "Include a number"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// ── COMPONENT ──────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Create Firestore user profile
  const createUserProfile = async (uid: string, displayName: string, email: string) => {
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      displayName,
      photoURL: null,
      role: "student",
      subscription: "free",
      subscriptionExpiresAt: null,
      stripeCustomerId: null,
      xp: 0,
      level: 1,
      currentPlanet: "planet-rose",
      streak: 0,
      lastActivityAt: serverTimestamp(),
      badges: [],
      enrolledCourses: [],
      completedLessons: [],
      prefersDarkMode: false,
      notificationsEnabled: true,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: "en",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  // Email/Password sign up
  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(user, { displayName: data.displayName });
      await createUserProfile(user.uid, data.displayName, data.email);
      toast.success("Welcome aboard, explorer! 🚀");
      router.push("/dashboard");
    } catch (err: any) {
      const messages: Record<string, string> = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/weak-password": "Password is too weak.",
        "auth/invalid-email": "Invalid email format.",
      };
      toast.error(messages[err.code] ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google sign up
  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      // Create profile only if new user
      const isNew = user.metadata.creationTime === user.metadata.lastSignInTime;
      if (isNew) {
        await createUserProfile(user.uid, user.displayName ?? "Explorer", user.email ?? "");
      }
      toast.success(`Welcome, ${user.displayName?.split(" ")[0]}! ⭐`);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        toast.error("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lpa-page relative flex items-center justify-center overflow-hidden p-4">
      <div className="stars-bg absolute inset-0 opacity-40" />
      <motion.div
        className="absolute right-16 top-16 text-5xl opacity-25"
        animate={{ y: [-8, 8, -8], rotate: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        🌹
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-12 text-4xl opacity-20"
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      >
        ⭐
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="lpa-card p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl border-b-4 border-landing-purpleDark bg-landing-purple shadow-sm">
              <Star className="h-8 w-8 fill-landing-yellow text-landing-yellow" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-landing-text">Begin your journey</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-landing-muted">
              Create your account — explore the academy
            </p>
          </div>

          <Link href="/dashboard" className="lpa-btn-gold mb-4 w-full justify-center py-3 text-center text-xs">
            <Rocket className="h-5 w-5" />
            Explore UI (no account)
          </Link>

          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-landing-border border-b-4 bg-white py-3 px-4 text-xs font-black uppercase tracking-widest text-landing-purple transition-all hover:bg-landing-surface disabled:opacity-50"
          >
            <Chrome className="h-5 w-5 text-blue-600" />
            Continue with Google
          </button>

          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-landing-border" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-landing-faint">Or email</span>
            <div className="h-px flex-1 bg-landing-border" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="lpa-label">Full name</label>
              <input
                {...register("displayName")}
                placeholder="Sophie Martin"
                className="lpa-input"
                disabled={loading}
              />
              {errors.displayName && (
                <p className="text-red-400 text-xs mt-1">{errors.displayName.message}</p>
              )}
            </div>

            <div>
              <label className="lpa-label">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="sophie@example.com"
                className="lpa-input"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="lpa-label">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="lpa-input pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center text-landing-faint transition-colors hover:text-landing-purple"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="lpa-label">Confirm password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className="lpa-input"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="lpa-btn-gold mt-2 w-full justify-center py-3.5 text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-landing-purple border-t-transparent" />
                  Creating account...
                </span>
              ) : (
                <>
                  <Rocket className="h-5 w-5" />
                  Launch!
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs font-black uppercase tracking-widest text-landing-faint">
            Have an account?{" "}
            <Link href="/login" className="text-landing-purple transition-colors hover:text-landing-purpleDark">
              Sign in
            </Link>
          </p>
          <p className="mt-3 text-center text-xs font-bold uppercase leading-relaxed text-landing-faint/80">
            By signing up you agree to our <a href="#" className="text-landing-purple underline">Terms</a> and{" "}
            <a href="#" className="text-landing-purple underline">Privacy</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
