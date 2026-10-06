import { Trip, ItineraryVersion, SignatureRecord, OnChainRecord, Proposal } from '../types';
import { computeItineraryHash } from './cryptoService';

const CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const NETWORK_NAME = 'TripChain Sepolia L2 (Chain ID: 421614)';
const STORAGE_KEY_VERSIONS = 'tripchain_version_history';
const STORAGE_KEY_ONCHAIN = 'tripchain_onchain_record';

/**
 * Generate realistic hex hash
 */
function randomHex(length: number): string {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export class BlockchainService {
  private static blockCounter = 19482912;

  /**
   * Load all versions for a trip from local ledger storage
   */
  static getVersionHistory(tripId: string): ItineraryVersion[] {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_VERSIONS}_${tripId}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed reading version history from storage:', e);
    }
    return [];
  }

  /**
   * Save version history to local storage
   */
  static saveVersionHistory(tripId: string, history: ItineraryVersion[]): void {
    try {
      localStorage.setItem(`${STORAGE_KEY_VERSIONS}_${tripId}`, JSON.stringify(history));
    } catch (e) {
      console.error('Failed saving version history:', e);
    }
  }

  /**
   * Get latest on-chain record
   */
  static getOnChainRecord(tripId: string): OnChainRecord | null {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_ONCHAIN}_${tripId}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed reading on-chain record:', e);
    }
    return null;
  }

  /**
   * Save latest on-chain record
   */
  static saveOnChainRecord(record: OnChainRecord): void {
    try {
      localStorage.setItem(`${STORAGE_KEY_ONCHAIN}_${record.tripId}`, JSON.stringify(record));
    } catch (e) {
      console.error('Failed saving on-chain record:', e);
    }
  }

  /**
   * Record genesis version v1.0 upon initial trip creation
   */
  static async recordGenesisVersion(
    trip: Trip,
    creatorSignature: SignatureRecord
  ): Promise<{ version: ItineraryVersion; record: OnChainRecord }> {
    const itineraryHash = await computeItineraryHash(trip);
    this.blockCounter += Math.floor(Math.random() * 3) + 1;

    const genesisVersion: ItineraryVersion = {
      versionNumber: 'v1.0',
      tripSnapshot: JSON.parse(JSON.stringify(trip)),
      hash: itineraryHash,
      previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      blockNumber: this.blockCounter,
      timestamp: new Date().toISOString(),
      txHash: randomHex(64),
      proposerName: 'AI Genesis & Group Founder',
      changeSummary: 'Genesis AI Itinerary generation & consensus baseline approved by group.',
      signatures: [creatorSignature],
      gasUsed: 142850,
      contractAddress: CONTRACT_ADDRESS
    };

    const record: OnChainRecord = {
      tripId: trip.id,
      currentVersion: 'v1.0',
      currentHash: itineraryHash,
      blockNumber: this.blockCounter,
      txHash: genesisVersion.txHash,
      committedAt: genesisVersion.timestamp,
      contractAddress: CONTRACT_ADDRESS,
      network: NETWORK_NAME,
      totalCommittedVersions: 1
    };

    this.saveVersionHistory(trip.id, [genesisVersion]);
    this.saveOnChainRecord(record);

    return { version: genesisVersion, record };
  }

  /**
   * Commit an approved proposal as a new on-chain version
   */
  static async commitProposalOnChain(
    proposal: Proposal,
    signatures: SignatureRecord[]
  ): Promise<{ newVersion: ItineraryVersion; updatedRecord: OnChainRecord }> {
    // Simulate mining latency
    await new Promise(r => setTimeout(r, 1200));

    const history = this.getVersionHistory(proposal.tripId);
    const prevVersion = history[history.length - 1];
    const prevHash = prevVersion ? prevVersion.hash : '0x0000000000000000000000000000000000000000000000000000000000000000';

    const newHash = await computeItineraryHash(proposal.proposedTrip);
    this.blockCounter += Math.floor(Math.random() * 5) + 2;

    const newVersion: ItineraryVersion = {
      versionNumber: proposal.targetVersionNumber,
      tripSnapshot: JSON.parse(JSON.stringify(proposal.proposedTrip)),
      hash: newHash,
      previousHash: prevHash,
      blockNumber: this.blockCounter,
      timestamp: new Date().toISOString(),
      txHash: randomHex(64),
      proposerName: proposal.proposerName,
      changeSummary: proposal.summaryOfChanges.join('; ') || 'Group approved amendments committed on-chain.',
      signatures: signatures,
      gasUsed: 168320 + signatures.length * 15200,
      contractAddress: CONTRACT_ADDRESS
    };

    const updatedHistory = [...history, newVersion];
    this.saveVersionHistory(proposal.tripId, updatedHistory);

    const updatedRecord: OnChainRecord = {
      tripId: proposal.tripId,
      currentVersion: newVersion.versionNumber,
      currentHash: newHash,
      blockNumber: this.blockCounter,
      txHash: newVersion.txHash,
      committedAt: newVersion.timestamp,
      contractAddress: CONTRACT_ADDRESS,
      network: NETWORK_NAME,
      totalCommittedVersions: updatedHistory.length
    };

    this.saveOnChainRecord(updatedRecord);

    return { newVersion, updatedRecord };
  }

  /**
   * Clear demo data if user resets
   */
  static clearTripLedger(tripId: string): void {
    localStorage.removeItem(`${STORAGE_KEY_VERSIONS}_${tripId}`);
    localStorage.removeItem(`${STORAGE_KEY_ONCHAIN}_${tripId}`);
  }
}
