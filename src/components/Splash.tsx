import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ShieldAlert, Fingerprint, Award, CheckCircle } from "lucide-react";

interface SplashProps {
  onComplete: () => void;
  centerName: string;
}

export default function Splash({ onComplete, centerName }: SplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 600);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-900 text-white flex flex-col justify-between items-center p-6 z-50 overflow-hidden">
      {/* Decorative vector grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: "20px 20px"
      }}></div>

      <div className="flex-1 flex flex-col justify-center items-center text-center relative max-w-md mx-auto">
        {/* Animated outer ring */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 relative z-10">
            <Fingerprint className="w-12 h-12 text-white animate-pulse" />
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-indigo-500/20 animate-ping"></div>
          <div className="absolute -inset-4 rounded-full border border-indigo-500/10"></div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-200">
            {centerName}
          </h1>
          <p className="text-indigo-400 font-mono text-xs mt-2 uppercase tracking-widest">
            Common Service Center Suite
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-sm text-slate-400 flex flex-wrap gap-2 justify-center max-w-sm"
        >
          <span className="bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50 flex items-center gap-1.5 text-xs">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Digital Services
          </span>
          <span className="bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50 flex items-center gap-1.5 text-xs">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Secure Payments
          </span>
          <span className="bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50 flex items-center gap-1.5 text-xs">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Instant Support
          </span>
        </motion.div>
      </div>

      {/* Progress & Bottom Branding */}
      <div className="w-full max-w-xs flex flex-col items-center gap-4 relative z-10">
        <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden relative border border-slate-700/40">
          <motion.div 
            className="bg-indigo-500 h-full rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between w-full text-[10px] font-mono text-slate-400">
          <span>SECURE GATEWAY ENCRYPTED</span>
          <span>{progress}%</span>
        </div>

        <div className="mt-2 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1.5 justify-center">
            <Award className="w-3 h-3 text-indigo-400" /> Aaple Sarkar Seva - Digital India
          </p>
        </div>
      </div>
    </div>
  );
}
