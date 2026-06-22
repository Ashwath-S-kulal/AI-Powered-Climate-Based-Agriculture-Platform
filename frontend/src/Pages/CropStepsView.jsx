import React, { useEffect, useState } from "react";
import { FiClipboard, FiZap } from "react-icons/fi";
import { Loader2 } from "lucide-react";

export default function CropStepsView({ crop }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!crop?.num) return;

    setLoading(true);

    fetch(`${import.meta.env.VITE_BASE_URI}/api/cropsteps/${crop.num}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch crop steps");
        return res.json();
      })
      .then((data) => {
        setPlan({
          overview: data.overview || "",
          steps: Array.isArray(data.steps) ? data.steps : []
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading crop steps:", err);
        setPlan(null);
        setLoading(false);
      });
  }, [crop?.num]);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mb-2" />
        <p className="text-sm font-medium">Retrieving growing data...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="w-full border border-slate-200 bg-white p-6 rounded-2xl text-center shadow-sm">
        <p className="text-slate-500 text-sm font-medium italic">
          No growing data available for {crop.name} yet.
        </p>
      </div>
    );
  }

  const { overview, steps } = plan;

return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 md:p-8 space-y-8">
      
      {/* Crop Overview Panel */}
      <div className="flex flex-col md:flex-row gap-6 p-5 md:p-6 rounded-xl bg-slate-50/50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 items-start">
        <div className="w-full md:w-36 aspect-[4/3] md:aspect-square rounded-xl overflow-hidden border border-slate-200/80 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 flex-shrink-0">
          {crop.image ? (
            <img
              src={crop.image}
              alt={crop.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-zinc-600 text-xs font-medium">
              No Image
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2.5">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {crop.name}
            </h2>
            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/40 dark:border-emerald-900/50 px-2 py-0.5 rounded inline-block">
              {crop.type} &middot; {crop.season} Season
            </p>
          </div>

          <p className="text-slate-600 dark:text-zinc-400 text-[13px] md:text-sm leading-relaxed max-w-2xl border-l-2 border-slate-200 dark:border-zinc-700 pl-3">
            {overview}
          </p>
        </div>
      </div>

      {/* Growth Timeline Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
          <FiClipboard className="text-slate-400 dark:text-zinc-500 text-lg" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">The Growth Journey</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex gap-4 p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex-shrink-0 w-7 h-7 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 font-bold text-xs flex items-center justify-center rounded-full shadow-sm">
                {i + 1}
              </div>
              <p className="text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed pt-0.5">
                {step}
              </p>
            </div>
          ))}

          {/* Conclusion Callout */}
          <div className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 rounded-xl p-5 col-span-full flex flex-col sm:flex-row items-center sm:justify-between gap-3 text-center sm:text-left mt-2">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center shadow-sm">
                <FiZap className="text-lg" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Happy Harvesting!</p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Enjoy cultivation and monitor your fresh yields carefully.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}