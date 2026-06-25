import React from "react";
import Header from "./Header";
import { NavLink } from "react-router-dom";
import {
  ArrowRight, ShieldCheck, Microscope, AlertTriangle,
  Lightbulb, CloudSun, Bug, BotMessageSquare
} from "lucide-react";

export default function AccessPage() {
  const features = [
    {
      icon: <Microscope size={20} />,
      title: "Disease Scan",
      desc: "AI-driven disease detection via leaf image uploads."
    },
    {
      icon: <AlertTriangle size={20} />,
      title: "Risk Analysis",
      desc: "Crop risk finding based on location with AI insights"
    },
    {
      icon: <Lightbulb size={20} />,
      title: "Crop Recommendation",
      desc: "Weather and location-based crop recommendations."
    },
    {
      icon: <Bug size={20} />,
      title: "Soil Analytics", 
      desc: "Soil Information based on location."
    },
    {
      icon: <BotMessageSquare size={20} />,
      title: "AgriBot 24/7",
      desc: "Instant, automated expert support anytime."
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Header />
      <main className="max-w-screen mx-auto px-3 md:px-20 py-16">
        <section className="text-center mb-24">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm tracking-wide uppercase">Built for Modern Agriculture</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-4 mb-6 text-slate-900 dark:text-white">
            Grow Smarter with
            Data-Driven <br /> Technology.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Access a comprehensive suite of agricultural intelligence. Empower your decisions with predictive modeling, climate data, and expert-level diagnostic tools.
          </p>
          <div className="flex justify-center gap-4">
            <NavLink to="/signin" className="px-6 py-3 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-white transition">Get Started</NavLink>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-10">
            <ShieldCheck className="text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Secure Access Modules</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors flex items-start gap-4">
                <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-zinc-700">{f.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-zinc-50">{f.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{f.desc}</p>
                  <NavLink to="/signin" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1">
                    Login to access <ArrowRight size={12} />
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}