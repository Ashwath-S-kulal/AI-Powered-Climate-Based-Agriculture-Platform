
import OAuth from "../Components/OAuth";
import Header from "../Components/Header";
import FacebookOAuth from "../Components/FacebookOAuth"

export default function LoginPage() {
return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      <Header />

      <main className="max-w-5xl mx-auto px-6 pt-10 md:pt-20 pb-16 md:pt-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-widest text-xs uppercase">
              SmartAgri Portal
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9]">
              Smart <br />
              <span className="text-slate-300 dark:text-zinc-700">Agriculture.</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-zinc-400 max-w-sm">
              Connect to your field diagnostics, weather data, and AI insights. Secure access for modern farm management.
            </p>
          </div>

        
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Access your account</h2>
              <p className="text-slate-500 dark:text-zinc-400 text-sm">
                Sign in to sync your local data to the cloud.
              </p>
            </div>
            <div className="space-y-3">
              <OAuth />


              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200 dark:border-zinc-800"></div>
                <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-600 font-bold bg-white dark:bg-zinc-950 px-2">
                  Or
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-zinc-800"></div>
              </div>

              <FacebookOAuth />
            </div>

            <div className="mt-12">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-600 font-semibold mb-4">
                Enterprise Security
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                End-to-end encrypted sessions. We prioritize the privacy of your agricultural data above all else.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}   