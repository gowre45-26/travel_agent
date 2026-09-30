import React from 'react';
import { Compass, Cpu, History, ExternalLink, Activity } from 'lucide-react';

interface NavbarProps {
  n8nStatus: 'online' | 'checking' | 'error';
  latencyMs: number | null;
  onOpenWorkflowModal: () => void;
  onOpenHistoryModal: () => void;
  submissionsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  n8nStatus,
  latencyMs,
  onOpenWorkflowModal,
  onOpenHistoryModal,
  submissionsCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-rose-500 p-0.5 shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-orange-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                VoyageAI
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30">
                n8n Powered
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Intelligent Itinerary & Travel Automation
            </p>
          </div>
        </div>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#planner" className="hover:text-orange-400 transition-colors">
            Trip Planner
          </a>
          <a href="#destinations" className="hover:text-orange-400 transition-colors">
            Inspiration
          </a>
          <a href="#workflow" className="hover:text-orange-400 transition-colors">
            Workflow Architecture
          </a>
        </nav>

        {/* Actions & Status */}
        <div className="flex items-center gap-3">
          
          {/* n8n Status Pill */}
          <button
            onClick={onOpenWorkflowModal}
            title="Click to view n8n webhook settings and diagnostics"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700"
          >
            <span className="relative flex h-2 w-2">
              {n8nStatus === 'online' && (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              )}
              {n8nStatus === 'checking' && (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 animate-pulse"></span>
              )}
              {n8nStatus === 'error' && (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              )}
            </span>
            <span className="hidden sm:inline font-mono">
              {n8nStatus === 'online' ? `n8n Active ${latencyMs ? `(${latencyMs}ms)` : ''}` : n8nStatus === 'checking' ? 'Connecting...' : 'n8n Offline'}
            </span>
            <Activity className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Workflow Config Button */}
          <button
            onClick={onOpenWorkflowModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-500/40 hover:text-orange-400 text-slate-300 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-orange-400" />
            <span>Webhook Spec</span>
          </button>

          {/* My Submissions Counter */}
          <button
            onClick={onOpenHistoryModal}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trips</span>
            {submissionsCount > 0 && (
              <span className="flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-orange-500 text-slate-950 font-bold text-[10px]">
                {submissionsCount}
              </span>
            )}
          </button>

          {/* Direct n8n form button */}
          <a
            href="https://jyothsnagowre.app.n8n.cloud/form/a6331600-5e70-4850-894d-baad0f91cc15"
            target="_blank"
            rel="noopener noreferrer"
            title="Open raw n8n form in new tab"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

        </div>
      </div>
    </header>
  );
};
