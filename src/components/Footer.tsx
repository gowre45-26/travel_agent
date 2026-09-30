import React from 'react';
import { Compass, ExternalLink, Zap, Heart } from 'lucide-react';

interface FooterProps {
  n8nUrl: string;
}

export const Footer: React.FC<FooterProps> = ({ n8nUrl }) => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white">VoyageAI</span>
              <span className="text-[11px] text-slate-500 ml-2">Autonomous n8n Travel Concierge</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="#planner" className="hover:text-orange-400 transition-colors">
              Trip Planner
            </a>
            <a href="#destinations" className="hover:text-orange-400 transition-colors">
              Curated Itineraries
            </a>
            <a href="#workflow" className="hover:text-orange-400 transition-colors">
              Architecture
            </a>
            <a
              href={n8nUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <span>Raw n8n Form</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <span>Powered by n8n Cloud Workflow Node</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="font-mono text-slate-400 truncate max-w-xs">{n8nUrl}</span>
          </div>

          <div>
            Built with modern React, Tailwind & full-stack n8n ingestion.
          </div>
        </div>

      </div>
    </footer>
  );
};
