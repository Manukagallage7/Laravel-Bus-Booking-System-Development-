"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

/* ─── Toast Component ─── */
function Toast({ message, type = "success", onClose }) {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onClose, 400);
        }, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === "success";

    return (
        <div
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-md border transition-all duration-500 ease-out
                ${isSuccess
                    ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
                    : "bg-red-50/90 border-red-200 text-red-800"}
                ${visible && !exiting
                    ? "translate-x-0 opacity-100 scale-100"
                    : "translate-x-12 opacity-0 scale-95"}`}
            style={{
                boxShadow: isSuccess
                    ? "0 20px 60px rgba(16,185,129,0.25), 0 8px 20px rgba(16,185,129,0.15)"
                    : "0 20px 60px rgba(239,68,68,0.25), 0 8px 20px rgba(239,68,68,0.15)"
            }}
        >
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isSuccess ? "bg-emerald-100" : "bg-red-100"}`}>
                {isSuccess
                    ? <CheckCircleOutlineIcon className="text-emerald-600" style={{ fontSize: 24 }} />
                    : <ErrorOutlineIcon className="text-red-600" style={{ fontSize: 24 }} />}
            </div>
            <div>
                <p className="font-semibold text-sm">{isSuccess ? "Success!" : "Oops!"}</p>
                <p className="text-xs opacity-80">{message}</p>
            </div>
            <button onClick={() => { setExiting(true); setTimeout(onClose, 400); }}
                className="ml-3 opacity-50 hover:opacity-100 transition-opacity text-lg leading-none">&times;</button>
            {/* Animated progress bar */}
            <div className="absolute bottom-0 left-0 h-1 rounded-b-2xl overflow-hidden w-full">
                <div
                    className={`h-full rounded-b-2xl ${isSuccess ? "bg-emerald-400" : "bg-red-400"}`}
                    style={{ animation: "shrinkBar 3.5s linear forwards" }}
                />
            </div>
        </div>
    );
}

