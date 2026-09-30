import { AirportSuggestion } from '../types/travel';

export const POPULAR_AIRPORTS: AirportSuggestion[] = [
  { code: 'VTZ', city: 'Visakhapatnam', country: 'India', name: 'Visakhapatnam International Airport' },
  { code: 'GOI', city: 'Goa', country: 'India', name: 'Dabolim Airport' },
  { code: 'GOX', city: 'Goa (Mopa)', country: 'India', name: 'Manohar International Airport' },
  { code: 'DEL', city: 'New Delhi', country: 'India', name: 'Indira Gandhi International Airport' },
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji Maharaj International' },
  { code: 'BLR', city: 'Bengaluru', country: 'India', name: 'Kempegowda International Airport' },
  { code: 'HYD', city: 'Hyderabad', country: 'India', name: 'Rajiv Gandhi International Airport' },
  { code: 'MAA', city: 'Chennai', country: 'India', name: 'Chennai International Airport' },
  { code: 'CCU', city: 'Kolkata', country: 'India', name: 'Netaji Subhash Chandra Bose International' },
  { code: 'JFK', city: 'New York', country: 'United States', name: 'John F. Kennedy International Airport' },
  { code: 'SFO', city: 'San Francisco', country: 'United States', name: 'San Francisco International Airport' },
  { code: 'LAX', city: 'Los Angeles', country: 'United States', name: 'Los Angeles International Airport' },
  { code: 'ORD', city: 'Chicago', country: 'United States', name: 'O\'Hare International Airport' },
  { code: 'LHR', city: 'London', country: 'United Kingdom', name: 'Heathrow Airport' },
  { code: 'CDG', city: 'Paris', country: 'France', name: 'Charles de Gaulle Airport' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', name: 'Amsterdam Airport Schiphol' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', name: 'Frankfurt Airport' },
  { code: 'ZRH', city: 'Zurich', country: 'Switzerland', name: 'Zurich Airport' },
  { code: 'HND', city: 'Tokyo', country: 'Japan', name: 'Haneda Airport' },
  { code: 'NRT', city: 'Tokyo (Narita)', country: 'Japan', name: 'Narita International Airport' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Singapore Changi Airport' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', name: 'Suvarnabhumi Airport' },
  { code: 'DPS', city: 'Bali', country: 'Indonesia', name: 'Ngurah Rai International Airport' },
  { code: 'DXB', city: 'Dubai', country: 'United Arab Emirates', name: 'Dubai International Airport' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad International Airport' },
  { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Sydney Kingsford Smith Airport' },
  { code: 'FCO', city: 'Rome', country: 'Italy', name: 'Leonardo da Vinci–Fiumicino Airport' },
  { code: 'BCN', city: 'Barcelona', country: 'Spain', name: 'Josep Tarradellas Barcelona-El Prat' }
];

export function findAirportSuggestions(query: string): AirportSuggestion[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  return POPULAR_AIRPORTS.filter(
    a => a.code.toLowerCase().includes(q) || 
         a.city.toLowerCase().includes(q) || 
         a.country.toLowerCase().includes(q)
  ).slice(0, 6);
}
