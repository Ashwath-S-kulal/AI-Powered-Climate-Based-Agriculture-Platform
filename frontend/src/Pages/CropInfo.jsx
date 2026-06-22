import {
  FaSeedling, FaLeaf, FaExclamationTriangle, FaMountain,
  FaTint, FaSun, FaCalendarAlt, FaFlask, FaChartLine,
  FaThermometerHalf
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Papa from "papaparse";
import Header from "../Components/Header";
import { useState, useEffect } from "react";
import ChatbotIcon from "../Components/ChatbotIcon";
import { Loader2 } from "lucide-react"; // Assuming you have lucide-react installed from the previous component

const keyDataIcons = {
  "Ideal pH": FaFlask,
  "Water Needs": FaTint,
  "Sunlight Requirements": FaSun,
  "Soil Type": FaMountain,
  "Planting Season": FaCalendarAlt,
  "Typical Height": FaChartLine,
  "Yield": FaChartLine,
  "Optimal Temperature": FaThermometerHalf,
};

const keyStatHeaders = [
  "Ideal pH",
  "Water Needs",
  "Sunlight Requirements",
  "Soil Type",
  "Planting Season",
  "Typical Height (m)",
  "Yield (Tons/Hectare)",
  "Optimal Temp",
];

export default function CropSearchCSV() {
  const [crops, setCrops] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const isInitialState = result?.initial;
  const isErrorState = result?.error;
  const isDataState = result?.["Crop Name"];

  const formatValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") return Object.values(value).join(", ");
    return value;
  };

  useEffect(() => {
    setLoading(true);

    fetch(`${import.meta.env.VITE_BASE_URI}/api/cropinfo/`)
      .then((res) => res.json())
      .then((data) => {
        setCrops(data);

        if (data.length > 0) {
          const headers = Object.keys(data[0]).filter(
            (key) => key !== "_id" && key !== "__v" && key !== "Crop_Name"
          );
          setHeaders(headers);
          setResult({ initial: true });
        }

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = async (query) => {
    const finalQuery = query || search;
    if (!finalQuery) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URI}/api/cropinfo/${encodeURIComponent(finalQuery)}`
      );

      if (!res.ok) {
        setResult({ error: `No detailed information found for: ${finalQuery}` });
        return;
      }

      const data = await res.json();
      setResult(data);
      setSuggestions([]);
      setIsFocused(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      setResult({ error: "Server error, please try again later." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search || !isFocused) return setSuggestions([]);

    const match = crops
      .filter((row) =>
        row["Crop Name"]?.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5);

    setSuggestions(match);
  }, [search, crops, isFocused]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(search);
  };

  const handleSuggestionClick = (cropName) => {
    setSearch(cropName);
    handleSearch(cropName);
  };

  const formatKeyName = (key) => {
    if (key === "Typical Height (m)") return "Typical Height";
    if (key === "Yield (Tons/Hectare)") return "Yield";
    if (key === "Planting Season") return "Planting Season";
    if (key === "Optimal Temp") return "Optimal Temp";
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (x) => x.toUpperCase())
      .replace(/_/g, " ")
      .trim();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      
      <div className="w-full max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-2xl font-extrabold text-slate-900 tracking-tight text-left">
            Crop Deep Information
          </h1>
          <p className="mt-2 text-sm text-slate-500 text-left">
            Search and analyze comprehensive cultivation data
          </p>
        </div>

        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
            <p className="text-sm font-medium text-slate-500">
              Loading crop database...
            </p>
          </div>
        )}

        {!loading && (
          <main className="w-full space-y-8">
            {(isInitialState || isDataState) && (
              <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-3 md:p-5 space-y-10">
                
                {/* Search & Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                      <FaLeaf className="text-emerald-600 w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {isDataState ? result["Crop Name"] : "Explore Crops"}
                    </h2>
                  </div>

                  <div className="w-full md:max-w-md relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                      type="text"
                      placeholder="Search for a crop..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                      className="w-full pl-11 pr-24 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all sm:text-sm"
                    />
                    <button
                      onClick={() => handleSearch(search)}
                      className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg font-medium text-xs tracking-wide transition-colors"
                    >
                      Search
                    </button>

                    {suggestions.length > 0 && isFocused && (
                      <ul className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto z-30">
                        {suggestions.map((s, i) => (
                          <li
                            key={i}
                            onClick={() => handleSuggestionClick(s["Crop Name"])}
                            className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 transition-colors border-b border-slate-100 last:border-0"
                          >
                            {s["Crop Name"]}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Key Stats Grid */}
                <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {headers
                    .filter((key) => keyStatHeaders.includes(key))
                    .map((key) => {
                      const formatted = formatKeyName(key);
                      const Icon = keyDataIcons[formatted] || FaLeaf;
                      const rawValue = isDataState ? (
                        result[key]
                      ) : (
                        <span className="text-slate-400 italic text-[13px] font-normal">
                          Awaiting search...
                        </span>
                      );

                      return (
                        <div
                          key={key}
                          className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-slate-300 transition-colors flex flex-col items-center text-center group"
                        >
                          <div className="bg-slate-50 border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors p-3 rounded-xl mb-3">
                            <Icon className="text-slate-500 group-hover:text-emerald-600 w-5 h-5 transition-colors" />
                          </div>
                          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            {formatted}
                          </h4>
                          <p className="text-sm font-semibold text-slate-900">
                            {isDataState ? formatValue(rawValue) : rawValue}
                          </p>
                        </div>
                      );
                    })}
                </section>

                {/* Detailed Cultivation Data Table */}
                <section className="pt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    Detailed Cultivation Data
                  </h3>

                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full text-sm text-left table-fixed">
                      <thead className="bg-slate-50/50 border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider w-1/3">
                            Parameter
                          </th>
                          <th className="px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider w-2/3">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {headers
                          .filter(
                            (key) =>
                              !["Crop Name", "Image Description", ...keyStatHeaders].includes(key)
                          )
                          .map((key) => {
                            const formatted = formatKeyName(key);
                            const rawValue = isDataState ? result[key] : "—";

                            return (
                              <tr
                                key={key}
                                className="hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="px-5 py-4 font-medium text-slate-700 align-top">
                                  <div className="flex items-start gap-2">
                                    <FaLeaf className="text-slate-300 w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                    <span>{formatted}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4 text-slate-600 align-top">
                                  {formatValue(rawValue)}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </section>

              </div>
            )}

            {isErrorState && (
              <div className="w-full bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-xl flex items-start sm:items-center gap-3 shadow-sm">
                <FaExclamationTriangle className="text-amber-500 w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-sm font-medium">{result.error}</p>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}