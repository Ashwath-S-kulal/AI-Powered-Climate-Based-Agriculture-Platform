import React, { useEffect, useState, useRef } from "react";
import {
  Search, MapPin, Thermometer, Droplet, Wind, Sun, CloudSun, Cloud, CloudFog, CloudDrizzle,
  CloudRain, CloudSnow, CloudLightning, CloudOff, Calendar, TrendingUp, TrendingDown, BarChart3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Header from "../Components/Header";
import { FiSearch } from "react-icons/fi";


const getWeatherIcon = (code, className = "w-12 h-12 text-slate-700") => {
  let color = "text-amber-500";
  if (code >= 61 && code < 80) color = "text-blue-500";
  else if (code >= 71 && code < 90) color = "text-slate-400";
  else if (code >= 95) color = "text-rose-500";
  const finalClassName = `${className} ${color}`;
  switch (code) {
    case 0: return <Sun className={finalClassName} />;
    case 1:
    case 2: return <CloudSun className={finalClassName} />;
    case 3: return <Cloud className={finalClassName} />;
    case 45:
    case 48: return <CloudFog className={finalClassName} />;
    case 51:
    case 53:
    case 55: return <CloudDrizzle className={finalClassName} />;
    case 61:
    case 63:
    case 65: return <CloudRain className={finalClassName} />;
    case 71:
    case 73:
    case 75: return <CloudSnow className={finalClassName} />;
    case 80:
    case 81:
    case 82: return <CloudRain className={finalClassName} />;
    case 95: return <CloudLightning className={finalClassName} />;
    default: return <CloudOff className={finalClassName} />;
  }
};

const weatherCodeText = (code) => {
  const map = {
    0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Fog", 48: "Rime Fog", 51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Heavy Drizzle",
    61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain", 71: "Slight Snow", 73: "Moderate Snow",
    75: "Heavy Snow", 80: "Slight Showers", 82: "Heavy Showers", 95: "Thunderstorm",
  };
  return map[code] || "Unspecified Weather";
};

export default function Weather() {
  const [city, setCity] = useState("");
  const [coords, setCoords] = useState(null);
  const [locationName, setLocationName] = useState("Getting your location...");
  const [today, setToday] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const searchTimeout = useRef(null);

  const [insights, setInsights] = useState("");
  const [isFetchingAI, setIsFetchingAI] = useState(false);

  useEffect(() => { getCurrentLocation(); }, []);
  useEffect(() => { if (coords) { getWeather(coords.lat, coords.lon); getHistory(coords.lat, coords.lon); } }, [coords]);

  const getCurrentLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false); setLocationName("Please search for a city.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const lat = coords.latitude, lon = coords.longitude;
        setCoords({ lat, lon });
        reverseGeocode(lat, lon);
        setLoading(false);
      },
      () => { setError("Location access blocked — search manually"); setLoading(false); setLocationName("Location access denied."); }
    );
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.address) {
        const { village, town, city, state, country } = data.address;
        const name = city || town || village || "";
        setLocationName(`${name || 'Near Coordinates'}, ${state || 'State'}, ${country || 'Country'}`);
      }
    } catch { setLocationName(`Location at ${lat.toFixed(2)}, ${lon.toFixed(2)}`); }
  };

  const searchCity = async (selectedCity) => {
    const query = selectedCity || city;
    if (!query) return;
    setLoading(true);
    setError("");
    setSuggestions([]);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data || !data.length) {
        setError(`City "${query}" not found!`);
        setLoading(false);
        return;
      }
      const lat = data[0].lat, lon = data[0].lon;
      setCoords({ lat, lon });
      reverseGeocode(lat, lon);
    } catch (e) { setError("Failed to search city. Check network."); console.error(e); }
    finally { setLoading(false); }
  };

  const fetchSuggestions = (value) => {
    clearTimeout(searchTimeout.current);
    setCity(value);
    if (!value) { setSuggestions([]); return; }
    searchTimeout.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`;
        const res = await fetch(url);
        const data = await res.json();
        setSuggestions(data.map(item => ({ name: item.display_name, lat: item.lat, lon: item.lon })));
      } catch { setSuggestions([]); }
    }, 300);
  };

  const getWeather = async (lat, lon) => {
    try {
      setLoading(true);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
        `&timezone=auto&temperature_unit=celsius&wind_speed_unit=ms`;
      const res = await fetch(url);
      const data = await res.json();
      setToday({ temp: data.current.temperature_2m, humidity: data.current.relative_humidity_2m, wind: data.current.wind_speed_10m, weather_code: data.current.weather_code });
      const d = data.daily.time.map((t, i) => ({ date: t, temp_max: data.daily.temperature_2m_max[i], temp_min: data.daily.temperature_2m_min[i], weather_code: data.daily.weather_code[i] }));
      setForecast(d.slice(1, 8));
      setLoading(false);
    } catch (e) { setError("Failed to fetch current weather."); console.error(e); }
    finally { setLoading(false); }
  };

  const getHistory = async (lat, lon) => {
    try {
      const end = new Date(), start = new Date();
      start.setDate(start.getDate() - 30);
      const format = (d) => d.toISOString().split("T")[0];
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
        `&start_date=${format(start)}&end_date=${format(end)}` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max` +
        `&timezone=auto&temperature_unit=celsius&wind_speed_unit=ms`;
      const res = await fetch(url);
      const data = await res.json();
      const arr = data.daily.time.map((t, i) => ({ date: t, temp_max: data.daily.temperature_2m_max[i], temp_min: data.daily.temperature_2m_min[i], rain: data.daily.precipitation_sum[i], wind: data.daily.wind_speed_10m_max[i], weather_code: data.daily.weather_code[i] }));
      setHistory(arr.reverse());
    } catch (e) { console.log("Failed to fetch history.", e); }
    finally { setLoading(false); }
  };

  const todayDate = today ? new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : null;


  const getAIInsights = async () => {
    setIsFetchingAI(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/weather/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weatherData: today })
      });

      const data = await response.json();
      setInsights(data);

    } catch (e) {
      console.error("AI Error:", e);
    } finally {
      setIsFetchingAI(false);
    }
  };


