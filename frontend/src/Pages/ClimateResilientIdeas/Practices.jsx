import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import { Sparkles } from 'lucide-react';

const resilienceData = [
    {
        category: "Water Management",
        color: "bg-blue-600",
        detail: "Focuses on minimizing water loss, maximizing absorption, and efficient storage to survive droughts and manage excess rain.",
        items: [
            {
                title: "Contour Farming / Terracing",
                subIcon: "⛰️",
                description: "Involves plowing and planting parallel to the natural slope contours. Terraces are built as steps on steep slopes. This dramatically slows down water runoff, increasing the time for infiltration and significantly reducing soil erosion during heavy rains.",
                imageUrl: "https://www.ceew.in/sites/default/files/image%20%2817%29.png"
            },
            {
                title: "Small Ponds / Farm Pits",
                subIcon: "🕳️",
                description: "Strategically located small reservoirs or pits dug on the farm to capture and store rainwater or surface runoff during the wet season. This stored water is crucial for supplementary irrigation during dry spells, acting as a buffer against drought.",
                imageUrl: "https://vikalpsangam.org/wp-content/uploads/migrate/Livelihoods/nirmalya_ch_1_farm_ponds.jpg"
            },
            {
                title: "Alternate Wetting and Drying (AWD) for Rice",
                subIcon: "🌧️",
                description: "A water-saving technology where irrigation water is applied only when the water level drops to a certain depth below the soil surface, instead of keeping the field continuously flooded. This saves up to 30% of water, reduces irrigation costs, and significantly lowers methane (a potent greenhouse gas) emissions.",
                imageUrl: "https://media.licdn.com/dms/image/v2/D4D22AQGkyuvf0bFcsw/feedshare-shrink_800/feedshare-shrink_800/0/1692513699768?e=2147483647&v=beta&t=j8zGU0mDZa5vaHQ5HUr0p8CoW9zK7RYY72JPKP0MGe8"
            },
        ]
    },
    {
        category: "Soil & Fertility Management",
        color: "bg-green-600",
        detail: "Strategies centered on building healthy soil structure, improving water retention, and naturally increasing nutrient content.",
        items: [
            {
                title: "Green Manures / Legume Intercropping",
                subIcon: "🌿",
                description: "Planting non-cash crops (like legumes or clover) specifically to be incorporated into the soil (green manure) or growing legumes alongside cash crops (intercropping). Legumes host nitrogen-fixing bacteria, naturally enriching the soil with nitrogen, reducing the need for chemical fertilizers, and improving overall soil structure.",
                imageUrl: "https://www.milkwood.net/wp-content/uploads/2021/03/green-manures-8.jpg"
            },
            {
                title: "Biochar Addition",
                subIcon: "🔥",
                description: "Adding biochar (a charcoal-like material made from organic matter pyrolysis) to the soil. Biochar has a highly porous structure, which dramatically improves the soil's capacity to retain water and nutrients, making the soil more fertile and resilient to both drought and nutrient leaching.",
                imageUrl: "https://www.researchgate.net/publication/372864717/figure/fig5/AS:11431281178787419@1691065209502/llustration-of-Adding-Biochar-to-the-Soil.jpg"
            },
            {
                title: "No-Till or Minimum Tillage",
                subIcon: "🚜",
                description: "Planting crops directly into undisturbed soil or with minimal soil disturbance. This leaves organic residue (previous crop stubble) on the surface, which acts as a protective mulch. It drastically reduces soil erosion from wind/rain and preserves soil moisture by limiting evaporation, especially vital during drought periods.",
                imageUrl: "https://kellytillage.com/us/wp-content/uploads/sites/4/2023/08/advantages-and-disadvantages-of-zero-tillage-.jpg"
            },
        ]
    },
    {
        category: "Crop Management",
        color: "bg-yellow-600",
        detail: "Techniques focused on optimizing planting cycles and crop diversity to maximize yield stability and adaptation to fluctuating climates.",
        items: [
            {
                title: "Relay Cropping",
                subIcon: "🔄",
                description: "The practice of planting a second crop into a standing first crop before the first crop is harvested. This maximizes the use of the growing season, increases total output from the same land, and ensures faster recovery or succession in case the first crop fails due to unseasonal weather.",
                imageUrl: "https://www.cfra.org/sites/default/files/page-images/xCredit%2C%20Drew%20Dietz.JPG"
            },
            {
                title: "Intercropping",
                subIcon: "🤝",
                description: "Growing two or more different crops simultaneously on the same field (e.g., maize and beans). This biological diversity reduces the overall risk of complete crop loss, suppresses weeds, and improves soil health. Different root systems access water and nutrients at varying depths, increasing resource efficiency.",
                imageUrl: "https://www.syngenta.com/sites/default/files/2025-06/IntercroppingBannerIMG.jpg"
            },
            {
                title: "Crop Rotation",
                subIcon: "🗓️",
                description: "Systematically changing the type of crops grown in a field over a sequence of seasons. This interrupts the life cycles of pests and diseases specific to one crop, prevents the depletion of specific soil nutrients, and helps maintain long-term soil fertility and structure.",
                imageUrl: "https://kaybeebio.com/wp-content/uploads/2023/08/Crop-Rotation.webp"
            },
        ]
    },
    {
        category: "Pest & Disease Management",
        color: "bg-red-600",
        detail: "Using natural and integrated methods to manage threats that can be exacerbated by temperature and moisture changes.",
        items: [
            {
                title: "Trap Crops",
                subIcon: "🦟",
                description: "Planting a small area with a crop that is highly attractive to a specific pest to draw the pests away from the main, cash crop. Pests can then be physically destroyed or treated only on the small trap crop area, minimizing pesticide use on the main field.",
                imageUrl: "https://static.agrostar.in/static/Feed_Trap-crop.jpg"
            },
            {
                title: "Neem or Garlic Sprays",
                subIcon: "🧄",
                description: "Using botanical extracts like neem oil (Azadirachta indica) or garlic as natural, biodegradable pesticides and fungicides. These are low-cost, effective against a wide range of pests, and their residues are safer for the environment and varying weather conditions compared to synthetic chemicals.",
                imageUrl: "https://images.thdstatic.com/productImages/9f57f4b9-0bcc-400f-af5c-017256e84938/svn/bonide-organic-disease-control-0226-c3_600.jpg"
            },
            {
                title: "Resilient Varieties",
                subIcon: "💪",
                description: "Selecting and cultivating crop varieties that have been bred or genetically adapted to be inherently resistant to common local pests, or diseases (like rusts or mildews) that thrive in specific weather-related conditions (e.g., prolonged wetness or heat stress).",
                imageUrl: "https://kj1bcdn.b-cdn.net/media/99595/climate-resilient-crops-1.jpg"
            },
        ]
    },
    {
        category: "Temperature & Extreme Weather",
        color: "bg-amber-600",
        detail: "Physical modifications to the farm environment to shield crops from harsh winds, intense heat, and untimely frost.",
        items: [
            {
                title: "Windbreaks",
                subIcon: "🌬️",
                description: "Rows of trees, shrubs, or artificial barriers planted strategically around fields. They reduce wind speed, preventing wind erosion, reducing desiccation (drying out) of soil and plants, and physically protecting sensitive crops from wind damage during storms.",
                imageUrl: "https://cdn.britannica.com/67/244267-050-CF455071/Windbreak-trees-farmland-agriculture-Romsdalen-valley-Norway.jpg"
            },
            {
                title: "Shade Cloth / Agroforestry",
                subIcon: "🌳",
                description: "Using artificial netting (shade cloth) or integrating trees into farming systems (Agroforestry) to provide partial shade to high-value or heat-sensitive crops (like coffee or certain vegetables). This protects them from intense solar radiation and heat stress, maintaining growth and quality during heatwaves.",
                imageUrl: "https://eyouagro.com/wp-content/uploads/2024/09/shade-2.webp"
            },
            {
                title: "Microclimate Farming",
                subIcon: "🌄",
                description: "Deliberately planting crops in specific areas of the farm where the local environment offers natural protection. For instance, planting heat-sensitive crops in low-lying, naturally shaded spots, or areas protected from the afternoon sun, to minimize temperature stress.",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRklwHKYtIFmkBLVvLM7VNsAvyzPooPHYsK0g&s"
            },
            {
                title: "Frost Protection",
                subIcon: "❄️",
                description: "Methods used to raise the temperature around the crop when frost is predicted. This can include running sprinklers (which release latent heat as the water freezes), or using temporary row covers (tunnels made of fabric or plastic) to trap ground heat, reducing damage to delicate plant tissue.",
                imageUrl: "https://www.cottonpicker.co.za/wp-content/uploads/2019/05/Frost-Cover-3-1.jpg"
            },
        ]
    },
    {
        category: "Low-Cost Innovative Ideas",
        color: "bg-purple-600",
        detail: "Simple, practical, and inexpensive methods leveraging basic materials and traditional knowledge to enhance resilience.",
        items: [
            {
                title: "Bottle Drip Irrigation",
                subIcon: "🍼",
                description: "A DIY irrigation method where plastic bottles are cut, filled with water, and placed upside down next to plants with a small hole in the cap or base. This delivers water slowly and directly to the root zone, minimizing evaporation and maximizing water efficiency at a zero hardware cost.",
                imageUrl: "https://5.imimg.com/data5/SELLER/Default/2021/4/JY/JO/BU/53715300/automatic-drip-irrigation-system-for-watering-plants-and-garden.jpg"
            },
            {
                title: "Sand Mulching",
                subIcon: "🏖️",
                description: "Applying a layer of coarse sand or small gravel on the soil surface, particularly effective in sandy or arid regions. This inert layer prevents the fine soil underneath from drying out by reducing capillary rise and evaporation, acting as a non-organic mulch to retain moisture.",
                imageUrl: "https://images.squarespace-cdn.com/content/v1/5a53e1b42278e7e117637152/1516818665403-PO640OSN2FUDLCPHCMEF/Lull+Mulch.JPG"
            },
            {
                title: "Planting in Mounds",
                subIcon: "🗻",
                description: "Creating raised beds or mounds of soil, especially beneficial in areas prone to seasonal flooding or high water tables. This keeps the plant roots and crown well above the standing water, preventing waterlogging and root rot, ensuring aeration and survival.",
                imageUrl: "https://www.wilsonbrosgardens.com/assets/images/Blog%20Pics/Planting-Diagram-Raised-Mound-Revised.jpg"
            },
            {
                title: "Seed Priming",
                subIcon: "🧪",
                description: "Pre-soaking seeds in water (sometimes with nutrient solutions) for a controlled period and then surface-drying them before planting. This kick-starts the germination process, ensuring rapid and uniform emergence when planted, which is crucial for survival under potential drought or heat-stress conditions post-planting.",
                imageUrl: "https://pub.mdpi-res.com/seeds/seeds-04-00014/article_deploy/html/images/seeds-04-00014-g001.png?1741328483"
            },
        ]
    },
];



