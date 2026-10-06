import React, { useState } from 'react';
import { OnChainRecord, Trip, ItineraryVersion } from '../types';
import { computeItineraryHash } from '../services/cryptoService';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  ExternalLink, 
  RotateCw, 
  Lock, 
  Cpu, 
  Flame, 
  Undo2,
  FileCheck2,
  Layers
} from 'lucide-react';

interface OnChainVerificationProps {
  trip: Trip;
  onChainRecord: OnChainRecord | null;
  latestVersion: ItineraryVersion | null;
  onOpenExplorer: (txHash?: string) => void;
  onTamperData: () => void;
  onRestoreData: () => void;
  isTampered: boolean;
}

export const OnChainVerificationSection: React.FC<OnChainVerificationProps> = ({
  trip,
  onChainRecord,
  latestVersion,
  onOpenExplorer,
  onTamperData,
  onRestoreData,
  isTampered
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    valid: boolean;
    computedHash: string;
    onChainHash: string;
    verifiedAt?: string;
  } | null>(null);

  const handleCopy = (text: string, type: 'hash' | 'tx') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  const handleRunVerification = async () => {
    if (!onChainRecord) return;
    setIsVerifying(true);
    try {
      const computed = await computeItineraryHash(trip);
      const isValid = computed.toLowerCase() === onChainRecord.currentHash.toLowerCase();
      
      setVerificationResult({
        tested: true,
        valid: isValid,
        computedHash: computed,
        onChainHash: onChainRecord.currentHash,
        verifiedAt: new Date().toLocaleTimeString()
      });
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!onChainRecord) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center text-slate-400">
        <Lock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p>No itinerary has been finalized on-chain yet.</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              On-Chain Cryptographic Verification
            </h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
              Arbitrum Sepolia L2
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Proves immutable consensus. The itinerary’s canonical state is hashed and anchored to the smart contract ledger.
          </p>
        </div>

        {/* Verification Check Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-glow-emerald transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verifying Hashes...' : 'Re-verify Client Hash'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: On-Chain Details & Verification Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Smart Contract Metadata */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
            
            {/* Version & Block Height */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Active Version</span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {onChainRecord.currentVersion}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <span>Block:</span>
                <span className="text-white font-semibold">#{onChainRecord.blockNumber}</span>
              </div>
            </div>

            {/* Itinerary Hash */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  Canonical Consensus Hash (SHA-256)
                </span>
                <button 
                  onClick={() => handleCopy(onChainRecord.currentHash, 'hash')}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0d121f] font-mono text-xs text-cyan-300 break-all border border-slate-800/80">
                {onChainRecord.currentHash}
              </div>
            </div>

            {/* Transaction Hash */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Transaction Hash</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleCopy(onChainRecord.txHash, 'tx')}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
                  >
                    {copiedTx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedTx ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button 
                    onClick={() => onOpenExplorer(onChainRecord.txHash)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Explorer</span>
                  </button>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0d121f] font-mono text-xs text-slate-300 break-all border border-slate-800/80">
                {onChainRecord.txHash}
              </div>
            </div>

            {/* Smart Contract & Timestamp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Verifying Contract</div>
                <div className="font-mono text-slate-200 text-xs truncate mt-0.5">
                  {onChainRecord.contractAddress}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Committed Timestamp</div>
                <div className="text-slate-200 text-xs truncate mt-0.5">
                  {new Date(onChainRecord.committedAt).toLocaleString()}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Live Proof & Interactive Demo Tamper Test */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Live Integrity Card */}
          <div className={`rounded-xl border p-5 transition-all ${
            isTampered 
              ? 'bg-rose-950/40 border-rose-500/60 shadow-glow-rose' 
              : 'bg-emerald-950/30 border-emerald-500/40 shadow-glow-emerald'
          }`}>
            <div className="flex items-start gap-3">
              {isTampered ? (
                <ShieldAlert className="w-7 h-7 text-rose-400 flex-shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-7 h-7 text-emerald-400 flex-shrink-0 mt-0.5" />
              )}
              
              <div className="space-y-1">
                <h4 className={`text-base font-bold ${isTampered ? 'text-rose-300' : 'text-emerald-300'}`}>
                  {isTampered ? 'Hash Mismatch - Tampering Detected!' : 'Consensus Authenticated on Chain'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isTampered ? (
                    'An unauthorized alteration was introduced to the local itinerary. The client-side calculated hash NO LONGER MATCHES the on-chain consensus hash!'
                  ) : (
                    `All ${latestVersion?.signatures.length || 1} participant signatures match the canonical SHA-256 hash. The itinerary is 100% tamper-evident.`
                  )}
                </p>
              </div>
            </div>

            {/* Signatures count */}
            {latestVersion && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Cryptographic Signers:</span>
                <div className="flex -space-x-1.5">
                  {latestVersion.signatures.map((sig, i) => (
                    <div 
                      key={i} 
                      className="w-6 h-6 rounded-full bg-indigo-600 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-white"
                      title={`${sig.memberName} (${sig.walletAddress})`}
                    >
                      {sig.memberName[0]}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Hackathon Tamper Test Panel */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Hackathon Judge Demo Tool
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Interactive</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              Test what happens when an itinerary item's price or description is secretly tampered with locally:
            </p>

            <div className="flex gap-2">
              {!isTampered ? (
                <button
                  onClick={onTamperData}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-medium transition-all"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Simulate Malicious Tamper</span>
                </button>
              ) : (
                <button
                  onClick={onRestoreData}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all shadow-glow-emerald"
                >
                  <Undo2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Restore Verified Consensus</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
