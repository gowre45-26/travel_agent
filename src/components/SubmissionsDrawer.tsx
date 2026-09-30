import React from 'react';
import { X, History, Trash2, ArrowRight, ExternalLink, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { TravelSubmissionRecord } from '../types/travel';

interface SubmissionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: TravelSubmissionRecord[];
  onClearHistory: () => void;
  onReloadIntoPlanner: (data: TravelSubmissionRecord['data']) => void;
}

export const SubmissionsDrawer: React.FC<SubmissionsDrawerProps> = ({
  isOpen,
  onClose,
  submissions,
  onClearHistory,
  onReloadIntoPlanner
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Submitted Itineraries</h3>
              <p className="text-xs text-slate-400">{submissions.length} dispatched requests recorded</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {submissions.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <History className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-300">No submissions yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                When you dispatch an itinerary request, a record will be saved here for your reference.
              </p>
            </div>
          ) : (
            submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-orange-400">{sub.bookingRef}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(sub.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="truncate">{sub.data.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="truncate text-orange-300">{sub.data.destination}</span>
                  </div>
                  {(sub.data.originAirport || sub.data.destAirport) && (
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {sub.data.originAirport || '---'} ➔ {sub.data.destAirport || '---'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-900/60 p-2 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Traveler</span>
                    <span className="text-slate-200 font-medium truncate block">{sub.data.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Budget</span>
                    <span className="text-emerald-400 font-medium truncate block">{sub.data.budget}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>n8n Status {sub.n8nStatus} ({sub.latencyMs}ms)</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onReloadIntoPlanner(sub.data);
                      onClose();
                    }}
                    className="text-xs text-orange-400 hover:text-orange-300 font-medium hover:underline cursor-pointer"
                  >
                    Load into Form
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {submissions.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-between items-center">
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
