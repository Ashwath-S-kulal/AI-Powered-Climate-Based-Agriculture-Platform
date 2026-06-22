import React from "react";
import Header from "./Header";
import { NavLink } from "react-router-dom";
import {
  ArrowRight, ShieldCheck, Microscope, AlertTriangle,
  Lightbulb, CloudSun, Bug, BotMessageSquare
} from "lucide-react";

export default function AccessPage() {
  const features = [
    { icon: <Microscope size={20} />, title: "Disease Info", desc: "AI-driven pathology diagnostics." },
    { icon: <AlertTriangle size={20} />, title: "Risk Analysis", desc: "Real-time crop risk assessment." },
    { icon: <Lightbulb size={20} />, title: "Crop Advisor", desc: "Weather-specific guidance." },
    { icon: <CloudSun size={20} />, title: "Weather Plus", desc: "Hyper-local climate tracking." },
    { icon: <Bug size={20} />, title: "Soil Analytics", desc: "Predictive outbreak modeling." },
    { icon: <BotMessageSquare size={20} />, title: "AgriBot 24/7", desc: "Instant expert support." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="max-w-screen mx-auto px-3 md:px-20 py-16">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <span className="text-emerald-600 font-semibold text-sm tracking-wide uppercase">Built for Modern Agriculture</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-4 mb-6">
            Grow Smarter with
            Data-Driven <br /> Technology.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Access a comprehensive suite of agricultural intelligence. Empower your decisions with predictive modeling, climate data, and expert-level diagnostic tools.
          </p>
          <div className="flex justify-center gap-4">
            <NavLink to="/signin" className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition">Get Started</NavLink>
          </div>
        </section>

        {/* Feature Grid */}
        <section>
          <div className="flex items-center gap-2 mb-10">
            <ShieldCheck className="text-emerald-600" />
            <h2 className="text-xl font-bold">Secure Access Modules</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="bg-white border border-slate-200 p-6 rounded-xl hover:border-emerald-300 transition-colors flex items-start gap-4">
                <div className="p-3 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">{f.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{f.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{f.desc}</p>
                  <NavLink to="/signin" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
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