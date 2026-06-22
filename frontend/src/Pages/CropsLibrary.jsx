import React from "react";
import {
  Leaf,
  BarChart2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  Clock,
  Users,
  Globe2,
  DollarSign,
  BookOpen,
  ArrowRight,
  User,
  BookMarked
} from "lucide-react";
import Header from "../Components/Header";
import { NavLink } from "react-router-dom";
import ChatbotIcon from "../Components/ChatbotIcon";

const recommendedBooks = [
  { title: "The Permaculture Handbook", author: "J. Russell", sourceUrl: "https://www.nazboo.com/wp-content/uploads/2017/05/ebook-The-Permaculture-Handbook.-Garden-Farming-for-Town-and-Country-by-Peter-Bane.pdf", coverPlaceholder: "https://m.media-amazon.com/images/I/71IEGjlIjWL._UF1000,1000_QL80_.jpg" },
  { title: "No-Till Farming Systems", author: "D. Johnson", sourceUrl: "http://www.waswac.org.cn/waswac/rootfiles/2017/08/17/1499910848045231-1499910848048172.pdf", coverPlaceholder: "https://0.academia-photos.com/attachment_thumbnails/91931327/mini_magick20221003-1-1bdeodq.png?1664824800" },
  { title: "Water-Wise Agriculture", author: "S. Patel", sourceUrl: "https://www.amazon.in/Water-Management-Conservation-Harvesting-Artificial/dp/8122422241", coverPlaceholder: "https://m.media-amazon.com/images/I/71RGBngukpL._SY385_.jpg" },
  { title: "Carbon Sequestration", author: "E. Chen", sourceUrl: "https://scholar.google.co.in/scholar?q=Carbon+Sequestration+By+E.+Chen+pdf&hl=en&as_sdt=0&as_vis=1&oi=scholart", coverPlaceholder: "https://dep.nj.gov/wp-content/uploads/ghg/c-seq-webpage-1024x1024.png" },
  { title: "The Resilient Farm", author: "B. White", sourceUrl: "https://toc.library.ethz.ch/objects/pdf03/e05_978-1-60358-444-9_01.pdf", coverPlaceholder: "https://m.media-amazon.com/images/I/91n89mVbtTL._UF1000,1000_QL80_.jpg" },
  { title: "Integrated Pest Mgmt", author: "K. Lee", sourceUrl: "https://www.researchgate.net/publication/255730153_Integrated_Pest_Management", coverPlaceholder: "https://0.academia-photos.com/attachment_thumbnails/38689899/mini_magick20190224-6867-1hevjtp.png?1551023838" },
  { title: "Climate Change Adaptation", author: "M. Garcia", sourceUrl: "https://www.researchgate.net/publication/200032572_Adaptation_to_Climate_Change_in_the_Developing_World", coverPlaceholder: "https://images.routledge.com/common/jackets/crclarge/978113805/9781138054509.jpg" },
  { title: "Soil Biology", author: "A. Singh", sourceUrl: "https://www.amazon.in/Advances-Applied-Bioremediation-Soil-Biology/dp/3642269176", coverPlaceholder: "https://media.springernature.com/w138/springer-static/cover/series/5138.jpg" },
  { title: "Agroforestry Systems Design", author: "L. Taylor", sourceUrl: "https://www.researchgate.net/publication/380373985_Designing_Agroforestry_Systems_Chapter-10", coverPlaceholder: "https://m.media-amazon.com/images/I/714rJsfksTL.jpg" },
  { title: "Regenerative Grazing", author: "C. Miller", sourceUrl: "https://www.foodandlandusecoalition.org/wp-content/uploads/2019/09/Regenerative-Agriculture-final.pdf", coverPlaceholder: "https://m.media-amazon.com/images/I/81n8JP7-OBL._UF1000,1000_QL80_.jpg" }
];

const successfulFarmers = [
  {
    title: "Pioneering chemical-free traditional farming",
    farmer: "Hukumchand Patidar",
    location: "Rajasthan, India",
    description: "Successful organic farmer exporting his produce to multiple countries. Practices organic farming on a massive, scalable level.",
    image: "https://cms.patrika.com/wp-content/uploads/2025/08/Hukumchand-Patidar.jpg",
    fullStoryUrl: "https://en.wikipedia.org/wiki/Hukumchand_Patidar#:~:text=Hukumchand%20Patidar%20(born%20c.,village%20in%20Jhalawar%20district%2C%20Rajasthan."
  },
  {
    title: "Transforming rural livelihoods via SHGs",
    farmer: "Rajkumari Devi (Kisan Chachi)",
    location: "Bihar, India",
    description: "Mobilized over 300 women into Self-Help Groups for kitchen farming and value-added products. Recipient of the Padma Shri award.",
    image: "https://images.bhaskarassets.com/web2images/521/2024/02/04/whatsapp-image-2024-02-04-at-42900-pm_1707057967.jpg",
    fullStoryUrl: "https://en.wikipedia.org/wiki/Kisan_Chachi"
  },
  {
    title: "High-tech yields for rural communities",
    farmer: "Ram Saran Verma",
    location: "Uttar Pradesh, India",
    description: "Known as the rural high-tech farmer, introducing advanced techniques to improve yields in banana, tomato, and potato crops.",
    image: "https://sugermint.com/wp-content/uploads/2022/06/Ram-Saran-Varma.jpg",
    fullStoryUrl: "https://en.wikipedia.org/wiki/Ram_Saran_Verma"
  },
  {
    title: "Zero Budget Natural Farming (ZBNF)",
    farmer: "Subhash Palekar",
    location: "Maharashtra, India",
    description: "Developed SPNF, an innovative method eliminating chemical fertilizers by relying entirely on indigenous resources.",
    image: "https://cms.thewire.in/wp-content/uploads/2017/07/subhash-palekar.jpg",
    fullStoryUrl: "https://en.wikipedia.org/wiki/Subhash_Palekar"
  },
];

