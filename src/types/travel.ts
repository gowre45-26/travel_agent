export interface TravelFormData {
  name: string;
  email: string;
  from: string;
  destination: string;
  originAirport: string;
  destAirport: string;
  departureDate: string;
  returnDate: string;
  travellers: number;
  budget: string;
  travelStyle: 'Budget' | 'Standard' | 'Luxury' | 'Adventure' | 'Family' | 'Relaxation';
  interests: string;
}

export interface TravelSubmissionRecord {
  id: string;
  bookingRef: string;
  timestamp: string;
  data: TravelFormData;
  n8nStatus: number;
  n8nUrl: string;
  latencyMs: number;
}

export interface AirportSuggestion {
  code: string;
  city: string;
  country: string;
  name: string;
}

export interface DestinationPreset {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  from: string;
  destination: string;
  originAirport: string;
  destAirport: string;
  daysDuration: number;
  budget: string;
  travelStyle: 'Budget' | 'Standard' | 'Luxury' | 'Adventure' | 'Family' | 'Relaxation';
  interests: string;
  tags: string[];
}
