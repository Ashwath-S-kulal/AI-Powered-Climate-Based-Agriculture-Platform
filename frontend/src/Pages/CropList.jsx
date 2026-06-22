import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FiSearch,
  FiRefreshCcw,
  FiX,
  FiEye,
  FiImage,
} from "react-icons/fi";
import { GiTreeGrowth } from "react-icons/gi";
import { Loader2 } from "lucide-react";

import Header from "../Components/Header";
import CropStepsView from "./CropStepsView";
import ChatbotIcon from "../Components/ChatbotIcon";

export default function CropsList() {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");
  const [selectedCropNum, setSelectedCropNum] = useState(null);
  const searchInputRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URI}/api/cropsteps/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCrops(data);
        else {
          console.error("Invalid crop data format", data);
          setCrops([]);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const selectedCrop = useMemo(
    () => crops.find((c) => c.num === selectedCropNum),
    [selectedCropNum, crops]
  );

  const searchSuggestions = useMemo(() => {
    if (!search) return [];
    return crops
      .filter((c) => c.name?.toLowerCase().startsWith(search.toLowerCase()))
      .slice(0, 5)
      .map((c) => c.name);
  }, [search, crops]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setTimeout(() => setShowSuggestions(false), 100);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    return crops.filter((c) => {
      const s = search.toLowerCase();
      const matchesSearch = c.name?.toLowerCase().includes(s);
      const matchesSeason = seasonFilter ? String(c.season)?.includes(seasonFilter) : true;
      return matchesSearch && matchesSeason;
    });
  }, [search, seasonFilter, crops]);

  const reset = () => {
    setSelectedCropNum(null);
    setSearch("");
    setSeasonFilter("");
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (name) => {
    setSearch(name);
    setSelectedCropNum(null);
    setShowSuggestions(false);
  };

  const isDetailViewOpen = selectedCropNum !== null;

 return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-800 dark:text-zinc-200 font-sans">
      <Header />
      
      {/* Hero Header Area */}
      <div className="w-full bg-white dark:bg-[#09090b] border-b border-slate-200 dark:border-zinc-800 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <h1 className="text-2xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Crop Cultivation Guides
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm md:text-sm mx-auto text-left">
            Explore step-by-step growing processes for various crops across different seasons.
          </p>
        </div>
      </div>

      <div className="px-4 w-full max-w-7xl mx-auto relative -top-6 z-20">
        {/* Search & Filter Control Bar */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4">
          
          <div className="relative flex-1 w-full" ref={searchInputRef}>
            <div className="flex items-center bg-slate-50 dark:bg-zinc-950 rounded-xl px-4 py-2.5 gap-3 border border-slate-200 dark:border-zinc-800 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <FiSearch className="text-slate-400 dark:text-zinc-500 text-lg flex-shrink-0" />
              <input
                type="text"
                placeholder="Search crop name..."
                className="w-full outline-none text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder-zinc-600 bg-transparent text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedCropNum(null);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => search.length >= 1 && setShowSuggestions(true)}
              />
              {search && (
                <FiX
                  className="text-slate-400 dark:text-zinc-500 cursor-pointer hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                  onClick={() => setSearch("")}
                />
              )}
            </div>

            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute w-full mt-2 z-30 max-h-60 overflow-y-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-slate-100 dark:border-zinc-800 py-1">
                {searchSuggestions.map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors border-b border-slate-50 dark:border-zinc-800 last:border-0"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionClick(name);
                    }}
                  >
                    <GiTreeGrowth className="text-emerald-500 dark:text-emerald-400" />
                    <span className="font-medium text-slate-700 dark:text-zinc-300 text-sm">{name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {["Winter", "Spring", "Summer"].map((season) => (
              <button
                key={season}
                onClick={() => setSeasonFilter(season === seasonFilter ? "" : season)}
                className={`flex-1 md:flex-none items-center justify-center text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 border ${
                  seasonFilter === season
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white dark:bg-zinc-950 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800"
                }`}
              >
                {season}
              </button>
            ))}
            <button
              onClick={reset}
              className="flex items-center justify-center text-xs gap-1.5 bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 py-2.5 px-4 rounded-xl transition-colors font-medium hover:text-slate-900 dark:hover:text-zinc-200 w-full sm:w-auto"
            >
              <FiRefreshCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400 mb-4" />
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              Loading crop database...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <GiTreeGrowth className="mx-auto text-4xl text-slate-300 dark:text-zinc-700 mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No crops found</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filtered.map((c) => (
            <div
              key={c.num}
              onClick={() => setSelectedCropNum(c.num)}
              className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-300 group flex flex-col"
            >
              <div className="h-44 overflow-hidden bg-slate-100 dark:bg-zinc-950 relative border-b border-slate-100 dark:border-zinc-800">
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-zinc-700">
                    <FiImage className="text-3xl" />
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {c.name}
                </h2>
                
                <div className="mt-auto pt-4 flex justify-between items-center text-sm">
                  <span className="flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-700">
                    {c.type}
                  </span>
                  <div className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 transition-colors">
                    View Guide <FiEye className="ml-1.5 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drawer / Modal View */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isDetailViewOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedCropNum(null)}></div>

        <div className={`absolute mt-10 bottom-0 left-0 right-0 w-full lg:max-w-4xl max-h-[85vh] mx-auto bg-white dark:bg-zinc-900 md:rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-500 ${isDetailViewOpen ? "translate-y-0" : "translate-y-full"}`}>
          {selectedCrop && (
            <>
              <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 md:rounded-t-3xl z-10">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedCrop.name} Guide</h2>
                <button
                  onClick={() => setSelectedCropNum(null)}
                  className="p-2 bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-zinc-700"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-slate-50/50 dark:bg-zinc-950">
                <CropStepsView crop={selectedCrop} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}