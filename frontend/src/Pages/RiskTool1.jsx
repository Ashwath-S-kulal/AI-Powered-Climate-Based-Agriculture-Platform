import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Components/Header";
import {
  FaLeaf, FaMapMarkerAlt, FaThermometerHalf, FaCloudRain,
  FaExclamationTriangle, FaFire, FaWater, FaCheckCircle,
  FaChartBar, FaSun
} from "react-icons/fa";
import ChatbotIcon from "../Components/ChatbotIcon";
import { useRef } from "react";


const cropList = [
  "maize", "wheat", "rice", "sorghum", "millet", "soybean", "sugarcane", "cotton",
  "groundnut", "barley", "oats", "chickpea", "pigeonpea", "lentil", "mustard",
  "rapeseed", "sunflower", "potato", "tomato", "onion", "garlic", "banana",
  "grapes", "apple", "orange", "tea", "coffee", "cocoa", "rubber", "cassava",
  "yam", "taro", "quinoa", "pearl millet", "foxtail millet", "buckwheat", "hemp",
  "tobacco", "beetroot", "carrot", "cabbage", "peas", "kidney bean", "black gram",
  "green gram", "cowpea", "fenugreek", "sesame", "jute", "flax", "rye", "triticale",
  "pumpkin", "cucumber", "bottle gourd", "bitter gourd", "ridge gourd", "brinjal",
  "cauliflower", "broccoli", "spinach", "lettuce", "coriander", "mint", "turmeric",
  "ginger", "cardamom", "clove", "cinnamon", "papaya", "pineapple", "mango",
  "guava", "lychee", "pomegranate", "watermelon", "muskmelon", "strawberry",
  "blueberry", "raspberry", "blackberry", "almond", "walnut", "cashew", "date palm",
  "fig", "olive", "avocado", "pear", "plum", "apricot", "peach", "nectarine",
  "hazelnut", "macadamia", "cranberry", "saffron", "vanilla", "hops", "agave",
  "aloe vera", "kale", "mustard greens", "beet greens", "sweet potato", "spring onion",
  "leek", "asparagus", "artichoke", "okra", "drumstick", "tamarind", "jackfruit",
  "custard apple", "passion fruit", "dragon fruit", "kiwi", "starfruit", "longan",
  "durian", "breadfruit", "plantain"
];

