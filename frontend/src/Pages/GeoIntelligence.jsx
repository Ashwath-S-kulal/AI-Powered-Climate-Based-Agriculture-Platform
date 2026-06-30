import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import {
    MapPin, CloudRain, Thermometer, Sprout, AlertTriangle,
    Loader2, MousePointerClick, Wind, Cloud, Droplets, Gauge, Sun, Activity, Snowflake, Sparkles,
    X
} from "lucide-react";
import {
    ResponsiveContainer, LineChart, Line, AreaChart, Area, ComposedChart, Bar,
    XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import Header from "../Components/Header";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapClickHandler({ setCoords }) {
    useMapEvents({
        click(e) {
            setCoords({ lat: e.latlng.lat, lon: e.latlng.lng });
        },
    });
    return null;
}

export default function GeoIntelligencePage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [locationName, setLocationName] = useState("Locating...");
    const [coords, setCoords] = useState(null);
    const [explainingKey, setExplainingKey] = useState(null);
    const [aiExplanations, setAiExplanations] = useState({});

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    console.warn("Geolocation denied or failed. Using fallback location.");
                    setCoords({ lat: 13.6213, lon: 74.6914 });
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } else {
            setCoords({ lat: 13.6213, lon: 74.6914 });
        }
    }, []);


    useEffect(() => {
        if (!coords) return;

        const fetchAllData = async () => {
            setLoading(true);
            try {
                const telemetryUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_gusts_10m,cloud_cover,surface_pressure,vapor_pressure_deficit,uv_index,dew_point_2m&hourly=temperature_2m,dew_point_2m,soil_moisture_0_to_7cm,soil_moisture_7_to_28cm,soil_moisture_28_to_100cm,evapotranspiration,precipitation,direct_radiation,diffuse_radiation,soil_temperature_0_to_7cm,soil_temperature_7_to_28cm,soil_temperature_28_to_100cm,wind_speed_10m,wind_gusts_10m&timezone=auto`;
                const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lon}&zoom=14&addressdetails=1`;

                const [telemetryRes, geoRes] = await Promise.all([
                    fetch(telemetryUrl),
                    fetch(geoUrl, { headers: { "User-Agent": "GeoIntelligenceApp/1.0" } })
                ]);

                const json = await telemetryRes.json();
                const geoJson = await geoRes.json();

                let locName = "Unknown Region";
                if (geoJson && geoJson.address) {
                    const addr = geoJson.address;
                    locName = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state || "Unknown Region";
                }
                setLocationName(locName);

                const trend = json.hourly.time.slice(0, 24).map((timeStr, i) => ({
                    time: timeStr.split("T")[1],
                    temp: json.hourly.temperature_2m[i],
                    dew: json.hourly.dew_point_2m[i],
                    rain: json.hourly.precipitation[i],
                    et0: json.hourly.evapotranspiration[i],
                    moistSurface: json.hourly.soil_moisture_0_to_7cm[i],
                    moistRoot: json.hourly.soil_moisture_7_to_28cm[i],
                    moistDeep: json.hourly.soil_moisture_28_to_100cm[i],
                    tempSurface: json.hourly.soil_temperature_0_to_7cm[i],
                    tempRoot: json.hourly.soil_temperature_7_to_28cm[i],
                    tempDeep: json.hourly.soil_temperature_28_to_100cm[i],
                    radDirect: json.hourly.direct_radiation[i],
                    radDiffuse: json.hourly.diffuse_radiation[i],
                    wind: json.hourly.wind_speed_10m[i],
                    gusts: json.hourly.wind_gusts_10m[i]
                }));

                setData({ current: json.current, trend });
                setAiExplanations({}); // Clear existing insights when coords/location changes
            } catch (e) {
                console.error("Data fetch failed:", e);
                setLocationName("Data Unavailable");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [coords]);

    const handleExplainChart = async (chartKey, chartTitle, extractedFields) => {
        setExplainingKey(chartKey);
        try {
            const payloadData = data.trend.map(item => {
                const subObject = { time: item.time };
                extractedFields.forEach(field => { subObject[field] = item[field]; });
                return subObject;
            });

            const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/geo/explain-telemetry`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chartTitle, telemetryData: payloadData })
            });

            const resJson = await response.json();
            if (resJson.explanation) {
                setAiExplanations(prev => ({ ...prev, [chartKey]: resJson.explanation }));
            }
        } catch (err) {
            console.error("Failed executing chart parsing context request:", err);
        } finally {
            setExplainingKey(null);
        }
    };

    const handleCloseChart = (chartKey) => {
        setAiExplanations((prev) => {
            const updated = { ...prev };
            delete updated[chartKey];
            return updated;
        });

        if (explainingKey === chartKey) {
            setExplainingKey(null);
        }
    };

    const DashboardSkeleton = () => (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-slate-200 dark:bg-neutral-900 h-[76px] rounded-xl" />
                ))}
            </div>

            <div className="w-full bg-slate-200 dark:bg-neutral-900 h-[400px] mb-10 rounded-2xl" />

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="col-span-1 lg:col-span-3 grid md:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-slate-200 dark:bg-neutral-900 h-[380px] rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    );

    if (!coords) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-slate-50 dark:bg-black p-4 md:p-6 lg:p-8 transition-colors duration-300">
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full pb-3 border-b border-slate-200/60 dark:border-neutral-900">
                        <h1 className="text-base md:text-xl font-bold text-slate-900 dark:text-neutral-50 flex items-center gap-3">
                            <span className="w-1.5 h-4 bg-emerald-500 rounded-full inline-block"></span>
                            Locating... Climate Intelligence
                        </h1>

                        <p className="text-slate-500 dark:text-neutral-400 flex items-center gap-2 font-mono text-xs md:text-xs bg-slate-100 dark:bg-neutral-900 px-2.5 py-1 rounded-md w-fit sm:self-center self-start">
                            <MapPin size={14} className="text-slate-400 dark:text-neutral-500" />
                            00.0000° N, 00.0000° E
                        </p>
                    </div>
                    <DashboardSkeleton />
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
            <Header />
            <div className=" bg-slate-50 dark:bg-zinc-950 p-4 md:p-6 lg:p-8 transition-colors duration-300">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full pb-3 border-b border-slate-200/60 dark:border-neutral-900">
                    <h1 className="text-base md:text-xl font-bold text-slate-900 dark:text-neutral-50 flex items-center gap-3">
                        <span className="w-1.5 h-4 bg-emerald-500 rounded-full inline-block"></span>
                        {locationName} Climate Intelligence
                    </h1>

                    <p className="text-slate-500 dark:text-neutral-400 flex items-center gap-2 font-mono text-xs md:text-xs bg-slate-100 dark:bg-neutral-900 px-2.5 py-1 rounded-md w-fit sm:self-center self-start">
                        <MapPin size={14} className="text-slate-400 dark:text-neutral-500" />
                        {coords.lat.toFixed(4)}° N, {coords.lon.toFixed(4)}° E
                    </p>
                </div>

                {loading || !data ? (
                    <DashboardSkeleton />
                ) : (
                    <div className="space-y-6 ">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                            {[
                                { icon: Thermometer, label: "Air Temp", val: `${data.current.temperature_2m}°C`, color: "text-orange-500" },
                                { icon: Snowflake, label: "Dew Point", val: `${data.current.dew_point_2m}°C`, color: "text-cyan-500", desc: "Condensation temperature" },
                                { icon: Activity, label: "VPD", val: `${data.current.vapor_pressure_deficit} kPa`, color: "text-red-500", desc: "Vapor Pressure Deficit" },
                                { icon: Droplets, label: "Humidity", val: `${data.current.relative_humidity_2m}%`, color: "text-blue-500" },
                                { icon: Sun, label: "UV Index", val: data.current.uv_index, color: "text-yellow-500" },
                                { icon: Wind, label: "Wind Gusts", val: `${data.current.wind_gusts_10m} km/h`, color: "text-teal-500" },
                                { icon: Cloud, label: "Cloud Cover", val: `${data.current.cloud_cover}%`, color: "text-slate-500" },
                                { icon: Gauge, label: "Pressure", val: `${data.current.surface_pressure} hPa`, color: "text-purple-500" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-black p-3 rounded-xl shadow-sm border border-slate-100 dark:border-neutral-900 flex flex-col items-center justify-center text-center group relative cursor-help transition-all">
                                    <stat.icon size={20} className={`mb-1 ${stat.color}`} />
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">{stat.label}</span>
                                    <span className="text-base font-bold text-slate-800 dark:text-neutral-200">{stat.val}</span>
                                    {stat.desc && (
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-neutral-800 text-white dark:text-neutral-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                            {stat.desc}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="col-span-1 bg-white dark:bg-black p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 flex flex-col h-[400px] mb-10 transition-all">
                            <div className="flex items-start gap-2 mb-4 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                                <MousePointerClick size={20} className="mt-0.5 shrink-0" />
                                <span className="text-xs md:text-sm font-medium">Map Active: Click any region to auto-resolve location name via OSM and run a 24-hour microclimate analysis.</span>
                            </div>
                            <div className="flex-grow w-full relative z-0 rounded-xl overflow-hidden border border-slate-200 dark:border-neutral-900 dark:invert dark:brightness-90 dark:hue-rotate-180">
                                <MapContainer center={[coords.lat, coords.lon]} zoom={10} style={{ height: "100%", width: "100%" }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[coords.lat, coords.lon]} />
                                    <MapClickHandler setCoords={setCoords} />
                                    <Circle center={[coords.lat, coords.lon]} radius={6000} pathOptions={{ color: '#059669', fillColor: '#10b981', fillOpacity: 0.2 }} />
                                </MapContainer>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="col-span-1 lg:col-span-3 grid md:grid-cols-3 gap-6 h-full pr-2">
                                <div >
                                    <div className="bg-white dark:bg-black p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 min-h-[360px] h-auto flex flex-col justify-between transition-all">
                                        <h2 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                                            <Sprout className="text-emerald-600" size={18} /> Deep Soil Moisture Profile
                                        </h2>
                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={data.trend}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-neutral-900" />
                                                    <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={8} stroke="#94a3b8" />
                                                    <YAxis domain={[0, 'auto']} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                                                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', backgroundColor: 'var(--tw-chart-bg, #fff)', borderColor: '#94a3b8' }} className="dark:[--tw-chart-bg:#000]" />
                                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                                    <Line type="monotone" name="Surface (0-7cm)" dataKey="moistSurface" stroke="#34d399" strokeWidth={2} dot={false} />
                                                    <Line type="monotone" name="Root Zone (7-28cm)" dataKey="moistRoot" stroke="#059669" strokeWidth={2} dot={false} />
                                                    <Line type="monotone" name="Deep (28-100cm)" dataKey="moistDeep" stroke="#064e3b" strokeWidth={2} dot={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <AIExplanationBlock
                                        chartKey="soil_moisture"
                                        title="Deep Soil Moisture Profile"
                                        fields={["moistSurface", "moistRoot", "moistDeep"]}
                                        explainingKey={explainingKey} aiExplanations={aiExplanations} onExplain={handleExplainChart} onClose={handleCloseChart}
                                    />
                                </div>

                                <div>
                                    <div className="bg-white dark:bg-black p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 min-h-[360px] h-auto flex flex-col justify-between transition-all">
                                        <h2 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                                            <Sprout className="text-orange-600" size={18} /> Subterranean Temperature
                                        </h2>
                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={data.trend}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-neutral-900" />
                                                    <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={8} stroke="#94a3b8" />
                                                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                                                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', backgroundColor: 'var(--tw-chart-bg, #fff)', borderColor: '#94a3b8' }} className="dark:[--tw-chart-bg:#000]" />
                                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                                    <Line type="monotone" name="Surface Temp" dataKey="tempSurface" stroke="#fb923c" strokeWidth={2} dot={false} />
                                                    <Line type="monotone" name="Root Temp" dataKey="tempRoot" stroke="#ea580c" strokeWidth={2} dot={false} />
                                                    <Line type="monotone" name="Deep Temp" dataKey="tempDeep" stroke="#9a3412" strokeWidth={2} dot={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <AIExplanationBlock
                                        chartKey="sub_temp"
                                        title="Subterranean Temperature"
                                        fields={["tempSurface", "tempRoot", "tempDeep"]}
                                        explainingKey={explainingKey}
                                        aiExplanations={aiExplanations}
                                        onExplain={handleExplainChart}
                                        onClose={handleCloseChart}
                                    />
                                </div>

                                <div>
                                    <div className="bg-white dark:bg-black p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 min-h-[360px] h-auto flex flex-col justify-between transition-all">
                                        <h2 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                                            <Snowflake className="text-cyan-500" size={18} /> Air Temp vs Dew Point
                                        </h2>
                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={data.trend}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-neutral-900" />
                                                    <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={8} stroke="#94a3b8" />
                                                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                                                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', backgroundColor: 'var(--tw-chart-bg, #fff)', borderColor: '#94a3b8' }} className="dark:[--tw-chart-bg:#000]" />
                                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                                    <Area type="monotone" name="Air Temp (°C)" dataKey="temp" stroke="#ef4444" fill="#fee2e2" fillOpacity={0.3} />
                                                    <Area type="monotone" name="Dew Point (°C)" dataKey="dew" stroke="#06b6d4" fill="#cffafe" fillOpacity={0.5} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <AIExplanationBlock
                                        chartKey="air_dew"
                                        title="Air Temp vs Dew Point"
                                        fields={["temp", "dew"]}
                                        explainingKey={explainingKey} aiExplanations={aiExplanations} onExplain={handleExplainChart} onClose={handleCloseChart}
                                    />
                                </div>

                                <div>
                                    <div className="bg-white dark:bg-black p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 min-h-[360px] h-auto flex flex-col justify-between transition-all">
                                        <h2 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                                            <Wind className="text-teal-500" size={18} /> Wind Speed & Gust Dynamics
                                        </h2>
                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <ComposedChart data={data.trend}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-neutral-900" />
                                                    <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={8} stroke="#94a3b8" />
                                                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                                                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', backgroundColor: 'var(--tw-chart-bg, #fff)', borderColor: '#94a3b8' }} className="dark:[--tw-chart-bg:#000]" />
                                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                                    <Area type="monotone" name="Wind Gusts (km/h)" dataKey="gusts" fill="#ccfbf1" stroke="#14b8a6" fillOpacity={0.4} />
                                                    <Line type="monotone" name="Wind Speed (km/h)" dataKey="wind" stroke="#0f766e" strokeWidth={2} dot={false} />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <AIExplanationBlock
                                        chartKey="wind_dynamics"
                                        title="Wind Speed & Gust Dynamics"
                                        fields={["wind", "gusts"]}
                                        explainingKey={explainingKey} aiExplanations={aiExplanations} onExplain={handleExplainChart} onClose={handleCloseChart}
                                    />
                                </div>

                                <div>
                                    <div className="bg-white dark:bg-black p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 min-h-[360px] h-auto flex flex-col justify-between transition-all">
                                        <h2 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                                            <Sun className="text-yellow-500" size={18} /> Solar Radiation (W/m²)
                                        </h2>
                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <ComposedChart data={data.trend}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-neutral-900" />
                                                    <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={8} stroke="#94a3b8" />
                                                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                                                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', backgroundColor: 'var(--tw-chart-bg, #fff)', borderColor: '#94a3b8' }} className="dark:[--tw-chart-bg:#000]" />
                                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                                    <Area type="monotone" name="Diffuse Rad" dataKey="radDiffuse" fill="#fef08a" stroke="#facc15" fillOpacity={0.5} />
                                                    <Bar name="Direct Rad" dataKey="radDirect" fill="#f59e0b" barSize={10} radius={[2, 2, 0, 0]} />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <AIExplanationBlock
                                        chartKey="solar_rad"
                                        title="Solar Radiation (W/m²)"
                                        fields={["radDirect", "radDiffuse"]}
                                        explainingKey={explainingKey} aiExplanations={aiExplanations} onExplain={handleExplainChart} onClose={handleCloseChart}
                                    />
                                </div>

                                <div>
                                    <div className="bg-white dark:bg-black p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 min-h-[360px] h-auto flex flex-col justify-between transition-all">
                                        <h2 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                                            <CloudRain className="text-blue-500" size={18} /> Water Balance (Loss vs Gain)
                                        </h2>
                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <ComposedChart data={data.trend}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-neutral-900" />
                                                    <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={8} stroke="#94a3b8" />
                                                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                                                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', backgroundColor: 'var(--tw-chart-bg, #fff)', borderColor: '#94a3b8' }} className="dark:[--tw-chart-bg:#000]" />
                                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                                    <Area yAxisId="left" type="monotone" name="Water Loss (ET0)" dataKey="et0" fill="#fed7aa" stroke="#f97316" fillOpacity={0.4} />
                                                    <Bar yAxisId="right" name="Rainfall (mm)" dataKey="rain" fill="#3b82f6" barSize={8} radius={[2, 2, 0, 0]} />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <AIExplanationBlock
                                        chartKey="water_balance"
                                        title="Water Balance (Loss vs Gain)"
                                        fields={["et0", "rain"]}
                                        explainingKey={explainingKey} aiExplanations={aiExplanations} onExplain={handleExplainChart} onClose={handleCloseChart}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function AIExplanationBlock({
    chartKey,
    title,
    fields,
    explainingKey,
    aiExplanations,
    onExplain,
    onClose
}) {
    const isThisLoading = explainingKey === chartKey;
    const rawText = aiExplanations[chartKey];
    const hasData = !!rawText;

    const formatBoldText = (textLine) => {
        const regex = /(\*\*.*?\*\*)/g;
        const parts = textLine.split(regex);

        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return (
                    <strong key={i} className="font-bold text-slate-900 dark:text-neutral-100">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return part;
        });
    };

    const renderCleanContent = () => {
        if (!rawText) return null;

        const lines = rawText.split("\n");
        return lines.map((line, index) => {
            const trimmedLine = line.trim();

            if (!trimmedLine) return null;

            if (trimmedLine.startsWith("* ") || trimmedLine.startsWith("- ") || trimmedLine.startsWith("+ ")) {
                const cleanText = trimmedLine.replace(/^[*-+]\s+/, "");
                return (
                    <div key={index} className="flex items-start gap-2 pl-1.5 my-0.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                        <span className="text-slate-600 dark:text-neutral-400">
                            {formatBoldText(cleanText)}
                        </span>
                    </div>
                );
            }
            return (
                <p key={index} className="text-slate-600 dark:text-neutral-400 leading-relaxed">
                    {formatBoldText(line)}
                </p>
            );
        });
    };

    return (
        <div className="mt-4 pb-4 border-b border-slate-100 dark:border-neutral-900/60 w-full flex flex-col justify-start items-start">            <div className="w-full">
            {!hasData ? (
                <button
                    disabled={explainingKey !== null}
                    onClick={() => onExplain(chartKey, title, fields)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isThisLoading ? (
                        <>
                            <Loader2 size={14} className="animate-spin text-emerald-500" />
                            <span>Analyzing Metrics...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={14} className="text-emerald-500" />
                            <span>AI Explanation</span>
                        </>
                    )}
                </button>
            ) : (
                <div className="bg-slate-100 dark:bg-neutral-950 p-3.5 rounded-xl border border-slate-100 dark:border-neutral-900 w-full animate-fadeIn">
                    <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-slate-200/60 dark:border-neutral-900/60">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <Sparkles size={12} /> SmartAgri Advisor
                        </span>
                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={() => onExplain(chartKey, title, fields)}
                                className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 transition-colors"
                            >
                                Recalculate
                            </button>
                            <button
                                onClick={() => onClose && onClose(chartKey)}
                                aria-label="Close explanation"
                                className="text-slate-400 hover:text-rose-500 dark:text-neutral-500 dark:hover:text-rose-400 transition-colors p-0.5 rounded-md hover:bg-slate-200/50 dark:hover:bg-neutral-900"
                            >
                                <X size={13} />
                            </button>
                        </div>
                    </div>
                    <div className="text-xs space-y-1.5 font-medium">
                        {renderCleanContent()}
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}