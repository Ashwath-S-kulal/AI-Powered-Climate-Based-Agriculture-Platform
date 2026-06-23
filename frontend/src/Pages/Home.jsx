import React from 'react';
import WellcomeCard from "../Components/WellcomeCard";
import Footer from "../Components/Footer";
import { NavLink } from 'react-router-dom';
import {
  BarChart3, Lightbulb, CalendarCheck, Sprout, Microscope, CloudSun,
  Info, CheckCircle2, ArrowRight, Leaf, TrendingUp, Shield, Zap
} from 'lucide-react';
import ChatbotIcon from '../Components/ChatbotIcon';
import Header from '../Components/Header';

// Refactored features configuration with uniform zinc/neutral structural elements
const features = [
  {
    icon: BarChart3,
    title: "Crop Risk Analyzer",
    description: "Real-time analysis based on weather data to identify and mitigate crop risks before they happen.",
    color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    navLink: "/cropriskcalculater",
    tag: "Planning"
  },
  {
    icon: Lightbulb,
    title: "Crop Recommender",
    description: "AI-powered crop suggestions based on local climate patterns to maximize yield and profitability.",
    color: "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400",
    navLink: "/croprecomnder",
    tag: "Planning"
  },
  {
    icon: CalendarCheck,
    title: "Climate Resilient Tips",
    description: "Evidence-based farming tips linked directly to scientific sources for sustainable practices.",
    color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
    navLink: "/croplibrary",
    tag: "Planning"
  },
  {
    icon: Sprout,
    title: "Crop Growing Guide",
    description: "Stage-by-stage cultivation instructions optimized for your region and soil conditions.",
    color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    navLink: "/croplibrary/croplist",
    tag: "Planning"
  },
  {
    icon: Microscope,
    title: "Disease Predictor",
    description: "Upload a photo of your crop leaf to instantly detect diseases using deep learning AI.",
    color: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
    navLink: "/disease",
    tag: "Defense"
  },
  {
    icon: CloudSun,
    title: "Hyper-Local Weather",
    description: "Accurate, minute-level and 10-day forecasts tailored to your exact farm location.",
    color: "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400",
    navLink: "/weather",
    tag: "Defense"
  },
  {
    icon: Info,
    title: "Crop Knowledge Base",
    description: "Comprehensive crop information covering genetics, nutrition, harvest, and market data.",
    color: "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
    navLink: "/croplibrary/cropinfo",
    tag: "Knowledge"
  },
];

const benefits = [
  "Maximize Yields with Data-Driven Insights",
  "Reduce Losses from Climate Volatility",
  "Optimize Water & Fertilizer Usage",
  "Proactive Disease & Pest Management",
  "Crop Selection for Future Climate",
  "Simplify Complex Farm Planning",
];

const stats = [
  { icon: Leaf, value: "50+", label: "Crop Varieties" },
  { icon: TrendingUp, value: "98%", label: "Prediction Accuracy" },
  { icon: Shield, value: "AI", label: "Powered Analysis" },
  { icon: Zap, value: "Live", label: "Weather Data" },
];

function FeatureCard({ icon: Icon, title, description, color, navLink, tag }) {
  return (
    <NavLink to={navLink} className="group flex flex-col h-full">
      <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/80 rounded-xl p-5 hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={18} />
          </div>
          <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide border border-gray-200 dark:border-zinc-800 px-2 py-0.5 rounded-full">{tag}</span>
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed flex-grow">{description}</p>
        <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
          Launch Tool <ArrowRight size={12} />
        </div>
      </div>
    </NavLink>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      <Header />
      <WellcomeCard />

      <section className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800/50 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Our Purpose</span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-zinc-300 text-sm leading-relaxed">
                To provide farmers with unparalleled predictive intelligence to combat climate unpredictability. We secure global food systems by making sustainable, high-yield farming accessible through technology.
              </p>
              <p className="text-gray-500 dark:text-zinc-400 text-xs italic mt-3 leading-relaxed">
                We bridge complex climate science and practical agricultural execution — ensuring every farm decision is backed by reliable data.
              </p>
            </div>
            <div className="lg:border-l lg:border-gray-200 dark:lg:border-zinc-800/60 lg:pl-10">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Our Future</span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Our Vision</h2>
              <p className="text-gray-600 dark:text-zinc-300 text-sm leading-relaxed">
                A future where climate change is no longer the primary threat to agriculture. Using AI and machine learning, we create adaptive farming plans that optimize growth cycles and maximize resource efficiency in real-time.
              </p>
              <p className="text-gray-500 dark:text-zinc-400 text-xs italic mt-3 leading-relaxed">
                Our goal is to be the global standard for resilient farming, helping ecosystems flourish alongside profitable businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-600 dark:bg-emerald-700/90 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-emerald-100 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-screen mx-auto px-3 sm:px-6 md:px-20">
          <div className="mb-8">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Phase 1</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Intelligent Planning Tools</h2>
            <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">Optimize your growing season with AI-powered planning features.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.filter(f => f.tag === "Planning").map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white dark:bg-zinc-950 border-y border-gray-200 dark:border-zinc-800/60 transition-colors">
        <div className="max-w-screen mx-auto px-3 sm:px-6 md:px-20">
          <div className="mb-8">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Phase 2</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Defense & Prediction</h2>
            <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">Proactively mitigate risks using hyper-local climate and biological prediction.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.filter(f => f.tag === "Defense").map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-screen mx-auto px-3 sm:px-6 md:px-20">
          <div className="mb-8">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Phase 3</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">The Knowledge Core</h2>
            <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">A centralized, verifiable repository of agricultural data and guidance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.filter(f => f.tag === "Knowledge").map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}

            <NavLink to="/croplibrary" className="group flex flex-col h-full">
              <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/80 rounded-xl p-5 hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
                    <Leaf size={18} />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide border border-gray-200 dark:border-zinc-800 px-2 py-0.5 rounded-full">Knowledge</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">Resilience Tips & Tricks</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed flex-grow">
                  A comprehensive guide linking each principle directly to foundational sources — essential reading for sustainable farming.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
                  Access Data <ArrowRight size={12} />
                </div>
              </div>
            </NavLink>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 dark:bg-zinc-900/40 border-t dark:border-zinc-800 py-14 transition-colors">
        <div className="max-w-screen mx-auto px-3 sm:px-6 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Why SmartAgri?</h2>
              <p className="text-gray-400 dark:text-zinc-400 text-sm leading-relaxed">
                Precision agriculture with a focus on future climate adaptation, built by climatologists and agricultural scientists.
              </p>
              <NavLink to="/croplibrary">
                <button className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 dark:bg-emerald-500 text-white dark:text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors">
                  Explore Platform <ArrowRight size={14} />
                </button>
              </NavLink>
            </div>
            <div className="lg:col-span-2">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 dark:text-zinc-300 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}