import React from "react";
import logo from "../assets/logo.png";
import { Phone, Mail, MapPin, Github, Leaf } from "lucide-react";
import { NavLink } from "react-router-dom";

const teamMembers = [
    { name: "Ashwath S", phone: "+91 8431294514", email: "ashwathkulal2004@gmail.com" },
];

const quickLinks = [
  { label: "Dashboard", to: "/" },
  { label: "Crop Library", to: "/croplibrary" },
  { label: "Weather", to: "/weather" },
  { label: "Disease Predictor", to: "/disease" },
  { label: "Risk Analyzer", to: "/cropriskcalculater" },
];

export default function Footer() {
 return (
    <footer className="bg-gray-900 dark:bg-zinc-950 text-gray-300 border-t border-gray-800 dark:border-zinc-800">
      <div className="max-w-screen mx-auto px-3 sm:px-6 md:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt="SmartAgri" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-white font-bold text-lg">SmartAgri</span>
            </div>
            <p className="text-sm text-gray-400 dark:text-zinc-400 leading-relaxed">
              Climate-resilient agriculture platform helping farmers make data-driven decisions to maximize yield and adapt to climate change.
            </p>
            <div className="flex items-center gap-1.5 mt-4">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Sustainable Farming Platform</span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <NavLink to={to} className="text-sm text-gray-400 hover:text-white dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-150">
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Development By</h3>
            <div className="space-y-4">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="border-b border-gray-800 dark:border-zinc-800 pb-3 last:border-0 last:pb-0">
                  <p className="text-white text-sm font-medium">{member.name}</p>
                  <div className="mt-1 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-gray-500 dark:text-zinc-600" />
                      <span className="text-xs text-gray-400 dark:text-zinc-500">{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-gray-500 dark:text-zinc-600" />
                      <span className="text-xs text-gray-400 dark:text-zinc-500">{member.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 dark:text-zinc-500">© 2025 SmartAgri. All rights reserved.</p>
          <p className="text-xs text-gray-500 dark:text-zinc-500">Built for climate-resilient agriculture</p>
        </div>
      </div>
    </footer>
  );
}
