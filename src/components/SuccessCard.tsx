import React from 'react';
import { 
  CheckCircle2, Calendar, MapPin, DollarSign, Users, Sparkles, 
  ArrowRight, Download, Share2, PlusCircle, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { TravelFormData } from '../types/travel';

interface SuccessCardProps {
  bookingRef: string;
  data: TravelFormData;
  latencyMs: number;
  submittedAt: string;
  onReset: () => void;
  n8nUrl: string;
}

export const SuccessCard: React.FC<SuccessCardProps> = ({
  bookingRef,
  data,
  latencyMs,
  submittedAt,
  onReset,
  n8nUrl
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopySummary = () => {
    const text = `VoyageAI Booking Confirmation [${bookingRef}]\n` +
      `Traveler: ${data.name} (${data.email})\n` +
      `Route: ${data.from} (${data.originAirport || 'N/A'}) to ${data.destination} (${data.destAirport || 'N/A'})\n` +
      `Dates: ${data.departureDate} to ${data.returnDate}\n` +
      `Party: ${data.travellers} | Budget: ${data.budget} | Style: ${data.travelStyle}\n` +
      `Interests: ${data.interests}\n` +
      `Processed via n8n AI Travel Agent in ${latencyMs}ms`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 sm:p-10 shadow-2xl shadow-emerald-950/20 backdrop-blur-md relative overflow-hidden">
        
        {/* Glow behind */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-8 h-8 animate-bounce-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  n8n Workflow Ingested
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {latencyMs}ms response
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Your Journey Request is Live!
              </h2>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
            <div className="text-xs text-slate-400">Reference Number</div>
            <div className="font-mono text-xl font-extrabold text-orange-400 tracking-wider">
              {bookingRef}
            </div>
          </div>
        </div>

        {/* Notice Box */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <strong className="text-white font-semibold">Autonomous Processing Underway:</strong> The n8n <em>AI Travel Agent</em> workflow is currently parsing your origin (<code className="text-orange-300">{data.originAirport || data.from}</code>), destination (<code className="text-orange-300">{data.destAirport || data.destination}</code>), and preferences. A full itinerary with daily schedules, transit options, and restaurant recommendations is being dispatched to <strong className="text-white">{data.email}</strong>.
          </div>
        </div>

        {/* Trip Parameters Breakdown */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>Journey Route</span>
            </div>
            <div className="font-semibold text-white text-sm">
              {data.from} ➔ {data.destination}
            </div>
            {(data.originAirport || data.destAirport) && (
              <div className="text-xs font-mono text-slate-400 mt-0.5">
                Airport Codes: {data.originAirport || 'N/A'} - {data.destAirport || 'N/A'}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Dates & Schedule</span>
            </div>
            <div className="font-semibold text-white text-sm">
              {data.departureDate} to {data.returnDate}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Round-trip travel window
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Party & Style</span>
            </div>
            <div className="font-semibold text-white text-sm">
              {data.travellers} {data.travellers === 1 ? 'Guest' : 'Guests'} • {data.travelStyle}
            </div>
            <div className="text-xs text-emerald-400 mt-0.5 font-medium">
              Budget: {data.budget}
            </div>
          </div>

        </div>

        {/* Interests strip */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-xs text-slate-400 mb-1">Special Interests & Notes</div>
          <div className="text-xs text-slate-200 font-medium">
            {data.interests}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleCopySummary}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Summary Copied!' : 'Copy Summary'}</span>
            </button>

            <a
              href={n8nUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Raw n8n Form</span>
            </a>
          </div>

          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Plan Another Itinerary</span>
          </button>
        </div>

      </div>
    </div>
  );
};
