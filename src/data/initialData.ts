import { Member, Trip } from '../types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'member-alice',
    name: 'Alice Chen',
    role: 'Trip Creator & Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    walletAddress: '0x71C8A39bF2197A35F01fD18659d646B4628D849A',
    testTokenBalance: 650,
    hasPaidShare: true
  },
  {
    id: 'member-bob',
    name: 'Bob Martinez',
    role: 'Adventure Co-planner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    walletAddress: '0x3B2e51cA872B889d1C6c6d59b208AfDbA3A9bE18',
    testTokenBalance: 420,
    hasPaidShare: false
  },
  {
    id: 'member-charlie',
    name: 'Charlie Zhao',
    role: 'Treasurer & Auditor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    walletAddress: '0x9F42b781B8470a2dC1b31528659714890B9388C2',
    testTokenBalance: 800,
    hasPaidShare: false
  }
];

export const PRESET_TRIPS: Array<{
  name: string;
  destination: string;
  country: string;
  budget: number;
  interests: string[];
  description: string;
  badge: string;
}> = [
  {
    name: 'Tokyo Neon & Shinto Odyssey',
    destination: 'Tokyo',
    country: 'Japan',
    budget: 1500,
    interests: ['Culture', 'Gastronomy', 'Nightlife', 'Sightseeing'],
    description: 'Ancient shrines, bustling Shibuya crossings, teamLab digital art, and Michelin ramen.',
    badge: 'Popular Demo'
  },
  {
    name: 'Paris Arts & Gastronomy',
    destination: 'Paris',
    country: 'France',
    budget: 1800,
    interests: ['Culture', 'Food', 'Sightseeing', 'Shopping'],
    description: 'Louvre masterworks, Montmartre bohemian sunsets, Latin Quarter cafés, and Versailles.',
    badge: 'Classic'
  },
  {
    name: 'Bali Spiritual & Adventure Retreat',
    destination: 'Bali',
    country: 'Indonesia',
    budget: 950,
    interests: ['Outdoor', 'Activity', 'Culture', 'Food'],
    description: 'Ubud emerald rice terraces, Batur volcano sunrise trek, Uluwatu fire dance, and spa retreats.',
    badge: 'Budget Friendly'
  },
  {
    name: 'New York Skyline & Broadway Pulse',
    destination: 'New York',
    country: 'United States',
    budget: 2100,
    interests: ['Sightseeing', 'Food', 'Nightlife', 'Culture'],
    description: 'Top of the Rock, High Line strolls, Broadway theatre, jazz basements, and Brooklyn pizza.',
    badge: 'Fast Paced'
  }
];
