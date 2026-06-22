import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import * as LucideIcons from "lucide-react";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Dashboard" },
    { to: "/croplibrary", label: "Library" },
    { to: "/weather", label: "Weather" },
    { to: "/geointelligence", label: "Geo Intelligence" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="font-bold text-lg text-slate-900">SmartAgri</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-500'}`}
            >
              {item.label}
            </NavLink>
          ))}

          {/* Desktop Hover Dropdown */}
          <div className="relative group">
            <button className="text-sm font-medium text-slate-600 hover:text-emerald-500 flex items-center gap-1">
              Tools <LucideIcons.ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-2 hidden group-hover:block w-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-white border border-slate-100 shadow-xl rounded-lg p-1">
                <Link to="/croprecomnder" className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded">Recommender</Link>
                <Link to="/cropriskcalculater" className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded">Risk Calculator</Link>
                <Link to="/soil" className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded">Soil Analytics</Link>
                <Link to="/disease" className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded">Disease Scan</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Right side: Auth/Profile */}
        <div className="hidden md:flex items-center gap-4">
          {!currentUser ? (
            <Link to="/signin" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all active:scale-95">Sign In</Link>
          ) : (
            <Link to="/profile" className="flex items-center gap-2 border border-slate-200 rounded-full py-1 pr-3 pl-1 hover:border-emerald-300 transition-all hover:shadow-sm">
              <img src={currentUser.profilePicture} className="h-7 w-7 rounded-full object-cover" />
              <span className="text-sm font-medium text-slate-700">{currentUser.username}</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <LucideIcons.X /> : <LucideIcons.Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden absolute top-16 right-0 w-64 bg-white border-l border-b border-slate-200 overflow-hidden transition-all duration-300 ease-in-out shadow-2xl flex flex-col ${isMobileMenuOpen ? "h-[calc(100vh-64px)] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        {/* Menu Items Container */}
        <div className="flex flex-col p-6 gap-6">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-600 hover:text-emerald-600 font-semibold text-lg transition-colors"
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="border-t pt-6 flex flex-col gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tools</p>
            <Link to="/croprecomnder" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 hover:text-emerald-600">Recommender</Link>
            <Link to="/cropriskcalculater" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 hover:text-emerald-600">Risk Calculator</Link>
            <Link to="/soil" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 hover:text-emerald-600">Soil Analytics</Link>
            <Link to="/disease" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 hover:text-emerald-600">Disease Scan</Link>
          </div>
        </div>

        {/* Profile Logo / Auth Footer (Stuck to bottom) */}
        <div className="mt-auto border-t border-slate-100 p-6 bg-slate-50">
          {!currentUser ? (
            <Link
              to="/signin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-center font-semibold hover:bg-emerald-700 transition"
            >
              Sign In
            </Link>
          ) : (
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <img src={currentUser.profilePicture} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">{currentUser.username}</span>
                <span className="text-[10px] text-slate-500">View Profile</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}