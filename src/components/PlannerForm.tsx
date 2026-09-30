import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, DollarSign, Send, Sparkles, AlertCircle, 
  MapPin, Plane, Check, ArrowRight, RefreshCw, Code2, Heart,
  Compass, ShieldCheck, HelpCircle
} from 'lucide-react';
import { TravelFormData } from '../types/travel';
import { POPULAR_AIRPORTS, findAirportSuggestions } from '../data/airports';
import { INTEREST_CHIPS } from '../data/destinations';

interface PlannerFormProps {
  initialData: TravelFormData;
  onSubmit: (data: TravelFormData) => Promise<void>;
  isSubmitting: boolean;
  submissionStep: string;
  n8nUrl: string;
}

const TRAVEL_STYLES: { id: TravelFormData['travelStyle']; label: string; desc: string; icon: string }[] = [
  { id: 'Budget', label: 'Budget', desc: 'Smart spending, boutique hostels & public transit', icon: '🎒' },
  { id: 'Standard', label: 'Standard', desc: 'Comfortable 3-4★ stays & curated local guides', icon: '✈️' },
  { id: 'Luxury', label: 'Luxury', desc: '5★ resorts, private chauffeur & VIP access', icon: '🥂' },
  { id: 'Adventure', label: 'Adventure', desc: 'Trekking, wildlife trails & adrenaline experiences', icon: '🧗' },
  { id: 'Family', label: 'Family', desc: 'Spacious stays, kid-friendly paces & fun activities', icon: '👨‍👩‍👧‍👦' },
  { id: 'Relaxation', label: 'Relaxation', desc: 'Secluded beaches, thermal spas & restorative tranquility', icon: '🌴' },
];

