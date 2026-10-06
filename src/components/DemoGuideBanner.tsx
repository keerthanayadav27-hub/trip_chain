import React from 'react';
import { Proposal, ItineraryVersion } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  PenTool, 
  ChevronRight,
  HelpCircle,
  FileCode2
} from 'lucide-react';

interface DemoGuideBannerProps {
  versionCount: number;
  activeProposal: Proposal | null;
  onQuickPropose: () => void;
  onOpenDiffModal: () => void;
  onOpenContractModal: () => void;
}

export const DemoGuideBanner: React.FC<DemoGuideBannerProps> = ({
  versionCount,
  activeProposal,
  onQuickPropose,
  onOpenDiffModal,
  onOpenContractModal
}) => {
  const isStep1Done = true; // Initial AI 3-day itinerary is active
  const isStep2Done = versionCount > 1; // At least one revision has been committed on-chain
  const isStep3Done = versionCount > 1; // Version history is populated and verifiable

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-cyan-950/60 p-4 sm:p-5 shadow-2xl mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            Hackathon Live Evaluation Checklist
          </h3>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">
            Hackathon Demo Flow
          </span>
        </div>

        <button
          onClick={onOpenContractModal}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono border border-slate-700 transition-all self-start sm:self-auto"
        >
          <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>View Solidity Contract (.sol)</span>
        </button>
      </div>

      {/* 3 Must-Show Criteria Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs">
        
        {/* Step 1 */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-[10px] font-mono">
                01
              </span>
              AI 3-Day Plan
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Passed
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            AI generates realistic 3-day day-by-day itinerary with budget allocation.
          </p>
        </div>

        {/* Step 2 */}
        <div className={`p-3 rounded-xl border transition-all space-y-1.5 ${
          isStep2Done
            ? 'bg-slate-950/60 border-slate-800'
            : activeProposal
              ? 'bg-indigo-950/40 border-indigo-500/50 shadow-glow-indigo'
              : 'bg-slate-950/40 border-amber-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-[10px] font-mono">
                02
              </span>
              Group Multi-Sig Proposal
            </span>
            {isStep2Done ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                Logged On-Chain
              </span>
            ) : activeProposal ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                <Clock className="w-3 h-3 animate-spin" />
                Voting Active
              </span>
            ) : (
              <button
                onClick={onQuickPropose}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-2 py-0.5 rounded transition-all"
              >
                <span>Trigger Sample Edit</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            {isStep2Done
              ? 'Changes proposed, signed by members with wallets, and committed.'
              : 'Propose an amendment, sign with wallet, and write to blockchain.'}
          </p>
        </div>

        {/* Step 3 */}
        <div className={`p-3 rounded-xl border transition-all space-y-1.5 ${
          isStep3Done
            ? 'bg-slate-950/60 border-slate-800'
            : 'bg-slate-950/40 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-[10px] font-mono">
                03
              </span>
              Version History Proof
            </span>
            {isStep3Done ? (
              <button
                onClick={onOpenDiffModal}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 px-2 py-0.5 rounded transition-all"
              >
                <Layers className="w-3 h-3 text-indigo-400" />
                <span>Compare Versions</span>
              </button>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">
                Commit v2.0 to unlock
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Timeline proving which plan everyone agreed to with cryptographic diff inspection.
          </p>
        </div>

      </div>

    </div>
  );
};