export default function CropLibrary() {
 return (
  <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 font-sans antialiased transition-colors duration-300">
    <Header />

    {/* Top Professional Header Banner */}
    <div className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800/80 pt-5 md:pt-10 pb-12 px-4 sm:px-20">
      <div className="max-w-screen mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2.5">
          <BookMarked className="text-emerald-600 dark:text-emerald-400" size={24} />
          Climate Resilience Knowledge Core
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 max-w-2xl leading-relaxed">
          A comprehensive repository of agricultural methodologies, real-world success paradigms, and curated literature designed to optimize and secure modern farming operations.
        </p>
      </div>
    </div>

    <div className="max-w-screen mx-auto px-4 sm:px-20 py-10 space-y-12">
      
      {/* Core Management Tools */}
      <section>
        <div className="mb-6">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase text-[10px]">Primary Modules</span>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">Core Management Tools</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <NavLink to={"/croplibrary/croplist"} className="block group">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-md transition-all h-full flex flex-col relative overflow-hidden">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-2">Crops Growing Steps</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-grow leading-relaxed">
                Complete, step-by-step guidance for cultivating and managing specific crop lifecycles.
              </p>
              <div className="mt-auto inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Explore Guide <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </NavLink>

          <NavLink to={"/croplibrary/cropinfo"} className="block group">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all h-full flex flex-col relative overflow-hidden">
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-2">Crop Information Center</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-grow leading-relaxed">
                Easily access detailed statistical and biological information about various crops.
              </p>
              <div className="mt-auto inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                Explore Data <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </NavLink>

          <NavLink to={"/croplibrary/diseasedata"} className="block group">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-amber-300 dark:hover:border-amber-500 hover:shadow-md transition-all h-full flex flex-col relative overflow-hidden">
              <div className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-2">Disease Data Dashboard</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-grow leading-relaxed">
                Fast diagnostic guidance and support to make informed decisions about plant health.
              </p>
              <div className="mt-auto inline-flex items-center text-sm font-semibold text-amber-600 dark:text-amber-400">
                Monitor Alerts <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </NavLink>
        </div>
      </section>

      {/* Business & Sustainability Hub */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-zinc-100 dark:border-zinc-800/60 pb-5">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Globe2 className="text-zinc-400 dark:text-zinc-500 w-5 h-5" /> Business & Sustainability Hub
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Scale operations with eco-friendly methodologies.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NavLink to={"/croplibrary/tips"} className="block group">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Resilient Tips</h3>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5 mb-2 leading-snug">Smart techniques to improve your operational resilience.</p>
                <span className="text-indigo-600 dark:text-indigo-400 text-[11px] font-bold uppercase tracking-wider flex items-center">
                  Get Tips <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </NavLink>

          <NavLink to={"/croplibrary/stratergies"} className="block group">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Sustainable Practices</h3>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5 mb-2 leading-snug">Protect the environment while driving crop productivity.</p>
                <span className="text-indigo-600 dark:text-indigo-400 text-[11px] font-bold uppercase tracking-wider flex items-center">
                  View Methods <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </NavLink>

          <NavLink to={"/croplibrary/adaptation"} className="block group">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Adaptation Strategies</h3>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5 mb-2 leading-snug">Adjust to changing climates and mitigate operational risks.</p>
                <span className="text-indigo-600 dark:text-indigo-400 text-[11px] font-bold uppercase tracking-wider flex items-center">
                  Start Planning <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </NavLink>
        </div>
      </section>

      {/* Recommended Reading */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <BookOpen className="text-zinc-400 dark:text-zinc-500 w-5 h-5" /> Recommended Reading
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Essential literature curated for modern agricultural professionals.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recommendedBooks.map((book, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all h-full">
              <div className="w-full aspect-[2/3] mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200/60 dark:border-zinc-700/60">
                <img src={book.coverPlaceholder} alt={book.title} className="object-cover w-full h-full" loading="lazy" />
              </div>
              <h3 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-1 line-clamp-2">{book.title}</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4">By {book.author}</p>
              <a
                href={book.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center w-full bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                View Source
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Farmer Success Stories */}
      <section className="pb-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Users className="text-zinc-400 dark:text-zinc-500 w-5 h-5" /> Pioneer Success Stories
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Real-world applications of sustainable and high-yield farming models.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {successfulFarmers.map((story, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
              <div className="h-36 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                <img
                  src={story.image}
                  alt={story.farmer}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-4 pr-4">
                   <p className="font-bold text-sm text-white truncate">{story.farmer}</p>
                   <p className="text-[11px] text-zinc-200 flex items-center gap-1 mt-0.5">
                     {story.location}
                   </p>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-50 mb-2 leading-snug">
                  {story.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5 line-clamp-3 leading-relaxed">
                  {story.description}
                </p>
                <a
                  href={story.fullStoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors group"
                >
                  Read Full Story <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  </div>
);
}