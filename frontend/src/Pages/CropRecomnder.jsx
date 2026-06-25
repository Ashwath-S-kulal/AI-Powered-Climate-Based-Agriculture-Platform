import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "../Components/Header";

import {
    Loader,
    Search,
    CloudDrizzle,
    Leaf,
    Thermometer,
    MapPin,
    Droplets,
    Navigation,
} from "lucide-react";

const IconLoader = Loader;
const IconSearch = Search;
const IconCloudDrizzle = CloudDrizzle;
const IconLeaf = Leaf;
const IconThermometer = Thermometer;
const IconMapMarker = MapPin;
const IconWater = Droplets;


export default function CropRecommender() {
    const [place, setPlace] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [geocode, setGeocode] = useState(null);
    const [climate, setClimate] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [remoteCropCatalog, setRemoteCropCatalog] = useState([]);
    const [remoteCropImages, setRemoteCropImages] = useState({});
    const [isCatalogLoaded, setIsCatalogLoaded] = useState(false);

    const HEADERS = {
        "User-Agent": "crop-recommender-app",
    };

    const geocodePlace = async (placeName) => {
        const url = "https://nominatim.openstreetmap.org/search";
        const params = { q: placeName, format: "json", limit: 1, addressdetails: 1 };
        const r = await axios.get(url, { params, headers: HEADERS });
        if (!r.data || r.data.length === 0) return null;
        const row = r.data[0];
        return {
            name: row.display_name,
            lat: parseFloat(row.lat),
            lon: parseFloat(row.lon),
            type: row.type,
            raw: row,
        };
    };

    const fetchClimateNormals = async (lat, lon) => {
        const url = "https://power.larc.nasa.gov/api/temporal/climatology/point";
        const params = {
            latitude: lat,
            longitude: lon,
            community: "AG",
            parameters: "T2M,PRECTOTCORR",
            format: "JSON",
        };
        const r = await axios.get(url, { params });
        const j = r.data;
        const tempDict = j.properties.parameter.T2M;
        const precDict = j.properties.parameter.PRECTOTCORR;

        const monthsOrder = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];
        const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        const tempMonthly = monthsOrder.map((m) => parseFloat(tempDict[m]));
        const precipMonthly = monthsOrder.map((m, i) => parseFloat(precDict[m]) * days[i]);
        const meanAnnualTemp = tempMonthly.reduce((a, b) => a + b, 0) / 12;
        const annualPrecip = precipMonthly.reduce((a, b) => a + b, 0);

        return { tempMonthly, precipMonthly, meanAnnualTemp, annualPrecip, raw: j };
    };

    const tempMatchScore = (crop, tempC) => {
        const mid = (crop.tMin + crop.tMax) / 2;
        const halfRange = (crop.tMax - crop.tMin) / 2 || 1;
        const score = 1 - Math.abs(tempC - mid) / (halfRange * 2.5);
        return Math.max(0, Math.min(1, score));
    };

    const precipMatchScore = (crop, annualPrecip) => {
        const mid = (crop.pMin + crop.pMax) / 2;
        const halfRange = (crop.pMax - crop.pMin) / 2 || 1;
        const score = 1 - Math.abs(annualPrecip - mid) / (halfRange * 2.5);
        return Math.max(0, Math.min(1, score));
    };

    const monthlySuitability = (crop, climate) => {
        let goodMonths = 0;
        for (let i = 0; i < 12; i++) {
            const t = climate.tempMonthly[i], p = climate.precipMonthly[i];
            const tOk = t >= crop.tMin - 3 && t <= crop.tMax + 3;
            const pOk = p >= crop.pMin / 12 - 10 || p <= crop.pMax / 12 + 50;
            if (tOk && pOk) goodMonths++;
        }
        return goodMonths / 12;
    };

    const scoreCrop = (crop, climate) => {
        const tScore = tempMatchScore(crop, climate.meanAnnualTemp);
        const pScore = precipMatchScore(crop, climate.annualPrecip);
        const seasonScore = monthlySuitability(crop, climate);
        const combined = (0.4 * tScore + 0.4 * pScore + 0.2 * seasonScore);
        return Math.max(0, Math.min(1, combined));
    };

    const generateReason = (c, climateData) => {
        const t = climateData.meanAnnualTemp;
        const p = climateData.annualPrecip;
        let reasons = [];
        reasons.push(`Mean temp ${t.toFixed(1)}°C fits ${c.name}'s preferred ${c.tMin}–${c.tMax}°C`);
        reasons.push(`Annual precip ${Math.round(p)} mm within/near ${c.pMin}–${c.pMax} mm range`);
        if (c.monthsFraction >= 0.7) reasons.push("Many months suitable — could have long growing window");
        else if (c.monthsFraction >= 0.4) reasons.push("Some months suitable — seasonal crop or requires specific sowing times");
        else reasons.push("Limited suitable months — likely requires irrigation/seasonal planning");
        return reasons.join(". ");
    };

    const recommendCrops = useCallback((climateData, topN = 15) => {
        if (!isCatalogLoaded || remoteCropCatalog.length === 0) return [];

        const scored = remoteCropCatalog.map(c => {
            const score = scoreCrop(c, climateData);
            const monthsFraction = monthlySuitability(c, climateData);
            return {
                ...c,
                score,
                monthsFraction,
                image: remoteCropImages[c.name]
            };
        });
        const filtered = scored.filter(c => c.score >= 0.15).sort((a, b) => b.score - a.score);
        return filtered.slice(0, topN).map(c => ({
            name: c.name,
            score: Number(c.score.toFixed(3)),
            image: c.image,
            reason: generateReason({ ...c, monthsFraction: Number(c.monthsFraction.toFixed(2)) }, climateData),
            monthsFraction: Number(c.monthsFraction.toFixed(2)),
            water: c.water || "med"
        }));
    }, [isCatalogLoaded, remoteCropCatalog, remoteCropImages]);

    const fetchForLocation = useCallback(async (lat, lon) => {
        if (!isCatalogLoaded) return;

        setLoading(true); setError("");
        try {
            const climateData = await fetchClimateNormals(lat, lon);
            setClimate(climateData);
            const recs = recommendCrops(climateData, 15);
            setRecommendations(recs);
            const url = "https://nominatim.openstreetmap.org/reverse";
            const params = { lat, lon, format: "json", addressdetails: 1 };
            const r = await axios.get(url, { params, headers: HEADERS });
            setGeocode({ name: r.data.display_name, lat, lon, type: r.data.type || "location" });
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to fetch climate or recommendations.");
        }
        setLoading(false);
    }, [isCatalogLoaded, remoteCropCatalog, recommendCrops]);

    const handleSubmit = async () => {
        setError(""); setGeocode(null); setClimate(null); setRecommendations([]);
        if (!place.trim()) { setError("Please enter an area name."); return; }

        setLoading(true);
        try {
            const geo = await geocodePlace(place);
            if (!geo) {
                setError("Could not geocode the area. Try a more specific name.");
                setLoading(false);
                return;
            }
            setGeocode(geo);
            await fetchForLocation(geo.lat, geo.lon);
        } catch (err) {
            console.error(err);
            setError("An error occurred while fetching data.");
        }
        setLoading(false);
    };

    const fetchSuggestions = async (query) => {
        if (!query.trim()) { setSuggestions([]); return; }
        try {
            const url = "https://nominatim.openstreetmap.org/search";
            const params = { q: query, format: "json", addressdetails: 1, limit: 5 };
            const r = await axios.get(url, { params, headers: HEADERS });
            setSuggestions(r.data || []);
        } catch (err) { console.error(err); setSuggestions([]); }
    };

    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/reccomender/catalog`);
                const catalog = response.data.map(c => ({
                    ...c,
                    tMin: parseInt(c.tMin, 10),
                    tMax: parseInt(c.tMax, 10),
                    pMin: parseInt(c.pMin, 10),
                    pMax: parseInt(c.pMax, 10),
                }));

                const images = catalog.reduce((acc, curr) => {
                    acc[curr.name] = curr.imageUrl;
                    return acc;
                }, {});

                setRemoteCropCatalog(catalog);
                setRemoteCropImages(images);
                setIsCatalogLoaded(true);
            } catch (error) {
                console.error("Failed to fetch crop catalog from backend:", error);
                setError("Failed to load crop database. Check server connection.");
                setIsCatalogLoaded(true);
            }
        };
        fetchCatalog();
    }, []);

    useEffect(() => {
        if (isCatalogLoaded && remoteCropCatalog.length > 0 && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    if (!geocode) {
                        fetchForLocation(pos.coords.latitude, pos.coords.longitude);
                    }
                },
                err => console.warn("Geolocation blocked or unavailable — search manually.", err)
            );
        }
    }, [isCatalogLoaded, fetchForLocation, geocode, remoteCropCatalog.length]);


    const getWaterIcon = (water) => {
        const baseClasses = "flex items-center gap-1 font-medium text-[11px] rounded-md px-2 py-0.5 tracking-wide";
        switch (water) {
            case 'high':
                return <span className={`${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`} title="High Water Requirement"><IconWater size={12} /> High Demand</span>;
            case 'med':
                return <span className={`${baseClasses} bg-amber-50 text-amber-700 border border-amber-200`} title="Medium Water Requirement"><IconWater size={12} /> Moderate</span>;
            case 'low':
                return <span className={`${baseClasses} bg-emerald-50 text-emerald-700 border border-emerald-200`} title="Low Water Requirement"><IconWater size={12} /> Low Demand</span>;
            default:
                return <span className={`${baseClasses} bg-gray-50 text-gray-600 border border-gray-200`} title="Unknown Water Requirement"><IconWater size={12} /> N/A</span>;
        }
    };

    const getScoreClasses = (score) => {
        if (score >= 0.7) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        if (score >= 0.4) return 'text-amber-700 bg-amber-50 border-amber-200';
        return 'text-rose-700 bg-rose-50 border-rose-200';
    };

    const handleAutoDetect = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    fetchForLocation(pos.coords.latitude, pos.coords.longitude);
                },
                (err) => {
                    setLoading(false);
                    setError("Location access denied. Please enable location permissions.");
                    console.warn(err);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-zinc-950 text-slate-800 dark:text-zinc-300 font-sans antialiased relative pb-16 transition-colors duration-200">
            <Header />
            <div className="w-full bg-white dark:bg-[#09090b] border-b border-slate-200/80 dark:border-zinc-800/80 pt-5 md:pt-10 pb-8 px-4 sm:px-6 transition-colors duration-200">
                <div className="max-w-screen mx-auto">
                    <div className="text-left md:text-left md:flex md:items-left md:justify-between mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-left justify-left md:justify-start gap-2 ">
                                <IconLeaf className="text-emerald-600 dark:text-emerald-400" size={26} /> Smart Crop Recommender
                            </h1>
                        </div>
                    </div>
                    

                    <div className="max-w-screen p-2 rounded-xl dark:border-zinc-800 transition-colors duration-200">
                        <div className="flex flex-col sm:flex-row gap-2 relative">
                            <div className="relative flex-1 w-full">
                                <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search location (e.g. Ujire, India)..."
                                    value={place}
                                    onChange={(e) => { setPlace(e.target.value); fetchSuggestions(e.target.value); }}
                                    className="w-full rounded-lg pl-10 pr-4 py-2.5 bg-white dark:bg-black text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 border border-slate-200 dark:border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                                />
                                {suggestions.length > 0 && (
                                    <ul className="absolute left-0 right-0 z-30 bg-white dark:bg-[#0f0f11] text-slate-800 dark:text-zinc-200 rounded-lg mt-1.5 shadow-xl dark:shadow-2xl max-h-52 overflow-y-auto border border-slate-200/80 dark:border-zinc-800 divide-y divide-slate-100 dark:divide-zinc-800/50">
                                        {suggestions.map((s, idx) => (
                                            <li key={idx} className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-900 text-xs text-slate-700 dark:text-zinc-300 transition-colors"
                                                onClick={() => {
                                                    setPlace(s.display_name); setSuggestions([]);
                                                    fetchForLocation(parseFloat(s.lat), parseFloat(s.lon));
                                                }}>
                                                {s.display_name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleAutoDetect}
                                    type="button"
                                    title="Use current location"
                                    aria-label="Auto fetch location"
                                    disabled={loading || !isCatalogLoaded}
                                    className="px-4 py-2.5 bg-white dark:bg-emerald-600 hover:bg-slate-50 dark:hover:bg-emerald-500 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 dark:disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Navigation size={15} className="text-slate-500 dark:text-white" />
                                    <span className="hidden md:inline">Auto Locate</span>
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !isCatalogLoaded || !place.trim()}
                                    className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors text-sm font-medium disabled:bg-slate-400 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                                >
                                    {loading ? (
                                        <><IconLoader className="animate-spin" size={16} /> Parsing...</>
                                    ) : isCatalogLoaded ? (
                                        "Generate Metrics"
                                    ) : (
                                        <><IconLoader className="animate-spin" size={16} /> Syncing...</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="w-full max-w-screen mx-auto py-8 px-4 sm:px-6">
                {(loading || !isCatalogLoaded) && (
                    <div className="flex flex-col justify-center items-center py-20 ">
                        <div className="w-8 h-8 border-4 border-slate-200 dark:border-zinc-800 border-t-emerald-600 dark:border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-slate-500 dark:text-zinc-500 mt-4">
                            Loading data...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 p-4 rounded-xl text-center text-sm font-medium max-w-xl mx-auto">
                        {error}
                    </div>
                )}

                {!loading && isCatalogLoaded && geocode && climate && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-[#09090b] p-5 rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm flex flex-col justify-between transition-colors duration-200">
                                <div>
                                    <h2 className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                        <IconMapMarker size={14} className="text-slate-400 dark:text-zinc-500" /> Target Boundary Area
                                    </h2>
                                    <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm line-clamp-2 leading-relaxed">{geocode.name}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/50 grid grid-cols-3 gap-1 text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                                    <div><span className="text-slate-400 dark:text-zinc-500 font-sans">LAT:</span> {geocode.lat.toFixed(3)}°</div>
                                    <div><span className="text-slate-400 dark:text-zinc-500 font-sans">LON:</span> {geocode.lon.toFixed(3)}°</div>
                                    <div className="truncate"><span className="text-slate-400 dark:text-zinc-500 font-sans">TYP:</span> {geocode.type}</div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#09090b] p-5 rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm transition-colors duration-200">
                                <h2 className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                    <IconThermometer size={14} className="text-slate-400 dark:text-zinc-500" /> Mean Thermal Climate
                                </h2>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    {climate.meanAnnualTemp.toFixed(1)}<span className="text-lg font-medium text-slate-400 dark:text-zinc-500 ml-0.5">°C</span>
                                </p>
                                <p className="text-slate-400 dark:text-zinc-500 text-xs mt-1">Calculated point-climatology annual median</p>
                            </div>

                            <div className="bg-white dark:bg-[#09090b] p-5 rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm transition-colors duration-200">
                                <h2 className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                    <IconCloudDrizzle size={14} className="text-slate-400 dark:text-zinc-500" /> Cumulative Precipitation
                                </h2>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    {Math.round(climate.annualPrecip)}<span className="text-lg font-medium text-slate-400 dark:text-zinc-500 ml-0.5">mm</span>
                                </p>
                                <p className="text-slate-400 dark:text-zinc-500 text-xs mt-1">Aggregated monthly precipitation baseline</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#09090b] rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm overflow-hidden transition-colors duration-200">
                            <div className="p-5 border-b border-slate-100 dark:border-zinc-800/50 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <IconLeaf className="text-emerald-600 dark:text-emerald-400" size={18} /> Optimized Suitability Recommendations
                                </h2>
                                <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">Top Matrix Profiles</span>
                            </div>

                            <div className="p-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {recommendations.map((crop, idx) => (
                                        <div key={idx} className="bg-white dark:bg-[#0d0d11] rounded-lg border border-slate-200 dark:border-zinc-800/80 overflow-hidden flex flex-col group hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200">
                                            <div className="relative bg-slate-50 dark:bg-zinc-900 h-32 w-full overflow-hidden">
                                                <img
                                                    src={crop.image}
                                                    alt={crop.name}
                                                    className="w-full h-full object-cover grayscale-[10%] dark:grayscale-[20%] dark:brightness-[85%] group-hover:scale-102 transition-transform duration-300"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x150/18181b/a1a1aa?text=No+Image+Available"; }}
                                                />
                                                <div className="absolute bottom-2 left-2">
                                                    {getWaterIcon(crop.water)}
                                                </div>
                                                <div className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-bold rounded border ${getScoreClasses(crop.score)}`}>
                                                    {(crop.score * 100).toFixed(0)}% Match
                                                </div>
                                            </div>

                                            <div className="p-4 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mb-1">{crop.name}</h3>
                                                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">{crop.reason}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {recommendations.length === 0 && (
                                    <div className="text-center py-12 text-slate-400 dark:text-zinc-500 text-sm">
                                        No indexed items matched the minimum compliance parameters threshold (15%).
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#09090b] rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm overflow-hidden transition-colors duration-200">
                            <div className="p-5 border-b border-slate-100 dark:border-zinc-800/50">
                                <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <IconCloudDrizzle className="text-emerald-600 dark:text-emerald-400" size={18} /> Detailed Climatology Distribution Model
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-slate-700 dark:text-zinc-300 text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-zinc-900/50 text-slate-500 dark:text-zinc-400 font-medium uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800">
                                            <th className="px-5 py-3">Temporal Index (Month)</th>
                                            <th className="px-5 py-3 text-center">Temperature (°C)</th>
                                            <th className="px-5 py-3 text-center">Precipitation Data Volume (mm)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                                            <tr key={m} className="hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                                                <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-zinc-200">{m}</td>
                                                <td className="px-5 py-2.5 text-center font-mono text-slate-600 dark:text-zinc-400">{climate.tempMonthly[i].toFixed(2)}</td>
                                                <td className="px-5 py-2.5 text-center font-mono text-slate-600 dark:text-zinc-400">{climate.precipMonthly[i].toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}