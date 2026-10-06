import React from 'react';
import { ItineraryVersion } from '../types';
import { 
  GitCommit, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  Layers, 
  ExternalLink, 
  ArrowLeftRight,
  UserCheck
} from 'lucide-react';

interface VersionHistorySectionProps {
  versionHistory: ItineraryVersion[];
  currentVersionNumber: string;
  onOpenDiffModal: (v1: string, v2: string) => void;
  onOpenExplorer: (txHash?: string) => void;
}

export const VersionHistorySection: React.FC<VersionHistorySectionProps> = ({
  versionHistory,
  currentVersionNumber,
  onOpenDiffModal,
  onOpenExplorer
}) => {
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const sortedHistory = [...versionHistory].reverse();

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              On-Chain Version History & Consensus Timeline
            </h2>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
              {versionHistory.length} Version{versionHistory.length > 1 ? 's' : ''} Logged
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Every approved change creates a new immutable version on-chain. Compare previous and current versions to audit modifications.
          </p>
        </div>

        {/* Compare Latest vs Previous shortcut */}
        {versionHistory.length > 1 && (
          <button
            onClick={() => onOpenDiffModal(versionHistory[0].versionNumber, versionHistory[versionHistory.length - 1].versionNumber)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold shadow-glow-indigo transition-all self-start sm:self-auto"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Compare {versionHistory[0].versionNumber} vs {versionHistory[versionHistory.length - 1].versionNumber}</span>
          </button>
        )}
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {sortedHistory.map((ver, idx) => {
          const isLatest = ver.versionNumber === currentVersionNumber;
          const prevVersion = sortedHistory[idx + 1];

          return (
            <div key={ver.versionNumber} className="relative group">
              
              {/* Timeline Node Dot */}
              <div className={`absolute -left-[27px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isLatest 
                  ? 'bg-emerald-500 border-emerald-300 shadow-glow-emerald' 
                  : 'bg-slate-900 border-slate-700 group-hover:border-indigo-400'
              }`}>
                {isLatest ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-950 font-bold" />
                ) : (
                  <GitCommit className="w-3 h-3 text-slate-400" />
                )}
              </div>

              {/* Version Card */}
              <div className={`rounded-xl border p-5 transition-all ${
                isLatest
                  ? 'bg-slate-900/90 border-indigo-500/40 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}>
                
                {/* Top Row: Version, Status, Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {ver.versionNumber}
                    </span>
                    {isLatest && (
                      <span className="text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                        Active Consensus
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-mono">
                      Block #{ver.blockNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(ver.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Change Summary */}
                <p className="text-xs sm:text-sm text-slate-200 font-medium mb-3">
                  {ver.changeSummary}
                </p>

                {/* Hashes & Signers Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  
                  {/* Canonical Itinerary Hash */}
                  <div className="md:col-span-6 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Canonical Hash</span>
                      <button
                        onClick={() => handleCopy(ver.hash)}
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[10px]"
                      >
                        {copiedHash === ver.hash ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                        <span>{copiedHash === ver.hash ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-cyan-300 bg-slate-950 p-2 rounded border border-slate-800 truncate">
                      {ver.hash}
                    </div>
                  </div>

                  {/* Signers & Actions */}
                  <div className="md:col-span-6 flex flex-wrap items-center justify-between gap-3 self-end">
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-emerald-400" />
                        Signed by ({ver.signatures.length})
                      </span>
                      <div className="flex items-center gap-1">
                        {ver.signatures.map((s, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700"
                            title={`${s.memberName} (${s.walletAddress})`}
                          >
                            {s.memberName.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions: Compare Diff */}
                    <div className="flex items-center gap-2">
                      {prevVersion && (
                        <button
                          onClick={() => onOpenDiffModal(prevVersion.versionNumber, ver.versionNumber)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
                          title={`Compare changes from ${prevVersion.versionNumber} to ${ver.versionNumber}`}
                        >
                          <ArrowLeftRight className="w-3 h-3 text-indigo-400" />
                          <span>Diff vs {prevVersion.versionNumber}</span>
                        </button>
                      )}

                      <button
                        onClick={() => onOpenExplorer(ver.txHash)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-all"
                        title="View on block explorer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
