import React, { useState } from 'react';
import { OnChainRecord, ItineraryVersion } from '../types';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  CheckCircle2, 
  Clock, 
  Boxes, 
  Flame, 
  FileCode,
  ShieldCheck,
  Code
} from 'lucide-react';

interface BlockExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string;
  onChainRecord: OnChainRecord | null;
  version?: ItineraryVersion | null;
}

export const BlockExplorerModal: React.FC<BlockExplorerModalProps> = ({
  isOpen,
  onClose,
  txHash,
  onChainRecord,
  version
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTx = txHash || onChainRecord?.txHash || '0x3a8291f04b92d7718c502b48991fa940e729a8c148bb019f884210a4e76d912a';
  const blockNum = version?.blockNumber || onChainRecord?.blockNumber || 19482914;
  const hash = version?.hash || onChainRecord?.currentHash || '0x9a8fcb1458b091f28b74619d8540c748e718b528a47291bb8409381c849182a0';
  const verNumber = version?.versionNumber || onChainRecord?.currentVersion || 'v1.0';
  const contractAddr = onChainRecord?.contractAddress || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  const gasUsed = version?.gasUsed || 158420;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl max-h-[90vh] rounded-2xl border border-slate-700 bg-[#0d121f] p-6 shadow-2xl overflow-y-auto text-slate-200 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white leading-tight">
                  TripChain Block Explorer
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Arbitrum Sepolia Testnet
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transaction Receipt & Immutable Ledger Proof
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

        {/* Status Bar */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 my-4 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <div className="font-bold text-emerald-300">Transaction Status: Success (Included in Block)</div>
            <div className="text-[11px] text-slate-300">Confirmed with 38 block confirmations on TripChain Consensus Contract.</div>
          </div>
        </div>

        {/* Transaction Data Table */}
        <div className="space-y-3 text-xs">
          
          {/* Transaction Hash */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 gap-1">
            <span className="text-slate-400 font-medium">Transaction Hash:</span>
            <div className="flex items-center gap-2 font-mono text-cyan-300 truncate">
              <span className="truncate">{currentTx}</span>
              <button
                onClick={() => handleCopy(currentTx, 'tx')}
                className="text-slate-400 hover:text-white"
                title="Copy Transaction Hash"
              >
                {copiedField === 'tx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Block Number & Timestamp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-medium block mb-1">Block Number:</span>
              <span className="font-mono text-sm font-bold text-white">#{blockNum}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-medium block mb-1">Timestamp:</span>
              <span className="text-xs text-slate-200 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {version?.timestamp ? new Date(version.timestamp).toLocaleString() : 'Just now'}
              </span>
            </div>
          </div>

          {/* Contract Address */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 gap-1">
            <span className="text-slate-400 font-medium">Interacted With (Contract):</span>
            <div className="flex items-center gap-2 font-mono text-indigo-300 truncate">
              <span className="truncate">{contractAddr}</span>
              <button
                onClick={() => handleCopy(contractAddr, 'contract')}
                className="text-slate-400 hover:text-white"
              >
                {copiedField === 'contract' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Gas & Fee */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-medium block mb-0.5">Gas Used:</span>
              <span className="font-mono text-slate-200">{gasUsed.toLocaleString()} units</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-medium block mb-0.5">Gas Price:</span>
              <span className="font-mono text-slate-200">0.12 Gwei</span>
            </div>
          </div>

          {/* Decoded Smart Contract Call */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                Decoded Function Call
              </span>
              <span className="font-mono text-emerald-400">commitItineraryVersion()</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#080b12] font-mono text-[11px] space-y-1 border border-slate-900">
              <div className="text-slate-400">
                [0] <span className="text-indigo-400">bytes32</span> itineraryHash: <span className="text-cyan-300">{hash}</span>
              </div>
              <div className="text-slate-400">
                [1] <span className="text-indigo-400">string</span> version: <span className="text-emerald-300">"{verNumber}"</span>
              </div>
              <div className="text-slate-400">
                [2] <span className="text-indigo-400">bytes[]</span> signatures: <span className="text-amber-300">[{version?.signatures?.length || 2} ECDSA signatures]</span>
              </div>
            </div>
          </div>

          {/* Emitted Events Log */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Contract Event Log
            </div>
            <div className="p-2.5 rounded-lg bg-[#080b12] font-mono text-[11px] text-slate-300 border border-slate-900 leading-relaxed">
              <span className="text-purple-400 font-bold">emit</span> ItineraryCommitted(
              <br />&nbsp;&nbsp;hash: <span className="text-cyan-300">{hash.substring(0, 18)}...</span>,
              <br />&nbsp;&nbsp;version: <span className="text-emerald-300">"{verNumber}"</span>,
              <br />&nbsp;&nbsp;blockTimestamp: <span className="text-indigo-300">{Math.floor(Date.now() / 1000)}</span>
              <br />)
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-800 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
          >
            Close Explorer
          </button>
        </div>

      </div>
    </div>
  );
};