export default function Register() {
    const router = useRouter();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [showPwConfirm, setShowPwConfirm] = useState(false);
    const [toast, setToast] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password || !passwordConfirm) {
            setError("All fields are required");
            setToast({ message: "Please fill in all fields", type: "error" });
            return;
        }
        if (password !== passwordConfirm) {
            setError("Passwords do not match");
            setToast({ message: "Passwords do not match", type: "error" });
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            setToast({ message: "Password must be at least 8 characters", type: "error" });
            return;
        }

        try {
            setLoading(true);
            await register(name, email, password, passwordConfirm);
            setToast({ message: "Account created successfully! Redirecting...", type: "success" });
            setTimeout(() => router.push("/auth/login"), 2000);
        } catch (err) {
            const msg = err.message || "Registration failed. Please try again.";
            setError(msg);
            setToast({ message: msg, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    /* Password strength indicator */
    const getStrength = (pw) => {
        let s = 0;
        if (pw.length >= 8) s++;
        if (/[A-Z]/.test(pw)) s++;
        if (/[0-9]/.test(pw)) s++;
        if (/[^A-Za-z0-9]/.test(pw)) s++;
        return s;
    };
    const strength = getStrength(password);
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"][strength];

    return (
        <>
            {/* Keyframe styles */}
            <style jsx global>{`
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes floatUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 30px rgba(99,102,241,0.15); }
                    50%      { box-shadow: 0 0 60px rgba(99,102,241,0.3); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes shrinkBar {
                    from { width: 100%; }
                    to   { width: 0%; }
                }
                @keyframes busMove {
                    0%   { transform: translateX(-30px) rotate(-2deg); opacity: 0; }
                    50%  { transform: translateX(5px) rotate(1deg); opacity: 1; }
                    100% { transform: translateX(0) rotate(0deg); opacity: 1; }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div
                className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12"
                style={{
                    background: "linear-gradient(-45deg, #0f172a, #1e293b, #312e81, #1e1b4b, #0f172a)",
                    backgroundSize: "400% 400%",
                    animation: "gradientShift 15s ease infinite",
                }}
            >
                {/* Decorative blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-125 h-125 rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)", filter: "blur(80px)" }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)", filter: "blur(80px)" }} />
                <div className="absolute top-[40%] left-[60%] w-75 h-75 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)", filter: "blur(60px)" }} />

                {/* Card */}
                <div
                    className={`relative z-10 w-full max-w-md transition-all duration-700 ease-out
                        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    style={{ animation: mounted ? "floatUp 0.8s ease-out, pulseGlow 4s ease-in-out infinite" : "none" }}
                >
                    <div className="bg-white/7 backdrop-blur-xl border border-white/12 rounded-3xl p-8 sm:p-10"
                        style={{
                            boxShadow: "0 25px 80px rgba(0,0,0,0.4), 0 8px 30px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.1)"
                        }}
                    >
                        {/* Header */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 mb-4"
                                style={{ animation: "busMove 1s ease-out 0.3s both" }}>
                                <DirectionsBusIcon className="text-indigo-300" style={{ fontSize: 32 }} />
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
                            <p className="text-sm text-gray-400 mt-1">Join us and start booking your rides</p>
                        </div>

                        {/* Error inline */}
                        {error && (
                            <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
                                style={{ animation: "floatUp 0.4s ease-out" }}>
                                <ErrorOutlineIcon style={{ fontSize: 18 }} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-5">
                            {/* Name */}
                            <div className="group relative">
                                <PersonOutlineIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" style={{ fontSize: 20 }} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/6 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-11 pr-4 py-3 text-sm outline-none transition-all duration-300 focus:border-indigo-400/60 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-white/20"
                                />
                            </div>

                            {/* Email */}
                            <div className="group relative">
                                <EmailOutlinedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" style={{ fontSize: 20 }} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/6 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-11 pr-4 py-3 text-sm outline-none transition-all duration-300 focus:border-indigo-400/60 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-white/20"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="group relative">
                                    <LockOutlinedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" style={{ fontSize: 20 }} />
                                    <input
                                        type={showPw ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/6 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-11 pr-11 py-3 text-sm outline-none transition-all duration-300 focus:border-indigo-400/60 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-white/20"
                                    />
                                    <button type="button" onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-300 transition-colors">
                                        {showPw
                                            ? <VisibilityOffOutlinedIcon style={{ fontSize: 20 }} />
                                            : <VisibilityOutlinedIcon style={{ fontSize: 20 }} />}
                                    </button>
                                </div>
                                {/* Strength bar */}
                                {password && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 flex gap-1">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
                                                    style={{ backgroundColor: i <= strength ? strengthColor : "rgba(255,255,255,0.1)" }} />
                                            ))}
                                        </div>
                                        <span className="text-[11px] font-medium" style={{ color: strengthColor }}>{strengthLabel}</span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="group relative">
                                <LockOutlinedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" style={{ fontSize: 20 }} />
                                <input
                                    type={showPwConfirm ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    className="w-full bg-white/6 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-11 pr-11 py-3 text-sm outline-none transition-all duration-300 focus:border-indigo-400/60 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-white/20"
                                />
                                <button type="button" onClick={() => setShowPwConfirm(!showPwConfirm)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-300 transition-colors">
                                    {showPwConfirm
                                        ? <VisibilityOffOutlinedIcon style={{ fontSize: 20 }} />
                                        : <VisibilityOutlinedIcon style={{ fontSize: 20 }} />}
                                </button>
                                {/* Match indicator */}
                                {passwordConfirm && (
                                    <span className={`absolute right-12 top-1/2 -translate-y-1/2 text-xs font-medium transition-all duration-300
                                        ${password === passwordConfirm ? "text-emerald-400" : "text-red-400"}`}>
                                        {password === passwordConfirm ? "Match ✓" : "No match"}
                                    </span>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative w-full py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group/btn"
                                style={{
                                    background: loading
                                        ? "rgba(99,102,241,0.4)"
                                        : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                    boxShadow: "0 8px 30px rgba(99,102,241,0.35)"
                                }}
                            >
                                {/* Shimmer overlay */}
                                {!loading && (
                                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
                                        style={{
                                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                                            backgroundSize: "200% 100%",
                                            animation: "shimmer 2s infinite"
                                        }} />
                                )}
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                style={{ animation: "spin 0.8s linear infinite" }} />
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </span>
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-xs text-gray-500">or</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Login link */}
                        <p className="text-center text-sm text-gray-400">
                            Already have an account?{" "}
                            <Link href="/auth/login"
                                className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors hover:underline underline-offset-4">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}