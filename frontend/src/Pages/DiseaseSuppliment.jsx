import React, { useState, useEffect, useMemo } from "react";
import { FiChevronDown, FiChevronUp, FiExternalLink, FiImage } from "react-icons/fi";
import { FaFilter, FaSyringe } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import Header from "../Components/Header";

export default function SupplementCatalog() {
  const [csvData, setCsvData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState("");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URI}/api/supplements/supplimentdata`)
      .then((res) => res.json())
      .then((result) => {
        setAllData(result.data);
        setCsvData(result.data);
        setLoading(false);
      })
      .catch((error) => console.error("API Error:", error));
  }, []);

  const handleFilterChange = (event) => {
    const disease = event.target.value;
    setSelectedDisease(disease);

    if (disease === "") {
      setCsvData(allData);
    } else {
      const filtered = allData.filter((row) => row.disease_name === disease);
      setCsvData(filtered);
    }
    setExpandedRow(null);
  };

  const uniqueDiseases = useMemo(() => {
    const diseases = allData.map((row) => row.disease_name).filter(Boolean);
    return [...new Set(diseases)].sort();
  }, [allData]);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-800 dark:text-zinc-200 font-sans">
      <Header />
      <div className="w-full bg-white dark:bg-[#09090b] border-b border-slate-200 dark:border-zinc-800 pt-10 pb-12">
        <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 text-left">
            Supplement Product Catalog
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm md:text-sm text-left mx-auto">
            Browse recommended agricultural supplements and treatments tailored for specific crop diseases.
          </p>
        </div>
      </div>

      <div className="px-3 md:px-10 w-full max-w-screen mx-auto relative -top-6 z-20">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:max-w-md">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-zinc-500 w-3.5 h-3.5" />
            <select
              id="disease-filter"
              value={selectedDisease}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none text-slate-700 dark:text-zinc-300 text-sm font-medium transition-all cursor-pointer outline-none"
            >
              <option value="">All Diseases</option>
              {uniqueDiseases.map((disease) => (
                <option key={disease} value={disease}>
                  {disease}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-zinc-500 w-4 h-4 pointer-events-none" />
          </div>
          <div className="text-sm font-medium text-slate-500 dark:text-zinc-500 md:ml-auto">
            Showing {csvData.length} products
          </div>
        </div>

        {loading && (
          <div className="flex flex-col justify-center items-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400 mb-4" />
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              Loading supplement database...
            </p>
          </div>
        )}

        {!loading && csvData.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-20">
            <div className="grid grid-cols-[80px_1fr_100px] sm:grid-cols-[100px_1fr_120px] bg-slate-50 dark:bg-zinc-950 text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider p-4 border-b border-slate-200 dark:border-zinc-800">
              <div className="text-center sm:text-left">Product</div>
              <div>Target Disease</div>
              <div className="text-right pr-2">Action</div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {csvData.map((row, idx) => {
                const isExpanded = expandedRow === idx;
                return (
                  <div key={idx} className="group flex flex-col transition-colors duration-200 hover:bg-slate-50/50 dark:hover:bg-zinc-800/50">
                    <div
                      className="grid grid-cols-[80px_1fr_100px] sm:grid-cols-[100px_1fr_120px] items-center p-3 sm:p-4 cursor-pointer"
                      onClick={() => toggleRow(idx)}
                    >
                      <div className="flex justify-center sm:justify-start pl-2">
                        {row["supplement image"] ? (
                          <img
                            src={row["supplement image"]}
                            alt={row["supplement name"] || "Supplement"}
                            className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm bg-white p-1"
                          />
                        ) : (
                          <div className="h-12 w-12 sm:h-14 sm:w-14 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-300 dark:text-zinc-600 rounded-xl border border-slate-200 dark:border-zinc-700">
                            <FiImage className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col pr-4">
                        <span className="text-slate-900 dark:text-zinc-100 font-semibold text-sm sm:text-base">
                          {row.disease_name || "Unknown Disease"}
                        </span>
                        {row["supplement name"] && (
                          <span className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm truncate mt-0.5">
                            {row["supplement name"]}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-end pr-2">
                        <button
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${isExpanded
                              ? "bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200"
                              : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30 group-hover:text-emerald-700 dark:group-hover:text-emerald-400"
                            }`}
                        >
                          {isExpanded ? "Hide" : "Details"}
                          {isExpanded ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="bg-slate-50/50 dark:bg-zinc-950/50 p-4 sm:p-6 border-t border-slate-100 dark:border-zinc-800">
                        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                          <div className="w-full md:w-1/3 flex-shrink-0">
                            <div className="w-full aspect-square bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm p-4 flex items-center justify-center">
                              {row["supplement image"] ? (
                                <img src={row["supplement image"]} alt={row["supplement name"] || "Supplement"} className="max-h-full object-contain" />
                              ) : (
                                <div className="flex flex-col items-center justify-center text-slate-400 dark:text-zinc-600">
                                  <FiImage className="w-10 h-10 mb-2 opacity-50" />
                                  <span className="text-sm">No image available</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="w-full md:w-2/3 flex flex-col justify-center">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                              {row["supplement name"] || "Recommended Supplement"}
                            </h3>

                            <div className="space-y-3 mb-6">
                              <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-400">
                                <span className="font-semibold text-slate-900 dark:text-zinc-200 min-w-[120px]">Target Disease:</span>
                                <span>{row.disease_name}</span>
                              </div>
                            </div>

                            {row["buy link"] ? (
                              <a
                                href={row["buy link"]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all w-full sm:w-auto self-start"
                              >
                                <FiExternalLink className="w-4 h-4" />
                                View & Buy Now
                              </a>
                            ) : (
                              <div className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 text-sm font-medium rounded-xl w-full sm:w-auto self-start cursor-not-allowed">
                                Purchase Link Unavailable
                              </div>
                            )}
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

        {!loading && csvData.length === 0 && allData.length > 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <FaSyringe className="mx-auto text-3xl text-slate-300 dark:text-zinc-700 mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No supplements found</h3>
          </div>
        )}
      </div>
    </div>
  );
}