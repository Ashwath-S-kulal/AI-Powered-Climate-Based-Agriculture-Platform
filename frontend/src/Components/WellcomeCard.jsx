import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Sprout, CloudSun, Microscope, Lightbulb, TriangleAlert, ChevronLeft, ChevronRight, LandPlot, Monitor, Activity, Radio } from "lucide-react";

const images = [
  "https://www.shutterstock.com/image-photo/lush-rice-paddy-field-neat-600nw-2499404003.jpg",
  "https://www.fii.org.in/wp-content/uploads/2020/10/1_Agriculture-1200x480.jpg",
  "https://bsmedia.business-standard.com/_media/bs/img/article/2025-02/07/thumb/featurecrop/1200X630/1738902597-8131.jpg",
  "https://thumbs.dreamstime.com/b/farmer-examining-soil-golden-light-sunset-field-ai-generated-image-farmer-examining-soil-golden-384589200.jpg",
  "https://plasticseurope.org/wp-content/uploads/2021/10/5.6._aaheader.png",
];

const quickActions = [
  { to: "/geointelligence", label: "Climate Core", icon: Sprout, textColor: "text-emerald-600 dark:text-emerald-400", hoverBg: "hover:bg-emerald-500/5 hover:border-emerald-500/30", description: "Environmental layers" },
  { to: "/weather", label: "Weather Center", icon: CloudSun, textColor: "text-sky-600 dark:text-sky-400", hoverBg: "hover:bg-sky-500/5 hover:border-sky-500/30", description: "Localized forecasts" },
  { to: "/disease", label: "Crop Diagnosis", icon: Microscope, textColor: "text-amber-600 dark:text-amber-400", hoverBg: "hover:bg-amber-500/5 hover:border-amber-500/30", description: "AI health assessments" },
  { to: "/soil", label: "Soil Matrix", icon: LandPlot, textColor: "text-orange-600 dark:text-orange-400", hoverBg: "hover:bg-orange-500/5 hover:border-orange-500/30", description: "Sub-surface analytics" },
  { to: "/croprecomnder", label: "AI Prediction", icon: Lightbulb, textColor: "text-violet-600 dark:text-violet-400", hoverBg: "hover:bg-violet-500/5 hover:border-violet-500/30", description: "Yield optimization" },
  { to: "/cropriskcalculater", label: "Risk Prediction", icon: TriangleAlert, textColor: "text-rose-600 dark:text-rose-400", hoverBg: "hover:bg-rose-500/5 hover:border-rose-500/30", description: "Threat vectors" },
];

export default function WelcomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);

  return (
    <div className="max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/80 rounded-md p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 mb-6 border-b border-zinc-200 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs font-mono tracking-wider uppercase mb-1">
              <Radio size={12} className="text-emerald-500 animate-pulse" />
              AI Powered Climate Based agriculture
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Welcome back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-400">SmartAgri</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
            <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
              <Activity size={14} className="text-emerald-500" /> System State:
            </span>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-semibold font-mono">
              SECURE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative h-[260px] sm:h-[340px] md:h-[400px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner bg-zinc-950">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Workspace telemetry display"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${idx === currentSlide ? "opacity-50" : "opacity-0"
                  }`}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/40" />

            <div className="absolute top-4 left-4 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-[11px] font-mono tracking-wide">
              <Monitor size={12} className="text-zinc-400" />
              <span>VISUAL_FEED_0{currentSlide + 1}.RAW</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
              <div className="text-white drop-shadow-sm max-w-sm hidden sm:block">
                <p className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold">Climate Overview</p>
                <h2 className="text-lg font-bold mt-0.5">AI-Powered Agricultural Intelligence Layer</h2>
              </div>

              <div className="flex gap-1 ml-auto bg-zinc-900/80 backdrop-blur-md p-1 rounded-xl border border-white/10">
                <button onClick={prevSlide} className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextSlide} className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 h-full max-h-[600px] lg:max-h-none overflow-hidden">
            <div className="space-y-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                  System Manifest
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono rounded font-semibold">
                  AI-ACTIVE
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                <strong className="text-zinc-900 dark:text-zinc-200 font-semibold">SmartAgri</strong> is a comprehensive AI-driven platform designed to empower farmers with actionable insights for sustainable and profitable farming. By combining machine learning, geospatial data, and agricultural expertise, the platform bridges the gap between climate science and practical farming operations.
              </p>
            </div>

            <div className="my-4 flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800" style={{ maxHeight: '180px' }}>
              <div className="space-y-2 pt-2">
                <div className="grid gap-1.5">
                  {[
                    { title: "AI Crop Recommendations", desc: "Dynamic suggestions cross-referenced with local weather matrices." },
                    { title: "AI Crop Disease Vision Engine", desc: "Computer vision processing utilizing Hugging Face AI architectures." },
                    { title: "AI Risk Prediction", desc: "Natural language agronomic advice powered by Groq LLM clusters." },
                    { title: "AI Chatbot Assistant", desc: "Natural language agronomic advice powered by Groq LLM clusters." }
                  ].map((feat, i) => (
                    <div key={i} className="p-2 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] border border-emerald-500/10 dark:border-emerald-500/5 rounded-xl">
                      <span className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        {feat.title}
                      </span>
                      <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{feat.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink key={index} to={item.to} className="group block">
                <div className={`h-full flex flex-col p-4 rounded-xl bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/80 ${item.hoverBg} hover:shadow-sm transition-all duration-200`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${item.textColor} group-hover:scale-105 transition-transform duration-200 mb-3`}>
                    <Icon size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white tracking-tight">
                    {item.label}
                  </h4>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 leading-normal">
                    {item.description}
                  </p>
                </div>
              </NavLink>
            );
          })}
        </div>

      </div>
    </div>
  );
}