export const PlannerForm: React.FC<PlannerFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  submissionStep,
  n8nUrl
}) => {
  const [formData, setFormData] = useState<TravelFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof TravelFormData, string>>>({});
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  
  // Airport suggestion popovers
  const [originSuggestions, setOriginSuggestions] = useState<typeof POPULAR_AIRPORTS>([]);
  const [destSuggestions, setDestSuggestions] = useState<typeof POPULAR_AIRPORTS>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Calculate duration
  const tripDuration = React.useMemo(() => {
    if (!formData.departureDate || !formData.returnDate) return null;
    const start = new Date(formData.departureDate);
    const end = new Date(formData.returnDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  }, [formData.departureDate, formData.returnDate]);

  const handleInputChange = (field: keyof TravelFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    if (field === 'originAirport') {
      const suggestions = findAirportSuggestions(value);
      setOriginSuggestions(suggestions);
      setShowOriginDropdown(suggestions.length > 0);
    }
    if (field === 'destAirport') {
      const suggestions = findAirportSuggestions(value);
      setDestSuggestions(suggestions);
      setShowDestDropdown(suggestions.length > 0);
    }
  };

  const handleSelectOriginAirport = (code: string, city: string) => {
    setFormData(prev => ({ 
      ...prev, 
      originAirport: code,
      from: prev.from ? prev.from : city
    }));
    setShowOriginDropdown(false);
  };

  const handleSelectDestAirport = (code: string, city: string) => {
    setFormData(prev => ({ 
      ...prev, 
      destAirport: code,
      destination: prev.destination ? prev.destination : city
    }));
    setShowDestDropdown(false);
  };

  const toggleInterestTag = (tag: string) => {
    const currentList = formData.interests
      ? formData.interests.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    
    let updated: string[];
    if (currentList.includes(tag)) {
      updated = currentList.filter(t => t !== tag);
    } else {
      updated = [...currentList, tag];
    }
    handleInputChange('interests', updated.join(', '));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TravelFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required by n8n workflow';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }
    if (!formData.from.trim()) newErrors.from = 'Departure location is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';
    if (!formData.returnDate) newErrors.returnDate = 'Return date is required';
    if (formData.departureDate && formData.returnDate) {
      if (new Date(formData.returnDate) < new Date(formData.departureDate)) {
        newErrors.returnDate = 'Return date must be on or after departure date';
      }
    }
    if (!formData.travellers || formData.travellers < 1) {
      newErrors.travellers = 'At least 1 traveller required';
    }
    if (!formData.budget.trim()) newErrors.budget = 'Budget estimate is required';
    if (!formData.travelStyle) newErrors.travelStyle = 'Please select a travel style';
    if (!formData.interests.trim()) newErrors.interests = 'Please specify your interests';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // scroll to first error
      window.scrollTo({ top: document.getElementById('planner')?.offsetTop || 0, behavior: 'smooth' });
      return;
    }
    onSubmit(formData);
  };

  const handleFillSample = () => {
    setFormData({
      name: 'Maya Lin',
      email: 'maya.traveler@example.com',
      from: 'Visakhapatnam',
      destination: 'Goa, India',
      originAirport: 'VTZ',
      destAirport: 'GOI',
      departureDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      returnDate: new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0],
      travellers: 2,
      budget: '$1,800',
      travelStyle: 'Adventure',
      interests: 'Beaches, coastal heritage shacks, water sports, sunset cruises, local seafood'
    });
    setErrors({});
  };

  // Build simulated n8n multipart representation for the developer drawer
  const n8nFieldMapping = [
    { n8nKey: 'field-0', label: 'Name', value: formData.name },
    { n8nKey: 'field-1', label: 'Email', value: formData.email },
    { n8nKey: 'field-2', label: 'Form (Origin)', value: formData.from },
    { n8nKey: 'field-3', label: 'Destination', value: formData.destination },
    { n8nKey: 'field-4', label: 'Origin Airport Code', value: formData.originAirport || '(None)' },
    { n8nKey: 'field-5', label: 'Destination Airport Code', value: formData.destAirport || '(None)' },
    { n8nKey: 'field-6', label: 'Departure Date', value: formData.departureDate },
    { n8nKey: 'field-7', label: 'Return Date', value: formData.returnDate },
    { n8nKey: 'field-8', label: 'Number of Travellers', value: formData.travellers },
    { n8nKey: 'field-9', label: 'Budget', value: formData.budget },
    { n8nKey: 'field-10', label: 'Travel Style', value: formData.travelStyle },
    { n8nKey: 'field-11', label: 'Interests', value: formData.interests }
  ];

  return (
    <section id="planner" className="py-12 md:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct n8n Form Ingestion Node</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Design Your Itinerary
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Submissions are processed in real-time by your custom n8n AI workflow instance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleFillSample}
              className="text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-500/40 text-slate-300 hover:text-orange-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Autofill Sample (VTZ → GOI)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPayloadModal(!showPayloadModal)}
              className="text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-orange-400" />
              <span>{showPayloadModal ? 'Hide n8n Payload' : 'Inspect n8n Payload'}</span>
            </button>
          </div>
        </div>

        {/* Developer Payload Inspector Drawer */}
        {showPayloadModal && (
          <div className="mb-8 p-5 rounded-2xl bg-slate-900/90 border border-orange-500/30 shadow-xl shadow-orange-950/20 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold text-white">Live n8n Form Payload Mapping</span>
                <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                  POST multipart/form-data
                </span>
              </div>
              <span className="text-xs text-orange-400 font-mono">12 Node Parameters</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
              {n8nFieldMapping.map((item) => (
                <div key={item.n8nKey} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-[10px] text-orange-400 font-mono">
                    <span>{item.n8nKey}</span>
                    <span className="text-slate-500">{item.label}</span>
                  </div>
                  <div className="mt-1 font-mono text-slate-200 truncate font-medium text-[11px]" title={String(item.value)}>
                    {String(item.value) || <span className="text-slate-600 italic">empty</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Grid: Form Left, Real-Time Trip Preview Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-8 bg-slate-900/60 rounded-3xl border border-slate-800/80 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              
              {/* SECTION 1: Traveler Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-slate-800/80 pb-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-mono font-bold">1</span>
                  <span>Traveler Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name (field-0) */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Full Name <span className="text-orange-400">*</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">(field-0)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                        errors.name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-orange-500'
                      } text-slate-100 placeholder-slate-600 text-sm focus:outline-none transition-colors`}
                    />
                    {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Email (field-1) */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Email Address <span className="text-orange-400">*</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">(field-1)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="itinerary@yourdomain.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                        errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-orange-500'
                      } text-slate-100 placeholder-slate-600 text-sm focus:outline-none transition-colors`}
                    />
                    {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Routing & Destinations */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-slate-800/80 pb-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-mono font-bold">2</span>
                  <span>Origin & Destination Route</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* From / Origin City (field-2) */}
                  <div className="relative">
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Starting City (From) <span className="text-orange-400">*</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">(field-2)</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={formData.from}
                        onChange={(e) => handleInputChange('from', e.target.value)}
                        placeholder="e.g. Visakhapatnam, San Francisco, London"
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                          errors.from ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-orange-500'
                        } text-slate-100 placeholder-slate-600 text-sm focus:outline-none transition-colors`}
                      />
                    </div>
                    {errors.from && <p className="text-rose-400 text-xs mt-1">{errors.from}</p>}
                  </div>

                  {/* Destination City (field-3) */}
                  <div className="relative">
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Destination <span className="text-orange-400">*</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">(field-3)</span>
                    </label>
                    <div className="relative">
                      <Plane className="w-4 h-4 text-slate-500 absolute left-3 top-3 rotate-45" />
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => handleInputChange('destination', e.target.value)}
                        placeholder="e.g. Goa, Tokyo, Amalfi Coast, Interlaken"
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                          errors.destination ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-orange-500'
                        } text-slate-100 placeholder-slate-600 text-sm focus:outline-none transition-colors`}
                      />
                    </div>
                    {errors.destination && <p className="text-rose-400 text-xs mt-1">{errors.destination}</p>}
                  </div>
                </div>

                {/* Airport Codes (field-4 and field-5) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Origin Airport Code (field-4) */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        Origin Airport Code (IATA)
                        <span className="text-[10px] text-slate-500 font-mono ml-1.5">(field-4)</span>
                      </label>
                      <span className="text-[10px] text-slate-500">Optional</span>
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      value={formData.originAirport}
                      onFocus={() => {
                        const s = findAirportSuggestions(formData.originAirport || formData.from);
                        setOriginSuggestions(s);
                        setShowOriginDropdown(s.length > 0);
                      }}
                      onChange={(e) => handleInputChange('originAirport', e.target.value.toUpperCase())}
                      placeholder="e.g. VTZ, SFO, JFK"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-orange-500 text-slate-100 placeholder-slate-600 text-sm font-mono uppercase focus:outline-none transition-colors"
                    />

                    {/* Origin suggestions dropdown */}
                    {showOriginDropdown && originSuggestions.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 mt-1 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1 max-h-48 overflow-y-auto">
                        <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                          Suggested Airports
                        </div>
                        {originSuggestions.map((item) => (
                          <button
                            key={item.code}
                            type="button"
                            onClick={() => handleSelectOriginAirport(item.code, item.city)}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between cursor-pointer"
                          >
                            <span className="font-mono font-bold text-orange-400">{item.code}</span>
                            <span className="text-slate-300 truncate ml-2">{item.city}, {item.country}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Destination Airport Code (field-5) */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        Destination Airport Code (IATA)
                        <span className="text-[10px] text-slate-500 font-mono ml-1.5">(field-5)</span>
                      </label>
                      <span className="text-[10px] text-slate-500">Optional</span>
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      value={formData.destAirport}
                      onFocus={() => {
                        const s = findAirportSuggestions(formData.destAirport || formData.destination);
                        setDestSuggestions(s);
                        setShowDestDropdown(s.length > 0);
                      }}
                      onChange={(e) => handleInputChange('destAirport', e.target.value.toUpperCase())}
                      placeholder="e.g. GOI, HND, FCO"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-orange-500 text-slate-100 placeholder-slate-600 text-sm font-mono uppercase focus:outline-none transition-colors"
                    />

                    {/* Destination suggestions dropdown */}
                    {showDestDropdown && destSuggestions.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 mt-1 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1 max-h-48 overflow-y-auto">
                        <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                          Suggested Airports
                        </div>
                        {destSuggestions.map((item) => (
                          <button
                            key={item.code}
                            type="button"
                            onClick={() => handleSelectDestAirport(item.code, item.city)}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between cursor-pointer"
                          >
                            <span className="font-mono font-bold text-orange-400">{item.code}</span>
                            <span className="text-slate-300 truncate ml-2">{item.city}, {item.country}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Dates, Duration & Group Size */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-slate-800/80 pb-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-mono font-bold">3</span>
                  <span>Timeline & Party Size</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Departure Date (field-6) */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Departure Date <span className="text-orange-400">*</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">(field-6)</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="date"
                        value={formData.departureDate}
                        onChange={(e) => handleInputChange('departureDate', e.target.value)}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                          errors.departureDate ? 'border-rose-500' : 'border-slate-800 focus:border-orange-500'
                        } text-slate-100 text-sm focus:outline-none transition-colors`}
                      />
                    </div>
                    {errors.departureDate && <p className="text-rose-400 text-xs mt-1">{errors.departureDate}</p>}
                  </div>

                  {/* Return Date (field-7) */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Return Date <span className="text-orange-400">*</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">(field-7)</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="date"
                        value={formData.returnDate}
                        min={formData.departureDate}
                        onChange={(e) => handleInputChange('returnDate', e.target.value)}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                          errors.returnDate ? 'border-rose-500' : 'border-slate-800 focus:border-orange-500'
                        } text-slate-100 text-sm focus:outline-none transition-colors`}
                      />
                    </div>
                    {errors.returnDate && <p className="text-rose-400 text-xs mt-1">{errors.returnDate}</p>}
                  </div>

                  {/* Number of Travellers (field-8) */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Travellers <span className="text-orange-400">*</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">(field-8)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('travellers', Math.max(1, formData.travellers - 1))}
                        className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={formData.travellers}
                        onChange={(e) => handleInputChange('travellers', parseInt(e.target.value) || 1)}
                        className="w-full text-center py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-orange-500 text-slate-100 font-bold text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange('travellers', formData.travellers + 1)}
                        className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    {errors.travellers && <p className="text-rose-400 text-xs mt-1">{errors.travellers}</p>}
                  </div>
                </div>

                {tripDuration !== null && tripDuration > 0 && (
                  <div className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Calculated Trip Duration: <strong className="text-white">{tripDuration} Days</strong> ({tripDuration - 1} Nights)</span>
                  </div>
                )}
              </div>

              {/* SECTION 4: Budget & Travel Style */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-slate-800/80 pb-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-mono font-bold">4</span>
                  <span>Budget & Travel Style</span>
                </div>

                {/* Budget (field-9) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Estimated Budget <span className="text-orange-400">*</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">(field-9)</span>
                    </label>
                    <span className="text-[10px] text-slate-500">Total estimated or per person</span>
                  </div>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="e.g. $3,500 or ₹60,000"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                        errors.budget ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-orange-500'
                      } text-slate-100 placeholder-slate-600 text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                  {errors.budget && <p className="text-rose-400 text-xs mt-1">{errors.budget}</p>}

                  {/* Preset budget chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[11px] text-slate-500">Quick presets:</span>
                    {['$1,500', '$3,000', '$5,000', '$8,500', '₹50,000', '₹1,00,000'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => handleInputChange('budget', b)}
                        className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                          formData.budget === b 
                            ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' 
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Travel Style (field-10) */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Travel Style <span className="text-orange-400">*</span>
                    <span className="text-[10px] text-slate-500 font-mono ml-1.5">(field-10)</span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {TRAVEL_STYLES.map((style) => {
                      const isSelected = formData.travelStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => handleInputChange('travelStyle', style.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-500/15 border-orange-500/70 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/50'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-lg">{style.icon}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-orange-400" />}
                          </div>
                          <div className="font-semibold text-xs text-white">{style.label}</div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                            {style.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.travelStyle && <p className="text-rose-400 text-xs mt-1">{errors.travelStyle}</p>}
                </div>
              </div>

              {/* SECTION 5: Interests & Activities */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-slate-800/80 pb-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-mono font-bold">5</span>
                  <span>Interests & Experiences</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Interests, Desires & Activities <span className="text-orange-400">*</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">(field-11)</span>
                    </label>
                    <span className="text-[10px] text-slate-500">Click tags below or write custom</span>
                  </div>

                  <textarea
                    rows={3}
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    placeholder="e.g. Scuba diving, ancient ruins, rooftop cocktails, Michelin star dining, botanical gardens..."
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                      errors.interests ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-orange-500'
                    } text-slate-100 placeholder-slate-600 text-sm focus:outline-none transition-colors resize-none`}
                  />
                  {errors.interests && <p className="text-rose-400 text-xs mt-1">{errors.interests}</p>}

                  {/* Clickable interest chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {INTEREST_CHIPS.map((chip) => {
                      const isActive = formData.interests.toLowerCase().includes(chip.toLowerCase());
                      return (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => toggleInterestTag(chip)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                            isActive
                              ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                              : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <span>{chip}</span>
                          {isActive && <Check className="w-3 h-3 text-orange-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submission Action Button */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-base shadow-xl shadow-orange-600/30 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{submissionStep || 'Dispatching to n8n AI Agent...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 text-orange-100" />
                      <span>Dispatch to AI Travel Agent Workflow</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500 mt-2 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Payload is transmitted directly to n8n webhook instance securely.</span>
                </p>
              </div>

            </form>
          </div>

          {/* Right Column: Live Trip Board & Automation Blueprint */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live Trip Summary Card */}
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-orange-400" />
                  <span>Trip Blueprint</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30">
                  Live Preview
                </span>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Route</span>
                  <div className="flex items-center gap-2 mt-0.5 font-semibold text-slate-200">
                    <span className="truncate">{formData.from || 'Origin'}</span>
                    <ArrowRight className="w-3 h-3 text-orange-400 shrink-0" />
                    <span className="truncate text-orange-300">{formData.destination || 'Destination'}</span>
                  </div>
                  {(formData.originAirport || formData.destAirport) && (
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      IATA: {formData.originAirport || '---'} ➔ {formData.destAirport || '---'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Duration</span>
                    <span className="font-semibold text-slate-200">
                      {tripDuration ? `${tripDuration} Days` : 'Set Dates'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Travellers</span>
                    <span className="font-semibold text-slate-200">
                      {formData.travellers} {formData.travellers === 1 ? 'Person' : 'People'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Budget</span>
                    <span className="font-semibold text-emerald-400">{formData.budget || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Style</span>
                    <span className="font-semibold text-amber-400">{formData.travelStyle}</span>
                  </div>
                </div>

                {formData.interests && (
                  <div className="pt-2 border-t border-slate-800/60">
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">Focus Areas</span>
                    <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                      "{formData.interests}"
                    </p>
                  </div>
                )}
              </div>

              {/* Status info */}
              <div className="mt-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Destination Node:</span>
                  <span className="text-emerald-400 font-mono">n8n Form Cloud</span>
                </div>
                <div className="truncate text-slate-500 font-mono text-[10px]">
                  {n8nUrl}
                </div>
              </div>
            </div>

            {/* Why n8n Card */}
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>What happens next?</span>
              </h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">1</span>
                  <span>Form fields are formatted into n8n multipart payload format.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">2</span>
                  <span>The AI Travel Agent LLM synthesizes day-by-day activities according to budget.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">3</span>
                  <span>Flights & hotel suggestions are mapped to airport codes ({formData.originAirport || 'origin'} ➔ {formData.destAirport || 'dest'}).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">4</span>
                  <span>Confirmation receipt and tailored travel packet dispatched to {formData.email || 'your email'}.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
