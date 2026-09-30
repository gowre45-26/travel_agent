import { DestinationPreset } from '../types/travel';

export const DESTINATION_PRESETS: DestinationPreset[] = [
  {
    id: 'tokyo-japan',
    title: 'Tokyo & Kyoto Imperial Tour',
    subtitle: 'Ultra-modern tech, neon streets & serene Zen gardens',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    from: 'San Francisco, CA',
    destination: 'Tokyo & Kyoto, Japan',
    originAirport: 'SFO',
    destAirport: 'HND',
    daysDuration: 10,
    budget: '$4,200',
    travelStyle: 'Standard',
    interests: 'Culinary omakase, historic shrines, bullet trains, anime culture, teamLab digital art',
    tags: ['Culture', 'Gastronomy', 'Rail Travel']
  },
  {
    id: 'goa-india',
    title: 'Goa Coastal & Heritage Retreat',
    subtitle: 'Golden sands, Portuguese architecture & sunset catamaran cruise',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    from: 'Visakhapatnam',
    destination: 'North & South Goa, India',
    originAirport: 'VTZ',
    destAirport: 'GOI',
    daysDuration: 6,
    budget: '₹45,000 (~$550)',
    travelStyle: 'Relaxation',
    interests: 'Beach lounging, spice plantation tour, beach shacks, Portuguese villas, scuba diving',
    tags: ['Beaches', 'Seafood', 'Heritage']
  },
  {
    id: 'amalfi-italy',
    title: 'Amalfi Coast & Rome Odyssey',
    subtitle: 'Cliffside lemon groves, espresso bars & ancient Roman wonders',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    from: 'New York, NY',
    destination: 'Rome & Positano, Italy',
    originAirport: 'JFK',
    destAirport: 'FCO',
    daysDuration: 8,
    budget: '$5,500',
    travelStyle: 'Luxury',
    interests: 'Colosseum VIP access, private boat tour around Capri, wine tasting in Campania, handmade pasta classes',
    tags: ['Romance', 'Fine Dining', 'Coastal']
  },
  {
    id: 'swiss-alps',
    title: 'Swiss Alps Glacier Discovery',
    subtitle: 'Snow-capped peaks, alpine cogwheel trains & mountain chalets',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    from: 'London, UK',
    destination: 'Interlaken & Zermatt, Switzerland',
    originAirport: 'LHR',
    destAirport: 'ZRH',
    daysDuration: 7,
    budget: '£3,800 (~$4,900)',
    travelStyle: 'Adventure',
    interests: 'Jungfraujoch glacier hike, Glacier Express panoramic train, fondue evenings, paragliding over valleys',
    tags: ['Mountains', 'Adventure', 'Scenic Rail']
  },
  {
    id: 'bali-indonesia',
    title: 'Bali Rainforest & Island Haven',
    subtitle: 'Ubud emerald rice terraces, yoga retreats & cliffside surf breaks',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    from: 'Singapore',
    destination: 'Ubud & Uluwatu, Bali',
    originAirport: 'SIN',
    destAirport: 'DPS',
    daysDuration: 7,
    budget: '$2,200',
    travelStyle: 'Relaxation',
    interests: 'Holistic wellness spa, Tegallalang rice terraces, sunrise hike at Mount Batur, beach club sunsets',
    tags: ['Tropical', 'Wellness', 'Nature']
  },
  {
    id: 'dubai-emirates',
    title: 'Dubai & Desert Dune Glamour',
    subtitle: 'Skyline icons, luxury yachting & magical desert starlight glamping',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    from: 'Mumbai, India',
    destination: 'Dubai & Abu Dhabi, UAE',
    originAirport: 'BOM',
    destAirport: 'DXB',
    daysDuration: 5,
    budget: '$3,200',
    travelStyle: 'Luxury',
    interests: 'Burj Khalifa Sky Lounge, 4x4 desert safari dune bashing, Museum of the Future, souk shopping',
    tags: ['Luxury', 'Modern Marvels', 'Desert']
  }
];

export const INTEREST_CHIPS = [
  'Culinary & Street Food',
  'Historical Monuments & Museums',
  'Beach & Watersports',
  'Mountain Hiking & Trekking',
  'Luxury Spa & Wellness',
  'Nightlife & Rooftop Lounges',
  'Wildlife Safari & Eco-Tours',
  'Photography & Architecture',
  'Local Arts & Crafts',
  'Theme Parks & Family Fun'
];
