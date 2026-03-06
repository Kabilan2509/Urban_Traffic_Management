"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ShieldCheck, Cpu } from "lucide-react";
import { motion } from "framer-motion";
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("traffix_token", data.access_token);
        localStorage.setItem("traffix_role", data.role);
        router.push("/dashboard");
      } else {
        const errData = await res.json();
        setError(errData.detail || "Invalid credentials");
      }
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Animated Animated Smart City Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] animate-[pulse_4s_ease-in-out_infinite]" />

        {/* Animated flow lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent"
            initial={{ left: "-100%", top: `${20 * i + 10}%`, opacity: 0 }}
            animate={{ left: "100%", opacity: [0, 1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3 + i * 2,
              ease: "linear",
              delay: i * 0.5,
            }}
            style={{ width: "200px" }}
          />
        ))}
      </div>

      <div className="z-10 w-full max-w-md p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-2xl p-8 neon-border shadow-2xl relative"
        >
          {/* Subtle top cyan glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-cyan-400 blur-sm"></div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="text-cyan-400 w-10 h-10 animate-pulse" />
              <h1 className="text-4xl font-bold text-gradient tracking-tight">Traffix</h1>
            </div>
            <p className="text-slate-400 text-sm">Traffix Traffic Management System</p>
            <p className="text-cyan-500/80 text-xs mt-1 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
              <Cpu className="w-3 h-3" /> AI-Powered Dashboard
            </p>
          </div>

          {error && <div className="mb-4 text-red-400 text-sm text-center bg-red-400/10 py-2 rounded border border-red-500/20">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Username / Authority ID</label>
              <input
                type="text"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                placeholder="Enter your specific ID..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Secure Passkey</label>
              <input
                type="password"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-400 cursor-pointer hover:text-cyan-400 transition-colors">
                <input type="checkbox" className="mr-2 rounded border-cyan-400 bg-transparent text-cyan-400 focus:ring-cyan-400 focus:ring-opacity-50" />
                Remember session
              </label>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Emergency config?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-cyan-500/30 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              {loading ? "Authenticating..." : "INITIALIZE SECURE UPLINK"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-700/50 pt-6">
            <p className="text-slate-500 text-xs">
              System access is restricted to authorized City Traffic Control personnel only. Unauthorized access is highly prohibited and monitored.
            </p>
            <div className="mt-4 flex justify-center gap-2 text-xs text-slate-600 font-mono">
              <span>Try: admin/admin</span>
              <span>•</span>
              <span>engineer/engineer</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
