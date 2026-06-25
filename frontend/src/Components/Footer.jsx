import React from "react";
import logo from "../assets/logo.png";
import { Phone, Mail, Leaf, ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const teamMembers = [
  { name: "Ashwath S", phone: "+91 8431294514", email: "ashwathkulal2004@gmail.com" },
];

const linkGroups = [
  {
    title: "Planning & Strategy",
    links: [
      { label: "Dashboard Core", to: "/" },
      { label: "Crop Risk Analyzer", to: "/cropriskcalculater" },
      { label: "Crop Recommender", to: "/croprecomnder" },
      { label: "Soil Analysis", to: "/soil" },
    ]
  },
  {
    title: "Defense & Markets",
    links: [
      { label: "Geo Intelligence", to: "/geointelligence" },
      { label: "Disease Predictor", to: "/disease" },
      { label: "Hyper-Local Weather", to: "/weather" },
      { label: "Market Price Board", to: "/marketprices" },
    ]
  },
  {
    title: "Knowledge Base",
    links: [
      { label: "Crop Library Base", to: "/croplibrary" },
      { label: "Crop Growing Guides", to: "/croplibrary/croplist" },
      { label: "Deep Crop Insights", to: "/croplibrary/cropinfo" },
      { label: "Disease Symptoms", to: "/disease/diseasedata" },
      { label: "Disease Supplements", to: "/disease/diseasesuppliment" },
    ]
  }
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-zinc-950 text-gray-300 border-t border-gray-800 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 md:gap-8">

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="SmartAgri" className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/10" />
              <span className="text-white font-extrabold text-xl tracking-tight">SmartAgri</span>
            </div>
            <p className="text-sm text-gray-400 dark:text-zinc-400 leading-relaxed max-w-sm">
              Climate-resilient agriculture platform helping farmers make data-driven decisions to maximize yield and adapt to climate change.
            </p>

          </div>

          {linkGroups.map((group, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-white font-bold text-xs ">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map(({ label, to }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className="group flex items-center text-xs text-gray-400 hover:text-white dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-150"
                    >
                      <span>{label}</span>
                      <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all duration-150" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4">
            <h3 className="text-white font-bold text-xs">
              Development By
            </h3>
            <div className="space-y-4">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-white text-sm font-semibold">{member.name}</p>
                  <div className="space-y-1.5">
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-zinc-200 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-600 flex-shrink-0" />
                      <span>{member.phone}</span>
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-zinc-200 transition-colors break-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-600 flex-shrink-0" />
                      <span>{member.email}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-gray-800 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-zinc-500">
            © 2026 SmartAgri. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 dark:text-zinc-500 font-medium">
            Built for Climate-Based agriculture
          </p>
        </div>
      </div>
    </footer>
  );
}