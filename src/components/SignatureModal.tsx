import React, { useState } from 'react';
import { Member, Trip } from '../types';
import { EIP712Payload, signItineraryPayload } from '../services/cryptoService';
import { 
  ShieldCheck, 
  Key, 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Lock, 
  FileCode,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  payload: EIP712Payload | null;
  onConfirmSignature: (signature: string) => void;
  isRealWalletConnected: boolean;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  member,
  payload,
  onConfirmSignature,
  isRealWalletConnected
}) => {
  const [isSigning, setIsSigning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  if (!isOpen || !payload) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(payload.message.itineraryHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSign = async () => {
    setIsSigning(true);
    try {
      const sig = await signItineraryPayload(payload, isRealWalletConnected);
      onConfirmSignature(sig);
    } catch (err) {
      console.error('Signature failed:', err);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0d121f] p-6 shadow-2xl space-y-5 text-slate-200 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Wallet Signature Request
              </h3>
              <p className="text-xs text-slate-400">
                EIP-712 Typed Itinerary Consensus Agreement
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Signer Identity */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
            <div>
              <div className="text-xs font-semibold text-white">{member.name}</div>
              <div className="text-[11px] font-mono text-slate-400">{member.walletAddress}</div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            {isRealWalletConnected ? 'MetaMask' : 'Simulated Key'}
          </span>
        </div>

        {/* Message Data Details */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span className="text-slate-400">Trip Destination</span>
            <span className="font-semibold text-white">{payload.message.destination}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span className="text-slate-400">Proposed Version</span>
            <span className="font-mono font-bold text-indigo-300">{payload.message.version}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span className="text-slate-400">Estimated Total Cost</span>
            <span className="font-mono text-emerald-300 font-semibold">${payload.message.estimatedCost}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span className="text-slate-400">Verifying Contract</span>
            <span className="font-mono text-slate-300">{payload.domain.verifyingContract.substring(0, 10)}...</span>
          </div>

          {/* Canonical Hash Display */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 font-medium">Canonical Itinerary SHA-256 Hash</span>
              <button 
                onClick={handleCopyHash}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Hash'}</span>
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 break-all border border-slate-800">
              {payload.message.itineraryHash}
            </div>
          </div>
        </div>

        {/* Collapsible EIP-712 JSON */}
        <div className="pt-1">
          <button 
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-300 font-medium"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{showJson ? 'Hide Raw EIP-712 Payload' : 'View Raw EIP-712 Payload'}</span>
          </button>

          {showJson && (
            <pre className="mt-2 p-3 rounded-lg bg-slate-950 text-[10px] font-mono text-slate-400 overflow-x-auto max-h-36 border border-slate-800">
              {JSON.stringify(payload, null, 2)}
            </pre>
          )}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300">
          <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <span>
            Signing certifies that you agree to all scheduled activities and budget estimates. Once quorum is reached, this hash is permanently logged on-chain.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSign}
            disabled={isSigning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-glow-indigo transition-all disabled:opacity-50"
          >
            {isSigning ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Signing via ECDSA...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign & Authorize</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
