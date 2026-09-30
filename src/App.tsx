import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PlannerForm } from './components/PlannerForm';
import { SuccessCard } from './components/SuccessCard';
import { DestinationGrid } from './components/DestinationGrid';
import { WorkflowDiagram } from './components/WorkflowDiagram';
import { WorkflowModal } from './components/WorkflowModal';
import { SubmissionsDrawer } from './components/SubmissionsDrawer';
import { Footer } from './components/Footer';
import { TravelFormData, TravelSubmissionRecord, DestinationPreset } from './types/travel';

const DEFAULT_N8N_URL = 'https://jyothsnagowre.app.n8n.cloud/form/a6331600-5e70-4850-894d-baad0f91cc15';

export default function App() {
  const [n8nUrl, setN8nUrl] = useState<string>(() => {
    return localStorage.getItem('voyage_n8n_url') || DEFAULT_N8N_URL;
  });

  const [n8nStatus, setN8nStatus] = useState<'online' | 'checking' | 'error'>('checking');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  
  const [submissions, setSubmissions] = useState<TravelSubmissionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('voyage_submissions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [formData, setFormData] = useState<TravelFormData>({
    name: '',
    email: '',
    from: '',
    destination: '',
    originAirport: '',
    destAirport: '',
    departureDate: '',
    returnDate: '',
    travellers: 2,
    budget: '$3,500',
    travelStyle: 'Standard',
    interests: 'Cultural landmarks, culinary experiences, scenic photography'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<TravelSubmissionRecord | null>(null);

  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Check n8n connectivity on load
  useEffect(() => {
    checkConnection(n8nUrl);
  }, [n8nUrl]);

  const checkConnection = async (urlToCheck: string) => {
    setN8nStatus('checking');
    try {
      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToCheck })
      });
      const data = await res.json();
      if (data.success) {
        setN8nStatus('online');
        setLatencyMs(data.latencyMs || 120);
      } else {
        setN8nStatus('error');
      }
    } catch {
      // In case server is starting or network hiccup
      setN8nStatus('error');
    }
  };

  const handleUpdateUrl = (newUrl: string) => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    setN8nUrl(trimmed);
    localStorage.setItem('voyage_n8n_url', trimmed);
    checkConnection(trimmed);
  };

  const handleResetUrl = () => {
    setN8nUrl(DEFAULT_N8N_URL);
    localStorage.removeItem('voyage_n8n_url');
    checkConnection(DEFAULT_N8N_URL);
  };

  const handleClearHistory = () => {
    setSubmissions([]);
    localStorage.removeItem('voyage_submissions');
  };

  const handleReloadIntoPlanner = (data: TravelFormData) => {
    setFormData(data);
    setSubmittedRecord(null);
    scrollToPlanner();
  };

  const handleSelectPreset = (preset: DestinationPreset) => {
    const today = new Date();
    const depart = new Date(today.getTime() + 86400000 * 20);
    const ret = new Date(depart.getTime() + 86400000 * preset.daysDuration);

    setFormData({
      name: formData.name || 'Wanderer Explorer',
      email: formData.email || '',
      from: preset.from,
      destination: preset.destination,
      originAirport: preset.originAirport,
      destAirport: preset.destAirport,
      departureDate: depart.toISOString().split('T')[0],
      returnDate: ret.toISOString().split('T')[0],
      travellers: formData.travellers || 2,
      budget: preset.budget,
      travelStyle: preset.travelStyle,
      interests: preset.interests
    });

    setSubmittedRecord(null);
    scrollToPlanner();
  };

  const scrollToPlanner = () => {
    const el = document.getElementById('planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDestinations = () => {
    const el = document.getElementById('destinations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Submit to n8n workflow
  const handleSubmit = async (data: TravelFormData) => {
    setIsSubmitting(true);
    setSubmissionStep('Normalizing airport codes & metadata...');

    try {
      await new Promise(r => setTimeout(r, 450));
      setSubmissionStep('Dispatching payload to n8n Cloud Webhook...');

      const response = await fetch('/api/submit-n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: n8nUrl,
          payload: data
        })
      });

      setSubmissionStep('Awaiting n8n Agent execution response...');
      const result = await response.json();

      if (response.ok && result.success) {
        const record: TravelSubmissionRecord = {
          id: 'sub-' + Date.now(),
          bookingRef: result.bookingRef || ('TRIP-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
          timestamp: result.submittedAt || new Date().toISOString(),
          data,
          n8nStatus: result.status || 200,
          n8nUrl,
          latencyMs: result.latencyMs || 280
        };

        const updated = [record, ...submissions];
        setSubmissions(updated);
        try {
          localStorage.setItem('voyage_submissions', JSON.stringify(updated.slice(0, 30)));
        } catch {
          // ignore storage issues
        }

        setSubmittedRecord(record);
        scrollToPlanner();
      } else {
        alert(`n8n Submission Notice: ${result.error || 'The workflow returned an unexpected response. Please try again or check settings.'}`);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      alert(`Network error connecting to n8n proxy: ${err.message || 'Please verify internet connection and retry.'}`);
    } finally {
      setIsSubmitting(false);
      setSubmissionStep('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Sticky Navbar */}
      <Navbar
        n8nStatus={n8nStatus}
        latencyMs={latencyMs}
        onOpenWorkflowModal={() => setIsWorkflowModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        submissionsCount={submissions.length}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onScrollToPlanner={scrollToPlanner}
          onScrollToDestinations={scrollToDestinations}
          n8nUrl={n8nUrl}
        />

        {/* Form or Success State */}
        {submittedRecord ? (
          <SuccessCard
            bookingRef={submittedRecord.bookingRef}
            data={submittedRecord.data}
            latencyMs={submittedRecord.latencyMs}
            submittedAt={submittedRecord.timestamp}
            n8nUrl={n8nUrl}
            onReset={() => {
              setSubmittedRecord(null);
            }}
          />
        ) : (
          <PlannerForm
            initialData={formData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submissionStep={submissionStep}
            n8nUrl={n8nUrl}
          />
        )}

        {/* Curated Itinerary Presets */}
        <DestinationGrid onSelectPreset={handleSelectPreset} />

        {/* Visual Architecture of the n8n Agent */}
        <WorkflowDiagram n8nUrl={n8nUrl} />
      </main>

      {/* Footer */}
      <Footer n8nUrl={n8nUrl} />

      {/* Workflow Inspection / Settings Modal */}
      <WorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        n8nUrl={n8nUrl}
        onUpdateUrl={handleUpdateUrl}
        onResetUrl={handleResetUrl}
        defaultUrl={DEFAULT_N8N_URL}
      />

      {/* Submissions History Drawer */}
      <SubmissionsDrawer
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        submissions={submissions}
        onClearHistory={handleClearHistory}
        onReloadIntoPlanner={handleReloadIntoPlanner}
      />

    </div>
  );
}
