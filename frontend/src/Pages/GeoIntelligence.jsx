import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import {
    MapPin, CloudRain, Thermometer, Sprout, AlertTriangle,
    Loader2, MousePointerClick, Wind, Cloud, Droplets, Gauge, Sun, Activity, Snowflake, Navigation
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


    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
                },
                (error) => {
                    console.warn("Geolocation denied or failed. Using fallback location.");
                    console.error(error);

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
                    fetch(geoUrl, {
                        headers: { "User-Agent": "GeoIntelligenceApp/1.0" }
                    })
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
            } catch (e) {
                console.error("Data fetch failed:", e);
                setLocationName("Data Unavailable");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [coords]);

    const DashboardSkeleton = () => (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-slate-200 dark:bg-neutral-900 h-20 rounded-xl" />
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="col-span-1 bg-slate-200 dark:bg-neutral-900 h-[800px] rounded-2xl" />

                <div className="col-span-1 lg:col-span-2 grid md:grid-cols-2 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-slate-200 dark:bg-neutral-900 h-[360px] rounded-2xl" />
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
                    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-neutral-50 flex items-center gap-3">
                                Locating... Intelligence
                            </h1>
                            <p className="text-slate-500 dark:text-neutral-500 flex items-center gap-2 mt-1 font-mono text-sm">
                                <MapPin size={14} />
                                00.0000° N, 00.0000° E
                            </p>
                        </div>
                    </div>
                    <DashboardSkeleton />
                </div>
            </>
        );
    }

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-slate-50 dark:bg-black p-4 md:p-6 lg:p-8 transition-colors duration-300">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-neutral-50 flex items-center gap-3">
                            {locationName} Intelligence
                        </h1>
                        <p className="text-slate-500 dark:text-neutral-400 flex items-center gap-2 mt-1 font-mono text-sm">
                            <MapPin size={14} />
                            {coords.lat.toFixed(4)}° N, {coords.lon.toFixed(4)}° E
                        </p>
                    </div>
                </div>

                {loading || !data ? (
                    <DashboardSkeleton />
                ) : (
                    <div className="space-y-6">
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

                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="col-span-1 bg-white dark:bg-black p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 flex flex-col h-[800px] mb-10 transition-all">
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

                            <div className="col-span-1 lg:col-span-2 grid md:grid-cols-2 gap-6 h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="bg-white dark:bg-black p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 h-[360px] flex flex-col transition-all">
                                    <h2 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                                        <Sprout className="text-emerald-600" size={18} /> Deep Soil Moisture Profile
                                    </h2>
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

                                <div className="bg-white dark:bg-black p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 h-[360px] flex flex-col transition-all">
                                    <h2 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                                        <Sprout className="text-orange-600" size={18} /> Subterranean Temperature
                                    </h2>
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

                                <div className="bg-white dark:bg-black p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 h-[360px] flex flex-col transition-all">
                                    <h2 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                                        <Snowflake className="text-cyan-500" size={18} /> Air Temp vs Dew Point
                                    </h2>
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

                                <div className="bg-white dark:bg-black p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 h-[360px] flex flex-col transition-all">
                                    <h2 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                                        <Wind className="text-teal-500" size={18} /> Wind Speed & Gust Dynamics
                                    </h2>
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

                                <div className="bg-white dark:bg-black p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 h-[360px] flex flex-col transition-all">
                                    <h2 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                                        <Sun className="text-yellow-500" size={18} /> Solar Radiation (W/m²)
                                    </h2>
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

                                <div className="bg-white dark:bg-black p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-900 h-[360px] flex flex-col transition-all">
                                    <h2 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                                        <CloudRain className="text-blue-500" size={18} /> Water Balance (Loss vs Gain)
                                    </h2>
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}