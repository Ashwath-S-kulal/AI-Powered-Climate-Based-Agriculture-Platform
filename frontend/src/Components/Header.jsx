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
    { to: "/", label: "Dashboard" },
    { to: "/croplibrary", label: "Library" },
    { to: "/weather", label: "Weather" },
    { to: "/geointelligence", label: "Geo Intelligence" },
  ];

  const toolItems = [
    { to: "/croprecomnder", label: "Recommender" },
    { to: "/cropriskcalculater", label: "Risk Calculator" },
    { to: "/soil", label: "Soil Analytics" },
    { to: "/disease", label: "Disease Scan" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <NavLink to="/" className="flex items-center gap-2.5 group focus:outline-none">
            <img src={logo} alt="SmartAgri Logo" className="h-9 w-9 object-contain transition-transform group-hover:scale-105" />
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              SmartAgri
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'text-emerald-600 bg-emerald-50/60 dark:bg-emerald-500/10 dark:text-emerald-400 font-semibold' 
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="relative group ml-1">
              <button className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-3 py-2 rounded-lg flex items-center gap-1 transition-all duration-200 focus:outline-none">
                Tools 
                <LucideIcons.ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180 text-zinc-400" />
              </button>
              
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 w-48 z-50">
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 shadow-xl rounded-xl p-1.5">
                  {toolItems.map((tool) => (
                    <Link 
                      key={tool.to}
                      to={tool.to} 
                      className="block px-3 py-2.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-emerald-50/50 dark:hover:bg-zinc-700/50 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg font-medium transition-colors"
                    >
                      {tool.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-4">
                        <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95 focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <LucideIcons.Sun size={20} className="text-amber-400" /> : <LucideIcons.Moon size={20} />}
            </button>

            {!currentUser ? (
              <Link to="/signin" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98]">
                Sign In
              </Link>
            ) : (
              <Link to="/profile" className="flex items-center gap-2.5 border border-zinc-200 dark:border-zinc-700 rounded-full py-1 pr-3.5 pl-1.5 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50/30 transition-all group shadow-sm">
                <img src={currentUser.profilePicture} alt={currentUser.username} className="h-7 w-7 rounded-full object-cover" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">
                  {currentUser.username}
                </span>
              </Link>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 active:bg-zinc-100 dark:active:bg-zinc-800 transition-colors"
            >
              {theme === "dark" ? <LucideIcons.Sun size={20} className="text-amber-400" /> : <LucideIcons.Moon size={20} />}
            </button>

            <button
              className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <LucideIcons.X size={22} /> : <LucideIcons.Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-zinc-900/30 dark:bg-zinc-950/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className={`fixed top-16 right-0 w-72 h-[calc(100vh-64px)] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col p-6 gap-6 overflow-y-auto flex-1">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Navigation</p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `px-3 py-2.5 rounded-xl font-medium text-base transition-colors ${
                    isActive 
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-500/10 font-semibold' 
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5 flex flex-col gap-2">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Tools</p>
            {toolItems.map((tool) => (
              <Link key={tool.to} to={tool.to} onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors font-medium text-sm">
                {tool.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800 p-5 bg-zinc-50/80 dark:bg-zinc-900/50 backdrop-blur-sm pb-10 md:pb-0">
          {!currentUser ? (
            <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-3 bg-emerald-600 text-white rounded-xl text-center font-semibold hover:bg-emerald-700 transition shadow-sm">
              Sign In
            </Link>
          ) : (
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors group">
              <img src={currentUser.profilePicture} alt={currentUser.username} className="h-11 w-11 rounded-full object-cover border-2 border-white dark:border-zinc-800 shadow-sm" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 transition-colors">{currentUser.username}</span>
                <span className="text-xs text-zinc-500 font-medium">View Profile</span>
              </div>
              <LucideIcons.ChevronRight size={16} className="ml-auto text-zinc-400" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}