const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-600">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

export default function Practices() {
  const initialCategory = resilienceData[0];
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (activeCategory.items.length > 0 && !selectedItem) {
      setSelectedItem(activeCategory.items[0]);
    }
  }, [activeCategory, selectedItem]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSelectedItem(category.items.length > 0 ? category.items[0] : null);
  };

return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 font-sans antialiased">
      <Header />

      <main className="max-w-screen mx-auto px-3 md:px-20 pt-10 pb-20">
        <header className="border-b border-slate-200 dark:border-zinc-800 pb-6 mb-8">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 mb-2">
            Good Practices
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Proven systematic frameworks and operational methodologies optimized for resilient farm management.
          </p>
        </header>

        <div className="flex border-b border-slate-200 dark:border-zinc-800 overflow-x-auto scrollbar-none gap-6 mb-8">
          {resilienceData.map((category) => {
            const isActive = activeCategory.category === category.category;
            return (
              <button
                key={category.category}
                onClick={() => handleCategoryChange(category)}
                className={`pb-4 text-sm font-semibold tracking-tight relative whitespace-nowrap transition-all focus:outline-none ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300'
                }`}
              >
                {category.category}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col space-y-5">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                {activeCategory.category} Frameworks
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {activeCategory.detail}
              </p>
            </div>

            <div className="flex flex-col space-y-2 overflow-y-auto max-h-[420px] pr-1">
              {activeCategory.items.map((item, i) => {
                const isSelected = selectedItem?.title === item.title;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-all focus:outline-none ${
                      isSelected
                        ? 'bg-white dark:bg-zinc-800 border-slate-400 dark:border-zinc-600 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-400/20'
                        : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg border transition-colors ${
                      isSelected ? 'bg-slate-50 dark:bg-zinc-700 border-slate-200 dark:border-zinc-600' : 'bg-slate-50/40 dark:bg-zinc-800 border-slate-100 dark:border-zinc-700'
                    }`}>
                      <SparklesIcon />
                    </div>
                    <span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-zinc-200">
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm min-h-[500px] flex flex-col justify-between">
            {selectedItem ? (
              <div className="w-full flex flex-col h-full">
                {selectedItem.imageUrl && selectedItem.imageUrl !== "#" ? (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-64 object-cover rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm mb-6 bg-slate-50 dark:bg-zinc-950"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-64 bg-slate-50 dark:bg-zinc-950 rounded-xl flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-zinc-700 mb-6">
                    <span className="text-2xl mb-2">{activeCategory.icon || "🌱"}</span>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold tracking-tight">
                      System Reference Layout Grid
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                    {selectedItem.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-normal bg-slate-50/50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 p-5 rounded-xl">
                    {selectedItem.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 dark:text-zinc-600 flex-1 flex flex-col items-center justify-center py-12">
                <span className="text-3xl mb-3 opacity-60">🌾</span>
                <p className="text-sm font-semibold tracking-tight">
                  Select a tactical methodology configuration to view blueprint architecture.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
