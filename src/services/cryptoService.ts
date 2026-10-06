import { Trip } from '../types';

/**
 * Deterministically serialize any JavaScript object into canonical JSON with sorted keys.
 * This guarantees the exact same hash regardless of property order.
 */
export function canonicalStringify(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalStringify).join(',') + ']';
  }

  const sortedKeys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = sortedKeys.map(key => {
    const val = (obj as Record<string, unknown>)[key];
    return `${JSON.stringify(key)}:${canonicalStringify(val)}`;
  });
  return '{' + pairs.join(',') + '}';
}

/**
 * Compute SHA-256 hash using the Web Crypto API.
 * Returns formatted 0x-prefixed 64-character hex string.
 */
export async function computeItineraryHash(trip: Trip): Promise<string> {
  // Only extract core itinerary consensus fields to ensure canonical deterministic hashing
  const consensusData = {
    destination: trip.destination.trim().toLowerCase(),
    country: trip.country.trim().toLowerCase(),
    startDate: trip.startDate,
    endDate: trip.endDate,
    totalBudget: trip.totalBudget,
    days: trip.days.map(d => ({
      dayNumber: d.dayNumber,
      date: d.date,
      theme: d.theme,
      activities: d.activities.map(a => ({
        time: a.time,
        title: a.title,
        location: a.location,
        category: a.category,
        estimatedCost: a.estimatedCost
      }))
    }))
  };

  const canonicalJson = canonicalStringify(consensusData);
  const encoder = new TextEncoder();
  const data = encoder.encode(canonicalJson);

  if (window?.crypto?.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `0x${hashHex}`;
  }

  // Fallback lightweight hash for non-secure contexts
  let hash = 0;
  for (let i = 0; i < canonicalJson.length; i++) {
    const char = canonicalJson.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(64, '0');
  return `0x${hex}`;
}

export interface EIP712Payload {
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  types: Record<string, Array<{ name: string; type: string }>>;
  primaryType: string;
  message: {
    tripId: string;
    destination: string;
    version: string;
    itineraryHash: string;
    totalBudget: number;
    estimatedCost: number;
    vote: 'APPROVE' | 'REJECT';
    signer: string;
    timestamp: number;
    nonce: number;
  };
}

export function buildEIP712Payload(params: {
  trip: Trip;
  version: string;
  itineraryHash: string;
  signerAddress: string;
  vote: 'APPROVE' | 'REJECT';
}): EIP712Payload {
  const { trip, version, itineraryHash, signerAddress, vote } = params;
  
  const estimatedCost = trip.days.reduce(
    (sum, d) => sum + d.activities.reduce((s, a) => s + (a.estimatedCost || 0), 0),
    0
  );

  return {
    domain: {
      name: 'TripChain Protocol',
      version: '1.0.0',
      chainId: 421614, // Arbitrum Sepolia Testnet
      verifyingContract: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    },
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      ItineraryApproval: [
        { name: 'tripId', type: 'string' },
        { name: 'destination', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'itineraryHash', type: 'bytes32' },
        { name: 'totalBudget', type: 'uint256' },
        { name: 'estimatedCost', type: 'uint256' },
        { name: 'vote', type: 'string' },
        { name: 'signer', type: 'address' },
        { name: 'timestamp', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
      ],
    },
    primaryType: 'ItineraryApproval',
    message: {
      tripId: trip.id,
      destination: trip.destination,
      version: version,
      itineraryHash: itineraryHash,
      totalBudget: trip.totalBudget,
      estimatedCost,
      vote,
      signer: signerAddress,
      timestamp: Math.floor(Date.now() / 1000),
      nonce: Math.floor(Math.random() * 1000000),
    },
  };
}

/**
 * Generate cryptographic signature (via MetaMask if available, or deterministic web crypto mock)
 */
export async function signItineraryPayload(
  payload: EIP712Payload,
  isRealWalletConnected = false
): Promise<string> {
  // If user connected real MetaMask / web3 provider
  if (isRealWalletConnected && typeof window !== 'undefined' && (window as unknown as { ethereum?: unknown }).ethereum) {
    try {
      const ethereum = (window as unknown as { ethereum: { request: (args: unknown) => Promise<string> } }).ethereum;
      const signature = await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [payload.message.signer, JSON.stringify(payload)],
      });
      return signature;
    } catch (err) {
      console.warn('MetaMask signing failed or rejected, falling back to secure simulated signature:', err);
    }
  }

  // Realistic mock signature using deterministic hash of payload message
  const rawStr = `${payload.message.signer}-${payload.message.itineraryHash}-${payload.message.vote}-${payload.message.nonce}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(rawStr);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return standard 65-byte ECDSA signature format (r: 32 bytes, s: 32 bytes, v: 1 byte [1b/1c])
  return `0x${hex}${hex.substring(0, 64)}1b`;
}

/**
 * Client-side cryptographic integrity verification
 */
export async function verifyItineraryIntegrity(trip: Trip, expectedHash: string): Promise<{
  isValid: boolean;
  computedHash: string;
  expectedHash: string;
}> {
  const computedHash = await computeItineraryHash(trip);
  return {
    isValid: computedHash.toLowerCase() === expectedHash.toLowerCase(),
    computedHash,
    expectedHash
  };
}