export default function CropRiskCalculater() {
  const [crop, setCrop] = useState("");
  const [place, setPlace] = useState("");
  const [result, setResult] = useState(null);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [showCropSug, setShowCropSug] = useState(false);
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [showPlaceSug, setShowPlaceSug] = useState(false);
  const [location, setLocation] = useState({
    placeName: "",
    latitude: null,
    longitude: null,
  });

  const recSectionRef = useRef(null);


  const fetchPlaceSuggestions = async (query) => {
    if (!query) {
      setPlaceSuggestions([]);
      setShowPlaceSug(false);
      return;
    }
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
      );
      setPlaceSuggestions(res.data);
      setShowPlaceSug(res.data.length > 0);
    } catch (error) {
      console.error(error);
      setPlaceSuggestions([]);
      setShowPlaceSug(false);
    }
  };


  useEffect(() => {
    if (!crop) {
      setFilteredCrops([]);
      setShowCropSug(false);
      return;
    }
    const matches = cropList.filter((c) =>
      c.toLowerCase().includes(crop.toLowerCase())
    );
    setFilteredCrops(matches.slice(0, 6));
    setShowCropSug(matches.length > 0);
  }, [crop]);

  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          setLocation({
            placeName: res.data.display_name,
            latitude,
            longitude,
          });

          setPlace(res.data.display_name);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingLoc(false);
        }
      },
      () => {
        alert("Location permission denied");
        setLoadingLoc(false);
      }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoadingRisk(true);

    try {
      const res = await axios.post("api/calculate/riskcalculater", {
        crop,
        location,
      });
      setResult(res.data);

      setTimeout(() => {
        recSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (err) {
      console.error(err);
      alert("Error calculating risk.");
    } finally {
      setLoadingRisk(false);
    }
  };

  const isFormValid = crop.trim() !== "" && location.latitude !== null && location.longitude !== null;

  return (
    <div className="min-h-screen text-slate-800 font-sans antialiased relative pb-16">

      <main className="w-full max-w-screen mx-auto">
        <div className="grid lg:grid-cols-12 gap-6 items-start">

          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <FaCheckCircle className="text-emerald-600" /> Parameter Matrix Setup
            </h2>

            <form onSubmit={submit} className="space-y-5 relative">
              <div className="relative">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Target Crop Index
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <FaLeaf size={14} />
                  </span>
                  <input
                    type="text"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    onFocus={() => setShowCropSug(filteredCrops.length > 0)}
                    onBlur={() => setTimeout(() => setShowCropSug(false), 200)}
                    placeholder="e.g., Wheat, Rice, Corn..."
                    className="w-full pl-9 pr-4 py-2 bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition text-sm font-medium"
                    autoComplete="off"
                  />
                </div>
                {showCropSug && filteredCrops.length > 0 && (
                  <ul className="absolute left-0 right-0 z-30 bg-white text-slate-800 rounded-lg mt-1.5 shadow-xl max-h-44 overflow-y-auto border border-slate-200/80 divide-y divide-slate-100">
                    {filteredCrops.map((c, i) => (
                      <li
                        key={i}
                        onMouseDown={() => { setCrop(c); setShowCropSug(false); }}
                        className="p-2.5 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Target Location Coordinates
                </label>
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <FaMapMarkerAlt size={13} />
                    </span>
                    <input
                      type="text"
                      value={place}
                      onChange={(e) => {
                        setPlace(e.target.value);
                        fetchPlaceSuggestions(e.target.value);
                      }}
                      onFocus={() => setShowPlaceSug(placeSuggestions.length > 0)}
                      onBlur={() => setTimeout(() => setShowPlaceSug(false), 200)}
                      placeholder="e.g., Delhi, India"
                      className="w-full pl-9 pr-4 py-2 bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition text-sm font-medium"
                      autoComplete="off"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUseLocation}
                    disabled={loadingLoc}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5 justify-center"
                  >
                    {loadingLoc ? (
                      <>
                        <span className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                        Syncing...
                      </>
                    ) : (
                      <>
                        <FaMapMarkerAlt className="text-slate-400" /> Auto Locate
                      </>
                    )}
                  </button>
                </div>

                {showPlaceSug && placeSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 z-30 bg-white text-slate-800 rounded-lg mt-1.5 shadow-xl max-h-44 overflow-y-auto border border-slate-200/80 divide-y divide-slate-100">
                    {placeSuggestions.map((p, i) => (
                      <li
                        key={i}
                        onMouseDown={() => {
                          setLocation({
                            placeName: p.display_name,
                            latitude: parseFloat(p.lat),
                            longitude: parseFloat(p.lon),
                          });
                          setPlace(p.display_name);
                          setShowPlaceSug(false);
                        }}
                        className="p-2.5 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors truncate"
                      >
                        {p.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                disabled={loadingRisk || !isFormValid}
                className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition text-sm disabled:bg-slate-400 flex justify-center items-center gap-2"
              >
                {loadingRisk ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Evaluating Climatology...
                  </>
                ) : (
                  <>
                    <FaCheckCircle size={14} /> Analyze Risk Indexes
                  </>
                )}
              </button>
              {/* Updated professional disclaimer */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                  <strong className="text-emerald-700 font-bold">Note:</strong> These recommendations are generated by Artificial Intelligence.
                  While we strive for accuracy, climate data and crop biology are complex.
                </p>
              </div>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[380px] flex flex-col justify-between">
            {loadingRisk ? (
              <div className="flex flex-col justify-center items-center my-auto space-y-3">
                <span className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
                <p className="text-slate-500 font-medium text-sm">Processing computational risk margins...</p>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between space-y-6">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                    <FaChartBar className="text-emerald-600" /> Evaluation Metrics Result
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                    <div className="sm:col-span-3 pb-2 border-b border-slate-200/60 flex items-start gap-1.5">
                      <FaMapMarkerAlt className="text-slate-400 mt-0.5 flex-shrink-0" size={13} />
                      <div>
                        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-0.5">Boundary Target Location</span>
                        <span className="text-slate-800 font-medium leading-relaxed">
                          {result?.location?.place || <span className="italic text-slate-400 font-normal">No telemetry synchronized</span>}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 sm:pt-0">
                      <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-0.5">Temperature Baseline</span>
                      <p className="text-slate-800 font-mono font-bold text-sm flex items-center gap-1">
                        <FaThermometerHalf className="text-slate-400" />
                        {result?.weatherData?.temperature !== undefined ? `${result.weatherData.temperature}°C` : "--"}
                      </p>
                    </div>
                    <div className="pt-2 sm:pt-0">
                      <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-0.5">Precipitation Scale</span>
                      <p className="text-slate-800 font-mono font-bold text-sm flex items-center gap-1">
                        <FaCloudRain className="text-slate-400" />
                        {result?.weatherData?.rainfall !== undefined ? `${result.weatherData.rainfall} mm` : "--"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Risk Distribution Aggregations */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <FaExclamationTriangle size={12} className="text-slate-400" /> Stress Factor Indexes
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white border border-slate-200 p-3 rounded-xl">
                      <FaFire className="text-amber-600 mb-1 mx-auto" size={14} />
                      <p className="font-semibold text-slate-400 tracking-wide text-[10px] uppercase">Drought Risk</p>
                      <p className="text-lg font-bold text-slate-800 mt-0.5">{result?.riskScores?.droughtRisk ? `${result.riskScores.droughtRisk.toFixed(1)}/5` : "--"}</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded-xl">
                      <FaWater className="text-blue-600 mb-1 mx-auto" size={14} />
                      <p className="font-semibold text-slate-400 tracking-wide text-[10px] uppercase">Flood Risk</p>
                      <p className="text-lg font-bold text-slate-800 mt-0.5">{result?.riskScores?.floodRisk ? `${result.riskScores.floodRisk.toFixed(1)}/5` : "--"}</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded-xl">
                      <FaSun className="text-orange-600 mb-1 mx-auto" size={14} />
                      <p className="font-semibold text-slate-400 tracking-wide text-[10px] uppercase">Heat Stress</p>
                      <p className="text-lg font-bold text-slate-800 mt-0.5">{result?.riskScores?.heatRisk ? `${result.riskScores.heatRisk.toFixed(1)}/5` : "--"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Recommendations Structural Block */}
        <div ref={recSectionRef} className="mt-6 bg-white border border-slate-200 shadow-sm w-full rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FaLeaf className="text-emerald-600" /> Resilient Cultivation Advice Recommendations
          </h3>
          <ul className="space-y-2.5">
            {result?.recommendations?.length > 0 ? (
              result.recommendations.map((r, i) => (
                <li
                  key={i}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3 hover:border-emerald-200 transition-colors"
                >
                  <FaCheckCircle className="text-emerald-600 mt-1 flex-shrink-0" size={16} />

                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-sm">
                      {r.title || "Recommendation"}
                    </span>

                    <span className="text-slate-600 text-xs sm:text-sm mt-0.5">
                      {typeof r === 'string' ? r : r.suggestion}
                    </span>

                    {r.category && (
                      <div className="flex gap-2 mt-2">
                        <span className="text-[9px] font-black uppercase bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                          {r.category}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${r.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {r.priority} Priority
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center py-6 text-xs text-slate-400 font-medium italic">
                Awaiting input telemetry configuration to produce adaptation metrics.
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}