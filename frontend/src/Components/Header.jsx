import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import * as LucideIcons from "lucide-react";
import { useSelector } from "react-redux";
import useTheme from "../hooks/useTheme";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { to: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { to: "/croplibrary", label: "Library", icon: "BookOpen" },
    { to: "/weather", label: "Weather", icon: "CloudSun" },
    { to: "/geointelligence", label: "Climate Intelligence", icon: "Compass" },
  ];

  const toolItems = [
    { to: "/croprecomnder", label: "Crop Recommender", icon: "Sparkles", desc: "AI optimization" },
    { to: "/cropriskcalculater", label: "Risk Calculator", icon: "ShieldAlert", desc: "Predict threats" },
    { to: "/soil", label: "Soil Analytics", icon: "Sprout", desc: "Nutrient insights" },
    { to: "/disease", label: "Disease Scan", icon: "ScanFace", desc: "Vision diagnostics" },
  ];

  const IconRenderer = ({ name, size = 18, className = "" }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
    return <IconComponent size={size} className={className} />;
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          <NavLink to="/" className="flex items-center gap-2.5 group focus:outline-none">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img src={logo} alt="SmartAgri Logo" className="h-9 w-9 object-contain relative z-10 transition-transform duration-300 group-hover:scale-105" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
              SmartAgri
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium px-3 py-2 rounded-xl transition-all duration-200 ${isActive
                    ? 'text-emerald-600 bg-emerald-50/60 dark:bg-emerald-500/10 dark:text-emerald-400 font-semibold shadow-sm shadow-emerald-500/5'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="relative group ml-1">
              <button className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 px-3 py-2 rounded-xl flex items-center gap-1 transition-all duration-200 focus:outline-none">
                Tools
                <LucideIcons.ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180 text-zinc-400" />
              </button>

              <div className="absolute top-full left-0 pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 w-56 z-50">
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 shadow-xl rounded-xl p-1.5">
                  {toolItems.map((tool) => (
                    <Link
                      key={tool.to}
                      to={tool.to}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-emerald-50/50 dark:hover:bg-zinc-700/40 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl font-medium transition-colors group/item"
                    >
                      <IconRenderer name={tool.icon} size={16} className="text-zinc-400 group-hover/item:text-emerald-500 dark:group-hover/item:text-emerald-400 transition-colors" />
                      {tool.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-3.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 border border-transparent hover:border-zinc-200/40 dark:hover:border-zinc-700/40 transition-all active:scale-95 focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <LucideIcons.Sun size={19} className="text-amber-400" /> : <LucideIcons.Moon size={19} />}
            </button>

            {!currentUser ? (
              <Link to="/signin" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 transition-all active:scale-[0.98]">
                Sign In
              </Link>
            ) : (
              <Link to="/profile" className="flex items-center gap-2.5 border border-zinc-200/60 dark:border-zinc-700/80 rounded-full py-1.5 pr-4 pl-2 hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:bg-emerald-50/20 dark:hover:bg-emerald-500/5 transition-all group shadow-sm">
                <img src={currentUser.profilePicture} alt={currentUser.username} className="h-6 w-6 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800" />
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {currentUser.username}
                </span>
              </Link>
            )}
          </div>

          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 active:bg-zinc-100 dark:active:bg-zinc-800/60 transition-colors"
            >
              {theme === "dark" ? <LucideIcons.Sun size={20} className="text-amber-400" /> : <LucideIcons.Moon size={20} />}
            </button>

            <button
              className="p-2.5 text-zinc-600 dark:text-zinc-300 active:bg-zinc-100 dark:active:bg-zinc-800/60 rounded-xl transition-all duration-200 focus:outline-none relative z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <LucideIcons.X size={22} className="text-zinc-900 dark:text-white" /> : <LucideIcons.Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-zinc-950/20 dark:bg-zinc-950/40 backdrop-blur-md z-40 md:hidden transition-all duration-300 animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`fixed top-0 right-0 w-[85vw] max-w-[340px] h-screen bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-l border-zinc-200/60 dark:border-zinc-800/60 shadow-2xl flex flex-col z-40 transform transition-transform duration-300 ease-out md:hidden pt-20 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col p-5 gap-6 overflow-y-auto flex-1">
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-2 mb-1">Navigation</p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-medium text-sm transition-all ${isActive
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-500/10 font-bold shadow-sm shadow-emerald-500/5'
                    : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`
                }
              >
                <span className="p-1.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/70 text-zinc-500 dark:text-zinc-400 group-active:scale-95 transition-transform">
                  <IconRenderer name={item.icon} size={16} />
                </span>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-5 flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-2 mb-1">Advanced Tools</p>
            <div className="grid grid-cols-1 gap-2">
              {toolItems.map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/40 active:bg-zinc-100 dark:active:bg-zinc-800/60 transition-all"
                >
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <IconRenderer name={tool.icon} size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{tool.label}</span>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-normal">{tool.desc}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800/80 p-4 bg-zinc-50/60 dark:bg-zinc-900/40 backdrop-blur-md pb-8">
          {!currentUser ? (
            <Link
              to="/signin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-center font-semibold text-sm shadow-md shadow-emerald-600/10 transition-transform active:scale-[0.99]"
            >
              Sign In to SmartAgri
            </Link>
          ) : (
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm active:bg-zinc-50 transition-colors group"
            >
              <img src={currentUser.profilePicture} alt={currentUser.username} className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500/20" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{currentUser.username}</span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">Account Intelligence</span>
              </div>
              <LucideIcons.ChevronRight size={16} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}