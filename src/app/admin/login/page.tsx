"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { AdminLoginBackground } from "@/components/admin/AdminLoginBackground";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push(from);
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Field */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="admin-email"
          className="text-xs font-semibold text-[#CBD5E1] block"
        >
          Administrator Email
        </label>
        <div className="relative rounded-xl bg-[#0D1224]/90 border border-white/10 hover:border-white/20 focus-within:border-[#8B5CF6]/70 focus-within:ring-2 focus-within:ring-[#8B5CF6]/25 transition-all">
          <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="admin-password"
          className="text-xs font-semibold text-[#CBD5E1] block"
        >
          Password
        </label>
        <div className="relative rounded-xl bg-[#0D1224]/90 border border-white/10 hover:border-white/20 focus-within:border-[#8B5CF6]/70 focus-within:ring-2 focus-within:ring-[#8B5CF6]/25 transition-all">
          <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-11 py-3 bg-transparent text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#CBD5E1] focus:outline-none transition-colors p-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error Message Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="group w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 bg-gradient-to-r from-[#9333EA] via-[#6366F1] to-[#3B82F6] hover:from-[#A855F7] hover:via-[#4F46E5] hover:to-[#60A5FA] shadow-[0_4px_25px_-3px_rgba(99,102,241,0.55)] hover:shadow-[0_6px_30px_rgba(99,102,241,0.7)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2 focus:ring-offset-[#070914] mt-3"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying Credentials...</span>
          </>
        ) : (
          <>
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#070914] relative overflow-hidden select-none">
      {/* Animated Cosmic 3D Grid & Celestial Atmosphere */}
      <AdminLoginBackground />

      <div className="max-w-[430px] w-full relative z-10 flex flex-col items-center">
        {/* Outer glowing border gradient container */}
        <div className="w-full p-[1.5px] rounded-[28px] bg-gradient-to-tr from-[#8B5CF6]/70 via-[#6366F1]/30 to-[#38BDF8]/70 shadow-[0_0_60px_-15px_rgba(139,92,246,0.35),0_0_60px_-15px_rgba(56,189,248,0.25)]">
          {/* Inner glassmorphism card */}
          <div className="w-full bg-[#080C1D]/80 backdrop-blur-2xl rounded-[26.5px] p-7 sm:p-9 border border-white/5 shadow-2xl">
            {/* Header: Shield Icon Badge & Titles */}
            <div className="text-center space-y-3.5 mb-7">
              {/* Shield Icon in glowing squircle */}
              <div className="w-14 h-14 rounded-2xl bg-[#12162E]/90 border border-[#8B5CF6]/50 mx-auto flex items-center justify-center text-[#A78BFA] shadow-[0_0_25px_rgba(139,92,246,0.35)]">
                <ShieldCheck className="w-7 h-7 text-[#C084FC]" />
              </div>

              {/* Title: Admin Portal */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Admin{" "}
                  <span className="bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#818CF8] bg-clip-text text-transparent">
                    Portal
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 font-normal">
                  Sign in to manage your portfolio content.
                </p>
              </div>
            </div>

            {/* Login Form */}
            <Suspense
              fallback={
                <div className="py-12 flex items-center justify-center text-[#A0A3B8] text-xs gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#8B5CF6]" />
                  <span>Loading sign-in portal...</span>
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>

        {/* Return to Public Website link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#94A3B8] hover:text-[#38BDF8] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
