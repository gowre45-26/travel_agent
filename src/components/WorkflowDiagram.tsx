import React from 'react';
import { Network, Database, Cpu, Send, CheckCircle2, ArrowRight, Zap, Code, Shield } from 'lucide-react';

interface WorkflowDiagramProps {
  n8nUrl: string;
}

export const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({ n8nUrl }) => {
  const steps = [
    {
      id: 1,
      title: 'n8n Form Trigger',
      subtitle: 'Webhook Ingestion Node',
      desc: 'Listens for POST multipart/form-data with 12 structured fields (name, dates, budget, etc.).',
      badge: 'HTTP 200 Ingestion',
      icon: <Network className="w-5 h-5 text-orange-400" />,
      color: 'from-orange-500/20 to-amber-500/10'
    },
    {
      id: 2,
      title: 'Geo & IATA Parser',
      subtitle: 'Airport Code Resolver',
      desc: 'Validates origin & destination city pairs, maps airport codes (e.g. VTZ ➔ GOI) and travel duration.',
      badge: 'Data Normalization',
      icon: <Database className="w-5 h-5 text-blue-400" />,
      color: 'from-blue-500/20 to-indigo-500/10'
    },
    {
      id: 3,
      title: 'AI Travel Agent Core',
      subtitle: 'LLM Itinerary Engine',
      desc: 'Synthesizes tailor-made schedule, daily morning/afternoon/night plans aligned with budget & style.',
      badge: 'Gemini / Claude Agent',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-500/20 to-pink-500/10'
    },
    {
      id: 4,
      title: 'Live Rates & Flights',
      subtitle: 'Aggregator Search Tool',
      desc: 'Scrapes and matches approximate flight corridors and boutique hotel tiers within target budget.',
      badge: 'Live Tool Calling',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/20 to-yellow-500/10'
    },
    {
      id: 5,
      title: 'Dispatcher & Mailer',
      subtitle: 'Client Response Node',
      desc: 'Constructs structured booking summary and delivers bespoke travel package to recipient email.',
      badge: 'Email & Webhook Sync',
      icon: <Send className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/10'
    }
  ];

  return (
    <section id="workflow" className="py-16 md:py-24 border-t border-slate-900 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Behind The Scenes Automation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How The n8n AI Travel Agent Operates
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Your form inputs travel through a secure, high-throughput autonomous automation pipeline configured on n8n Cloud.
          </p>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                {/* Step badge & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} border border-white/10 flex items-center justify-center`}>
                    {step.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    0{step.id}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider mb-1">
                  {step.subtitle}
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{step.badge}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Technical Webhook Ingestion Summary Banner */}
        <div className="mt-12 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold text-white">Target Webhook Endpoint</span>
            </div>
            <p className="text-xs text-slate-400 font-mono break-all">
              {n8nUrl}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Full-Stack Proxy Verified</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono">
              POST multipart/form-data
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
