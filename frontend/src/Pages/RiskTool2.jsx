import React, { useState } from 'react';

// Inline Icons for zero-dependency drop-in convenience
const ShieldAlertIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const LeafIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58.9 9.2A7 7 0 0 1 11 20z"/><path d="M19 2c-2.26 4.33-5.27 7.14-8 10"/>
  </svg>
);

export default function ClimateRiskCalculator() {
  // 1. Core Parameter Inputs State
  const [moisture, setMoisture] = useState(45);
  const [temperature, setTemperature] = useState(28);
  const [rainfall, setRainfall] = useState('moderate');
  const [cropType, setCropType] = useState('cereals');

  // 2. Real-time Pure Frontend Resilience Calculation Engine
  const calculateResilience = () => {
    let score = 100;
    let alerts = [];
    let advice = "Balanced Preventive Management: Soil parameters are within acceptable thresholds. Maintain regular monitoring matrices and inspect under-canopy moisture retention zones weekly.";

    // Moisture Evaluations
    if (moisture < 35) {
      score -= 25;
      alerts.push("Critical Low Moisture");
    } else if (moisture > 80) {
      score -= 20;
      alerts.push("Soil Waterlogging Exposure");
    }

    // Temperature Evaluations
    if (temperature > 38) {
      score -= 25;
      alerts.push("Severe Thermal Stress");
    } else if (temperature < 18) {
      score -= 15;
      alerts.push("Sub-Optimal Heat Accumulation");
    }

    // Compound Weather & Forecast Anomalies
    if (rainfall === 'low' && moisture < 40) {
      score -= 20;
      alerts.push("Accelerated Drought Risk Vector");
      advice = "Critical Drought Action Required: Implement organic mulching immediately across exposed root zones to suppress evaporation. Transition irrigation schedules strictly to early morning hours to preserve water volume.";
    } else if (rainfall === 'heavy' && moisture > 70) {
      score -= 20;
      alerts.push("Potential Saturation / Root Rot Threat");
      advice = "Flash Flood Preemptive Protocol: Clear structural boundary drainage channels instantly. Suspend all upcoming liquid fertigation cycles to reduce nutrient runoff and protect structural root integrity.";
    } else if (temperature > 35) {
      advice = "Thermal Defense Protocol: Deploy micro-overhead shade meshes if accessible. Apply potassium-rich foliar compounds to optimize plant stomatal regulation and lower vascular transpiration stress.";
    } else if (score >= 80) {
      advice = "Optimal Yield Growth State: Current microclimate parameters align perfectly with high-yield baseline standards. Proceed with standard scheduled operational rotations.";
    }

    // Crop Modifiers (Buffering capacity baseline adjustments)
    if (cropType === 'legumes' && moisture < 30) score -= 5; // Legumes are slightly sensitive to deep dry spells
    if (cropType === 'root crops' && moisture > 75) score -= 10; // Root crops decay quickly under high moisture

    // Bound output score between 0 and 100 safely
    const finalScore = Math.max(0, Math.min(100, score));
    
    // Assign structural classification properties
    let tier = { name: "Low Risk", color: "text-emerald-700 bg-emerald-50 border-emerald-200", fill: "bg-emerald-600" };
    if (finalScore < 45) {
      tier = { name: "High Risk", color: "text-rose-700 bg-rose-50 border-rose-200", fill: "bg-rose-600" };
    } else if (finalScore < 75) {
      tier = { name: "Moderate Warning", color: "text-amber-700 bg-amber-50 border-amber-200", fill: "bg-amber-500" };
    }

    return { score: finalScore, alerts, advice, tier };
  };

  const { score, alerts, advice, tier } = calculateResilience();

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden font-sans">
      
      {/* Module Navigation Subheader Banner */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LeafIcon className="text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">Interactive Vulnerability Index</h3>
        </div>
        <span className="hidden md:inline text-[10px] bg-slate-200 text-slate-600 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Sandbox Component
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        
        {/* Left Column: Interactive Parametric Input Form */}
        <div className="lg:col-span-6 p-6 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Environmental Variables</h4>
            
            {/* Input 1: Soil Moisture */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <label htmlFor="moisture-slider">Soil Moisture Level</label>
                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-900">{moisture}%</span>
              </div>
              <input 
                id="moisture-slider"
                type="range" 
                min="0" 
                max="100" 
                value={moisture} 
                onChange={(e) => setMoisture(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
              />
            </div>

            {/* Input 2: Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <label htmlFor="temp-slider">Ambient Temperature</label>
                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-900">{temperature}°C</span>
              </div>
              <input 
                id="temp-slider"
                type="range" 
                min="15" 
                max="45" 
                value={temperature} 
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Crop Configuration Matrices</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Input 3: Rainfall Select Box */}
              <div className="space-y-1.5">
                <label htmlFor="rainfall-select" className="text-xs font-bold text-slate-700">7-Day Rainfall Forecast</label>
                <select 
                  id="rainfall-select"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:border-slate-400 focus:outline-none"
                >
                  <option value="low">Low / Extended Drought</option>
                  <option value="moderate">Moderate / Normal Distribution</option>
                  <option value="heavy">Heavy / Extreme Inundation</option>
                </select>
              </div>

              {/* Input 4: Crop Category Type Select Box */}
              <div className="space-y-1.5">
                <label htmlFor="crop-select" className="text-xs font-bold text-slate-700">Main Canopy Target</label>
                <select 
                  id="crop-select"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:border-slate-400 focus:outline-none"
                >
                  <option value="cereals">Cereals (Rice, Wheat, Corn)</option>
                  <option value="legumes">Legumes (Beans, Lentils, Peas)</option>
                  <option value="root crops">Root Crops (Potatoes, Cassava)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Assessment & Blueprint Advice Display */}
        <div className="lg:col-span-6 p-6 bg-slate-50/50 flex flex-col justify-between space-y-6">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Calculated Diagnostics</h4>
            
            {/* Dynamic Score Indicator and State Tracker */}
            <div className="flex items-center gap-5 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full border-4 border-slate-100 flex-shrink-0">
                <span className="text-lg font-black text-slate-800 tracking-tighter">{score}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Farm Resilience Index</span>
                <div className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border w-max ${tier.color}`}>
                  {tier.name}
                </div>
              </div>
            </div>

            {/* Micro Gauge Track Bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-4">
              <div className={`h-full transition-all duration-300 ${tier.fill}`} style={{ width: `${score}%` }}></div>
            </div>

            {/* Parameter Warning Chips Area */}
            {alerts.length > 0 && (
              <div className="mt-5 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Identified Hazard Vectors:</span>
                <div className="flex flex-wrap gap-1.5">
                  {alerts.map((alert, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-[11px] font-bold bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                      {alert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contextual Action Items Response Field */}
          <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 tracking-tight">
              <ShieldAlertIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Targeted Operational Action Step</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {advice}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}