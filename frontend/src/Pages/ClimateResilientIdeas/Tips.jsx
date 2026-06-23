import React, { useState } from "react";
import { Leaf, Droplet, CloudRain, Users, Check } from "lucide-react";
import Header from "../../Components/Header";

const tips = [
    {
      id: 'soil',
      title: "Soil Health & Ecology",
      subtitle: "The foundational layer for nutrient cycling and carbon sequestration.",
      icon: Leaf,
      color: "text-teal-500",
      tips: [
        "Implement no-till or reduced tillage practices to preserve soil structure and microbial life, minimizing carbon release.",
        "Use diverse cover cropping systems (legumes, grasses) to enhance nitrogen fixation and prevent wind/water erosion.",
        "Manage residue effectively to build soil organic matter and significantly increase water infiltration capacity.",
        "Regularly test soil to accurately target nutrient deficiencies, maximizing fertilizer efficiency and avoiding chemical excess.",
        "Incorporate biochar or local compost to rapidly boost water retention and long-term carbon storage in the field."
      ]
    },
    {
      id: 'water',
      title: "Water Use & Efficiency",
      subtitle: "Strategic management of water resources for drought mitigation and supply security.",
      icon: Droplet, 
      color: "text-blue-500",
      tips: [
        "Transition to high-efficiency irrigation (sub-surface drip, microsprinklers) to minimize evaporation loss.",
        "Employ remote sensing and soil moisture probes for real-time, precision irrigation scheduling, providing water exactly when needed.",
        "Design and construct small-scale water harvesting structures (check dams, contour trenches) for surface runoff capture.",
        "Use thick organic mulches (straw, crop residues) to significantly reduce soil surface water evaporation and weed growth.",
        "Select crop varieties with naturally lower water requirements or enhanced drought tolerance suitable for local conditions."
      ]
    },
    {
      id: 'climate',
      title: "Climate & Weather Readiness",
      subtitle: "Adapting farming systems to handle weather extremes and increasing variability.",
      icon: CloudRain,
      color: "text-orange-500",
      tips: [
        "Diversify the farm system by integrating trees (agroforestry) and livestock, providing microclimates and multiple products.",
        "Utilize seasonal climate forecasts and early warning systems to make proactive decisions on planting and input allocation.",
        "Shift planting and harvesting dates to avoid predicted periods of extreme heat, frost, or intense rainfall events.",
        "Invest in protective measures like shade nets or high tunnels for vulnerable, high-value crops against hail and strong sun.",
        "Develop contingency plans for post-disaster recovery, including access to emergency seeds and equipment."
      ]
    },
    {
      id: 'economic',
      title: "Economic & Social Resilience",
      subtitle: "Future-proof your operation and build strong community and reliable market ties.",
      icon: Users,
      color: "text-indigo-500",
      tips: [
        "Diversify income streams through value-added processing, direct consumer market sales, or eco-tourism initiatives.",
        "Establish farmer cooperatives for bulk purchasing of expensive inputs and collective market negotiation power.",
        "Secure comprehensive crop insurance or risk-sharing mechanisms to buffer against weather-related income loss.",
        "Foster knowledge sharing, mentorship, and peer-to-peer training on new climate-smart agricultural techniques.",
        "Use robust financial planning to maintain an operational buffer fund and manage exposure to price volatility."
      ]
    }
  ];


const CheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Tips() {
  const [active, setActive] = useState("soil");
  const section = tips.find((s) => s.id === active);
  const ActiveIcon = section?.icon;

return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 font-sans antialiased">
      <Header />

      <main className="max-w-screen mx-auto px-3 md:px-20 pt-10 pb-20">
        <header className="border-b border-slate-200 dark:border-zinc-800 pb-6 mb-8">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 mb-2">
            Climate Resilience Framework
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Interactive guide to environmental protection adjustments, resource management, and conservation matrices.
          </p>
        </header>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 mb-8 p-1.5 bg-slate-200/60 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
          {tips.map((sec) => {
            const Icon = sec.icon;
            const isActive = sec.id === active;

            return (
              <button
                key={sec.id}
                onClick={() => setActive(sec.id)}
                className={`flex items-center justify-center sm:justify-start gap-2.5 flex-1 min-w-[120px] px-4 py-3 text-xs font-bold tracking-tight rounded-lg transition-all focus:outline-none ${
                  isActive
                    ? `bg-white dark:bg-zinc-800 border-slate-200/80 dark:border-zinc-700 text-slate-900 dark:text-white shadow-sm ${sec.color}`
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-white/40 dark:hover:bg-zinc-800/50"
                }`}
              >
                {Icon && (
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? sec.color : "text-slate-400 dark:text-zinc-500"}`} />
                )}
                <span>{sec.title.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {section && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-sm animate-fadeIn">
            <div className="flex items-start gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-zinc-800">
              {ActiveIcon && (
                <div className="p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-xl flex-shrink-0">
                  <ActiveIcon className={`w-6 h-6 ${section.color}`} />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{section.title}</h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{section.subtitle}</p>
              </div>
            </div>

            <ul className="space-y-4">
              {section.tips.map((tip, i) => (
                <li 
                  key={i} 
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-950 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-slate-200/80 dark:hover:border-zinc-700 transition-colors"
                >
                  <span className={`p-1 rounded-md bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm mt-0.5 flex-shrink-0 ${section.color}`}>
                    <CheckIcon className="w-3 h-3" />
                  </span>
                  <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                    <span className="font-bold text-slate-800 dark:text-zinc-200 mr-1">{i + 1}.</span>
                    {tip}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

