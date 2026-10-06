export type ActivityCategory = 
  | 'Sightseeing' 
  | 'Food' 
  | 'Culture' 
  | 'Transport' 
  | 'Nightlife' 
  | 'Outdoor' 
  | 'Shopping'
  | 'Activity';

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  category: ActivityCategory;
  estimatedCost: number; // in USD
  durationHours?: number;
  highlight?: string;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  theme: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  totalBudget: number; // in USD
  interests: string[];
  days: DayPlan[];
  currency: string;
  coverImage?: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  walletAddress: string;
  testTokenBalance: number; // TRIP tokens
  hasPaidShare: boolean;
}

export type VoteStatus = 'APPROVE' | 'REJECT' | 'APPROVED' | 'REJECTED';

export interface SignatureRecord {
  memberId: string;
  memberName: string;
  walletAddress: string;
  vote: VoteStatus;
  signature: string;
  timestamp: string;
  comment?: string;
}

export interface ProposalVote {
  vote: VoteStatus;
  signature?: string;
  timestamp?: string;
  comment?: string;
}

export interface Proposal {
  id: string;
  tripId: string;
  title: string;
  summaryOfChanges: string[];
  baseVersionNumber: string;
  targetVersionNumber: string;
  proposedTrip: Trip;
  proposerId: string;
  proposerName: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMMITTED';
  votes: Record<string, ProposalVote>;
  quorumThreshold: number; // e.g. 2 out of 3
}

export interface ItineraryVersion {
  versionNumber: string; // e.g. "v1.0"
  tripSnapshot: Trip;
  hash: string; // 0x...
  previousHash: string; // 0x...
  blockNumber: number;
  timestamp: string;
  txHash: string;
  proposerName: string;
  changeSummary: string;
  signatures: SignatureRecord[];
  gasUsed: number;
  contractAddress: string;
}

export interface OnChainRecord {
  tripId: string;
  currentVersion: string;
  currentHash: string;
  blockNumber: number;
  txHash: string;
  committedAt: string;
  contractAddress: string;
  network: string;
  totalCommittedVersions: number;
}
