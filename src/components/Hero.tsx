import React from 'react';
import { Sparkles, ArrowRight, Zap, CheckCircle2, ShieldCheck, MapPin, PlaneTakeoff, Globe2 } from 'lucide-react';

interface HeroProps {
  onScrollToPlanner: () => void;
  onScrollToDestinations: () => void;
  n8nUrl: string;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToPlanner,
  onScrollToDestinations,
  n8nUrl
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-orange-600/15 via-rose-600/10 to-amber-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tag */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-orange-500/30 text-orange-300 text-xs font-medium shadow-inner shadow-orange-500/10">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>n8n Cloud Automation Live Integration</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="text-slate-400 font-mono text-[11px]">Workflow a6331600</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Autonomous Travel Planning,{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
              Orchestrated by AI & n8n
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Experience bespoke journey curation. Input your dream destinations, dates, and budget to trigger your dedicated <strong className="text-white font-semibold">n8n AI Travel Agent</strong> workflow node in real time.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onScrollToPlanner}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-sm shadow-xl shadow-orange-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <PlaneTakeoff className="w-4 h-4" />
              <span>Launch Trip Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onScrollToDestinations}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Globe2 className="w-4 h-4 text-orange-400" />
              <span>Explore Curated Journeys</span>
            </button>
          </div>

          {/* Connected Webhook Pill Bar */}
          <div className="mt-10 p-3 max-w-2xl mx-auto rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2 truncate max-w-full">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium text-slate-300 shrink-0">Connected n8n URL:</span>
              <span className="font-mono text-slate-400 truncate text-[11px] bg-slate-950 px-2 py-1 rounded border border-slate-800">
                {n8nUrl}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Live & Ready</span>
            </div>
          </div>

          {/* Value Props Strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-2">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Instant Trigger</h4>
              <p className="text-xs text-slate-400 mt-1">Dispatches in &lt;150ms straight into the n8n cloud webhook.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">IATA Auto-Resolver</h4>
              <p className="text-xs text-slate-400 mt-1">Smart suggestions for departure & arrival airport codes.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">6 Travel Styles</h4>
              <p className="text-xs text-slate-400 mt-1">Tailored for Budget, Luxury, Family, or High-Adrenaline trips.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Zero CORS Friction</h4>
              <p className="text-xs text-slate-400 mt-1">Safe full-stack proxy routing with multipart form fidelity.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
