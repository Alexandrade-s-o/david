"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Chrome, Rocket, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { auth, googleProvider, isFirebaseConfigured, ensureStudentProfile } from "@/lib/firebase";

const loginSchema = z.object({
  email: z.string().email("Correo no válido"),
  password: z.string().min(1, "Introduce tu contraseña"),
});

type LoginForm = z.infer<typeof loginSchema>;

const authErrorsEs: Record<string, string> = {
  "auth/invalid-email": "El correo no es válido.",
  "auth/user-disabled": "Esta cuenta está desactivada.",
  "auth/user-not-found": "No hay cuenta con ese correo.",
  "auth/wrong-password": "Contraseña incorrecta.",
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/too-many-requests": "Demasiados intentos. Prueba más tarde.",
  "auth/network-request-failed": "Error de red. Comprueba tu conexión.",
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const goDemo = () => {
    toast.success("¡Vista previa sin Firebase!");
    router.push("/dashboard");
  };

  const onSubmit = async (data: LoginForm) => {
    if (!isFirebaseConfigured) {
      toast.error("Firebase no está configurado. Usa la demo o añade las variables en Vercel.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("¡Hola de nuevo!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? String((err as { code: string }).code) : "";
      toast.error(authErrorsEs[code] ?? "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isFirebaseConfigured) {
      toast.error("Firebase no está configurado.");
      return;
    }
    setLoading(true);
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await ensureStudentProfile(user);
      toast.success(`¡Hola${user.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}!`);
      router.push("/dashboard");
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? String((err as { code: string }).code) : "";
      if (code !== "auth/popup-closed-by-user") {
        toast.error(authErrorsEs[code] ?? "Error al entrar con Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #E5E5E5 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-10 md:flex-row md:gap-16">
        <motion.div
          className="flex flex-1 justify-center"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/hero-mascot.png"
            alt="Mascota Ling"
            width={380}
            height={380}
            className="h-auto w-64 object-contain drop-shadow-xl md:w-80"
            priority
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md flex-1">
          <div className="rounded-3xl border-2 border-[#E5E5E5] border-b-8 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 text-center sm:mb-8">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border-b-4 border-[#C4530D] bg-[#F56B1F]">
                <Image src="/hero-mascot.png" alt="Ling" width={48} height={48} className="h-12 w-12 object-contain" />
              </div>
              <h1 className="text-2xl font-extrabold uppercase tracking-tight text-[#2E5782]">Ling</h1>
              <p className="mt-2 text-sm font-bold text-[#777777]">¡Bienvenido de vuelta! Ingresa para continuar.</p>
            </div>

            {!isFirebaseConfigured && (
              <p className="mb-4 rounded-xl border-2 border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs font-bold text-amber-900">
                Sin variables <code className="font-mono">NEXT_PUBLIC_FIREBASE_*</code> en el entorno. Añádelas en Vercel
                y en Firebase Console autoriza tu dominio en Authentication → Settings → Authorized domains.
              </p>
            )}

            {isFirebaseConfigured && (
              <>
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-3.5 text-sm font-extrabold uppercase tracking-widest text-[#2E5782] transition-all hover:bg-[#F4F4F4] disabled:opacity-50"
                >
                  <Chrome className="h-5 w-5 text-blue-600" />
                  Continuar con Google
                </button>

                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E5E5E5]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#AFAFAF]">o correo</span>
                  <div className="h-px flex-1 bg-[#E5E5E5]" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-[#AFAFAF]">
                      Correo
                    </label>
                    <input
                      type="email"
                      autoComplete="email"
                      disabled={loading}
                      className="w-full rounded-xl border-2 border-[#E5E5E5] px-4 py-3 text-sm text-[#2E5782] placeholder:text-[#AFAFAF] focus:border-[#F56B1F] focus:outline-none"
                      placeholder="tu@correo.com"
                      {...register("email")}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-[#AFAFAF]">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        disabled={loading}
                        className="w-full rounded-xl border-2 border-[#E5E5E5] px-4 py-3 pr-11 text-sm text-[#2E5782] placeholder:text-[#AFAFAF] focus:border-[#F56B1F] focus:outline-none"
                        placeholder="••••••••"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AFAFAF] hover:text-[#2E5782]"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-[#C4530D] bg-[#F56B1F] py-4 text-sm font-extrabold uppercase tracking-widest text-white transition-all hover:bg-[#E05C10] active:translate-y-1 active:border-b-0 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : null}
                    Iniciar sesión
                  </button>
                </form>
              </>
            )}

            <button
              type="button"
              onClick={goDemo}
              disabled={loading}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#E5E5E5] border-b-4 py-3 text-xs font-extrabold uppercase tracking-widest text-[#2E5782] transition-all hover:bg-[#F4F4F4] disabled:opacity-50 ${isFirebaseConfigured ? "" : "mt-0 py-4 text-sm"}`}
            >
              <Rocket className="h-5 w-5" />
              {isFirebaseConfigured ? "Entrar sin cuenta (demo)" : "Abrir dashboard (demo)"}
            </button>

            <p className="mt-6 text-center text-xs font-bold uppercase tracking-widest text-[#AFAFAF]">
              ¿Eres nuevo?{" "}
              <Link href="/register" className="font-extrabold text-[#2E5782] transition-colors hover:text-[#F56B1F]">
                Crear cuenta
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
