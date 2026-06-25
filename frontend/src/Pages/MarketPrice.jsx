import React, { useState, useEffect } from "react";
import {
    Search,
    MapPin,
    Loader2,
    AlertCircle,
    RefreshCw,
    X,
    TrendingUp
} from "lucide-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import Header from "../Components/Header";

const MANDI_API_KEY = import.meta.env.VITE_MANDI_API_KEY;

export default function MarketPrices() {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [userState, setUserState] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);

    const detectLocationAndFetch = async () => {
        setLoadingLocation(true);
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser. Defaulting to nationwide data.");
            setUserState("All India (Fallback)");
            fetchMandiPrices();
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    const detectedState = data.address?.state;

                    if (detectedState) {
                        setUserState(detectedState);
                        fetchMandiPrices();
                    } else {
                        throw new Error("Could not resolve state from coordinates.");
                    }
                } catch (err) {
                    console.error("Location resolution error:", err);
                    setUserState("All India (Fallback)");
                    fetchMandiPrices();
                } finally {
                    setLoadingLocation(false);
                }
            },
            (err) => {
                console.warn("Location permission denied or timed out:", err);
                setUserState("All India (Fallback)");
                fetchMandiPrices();
                setLoadingLocation(false);
            },
            { timeout: 10000 }
        );
    };

    const fetchMandiPrices = async () => {
        if (!MANDI_API_KEY) {
            setError("API Key Missing: Please ensure VITE_MANDI_API_KEY is configured.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            let url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${MANDI_API_KEY}&format=json&limit=5000`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Server returned HTTP status ${response.status}`);
            }

            const data = await response.json();

            if (data && data.records) {
                setRecords(data.records);
                setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            } else {
                setRecords([]);
                setFilteredRecords([]);
            }
        } catch (err) {
            console.error("API Fetch Error:", err);
            setError(`Failed to retrieve market records: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        detectLocationAndFetch();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase().trim();

        if (!query) {
            if (userState && userState !== "All India (Fallback)") {
                const localData = records.filter(
                    r => r.state?.toLowerCase() === userState.toLowerCase()
                );
                setFilteredRecords(localData.length > 0 ? localData : records);
            } else {
                setFilteredRecords(records);
            }
            return;
        }

        const filtered = records.filter((item) => {
            return (
                item.commodity?.toLowerCase().includes(query) ||
                item.market?.toLowerCase().includes(query) ||
                item.district?.toLowerCase().includes(query) ||
                item.variety?.toLowerCase().includes(query) ||
                item.state?.toLowerCase().includes(query) 
            );
        });
        setFilteredRecords(filtered);
    }, [searchQuery, records, userState]);

    const getChartData = (record) => {
        if (!record) return [];
        return [
            { name: "Floor (Min)", Price: Number(record.min_price || 0) },
            { name: "Selling (Modal)", Price: Number(record.modal_price || 0) },
            { name: "Ceiling (Max)", Price: Number(record.max_price || 0) }
        ];
    };

    return (
        <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 font-sans antialiased transition-colors duration-200">
            <Header />
            <main className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Local Market Price</h2>
                        <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                            <MapPin className="w-4 h-4 mr-1.5 animate-pulse" />
                            {loadingLocation ? (
                                <span className="text-zinc-400 font-normal">Triangulating location metrics...</span>
                            ) : (
                                <span>Your Location: {userState}</span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={detectLocationAndFetch}
                        disabled={loading || loadingLocation}
                        className="self-start sm:self-center p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 text-zinc-600 dark:text-zinc-400 ${(loading || loadingLocation) ? "animate-spin" : ""}`} />
                    </button>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm flex items-center">
                    <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500 mr-3 flex-shrink-0" />
                    <input
                        className="w-full bg-transparent outline-none text-sm placeholder-zinc-400"
                        placeholder="Search commodities, mandis, or states nationwide..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {!loading && !error && (
                    <div className="text-xs text-zinc-400 dark:text-zinc-500 font-medium px-1 flex justify-between items-center">
                        <span>Showing {filteredRecords.length} records {searchQuery ? "(Nationwide Search)" : "(Local Region)"}</span>
                        {lastUpdated && <span>Sync timestamp: <span className="font-mono">{lastUpdated}</span></span>}
                    </div>
                )}

                {error ? (
                    <div className="p-6 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40 rounded-xl flex items-center gap-3">
                        <AlertCircle className="flex-shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                ) : loading ? (
                    <div className="py-24 text-center text-zinc-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                        <p className="mt-3 text-sm font-medium dark:text-zinc-400">Downloading nationwide data streams...</p>
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">No live listings found for your search.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800/80">
                                    <tr>
                                        <th className="py-4 px-6">Commodity / Variety</th>
                                        <th className="py-4 px-6">Market Location</th>
                                        <th className="py-4 px-6 text-right">Floor (Min)</th>
                                        <th className="py-4 px-6 text-right">Ceiling (Max)</th>
                                        <th className="py-4 px-6 text-right">Selling (Modal)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
                                    {filteredRecords.map((r, i) => (
                                        <tr
                                            key={i}
                                            onClick={() => setSelectedRecord(r)}
                                            className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors duration-150"
                                        >
                                            <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-100">
                                                <div>{r.commodity}</div>
                                                <div className="text-xs font-normal text-zinc-400 dark:text-zinc-500 mt-0.5">Var: {r.variety || "Regular"}</div>
                                            </td>
                                            <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                                    <span>{r.market}, {r.district}</span>
                                                </div>
                                                <div className="text-xs text-zinc-400 font-bold uppercase mt-0.5 pl-4">{r.state}</div>
                                            </td>
                                            <td className="py-4 px-6 text-right font-mono text-zinc-500 dark:text-zinc-400">₹{Number(r.min_price || 0).toLocaleString('en-IN')}</td>
                                            <td className="py-4 px-6 text-right font-mono text-zinc-500 dark:text-zinc-400">₹{Number(r.max_price || 0).toLocaleString('en-IN')}</td>
                                            <td className="py-4 px-6 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                ₹{Number(r.modal_price || 0).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {selectedRecord && (
                <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-md p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 relative animate-in fade-in zoom-in-95 duration-150">
                        <button
                            onClick={() => setSelectedRecord(null)}
                            className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-md inline-block">
                                {selectedRecord.state} Local Index
                            </span>
                            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mt-2">{selectedRecord.commodity}</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
                                <MapPin className="w-3.5 h-3.5" /> {selectedRecord.market} Mandi • Variety: {selectedRecord.variety || "Regular"}
                            </p>
                        </div>

                        <div className="h-64 w-full bg-zinc-50 dark:bg-zinc-950/50 rounded-xl p-2 border border-zinc-100 dark:border-none">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={getChartData(selectedRecord)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="localPriceGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" vertical={false} />
                                    <XAxis dataKey="name" className="text-xs font-medium fill-zinc-400" tickLine={false} />
                                    <YAxis className="text-xs font-mono fill-zinc-400" tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: 'none', color: '#f4f4f5' }}
                                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Price Pool']}
                                    />
                                    <Area type="monotone" dataKey="Price" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#localPriceGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-6 text-center">
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Min Entry</div>
                                <div className="text-sm font-mono font-bold mt-0.5">₹{Number(selectedRecord.min_price).toLocaleString('en-IN')}</div>
                            </div>
                            <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Selling Price</div>
                                <div className="text-base font-mono font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹{Number(selectedRecord.modal_price).toLocaleString('en-IN')}</div>
                            </div>
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Max Cap</div>
                                <div className="text-sm font-mono font-bold mt-0.5">₹{Number(selectedRecord.max_price).toLocaleString('en-IN')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}