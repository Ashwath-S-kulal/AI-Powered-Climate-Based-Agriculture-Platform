import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Sprout, CloudSun, Microscope, Lightbulb, Info, TriangleAlert, ChevronLeft, ChevronRight, LandPlot } from "lucide-react";

const images = [
  "https://www.shutterstock.com/image-photo/lush-rice-paddy-field-neat-600nw-2499404003.jpg",
  "https://www.fii.org.in/wp-content/uploads/2020/10/1_Agriculture-1200x480.jpg",
  "https://bsmedia.business-standard.com/_media/bs/img/article/2025-02/07/thumb/featurecrop/1200X630/1738902597-8131.jpg",
  "https://thumbs.dreamstime.com/b/farmer-examining-soil-golden-light-sunset-field-ai-generated-image-farmer-examining-soil-golden-384589200.jpg",
  "https://plasticseurope.org/wp-content/uploads/2021/10/5.6._aaheader.png",
];

const quickActions = [
  { to: "/croplibrary/croplist", label: "Crops", icon: Sprout, color: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400", description: "Crop varieties & growing steps" },
  { to: "/weather", label: "Weather", icon: CloudSun, color: "bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400", description: "Current weather & forecasts" },
  { to: "/disease", label: "Diagnose", icon: Microscope, color: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400", description: "Scan crops for diseases" },
  { to: "/soil", label: "Soil", icon: LandPlot, color: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400", description: "Analyse your Soil" },
  { to: "/croprecomnder", label: "Recommend", icon: Lightbulb, color: "bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400", description: "Crop suggestions for your area" },
  { to: "/croplibrary/cropinfo", label: "Crop Info", icon: Info, color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400", description: "Detailed crop knowledge base" },
  { to: "/cropriskcalculater", label: "Risk", icon: TriangleAlert, color: "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400", description: "Calculate crop risks" },
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
    <div className="transition-colors duration-300">
      <div className="relative h-[250px] md:h-[400px] overflow-hidden bg-zinc-900 mx-2 md:mx-8 my-3 rounded-lg md:rounded-3xl shadow-xl dark:shadow-black/20">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="flex-shrink-0 w-full h-full relative">
              <img src={img} alt={`Farm slide ${idx + 1}`} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-semibold mb-4 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI-Powered Agriculture Platform
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight max-w-3xl">
            Farm Smarter with<br />
            <span className="text-emerald-400">Climate Intelligence</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-xl leading-relaxed">
            Predict risks, get crop recommendations, and monitor weather — all in one professional platform.
          </p>
        </div>

        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-colors">
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800/80 transition-colors duration-300">
        <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {quickActions.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink key={index} to={item.to} className="group">
                  <div className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all duration-150 text-center cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-zinc-700/60">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${item.color} group-hover:scale-105 transition-transform duration-150`}>
                      <Icon size={18} />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-400 dark:text-zinc-400 leading-tight hidden sm:block">
                      {item.description}
                    </p>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}