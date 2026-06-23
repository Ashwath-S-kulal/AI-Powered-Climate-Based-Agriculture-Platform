import React, { useState, useEffect, useMemo } from "react";
import {
  FaSyringe,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FiImage, FiActivity } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import Header from "../Components/Header";

export default function CsvReader() {
  const [csvData, setCsvData] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URI}/api/cropdiseases`)
      .then((res) => res.json())
      .then((data) => {
        setCsvData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching disease data:", error);
        setLoading(false);
      });
  }, []);

  const uniqueDiseaseNames = useMemo(() => {
    return [...new Set(csvData.map((row) => row.disease_name).filter(Boolean))].sort();
  }, [csvData]);

  const filteredData = useMemo(() => {
    if (selectedDisease.trim() === "") {
      return csvData;
    }
    return csvData.filter((d) => d.disease_name === selectedDisease);
  }, [csvData, selectedDisease]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-800 dark:text-zinc-200 font-sans">
      <Header />
      <div className="w-full bg-white dark:bg-[#09090b] border-b border-slate-200 dark:border-zinc-800 pt-10 pb-12">
        <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 text-left">
            Disease Data Dashboard
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm md:text-sm mx-auto text-left">
            Explore comprehensive data on crop diseases, visual symptoms, and recommended actions.
          </p>
        </div>
      </div>

      <div className="px-10 w-full max-w-screen mx-auto relative -top-6 z-20">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:max-w-md">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-zinc-500 w-3.5 h-3.5" />
            <select
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none text-slate-700 dark:text-zinc-300 text-sm font-medium transition-all cursor-pointer outline-none"
              value={selectedDisease}
              onChange={(e) => {
                setSelectedDisease(e.target.value);
                setExpandedIndex(null);
              }}
            >
              <option value="">All Diseases</option>
              {uniqueDiseaseNames.map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-zinc-500 w-3 h-3 pointer-events-none" />
          </div>
          <div className="text-sm font-medium text-slate-500 dark:text-zinc-500 md:ml-auto">
            Showing {filteredData.length} entries
          </div>
        </div>

        {loading && (
          <div className="flex flex-col justify-center items-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400 mb-4" />
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              Loading disease database...
            </p>
          </div>
        )}

        {!loading && filteredData.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-20">
            <div className="grid grid-cols-[80px_1fr_100px] sm:grid-cols-[100px_1fr_120px] bg-slate-50 dark:bg-zinc-950 text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider p-4 border-b border-slate-200 dark:border-zinc-800">
              <div className="text-center sm:text-left">Image</div>
              <div>Disease Name</div>
              <div className="text-right pr-2">Action</div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredData.map((row, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div key={idx} className="group flex flex-col transition-colors duration-200 hover:bg-slate-50/50 dark:hover:bg-zinc-800/50">
                    <div
                      className="grid grid-cols-[80px_1fr_100px] sm:grid-cols-[100px_1fr_120px] items-center p-3 sm:p-4 cursor-pointer"
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    >
                      <div className="flex justify-center sm:justify-start pl-2">
                        {row.image_url ? (
                          <img
                            src={row.image_url}
                            alt={row.disease_name}
                            className="h-12 w-12 sm:h-14 sm:w-14 object-cover rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm"
                          />
                        ) : (
                          <div className="h-12 w-12 sm:h-14 sm:w-14 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-300 dark:text-zinc-600 rounded-xl border border-slate-200 dark:border-zinc-700">
                            <FiImage className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                        )}
                      </div>

                      <div className="text-slate-900 dark:text-zinc-100 font-semibold text-sm sm:text-base pr-4">
                        {row.disease_name || "Unknown Disease"}
                      </div>

                      <div className="flex justify-end pr-2">
                        <button
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${isExpanded
                              ? "bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200"
                              : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30 group-hover:text-emerald-700 dark:group-hover:text-emerald-400"
                            }`}
                        >
                          {isExpanded ? "Hide" : "Details"}
                          {isExpanded ? <FaChevronUp className="w-2.5 h-2.5" /> : <FaChevronDown className="w-2.5 h-2.5" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="bg-slate-50/50 dark:bg-zinc-950/50 p-4 sm:p-6 border-t border-slate-100 dark:border-zinc-800">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-1/3 flex-shrink-0">
                            <div className="w-full aspect-square md:aspect-auto md:h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                              {row.image_url ? (
                                <img src={row.image_url} alt={row.disease_name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-zinc-600">
                                  <FiImage className="w-10 h-10 mb-2 opacity-50" />
                                  <span className="text-sm">No image available</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="w-full md:w-2/3 flex flex-col gap-4">
                            <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800">
                              <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
                                <IoInformationCircleOutline className="w-4 h-4 text-emerald-500" /> Description
                              </h3>
                              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm">
                                {row.description || <span className="text-slate-400 italic">No description provided.</span>}
                              </p>
                            </div>

                            <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800">
                              <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
                                <FiActivity className="w-4 h-4 text-emerald-500" /> Recommended Actions
                              </h3>
                              <ul className="text-slate-600 dark:text-zinc-400 space-y-2 text-sm">
                                {(row["Possible Steps"]?.split("\n") || [])
                                  .filter((step) => step.trim() !== "")
                                  .map((step, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                                      <span className="leading-relaxed">{step.trim()}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && filteredData.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <FaSyringe className="mx-auto text-3xl text-slate-300 dark:text-zinc-700 mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No data found</h3>
          </div>
        )}
      </div>
    </div>
  );
}