import React, { useState, useEffect, useRef } from 'react';
import {
  Search, MapPin, Thermometer, Droplet, Sprout, Info, Calendar, BarChart3
} from 'lucide-react';
import Header from "../Components/Header";
import { FiSearch } from "react-icons/fi";
import ChatbotIcon from "../Components/ChatbotIcon";

export default function FriendlySoilChecker() {
  const [userInputCity, setUserInputCity] = useState("");
  const [dropdownLocations, setDropdownLocations] = useState([]);
  
  const [currentLocation, setCurrentLocation] = useState(null);
  const [soilReport, setSoilReport] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [alertNotice, setAlertNotice] = useState(null);
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            if (res.ok) {
              const data = await res.json();
              setCurrentLocation({
                friendlyName: data.display_name || "Your Current Location",
                lat: latitude,
                lon: longitude
              });
            } else {
              throw new Error();
            }
          } catch {
            setCurrentLocation({
              friendlyName: `Detected Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
              lat: latitude,
              lon: longitude
            });
          }
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          console.warn("Location access denied or unavailable. Falling back to default baseline.");
          setCurrentLocation({
            friendlyName: "Bengaluru, Karnataka, India",
            lat: 12.9716,
            lon: 77.5946
          });
        }
      );
    } else {
      setCurrentLocation({
        friendlyName: "Bengaluru, Karnataka, India",
        lat: 12.9716,
        lon: 77.5946
      });
    }
  }, []);

  useEffect(() => {
    if (currentLocation) {
      loadLiveUndergroundData(currentLocation.lat, currentLocation.lon);
    }
  }, [currentLocation]);

  const handleTypingSuggestions = (value) => {
    clearTimeout(searchTimeout.current);
    setUserInputCity(value);
    if (!value.trim()) {
      setDropdownLocations([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`);
        if (response.ok) {
          const matches = await response.json();
          setDropdownLocations(matches);
        }
      } catch {
        setDropdownLocations([]);
      }
    }, 300);
  };

  const triggerManualSearch = async () => {
    if (!userInputCity.trim()) return;
    setIsDataLoading(true);
    setAlertNotice(null);
    setDropdownLocations([]);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(userInputCity)}&limit=1`);
      const matches = await response.json();
      if (matches && matches.length > 0) {
        setCurrentLocation({
          friendlyName: matches[0].display_name,
          lat: parseFloat(matches[0].lat),
          lon: parseFloat(matches[0].lon)
        });
      } else {
        setAlertNotice(`Location "${userInputCity}" could not be matched. Please double-check spelling.`);
      }
    } catch (err) {
      console.error(err);
      setAlertNotice("Failed to resolve location coordinates via networks.");
    } finally {
      setIsDataLoading(false);
    }
  };

  const loadLiveUndergroundData = async (lat, lon) => {
    setIsDataLoading(true);
    setAlertNotice(null);
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=soil_moisture_0_to_7cm,soil_moisture_7_to_28cm,soil_temperature_0_to_7cm,soil_temperature_7_to_28cm&forecast_days=1&timezone=auto`);
      if (!response.ok) throw new Error("The weather station failed to stream current ground metrics.");
      
      const rawData = await response.json();
      const rightNowHour = new Date().getHours();

      const moistureLayerA = rawData.hourly.soil_moisture_0_to_7cm[rightNowHour] ?? 0.2;
      const moistureLayerB = rawData.hourly.soil_moisture_7_to_28cm[rightNowHour] ?? 0.2;
      const tempLayerA = rawData.hourly.soil_temperature_0_to_7cm[rightNowHour] ?? 25;
      const tempLayerB = rawData.hourly.soil_temperature_7_to_28cm[rightNowHour] ?? 24;

      // Scaling down baseline saturation (where 0.45 m³/m³ raw VWC map to 100% saturation capacity)
      const readableTopMoisture = Math.min(100, Math.round((moistureLayerA / 0.45) * 100));
      const readableDeepMoisture = Math.min(100, Math.round((moistureLayerB / 0.45) * 100));

      setSoilReport({
        surfaceWetness: readableTopMoisture,
        rootWetness: readableDeepMoisture,
        surfaceTemp: Math.round(tempLayerA),
        deepTemp: Math.round(tempLayerB)
      });
    } catch (err) {
      setAlertNotice(err.message);
    } finally {
      setIsDataLoading(false);
    }
  };

  const translateDataToAdvice = () => {
    if (!soilReport) return null;
    const { surfaceWetness, surfaceTemp } = soilReport;

    if (surfaceWetness < 35) {
      return {
        headline: "Thirsty Soil - Critical Irrigation Required",
        badgeColor: "bg-rose-500 text-white",
        textColor: "text-rose-900 bg-rose-50 border-rose-200/80",
        summary: "The shallow topsoil layer is falling below the critical baseline. If handling shallow crops, apply hydration immediately to protect fresh roots from dry heat stress."
      };
    }
    if (surfaceWetness > 85) {
      return {
        headline: "Soggy Ground - Halting Water Pumps",
        badgeColor: "bg-blue-600 text-white",
        textColor: "text-blue-900 bg-blue-50 border-blue-200/80",
        summary: "Soil structure has reached complete volumetric saturation. Suspend all active automated watering loops immediately to let root capillaries breathe oxygen and counter deep rot risks."
      };
    }
    if (surfaceTemp > 38) {
      return {
        headline: "Severe Surface Heat Stress Warning",
        badgeColor: "bg-amber-500 text-slate-950",
        textColor: "text-amber-900 bg-amber-50 border-amber-200/80",
        summary: "Surface dirt temperatures are spiking. Postpone vulnerable micro-transplanting tasks today, or deploy loose straw mulching covers to conserve shallow surface moisture profiles."
      };
    }
    return {
      headline: "Optimized Moisture Baseline Balanced",
      badgeColor: "bg-emerald-600 text-white",
      textColor: "text-emerald-900 bg-emerald-50 border-emerald-200/80",
      summary: "Underground parameters match the ideal growth profile. Excellent window for organic micro-manure blending, open seeding schedules, or basic structural tilling."
    };
  };

  const adviceBox = translateDataToAdvice();
  const currentLongDateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black text-slate-800 dark:text-zinc-200 font-sans antialiased relative pb-16 transition-colors duration-200">
      <Header />

      <div className="w-full bg-white dark:bg-[#09090b] border-b border-slate-200/80 dark:border-zinc-800/80 pt-5 md:pt-10 pb-8 px-4 sm:px-6 transition-colors duration-200">
        <div className="max-w-screen mx-auto">
          <div className="text-left md:flex md:items-left md:justify-between mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center justify-start gap-2">
                <Sprout className="text-emerald-600 dark:text-emerald-400" size={26} /> <span className='hidden md:block'>Live Sub -</span>Soil Analytics Diagnostics
              </h1>
              <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1 max-w-xl">
                Real-time sub-surface telemetry profiling, soil moisture density metrics, and root-zone agricultural advisory mapping indexes.
              </p>
            </div>
          </div>

          <div className="max-w-screen p-1.5 rounded-xl  relative transition-colors duration-200">
            <div className="flex gap-2 items-center w-full relative">
              <div className="relative flex-grow">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" size={16} />
                <input
                  type="text"
                  placeholder="Search target village, town or region coordinates..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-black text-slate-900 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 border border-slate-200 dark:border-zinc-800 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition text-sm font-medium"
                  value={userInputCity}
                  onChange={(e) => handleTypingSuggestions(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && triggerManualSearch()}
                />
              </div>
              <button
                onClick={triggerManualSearch}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium flex items-center justify-center"
              >
                Diagnostic
              </button>
            </div>

            {dropdownLocations.length > 0 && (
              <ul className="absolute left-0 right-0 z-50 mt-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800">
                {dropdownLocations.map((place, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setCurrentLocation({
                        friendlyName: place.display_name,
                        lat: parseFloat(place.lat),
                        lon: parseFloat(place.lon)
                      });
                      setDropdownLocations([]);
                      setUserInputCity("");
                    }}
                    className="p-3 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors truncate"
                  >
                    🏡 {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-screen mx-auto px-4 sm:px-6 mt-8">
        {(isDataLoading || !currentLocation) ? (
          <div className="flex flex-col justify-center items-center py-20 bg-white dark:bg-[#09090b] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm transition-colors duration-200">
            <div className="w-8 h-8 border-4 border-slate-200 dark:border-zinc-700 border-t-emerald-600 dark:border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-500 mt-4">Syncing live telemetry parameters...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {alertNotice && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900/50 text-sm font-medium">
                Notice: {alertNotice}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
              {soilReport && (
                <div className="lg:col-span-4 w-full">
                  <div className="p-5 bg-white dark:bg-[#09090b] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm h-full flex flex-col justify-between transition-colors duration-200">
                    <div>
                      <h2 className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center border-b border-slate-100 dark:border-zinc-800 pb-3 mb-4">
                        <Info className="w-4 h-4 mr-1.5 text-slate-400" /> Ground Baseline Node
                      </h2>

                      <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 flex items-start gap-1">
                        <MapPin className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-emerald-500 flex-shrink-0" size={16} />
                        <span className="line-clamp-2">{currentLocation.friendlyName.split(",")[0].trim()}</span>
                      </h3>

                      <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 pl-5">
                        {currentLongDateStr}
                      </p>

                      <div className="flex flex-col items-center py-8 my-2 border-b border-slate-100 dark:border-zinc-800 text-center">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-full border border-emerald-100/50 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-500">
                          <Sprout size={36} />
                        </div>
                        <p className="text-4xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight mt-4">
                          {soilReport.surfaceWetness}%<span className="text-lg text-slate-400 font-medium ml-1">VWC Status</span>
                        </p>
                        <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 mt-1 px-4">
                          Topsoil composite index holds {soilReport.surfaceTemp}°C residual heat.
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg text-center">
                          <Thermometer className="w-5 h-5 mx-auto text-slate-400 dark:text-zinc-600 mb-1" />
                          <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-zinc-500">Surface Temp</p>
                          <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 font-mono mt-0.5">{soilReport.surfaceTemp}°C</p>
                        </div>

                        <div className="p-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg text-center">
                          <Droplet className="w-5 h-5 mx-auto text-slate-400 dark:text-zinc-600 mb-1" />
                          <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-zinc-500">Top Hydration</p>
                          <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 font-mono mt-0.5">{soilReport.surfaceWetness}%</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 mt-4 px-3 py-2 rounded-lg text-slate-400 dark:text-zinc-600 italic text-[11px] text-center">
                        Soil profiles scale dynamically based on soil topology variations.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {soilReport && (
                <div className="lg:col-span-8 w-full flex flex-col gap-6">
                  <div className="p-5 bg-white dark:bg-[#09090b] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-grow transition-colors duration-200">
                    <h2 className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center border-b border-slate-100 dark:border-zinc-800 pb-3 mb-4">
                      <BarChart3 className="w-4 h-4 mr-1.5 text-slate-400" /> Vertical Stratum Layer Vectors
                    </h2>

                    <div className="space-y-5">
                      <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-xs text-slate-900 dark:text-zinc-200 uppercase tracking-wider">Topsoil Layer (0 to 7 cm Depth)</p>
                            <p className="text-[11px] text-slate-400 font-medium">Seed sprout incubation and shallow fertilization level</p>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-900 dark:text-zinc-200 font-mono font-bold text-xs bg-white dark:bg-black border border-slate-200 dark:border-zinc-700 px-2 py-0.5 rounded shadow-3xs">
                              {soilReport.surfaceTemp}°C
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                            <span>Volumetric Moisture Content Level:</span>
                            <span className="font-mono text-blue-600 dark:text-blue-400">{soilReport.surfaceWetness}% Cap</span>
                          </div>
                          <div className="w-full bg-slate-200/60 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 dark:bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${soilReport.surfaceWetness}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-xs text-slate-900 dark:text-zinc-200 uppercase tracking-wider">Deep Root Stratum (7 to 28 cm Depth)</p>
                            <p className="text-[11px] text-slate-400 font-medium">Core root hydration reservoir and structural growth zone</p>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-900 dark:text-zinc-200 font-mono font-bold text-xs bg-white dark:bg-black border border-slate-200 dark:border-zinc-700 px-2 py-0.5 rounded shadow-3xs">
                              {soilReport.deepTemp}°C
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                            <span>Sub-Surface Deep Water Reserves:</span>
                            <span className="font-mono text-teal-600 dark:text-teal-400">{soilReport.rootWetness}% Cap</span>
                          </div>
                          <div className="w-full bg-slate-200/60 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-teal-500 dark:bg-teal-600 h-full rounded-full transition-all duration-500" style={{ width: `${soilReport.rootWetness}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {adviceBox && (
                    <div className={`border dark:border-none bg-slate-200/60 dark:bg-zinc-900 p-4 rounded-xl shadow-sm flex flex-col gap-2 transition-all duration-300 ${adviceBox.textColor}`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${adviceBox.badgeColor}`}>
                          Automated Expert Advisory
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold tracking-tight dark:text-white">{adviceBox.headline}</h3>
                      </div>
                      <p className="text-xs font-medium leading-relaxed opacity-90 dark:text-white">
                        {adviceBox.summary}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <ChatbotIcon />
    </div>
  );
}