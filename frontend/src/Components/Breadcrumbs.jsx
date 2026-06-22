import { Link, useLocation } from "react-router-dom";
import {
  Home, ChevronRight, User, CloudSun, Leaf,
  MessageSquare, Activity, Settings, ShieldCheck,
  ClipboardList, HelpCircle, ThermometerSnowflake
} from "lucide-react";

const iconMap = {
  "home": <Home size={14} />,
  "profile": <User size={14} />,
  "weather": <CloudSun size={14} />,
  "disease": <Activity size={14} />,
  "chatbot": <MessageSquare size={14} />,
  "croplist": <ClipboardList size={14} />,
  "croprecomnder": <Leaf size={14} />,
  "cropriskcalculater": <ShieldCheck size={14} />,
  "adminpanel": <Settings size={14} />,
  "tips": <HelpCircle size={14} />,
  "adaptation": <ThermometerSnowflake size={14} />,
};

const routeNameMap = {
  "home": "Home", "profile": "Profile", "weather": "Weather Center",
  "disease": "Disease Prediction", "chatbot": "Chatbot", "croplist": "Crops steps",
  "croprecomnder": "Crop Recommender", "cropriskcalculater": "Risk Analyzer",
  "tips": "Resilient Tips", "adaptation": "Adaptation Strategies", "adminpanel": "Admin panel"
};

export default function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  if (paths.includes("chatbot")) return null;
  if (paths.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="fixed bottom-0 left-0 z-[50] w-full overflow-x-auto no-scrollbar transition-all duration-300"
    >
      <ol className="flex items-center whitespace-nowrap py-1 px-3 bg-white/80 backdrop-blur-md border border-gray-200  shadow-sm border-l-0">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-green-600 p-1"
            title="Dashboard"
          >
            <Home size={16} />
          </Link>
        </li>

        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          const link = "/" + paths.slice(0, index + 1).join("/");
          const label = routeNameMap[path] || path;
          const Icon = iconMap[path];

          return (
            <li key={index} className="flex items-center">
              <ChevronRight size={14} className="text-gray-400 mx-0.5" />

              {!isLast ? (
                <Link
                  to={link}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-green-600 transition-colors px-1"
                >
                  {/* Icon hidden on very small screens to save space */}
                  <span className="hidden xs:inline-flex">{Icon}</span>
                  <span className="capitalize">{label}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100/50 text-green-700 rounded-md border border-green-200">
                  <span className="xs:inline-flex">{Icon}</span>
                  <span className="text-xs font-semibold capitalize truncate max-w-[100px] sm:max-w-none">
                    {label}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}