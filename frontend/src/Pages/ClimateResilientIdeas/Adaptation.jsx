import React, { useState } from 'react';
import Header from '../../Components/Header';
import ChatbotIcon from '../../Components/ChatbotIcon';

// Custom clean SVG components (preserved exactly for zero dependencies)
const ChevronDown = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${props.className || ""}`}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const Water = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="M12 18v-4" /></svg>
);

const Leaf = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 19 14 19 14c2.2 0 4.2-.6 6-1.5v1.5a10 10 0 0 1-5.9 9.1 8 8 0 0 1-8.5-4.4c1.5-.7 2.4-2.5 2-4.9-.1-.7-.7-1.4-1.2-2.1zm5.2 2.2a2 2 0 0 0-2.2 2.2 2 2 0 0 0 2.2-2.2z" /></svg>
);

const Seed = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 7c0-2.43-1.42-4.52-3.48-5.59L12 1l-2.52.41C7.42 2.48 6 4.57 6 7c0 1.96.96 3.73 2.48 4.79L12 15l3.52-3.21C17.04 10.73 18 8.96 18 7z" /><path d="M12 15v8" /></svg>
);

const Sun = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="M4.93 19.07l1.41-1.41" /><path d="M17.66 6.34l1.41-1.41" /></svg>
);

const Tree = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10c0 4.14-6 9-6 9s-6-4.86-6-9a6 6 0 1 1 12 0z" /><path d="M12 18v4" /><path d="M8 12h8" /></svg>
);

const Bug = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12h3" /><path d="M2 12h3" /><path d="M5 5l2 2" /><path d="M17 17l2 2" /><path d="M5 19l2-2" /><path d="M17 7l2-2" /><path d="M20 16a8 8 0 0 0-16 0" /><circle cx="12" cy="17" r="2" /></svg>
);

const Shield = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
);

const DollarSign = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
);

const CloudRain = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v2" /><path d="M8 16v2" /><path d="M12 18v2" /><path d="M8 8a4 4 0 0 1 4-4 4 4 0 0 1 4 4c0 1.5-1 3-2 4l-2 2-2-2c-1-1-2-2.5-2-4z" /></svg>
);

const Users = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

const Target = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);

const Repeat = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
);

const Zap = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);

const Pocket = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2" /><path d="M12 12l-1 5-2-3h6l-2 3-1-5z" /></svg>
);

const Fence = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h8" /><path d="M12 12h8a2 2 0 0 1 2 2v2c0 1.1-.9 2-2 2h-8" /><path d="M16 4v16" /><path d="M8 4v16" /></svg>
);

const Scale = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16.5V9.5m-8 7V5.5m4 13v-9m0-6H7l1-5h6l1 5h-7M12 21v-3.5" /></svg>
);

const Flower = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1zm6 1a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zm-6 17a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1zm6-17a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zm-6 17a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1zm6-17a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1z" /><circle cx="12" cy="12" r="3" /><path d="M17.5 6.5l-1.5 1.5M6.5 17.5l1.5-1.5M17.5 17.5l-1.5-1.5M6.5 6.5l1.5 1.5" /></svg>
);

const Feather = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.6 15.6l-5.6-5.6 5.6-5.6 8.4 8.4-5.6 5.6z" /><path d="M12 22l-5-5M17 17l-5-5" /></svg>
);

const Archive = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="2" width="18" height="20" rx="2" /><path d="M7 16l4-4 4 4" /><path d="M15 8H9" /></svg>
);

const Monitor = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="12" y1="21" x2="12" y2="17" /><line x1="8" y1="21" x2="16" y2="21" /></svg>
);

const iconMap = {
  1: Water, 2: Leaf, 3: Seed, 4: Sun, 5: Tree, 6: Bug, 7: Shield, 8: DollarSign, 9: CloudRain, 10: Users,
  11: Target, 12: Repeat, 13: Zap, 14: Pocket, 15: Fence, 16: Scale, 17: Flower, 18: Feather, 19: Archive, 20: Monitor,
};

const TipCard = ({ tip, isActive, onToggle }) => {
  const IconComponent = iconMap[tip.id];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors duration-200">
      <button
        onClick={() => onToggle(tip.id)}
        className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-zinc-900 hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors focus:outline-none"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg text-slate-600 dark:text-zinc-400 border border-slate-100 dark:border-zinc-700 flex-shrink-0">
            {IconComponent && <IconComponent />}
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight leading-tight">{tip.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 hidden sm:block font-medium">{tip.summary}</p>
          </div>
        </div>
        <ChevronDown className={`${isActive ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`} />
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isActive ? 'grid-rows-[1fr] opacity-100 border-t border-slate-100 dark:border-zinc-800' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-5 bg-slate-50/40 dark:bg-zinc-950">
            {/* Mobile Summary fallback */}
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3 block sm:hidden">
              <span className="text-slate-800 dark:text-zinc-200 font-semibold">Summary:</span> {tip.summary}
            </p>

            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-normal mb-5">
              {tip.detail}
            </p>

            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center text-xs font-semibold text-slate-700 dark:text-zinc-300">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0" />
                <span>Source Foundation: {tip.sourceCredit}</span>
              </div>
              <a
                href={tip.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors inline-flex items-center"
              >
                Explore Concept Guides &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Tips() {
  const [activeTipId, setActiveTipId] = useState(null);

  const handleToggle = (id) => {
    setActiveTipId(activeTipId === id ? null : id);
  };

return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 font-sans antialiased">
      <Header />

      <main className="max-w-screen mx-auto px-3 md:px-20 pt-10 pb-20">
        {/* Clean Architectural Header Area */}
        <header className="border-b border-slate-200 dark:border-zinc-800 pb-8 mb-10">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs tracking-wider uppercase">
            Agri Knowledge Core
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2 mb-3">
            Adaptation Strategies
          </h1>
          <p className="text-sm sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
            Data-driven agricultural tactics and structural adjustments engineered to maximize macro-level crop resilience and operational yield.
          </p>
        </header>

        {/* 2-Column Professional Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {resilienceTips.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              isActive={activeTipId === tip.id}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </main>

      <ChatbotIcon />
    </div>
  );
}

const resilienceTips = [
    {
        id: 1,
        title: "1. Optimized Water Management (Hydrology)",
        summary: "Implement high-efficiency irrigation and rainwater harvesting to manage water scarcity and combat drought conditions.",
        detail: "Move beyond traditional flood irrigation, which wastes huge amounts of water. Utilize advanced techniques like Drip and Micro-Sprinkler systems with pressure compensation to deliver water directly to the root zone, maximizing the water use efficiency (WUE). Constructing small check dams, contour bunds, and on-farm rainwater collection ponds helps recharge groundwater aquifers and provides critical supplemental water during prolonged dry spells. Crucially, deploy soil moisture sensors and tensiometers to prevent both under- and over-watering, saving energy and water resources.",
        sourceCredit: "Source: World Bank's Water Global Practice reports on Irrigation Efficiency",
        sourceLink: "https://www.google.com/search?q=World+Bank+Water+Global+Practice+irrigation+efficiency+guide",
        iconColor: 'text-blue-600',
    },
    {
        id: 2,
        title: "2. Enhanced Soil Health & No-Till Farming",
        summary: "Protect the soil surface using cover crops and minimum tillage to improve structure, water retention, and carbon content.",
        detail: "Adopt the principles of Regenerative Agriculture by eliminating or minimizing soil disturbance (No-Till/Reduced Tillage). This prevents the loss of topsoil due to erosion. Planting diverse cover crops (mixtures of grasses, legumes, and brassicas) during fallow periods adds organic matter, acts as a living mulch to regulate soil temperature, suppresses weed growth, and dramatically increases the soil's capacity to hold moisture. Increasing soil organic carbon by just 1% can hold an additional 20,000 gallons of water per acre.",
        sourceCredit: "Source: Gabe Brown's 'Dirt to Soil' principles of soil health",
        sourceLink: "https://www.google.com/search?q=Gabe+Brown+Dirt+to+Soil+book",
        iconColor: 'text-green-600',
    },
    {
        id: 3,
        title: "3. Crop Diversification and Rotation",
        summary: "Rotate crops seasonally and practice intercropping to break disease cycles and ensure yield stability despite localized stress.",
        detail: "To combat high-risk monocultures, implement a strict 4-field crop rotation (alternating cereals, legumes, root crops, and cash crops) to maintain nutrient balance, naturally manage pest pressure, and reduce the need for synthetic inputs. Intercropping (simultaneously growing two or more complimentary crops, such as corn and squash) uses vertical and horizontal space efficiently, hedges against single-crop failure, and provides diverse nutritional output and market streams, making the farm economically resilient.",
        sourceCredit: "Source: FAO's guide on Sustainable Crop Intensification",
        sourceLink: "https://www.google.com/search?q=FAO+guide+on+Sustainable+Crop+Intensification+rotation",
        iconColor: 'text-yellow-600',
    },
    {
        id: 4,
        title: "4. Utilize Climate-Smart Crop Varieties",
        summary: "Select and plant seeds bred specifically for tolerance to high heat, salinity, and persistent drought or waterlogging conditions.",
        detail: "Invest in seeds that have been carefully bred for resilience to regional climate scenarios. This includes using early-maturing varieties to escape severe terminal drought stress late in the season, salt-tolerant rice for coastal areas, or varieties with enhanced resistance to new fungal or viral diseases that thrive in warmer climates. Sourcing certified, high-quality, regionally-adapted seeds is the first line of defense against predictable climate shifts.",
        sourceCredit: "Source: CGIAR's work on Climate-Resilient Crops",
        sourceLink: "https://www.google.com/search?q=CGIAR+Climate-Resilient+Crops+research",
        iconColor: 'text-red-600',
    },
    {
        id: 5,
        title: "5. Integrate Agroforestry Systems (Trees and Crops)",
        summary: "Plant trees strategically within or around cropland to create beneficial micro-climates, stabilize soil, and diversify farm income.",
        detail: "Agroforestry systems, such as silvopasture (trees, forage, and livestock) or alley cropping (rows of trees with crops planted between), offer powerful ecological benefits. Trees planted as windbreaks reduce wind speed by up to 50%, minimizing soil moisture loss and physical crop damage. The shade from the trees reduces evapotranspiration for underlying crops, potentially cutting water use by 15-20% during peak heat. This also diversifies harvestable outputs (fruit, nuts, timber).",
        sourceCredit: "Source: R. V. Nair and C. T. S. Nair's research on Agroforestry systems",
        sourceLink: "https://www.google.com/search?q=Agroforestry+systems+R+V+Nair+C+T+S+Nair",
        iconColor: 'text-lime-600',
    },
    {
        id: 6,
        title: "6. Integrated Pest Management (IPM) Strategy",
        summary: "Manage pests and diseases ecologically, minimizing chemical inputs and promoting the use of natural predators.",
        detail: "Climate change leads to the emergence of new pest migration patterns and disease vectors. IPM is a cyclical process: Monitor pest populations rigorously, set Economic Thresholds for intervention, use Biological Controls (e.g., habitat enhancement for natural predators), and only use target-specific, low-toxicity chemicals as a final, precise response. This approach maintains the natural balance of the farm ecosystem, lowers input costs, and prevents the rapid development of pesticide resistance.",
        sourceCredit: "Source: Cornell University's IPM program guidelines",
        sourceLink: "https://www.google.com/search?q=Cornell+University+IPM+program+guidelines",
        iconColor: 'text-orange-600',
    },
    {
        id: 7,
        title: "7. Protective Cultivation & Infrastructure",
        summary: "Invest in physical structures like shade nets, tunnels, or high-tensile fences to shield high-value crops from extreme weather events.",
        detail: "For high-value or highly vulnerable crops, invest in polyhouses or protective shade nets which reduce air temperature and UV intensity, significantly lowering heat stress and water demand. Constructing permanent, engineered solutions like earthen berms, drainage trenches, and raised beds prevents waterlogging and protects against surface runoff during sudden intense rainfall events. Sturdy perimeter infrastructure like hedgerows or wind fences protects against storm damage.",
        sourceCredit: "Source: USDA's Natural Resources Conservation Service (NRCS) on structural best practices",
        sourceLink: "https://www.google.com/search?q=USDA+NRCS+Protective+Cultivation+guide",
        iconColor: 'text-indigo-600',
    },
    {
        id: 8,
        title: "8. Financial Risk Planning & Insurance",
        summary: "Develop a robust financial safety net, including micro-insurance and diversified savings, to ensure rapid recovery from climate shocks.",
        detail: "Financial resilience is key to recovery. Secure Parametric Crop Insurance, which automatically pays out based on objective weather indices (like temperature or rainfall deviation), simplifying the lengthy claim process associated with yield losses. Maintain a farm emergency cash reserve and diversify revenue streams (e.g., value-added processing, agritourism) to cushion against full-season losses. Utilize government disaster relief programs and access low-interest recovery credit proactively.",
        sourceCredit: "Source: World Bank's Global Index Insurance Facility (GIIF)",
        sourceLink: "https://www.google.com/search?q=World+Bank+Global+Index+Insurance+Facility+GIIF",
        iconColor: 'text-teal-600',
    },
    {
        id: 9,
        title: "9. Access to Early Weather Information",
        summary: "Subscribe to and use localized, timely weather forecasts and early warning systems for critical operational decisions.",
        detail: "Timely information allows for pre-emptive action. Utilize agro-meteorological services to receive hyper-local, daily forecasts (via SMS or dedicated mobile apps). Knowing a heavy rain is imminent allows a farmer to postpone fertilizer application (preventing runoff); knowing a heatwave is coming allows for pre-emptive irrigation or temporary shade deployment. This data must be specific to the micro-region, not just the capital city, to be useful.",
        sourceCredit: "Source: WMO's Global Framework for Climate Services (GFCS)",
        sourceLink: "https://www.google.com/search?q=WMO+Global+Framework+for+Climate+Services+GFCS+agriculture",
        iconColor: 'text-sky-600',
    },
    {
        id: 10,
        title: "10. Community Knowledge and Training Networks",
        summary: "Actively share successful strategies with neighbors and participate in ongoing, localized agricultural training programs.",
        detail: "Climate adaptation is a shared challenge and collective action multiplies success. Participate in or organize Farmer Field Schools (FFS) where farmers learn from each other through local experimentation and verification. Create community resilience groups to pool resources for expensive machinery or shared rainwater infrastructure. This builds crucial social capital, ensuring that localized solutions are rapidly shared and implemented across the region.",
        sourceCredit: "Source: FAO's Farmer Field School (FFS) program methodology",
        sourceLink: "https://www.google.com/search?q=FAO+Farmer+Field+School+FFS+methodology+guide",
        iconColor: 'text-purple-600',
    },
    {
        id: 11,
        title: "11. Precision Agriculture & Remote Sensing",
        summary: "Use digital tools, satellite data, and drones to optimize input use (water, fertilizer) and monitor crop stress early.",
        detail: "Embrace technology to manage spatial variability. Remote sensing from satellites or drones provides Normalized Difference Vegetation Index (NDVI) and thermal maps, showing crop vitality, water stress, and disease outbreaks before they are visible to the naked eye. This data feeds into Variable Rate Application (VRA) machinery, allowing farmers to apply inputs (fertilizer, pesticides) only where needed, cutting input costs by up to 20% and minimizing environmental impact.",
        sourceCredit: "Source: World Economic Forum (WEF) reports on Digital Agriculture adoption",
        sourceLink: "https://www.google.com/search?q=World+Economic+Forum+Digital+Agriculture+VRA",
        iconColor: 'text-pink-600',
    },
    {
        id: 12,
        title: "12. On-Farm Nutrient Recycling (Composting)",
        summary: "Convert farm waste and crop residues into high-quality organic fertilizers (compost, biochar) instead of burning or discarding them.",
        detail: "Develop robust aerobic and anaerobic composting systems for animal manure, crop stubble, and organic waste. The resulting humus-rich compost provides balanced, slow-release nutrients and, most importantly, dramatically improves soil structure, aeration, and water holding capacity (WHC). This practice also includes implementing an anaerobic digester to capture methane (a potent greenhouse gas) from manure and convert it into biogas for farm energy.",
        sourceCredit: "Source: The Compost Tea Book by Elaine Ingham (Focus on microbial ecology)",
        sourceLink: "https://www.google.com/search?q=Elaine+Ingham+The+Compost+Tea+Book+soil+fertility",
        iconColor: 'text-emerald-600',
    },
    {
        id: 13,
        title: "13. Shifting to Decentralized Renewable Energy",
        summary: "Install solar pumps for irrigation and lighting to reduce energy costs and maintain functionality during grid disruptions.",
        detail: "Water pumping is the largest energy drain on most farms. Investing in solar photovoltaic (PV) powered irrigation systems (solar pumps) provides energy independence, acts as a crucial hedge against rising fuel/electricity prices, and ensures a reliable water supply even when the conventional power grid fails due to storm damage or systemic heatwave blackouts. The farm becomes its own energy resilient micro-grid.",
        sourceCredit: "Source: IRENA's reports on Renewable Energy in Agriculture",
        sourceLink: "https://www.google.com/search?q=IRENA+reports+on+Renewable+Energy+in+Agriculture+solar+pumping",
        iconColor: 'text-yellow-500',
    },
    {
        id: 14,
        title: "14. Focus on Post-Harvest Value Chains",
        summary: "Invest in on-farm storage, drying, and primary processing to reduce post-harvest losses and capture greater market value.",
        detail: "Protecting crops after harvest is critical; up to 30% of global food is lost post-harvest. Develop local infrastructure like efficient grain drying silos (using solar or biomass heat), on-site cold storage for perishable goods, and basic primary processing units (milling, shelling). This allows farmers to hold produce longer, sell when prices are optimal, and protects their investment from rapid spoilage due to unexpected humidity or heat spikes.",
        sourceCredit: "Source: UC Davis Postharvest Technology Center guidelines",
        sourceLink: "https://www.google.com/search?q=UC+Davis+Postharvest+Technology+Center+guidelines+storage",
        iconColor: 'text-fuchsia-600',
    },
    {
        id: 15,
        title: "15. Managed Livestock Integration (Silvopasture)",
        summary: "Carefully integrate livestock with crops and trees, using managed rotational grazing to enhance biodiversity and soil fertility.",
        detail: "Move toward ecological balance through Holistic Planned Grazing. Animals are moved frequently (Rotational Grazing) to prevent overgrazing, allowing grass roots to recover fully, which increases carbon sequestration and soil health. In Silvopasture, trees provide shade for livestock, reducing heat stress and mortality during extreme summer temperatures, while the animals manage weeds and naturally fertilize the soil, creating a balanced, resilient system.",
        sourceCredit: "Source: Allan Savory's Holistic Management framework",
        sourceLink: "https://www.google.com/search?q=Allan+Savory+Holistic+Management+grazing+book",
        iconColor: 'text-gray-700',
    },
    {
        id: 16,
        title: "16. Policy and Advocacy at the Local Level",
        summary: "Engage in local policy-making to influence climate adaptation planning and secure community infrastructure support.",
        detail: "Individual adaptation efforts are amplified by supportive policy. Organize with local cooperatives or farming unions to lobby municipal governments for decentralized infrastructure grants (e.g., funding for community-shared water storage tanks or localized weather stations). Advocate for flexible, adaptive water rights and land-use planning that explicitly recognizes the need for ecological corridors and vegetative buffers against extreme weather events.",
        sourceCredit: "Source: IFOAM Organics International policy recommendations",
        sourceLink: "https://www.google.com/search?q=IFOAM+Organics+International+climate+policy+advocacy",
        iconColor: 'text-amber-600',
    },
    {
        id: 17,
        title: "17. Farm Biodiversity Mapping and Protection",
        summary: "Conduct a systematic inventory of farm biodiversity to protect native species and critical ecological service providers.",
        detail: "A diverse farm is inherently more stable. Systematically map out and actively protect key habitats, such as native hedgerows, riparian buffers (along waterways), and perennial wildflower strips. These areas provide habitat for beneficial insects (pollinators and pest predators), which reduces the need for chemical inputs. Protecting native, locally-adapted species ensures that critical ecosystem services continue despite regional climate volatility.",
        sourceCredit: "Source: Xerces Society for Invertebrate Conservation's farming guidelines",
        sourceLink: "https://www.google.com/search?q=Xerces+Society+farming+biodiversity+guide",
        iconColor: 'text-rose-600',
    },
    {
        id: 18,
        title: "18. Active Soil Carbon Sequestration",
        summary: "Adopt practices like biochar amendment and deep compost application to deliberately increase carbon storage in the soil.",
        detail: "Focus on increasing Soil Organic Carbon (SOC) not just for fertility, but for its physical benefits. Techniques include the controlled application of biochar (stable carbon from biomass pyrolysis), which significantly improves cation exchange capacity and long-term soil structure. Continuous application of deep compost and planting deep-rooted perennial crops (especially cool-season grasses) are crucial, directly helping the farm act as a carbon sink and increasing its drought defense.",
        sourceCredit: "Source: The Carbon Cycle Institute research on carbon farming",
        sourceLink: "https://www.google.com/search?q=Carbon+Cycle+Institute+soil+carbon+sequestration+guide",
        iconColor: 'text-fuchsia-800',
    },
    {
        id: 19,
        title: "19. Post-Disaster Community Seed Banking",
        summary: "Establish a local, community-managed seed bank of indigenous and resilient crop varieties for rapid post-disaster recovery.",
        detail: "Following a severe weather event, commercial seed supply chains often collapse. A Community Seed Bank is a decentralized, localized insurance mechanism. Farmers store and manage seeds from locally-adapted landraces (traditional, heritage varieties) known for their resilience to specific regional stressors (e.g., flash flood tolerance or specific nutrient deficiencies). This ensures immediate access to viable, adapted planting material when it's needed most.",
        sourceCredit: "Source: Bioversity International's community seed bank strategy",
        sourceLink: "https://www.google.com/search?q=Bioversity+International+community+seed+bank+guide",
        iconColor: 'text-cyan-700',
    },
    {
        id: 20,
        title: "20. Leveraging Digital Farmer Field Schools (FFS)",
        summary: "Utilize mobile technology and digital platforms for real-time training, extension services, and peer-to-peer knowledge exchange.",
        detail: "The pace of climate change requires instant, personalized extension services. Implement geographically-targeted mobile apps and dedicated chat groups (e.g., WhatsApp, Signal) to deliver immediate, expert advice on localized disease outbreaks, pest alerts, and optimal harvest windows. Digital FFS allows for the rapid dissemination of photos and videos, enabling remote diagnostics and training that is continuous, cost-effective, and highly responsive to dynamic field conditions.",
        sourceCredit: "Source: GIZ and World Bank projects on Digital Extension Services",
        sourceLink: "https://www.google.com/search?q=GIZ+World+Bank+Digital+Extension+Services+agriculture",
        iconColor: 'text-violet-600',
    },
];