return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans antialiased relative pb-16 transition-colors duration-300">
      <Header />

      <div className="w-full bg-white dark:bg-zinc-950 pt-5 md:pt-10 pb-8 px-4 sm:px-6 transition-colors">
        <div className="max-w-screen mx-auto">
          <div className="max-w-screen p-1.5 rounded-xl  dark:border-zinc-800/80 relative transition-colors">
            <div className="flex gap-2 items-center w-full relative">
              <div className="relative flex-grow">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" size={16} />
                <input
                  type="text"
                  placeholder="Search location, town or region..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 placeholder-slate-400 dark:placeholder-zinc-500 border border-slate-200 dark:border-zinc-800 rounded-lg focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 outline-none transition text-sm font-medium"
                  value={city}
                  onChange={(e) => fetchSuggestions(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchCity()}
                />
              </div>
              <button
                onClick={() => searchCity()}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium flex items-center justify-center shrink-0"
              >
                Search
              </button>
            </div>

            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 z-50 mt-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/60">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => searchCity(s.name)}
                    className="p-3 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="pt-3  px-6 font-sans antialiased">
        {!insights && !isFetchingAI && !loading && (
          <div className="text-left rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-50">AI Weather Summary</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Automatically generate an intelligent analysis of your current micro-climate data using our advanced predictive model.
              </p>
            </div>

            <button
              onClick={getAIInsights}
              disabled={isFetchingAI}
              className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 dark:from-violet-500 dark:to-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all shadow-sm active:scale-[0.97]"
            >
              {isFetchingAI ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <span className="text-sm">✨</span>
                  Generate summary
                </>
              )}
            </button>
          </div>
        )}

        {isFetchingAI && (
          <div className="rounded-2xl border border-emerald-100/70 dark:border-emerald-500/10 bg-emerald-50/20 dark:bg-emerald-950/5 p-6 shadow-sm animate-pulse space-y-5">
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-emerald-200/60 dark:bg-emerald-900/20 rounded" />
              <div className="h-3 w-3/4 bg-slate-200/60 dark:bg-zinc-800/40 rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-12 w-full bg-slate-100 dark:bg-zinc-800/30 rounded-xl" />
              <div className="h-12 w-full bg-slate-100 dark:bg-zinc-800/30 rounded-xl" />
            </div>
          </div>
        )}

        {insights && !isFetchingAI && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-400">
            <div className="rounded-2xl border border-emerald-100 dark:border-emerald-500/10 bg-emerald-50/40 dark:bg-emerald-950/10 p-6 shadow-[0_2px_12px_rgba(16,185,129,0.01)]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 tracking-tight">
                  {insights.title || "Agronomist Insights"}
                </h3>
              </div>

              <p className="text-xs text-emerald-800/90 dark:text-emerald-400/90 leading-relaxed mb-5">
                {insights.explanation}
              </p>

              <ul className="space-y-3">
                {insights.steps?.map((step, i) => (
                  <li
                    key={i}
                    className="bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-500/10 p-4 rounded-xl flex items-start gap-3 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200 leading-tight">
                        {step.action}
                      </p>
                      <span className="inline-block text-[10px] font-medium text-emerald-600/80 dark:text-emerald-400 bg-emerald-100/40 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md border border-emerald-100/30 dark:border-emerald-500/20">
                        ({step.type || "General"})
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/60 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-500/20 p-4 rounded-xl flex gap-3 items-start">
              <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed italic">
                {insights.disclaimer || "This advice is AI-generated and should not be considered a substitute for professional agricultural consultation."} Always consult a local expert.
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setInsights(null)}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 uppercase tracking-wider transition-colors px-3 py-1.5 rounded-lg"
              >
                Dismiss Analysis
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-screen mx-auto px-4 sm:px-6 mt-8">
        {loading && (
          <div className="flex flex-col justify-center items-center py-20 ">
            <div className="w-8 h-8 border-4 border-slate-200 dark:border-zinc-800 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mt-4">
              Loading data...
            </p>
          </div>
        )}

        {!loading && (
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-500/20 text-sm font-medium">
                Error: {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
              {today && (
                <div className="lg:col-span-4 w-full">
                  <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800/50 shadow-sm h-full flex flex-col justify-between transition-colors">
                    <div>
                      <h2 className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center border-b border-slate-100 dark:border-zinc-800/40 pb-3 mb-4">
                        <Calendar className="w-4 h-4 mr-1.5 text-slate-400 dark:text-zinc-500" /> Current Condition
                      </h2>

                      <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 flex items-start gap-1">
                        <MapPin className="w-4 h-4 mt-0.5 text-slate-400 dark:text-zinc-500 flex-shrink-0" />
                        <span>{locationName.split(",")[0].trim()}</span>
                      </h3>

                      <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 flex items-center">
                        {todayDate}
                      </p>

                      <div className="flex flex-col items-center py-6 my-2 border-b border-slate-100 dark:border-zinc-800/40">
                        <div>
                          {getWeatherIcon(today.weather_code, "w-20 h-20")}
                        </div>
                        <p className="text-5xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight mt-3">
                          {Math.round(today.temp)}<span className="text-2xl text-slate-400 dark:text-zinc-500 font-medium ml-0.5">°C</span>
                        </p>
                        <p className="text-sm font-medium text-slate-600 dark:text-zinc-300 mt-1">
                          {weatherCodeText(today.weather_code)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 rounded-lg text-center">
                          <Thermometer className="w-5 h-5 mx-auto text-slate-400 dark:text-zinc-500 mb-1" />
                          <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-zinc-500">Temp</p>
                          <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 font-mono mt-0.5">{today.temp.toFixed(1)}°C</p>
                        </div>

                        <div className="p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 rounded-lg text-center">
                          <Droplet className="w-5 h-5 mx-auto text-slate-400 dark:text-zinc-500 mb-1" />
                          <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-zinc-500">Humidity</p>
                          <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 font-mono mt-0.5">{today.humidity}%</p>
                        </div>

                        <div className="p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 rounded-lg text-center">
                          <Wind className="w-5 h-5 mx-auto text-slate-400 dark:text-zinc-500 mb-1" />
                          <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-zinc-500">Wind</p>
                          <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 font-mono mt-0.5">{today.wind.toFixed(1)} m/s</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80 mt-4 px-3 py-2 rounded-lg text-slate-400 dark:text-zinc-500 italic text-[11px] text-center">
                        Local micro-climates may present minor deviations.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="lg:col-span-8 w-full">
                {forecast.length > 0 && (
                  <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800/50 shadow-sm transition-colors">
                    <h2 className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center border-b border-slate-100 dark:border-zinc-800/40 pb-3 mb-4">
                      <Calendar className="w-4 h-4 mr-1.5 text-slate-400 dark:text-zinc-500" /> 7-Day Aggregation Forecast
                    </h2>

                    <div className="space-y-3">
                      {forecast.map((day, i) => {
                        const dayName = new Date(day.date).toLocaleDateString("en-US", { weekday: "long" });
                        const date = new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                        return (
                          <div
                            key={i}
                            className="flex items-center p-3 rounded-lg bg-slate-50/50 dark:bg-zinc-950/30 hover:bg-slate-50 dark:hover:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/40 hover:border-slate-300 dark:hover:border-zinc-700 transition-all text-xs"
                          >
                            <div className="w-24 sm:w-32">
                              <p className="font-semibold text-slate-900 dark:text-zinc-200">{dayName}</p>
                              <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">{date}</p>
                            </div>

                            <div className="flex items-center flex-1 px-2">
                              {getWeatherIcon(day.weather_code, "w-5 h-5 mr-2 flex-shrink-0")}
                              <span className="text-slate-600 dark:text-zinc-400 font-medium hidden sm:inline">
                                {weatherCodeText(day.weather_code)}
                              </span>
                            </div>

                            <div className="flex space-x-4 ml-auto text-right font-mono font-bold">
                              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                                <TrendingUp size={13} className="text-rose-400 dark:text-rose-500" /> {Math.round(day.temp_max)}°
                              </span>
                              <span className="text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                                <TrendingDown size={13} className="text-blue-400 dark:text-blue-500" /> {Math.round(day.temp_min)}°
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {history.length > 0 && (
              <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800/50 shadow-sm mt-6 w-full transition-colors">
                <h2 className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center border-b border-slate-100 dark:border-zinc-800/40 pb-3 mb-4">
                  <BarChart3 className="w-4 h-4 mr-1.5 text-slate-400 dark:text-zinc-500" /> 30-Day Historical Baseline Logs
                </h2>

                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-800/80">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-zinc-800/80 text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5">Date Index</th>
                        <th className="px-4 py-2.5 text-center">Atmospheric Condition</th>
                        <th className="px-4 py-2.5 text-right">Max Temperature</th>
                        <th className="px-4 py-2.5 text-right">Min Temperature</th>
                        <th className="px-4 py-2.5 text-right">Precipitation</th>
                        <th className="px-4 py-2.5 text-right">Peak Wind speed</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 font-medium text-slate-700 dark:text-zinc-300">
                      {history.map((day, i) => (
                        <tr key={i} className="bg-white dark:bg-zinc-900 hover:bg-slate-50/80 dark:hover:bg-zinc-800/30 transition-colors font-mono">
                          <td className="px-4 py-2.5 text-slate-900 dark:text-zinc-50 font-sans font-medium">{day.date}</td>
                          <td className="px-4 py-2.5 text-center font-sans">
                            <span className="flex items-center justify-center gap-1.5">
                              {getWeatherIcon(day.weather_code, "w-4 h-4")}
                              <span className="text-slate-600 dark:text-zinc-400">{weatherCodeText(day.weather_code)}</span>
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right text-rose-600 dark:text-rose-400 font-bold">{day.temp_max}°C</td>
                          <td className="px-4 py-2.5 text-right text-blue-600 dark:text-blue-400 font-bold">{day.temp_min}°C</td>
                          <td className="px-4 py-2.5 text-right text-blue-500 dark:text-blue-400">{day.rain} mm</td>
                          <td className="px-4 py-2.5 text-right text-slate-500 dark:text-zinc-400 font-normal">{day.wind} m/s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}