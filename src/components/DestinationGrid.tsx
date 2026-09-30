import React from 'react';
import { Plane, Calendar, DollarSign, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { DESTINATION_PRESETS } from '../data/destinations';
import { DestinationPreset, TravelFormData } from '../types/travel';

interface DestinationGridProps {
  onSelectPreset: (preset: DestinationPreset) => void;
}

export const DestinationGrid: React.FC<DestinationGridProps> = ({ onSelectPreset }) => {
  return (
    <section id="destinations" className="py-16 md:py-24 border-t border-slate-900 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Expedition Blueprints</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trending Itinerary Presets
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Tap any pre-configured journey below to auto-populate all 12 n8n parameters into your live trip planner.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATION_PRESETS.map((dest) => (
            <div
              key={dest.id}
              className="group rounded-3xl bg-slate-900/60 border border-slate-800/80 overflow-hidden hover:border-orange-500/40 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-orange-950/20"
            >
              {/* Image & Badges */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                {/* Route Pill */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-mono font-medium">
                  <span>{dest.originAirport || 'ORIGIN'}</span>
                  <Plane className="w-3 h-3 text-orange-400 rotate-45" />
                  <span>{dest.destAirport || 'DEST'}</span>
                </div>

                {/* Style badge */}
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-orange-500/90 text-slate-950 text-[11px] font-bold uppercase tracking-wider">
                  {dest.travelStyle}
                </div>

                {/* Bottom title on image */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white leading-snug drop-shadow-md">
                    {dest.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {dest.subtitle}
                </p>

                {/* Details pill row */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{dest.daysDuration} Days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-slate-200">{dest.budget}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {dest.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={() => onSelectPreset(dest)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 group-hover:bg-orange-500 text-slate-200 group-hover:text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span>Load Into Planner</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
