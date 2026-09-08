


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      login(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 select-none overflow-hidden text-slate-900">
      {/* Background Soft Pastel Ambient Accents */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-[#E6F9F2] opacity-70 pointer-events-none blur-3xl" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-[#EEF2FF] opacity-70 pointer-events-none blur-3xl" />

      {/* Main Elevated Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.05)] space-y-7">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00B884] text-white shadow-md shadow-[#00B884]/25">
            <GraduationCap className="w-7 h-7" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F9F2] border border-[#BFF0DE] text-[11px] font-bold text-[#00B884] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Learn • Your Study Companion</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 font-medium leading-relaxed">
              Join <span className="font-bold text-slate-800">AI Learn</span> to convert your lecture slides and notes into automated flashcards and practice quizzes.
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Full Name</label>
            <div className="relative">
              <User className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00B884] focus:ring-2 focus:ring-[#00B884]/15 transition"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Email Address</label>
            <div className="relative">
              <Mail className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00B884] focus:ring-2 focus:ring-[#00B884]/15 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Password</label>
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00B884] focus:ring-2 focus:ring-[#00B884]/15 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00B884] hover:bg-[#009e71] active:scale-95 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#00B884]/25 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create AI Learn Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Already registered on AI Learn?{" "}
            <Link
              to="/login"
              className="font-bold text-[#00B884] hover:text-[#009e71] transition ml-1"
            >
              Log in to your workspace
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}