import React, { useState } from 'react';
import { X, Cpu, Check, Copy, Activity, RefreshCw, Terminal, ExternalLink, Globe } from 'lucide-react';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  n8nUrl: string;
  onUpdateUrl: (newUrl: string) => void;
  onResetUrl: () => void;
  defaultUrl: string;
}

export const WorkflowModal: React.FC<WorkflowModalProps> = ({
  isOpen,
  onClose,
  n8nUrl,
  onUpdateUrl,
  onResetUrl,
  defaultUrl
}) => {
  const [currentUrl, setCurrentUrl] = useState(n8nUrl);
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; status?: number; latencyMs?: number; message?: string } | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'fields' | 'curl'>('status');

  if (!isOpen) return null;

  const handleTestPing = async () => {
    setTestingPing(true);
    setPingResult(null);
    try {
      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: currentUrl })
      });
      const data = await res.json();
      setPingResult({
        success: data.success,
        status: data.status,
        latencyMs: data.latencyMs,
        message: data.message || (data.success ? 'n8n Webhook Active' : data.error)
      });
    } catch (err: any) {
      setPingResult({
        success: false,
        message: err.message || 'Connection test failed'
      });
    } finally {
      setTestingPing(false);
    }
  };

  const sampleCurl = `curl -X POST "${currentUrl}" \\
  -F "field-0=Elena Rostova" \\
  -F "field-1=elena@example.com" \\
  -F "field-2=San Francisco" \\
  -F "field-3=Kyoto & Tokyo" \\
  -F "field-4=SFO" \\
  -F "field-5=HND" \\
  -F "field-6=2026-10-15" \\
  -F "field-7=2026-10-25" \\
  -F "field-8=2" \\
  -F "field-9=$4,500" \\
  -F "field-10=Standard" \\
  -F "field-11=Temples, omakase, bullet trains"`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(sampleCurl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const formFields = [
    { key: 'field-0', name: 'Name', type: 'text', req: true, example: 'Elena Rostova' },
    { key: 'field-1', name: 'Email', type: 'email', req: true, example: 'elena@example.com' },
    { key: 'field-2', name: 'Form (Origin)', type: 'text', req: true, example: 'Visakhapatnam' },
    { key: 'field-3', name: 'Destination', type: 'text', req: true, example: 'Goa' },
    { key: 'field-4', name: 'Origin Airport Code', type: 'text', req: false, example: 'VTZ' },
    { key: 'field-5', name: 'Destination Airport Code', type: 'text', req: false, example: 'GOI' },
    { key: 'field-6', name: 'Departure Date', type: 'date', req: true, example: 'YYYY-MM-DD' },
    { key: 'field-7', name: 'Return Date', type: 'date', req: true, example: 'YYYY-MM-DD' },
    { key: 'field-8', name: 'Number of Travellers', type: 'number', req: true, example: '2' },
    { key: 'field-9', name: 'Budget', type: 'text', req: true, example: '$2,500' },
    { key: 'field-10', name: 'Travel Style', type: 'select', req: true, example: 'Adventure, Luxury, etc.' },
    { key: 'field-11', name: 'Interests', type: 'text', req: true, example: 'Beaches, hiking, food' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">n8n Workflow Hub & Settings</h3>
              <p className="text-xs text-slate-400">Target Node: AI Travel Agent (a6331600...)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'status'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Webhook URL & Ping
          </button>
          <button
            onClick={() => setActiveTab('fields')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'fields'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Field Mapping (12 Fields)
          </button>
          <button
            onClick={() => setActiveTab('curl')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'curl'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            cURL Terminal Test
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  n8n Webhook Endpoint URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-orange-500 font-mono text-slate-200 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateUrl(currentUrl)}
                    className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Save URL
                  </button>
                </div>
                {currentUrl !== defaultUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentUrl(defaultUrl);
                      onResetUrl();
                    }}
                    className="text-[11px] text-orange-400 hover:underline mt-1.5 block cursor-pointer"
                  >
                    Reset to Default n8n Cloud URL
                  </button>
                )}
              </div>

              {/* Ping action */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-slate-200">Test Live Connection</span>
                  </div>
                  <button
                    onClick={handleTestPing}
                    disabled={testingPing}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingPing ? 'animate-spin' : ''}`} />
                    <span>{testingPing ? 'Pinging...' : 'Ping Node'}</span>
                  </button>
                </div>

                {pingResult && (
                  <div className={`p-3 rounded-xl border text-xs font-mono ${
                    pingResult.success 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Status: {pingResult.status || (pingResult.success ? '200 OK' : 'Failed')}</span>
                      {pingResult.latencyMs !== undefined && <span>{pingResult.latencyMs}ms</span>}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-300 font-sans">
                      {pingResult.message}
                    </div>
                  </div>
                )}
              </div>

              {/* Raw link */}
              <div className="flex items-center justify-between text-slate-400 pt-2">
                <span>View hosted form in browser directly:</span>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:underline flex items-center gap-1"
                >
                  <span>Open n8n UI</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'fields' && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs">
                All 12 input keys parsed and accepted by this specific n8n Form trigger node:
              </p>
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-mono">
                    <tr>
                      <th className="p-2.5">Field Key</th>
                      <th className="p-2.5">Label</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Required</th>
                      <th className="p-2.5">Sample</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-[11px] text-slate-300 font-mono">
                    {formFields.map((f) => (
                      <tr key={f.key} className="hover:bg-slate-800/40">
                        <td className="p-2.5 text-orange-400 font-semibold">{f.key}</td>
                        <td className="p-2.5 font-sans text-slate-200">{f.name}</td>
                        <td className="p-2.5 text-slate-400">{f.type}</td>
                        <td className="p-2.5">
                          {f.req ? (
                            <span className="text-emerald-400 font-semibold font-sans text-[10px]">YES</span>
                          ) : (
                            <span className="text-slate-500 font-sans text-[10px]">No</span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-400">{f.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'curl' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Terminal cURL Command</span>
                <button
                  onClick={handleCopyCurl}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCurl ? 'Copied!' : 'Copy cURL'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-orange-300/90 overflow-x-auto whitespace-pre leading-relaxed">
                {sampleCurl}
              </pre>

              <p className="text-[11px] text-slate-500">
                You can run this exact command in your local bash or zsh terminal to directly send a mock request to the n8n webhook.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
