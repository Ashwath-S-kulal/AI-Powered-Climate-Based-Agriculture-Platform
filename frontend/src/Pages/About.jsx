import { Play, CheckCircle2 } from "lucide-react";

const highlights = [
  "Climate-smart monitoring for soil and weather to optimize yield naturally.",
  "Organic fertilizer use ensuring sustainability and long-term soil health.",
  "Empowering local farmers with AI-driven precision agriculture insights.",
];

export default function AboutSection() {
  return (
    <section className="bg-gray-50 border-t border-gray-200 py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
            <img
              src="https://media.istockphoto.com/id/1469639791/photo/farmer-using-digital-tablet-in-corn-crop-cultivated-field-with-smart-farming-interface-icons.jpg?s=612x612&w=0&k=20&c=CEnLHATfACNoH_N3Ru5KoTOmAc5SbufJozvV_kcuwc4="
              alt="Farmer with crops"
              className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <Play className="text-emerald-600 w-5 h-5 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">About Our Approach</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4 leading-tight">
              How We Care & Grow Climate-Resilient Agriculture
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              We combine traditional agricultural wisdom with modern climate-smart technologies
              to ensure healthy, thriving crops — while keeping farming sustainable and accessible for everyone.
            </p>
            <ul className="space-y-3">
              {highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
