import React from 'react';
import { Proposal, Member } from '../types';
import { 
  GitPullRequest, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  PenTool, 
  Sparkles,
  ArrowRight,
  Trash2,
  Lock
} from 'lucide-react';

interface ProposalBannerProps {
  proposal: Proposal;
  members: Member[];
  currentMember: Member;
  onOpenSignModal: () => void;
  onRejectProposal: () => void;
  onCommitOnChain: () => void;
  onDiscardProposal: () => void;
  isCommitting: boolean;
}

export const ProposalBanner: React.FC<ProposalBannerProps> = ({
  proposal,
  members,
  currentMember,
  onOpenSignModal,
  onRejectProposal,
  onCommitOnChain,
  onDiscardProposal,
  isCommitting
}) => {
  const votes = proposal.votes || {};
  const approvedCount = Object.values(votes).filter(v => v.vote === 'APPROVED' || v.vote === 'APPROVE').length;
  const rejectedCount = Object.values(votes).filter(v => v.vote === 'REJECTED' || v.vote === 'REJECT').length;
  const quorumMet = approvedCount >= proposal.quorumThreshold;

  const currentMemberVote = votes[currentMember.id];
  const hasCurrentMemberVoted = !!currentMemberVote;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-cyan-950/50 p-5 shadow-2xl mb-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Side: Proposal Summary & Voting Bar */}
        <div className="space-y-3 max-w-2xl">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              <GitPullRequest className="w-3.5 h-3.5 text-indigo-400" />
              Consensus Proposal {proposal.targetVersionNumber}
            </span>
            <span className="text-xs text-slate-400">
              Proposed by <strong className="text-slate-200">{proposal.proposerName}</strong>
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">
              Base: {proposal.baseVersionNumber}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white leading-snug">
            {proposal.title}
          </h3>

          {/* Change bullets */}
          <div className="space-y-1">
            {proposal.summaryOfChanges.map((change, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{change}</span>
              </div>
            ))}
          </div>

          {/* Member Vote Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Votes ({approvedCount}/{proposal.quorumThreshold} required):</span>
            {members.map(member => {
              const voteRecord = votes[member.id];
              const isApproved = voteRecord?.vote === 'APPROVED' || voteRecord?.vote === 'APPROVE';
              const isRejected = voteRecord?.vote === 'REJECTED' || voteRecord?.vote === 'REJECT';
              
              return (
                <div 
                  key={member.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    isApproved 
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                      : isRejected
                        ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <img src={member.avatar} alt={member.name} className="w-4 h-4 rounded-full object-cover" />
                  <span>{member.name.split(' ')[0]}</span>
                  {isApproved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {isRejected && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                  {!isApproved && !isRejected && <Clock className="w-3 h-3 text-slate-500" />}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto self-stretch lg:self-center justify-center">
          
          {/* If Quorum Met -> Allow Committing to Blockchain */}
          {quorumMet ? (
            <button
              onClick={onCommitOnChain}
              disabled={isCommitting}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wide shadow-glow-emerald transition-all transform hover:scale-[1.02] disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>{isCommitting ? 'Hashing & Mining On-Chain...' : `Commit ${proposal.targetVersionNumber} On-Chain`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              {/* Member Voting Action */}
              {!hasCurrentMemberVoted ? (
                <div className="flex gap-2">
                  <button
                    onClick={onOpenSignModal}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-glow-indigo"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Sign as {currentMember.name.split(' ')[0]}</span>
                  </button>
                  <button
                    onClick={onRejectProposal}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-medium transition-all"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>You signed with wallet ({currentMember.walletAddress.substring(0, 6)}...)</span>
                </div>
              )}
            </>
          )}

          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400">
              {quorumMet 
                ? '✅ Quorum reached! Ready to write on-chain.' 
                : `Need ${proposal.quorumThreshold - approvedCount} more signature(s) to commit.`}
            </span>

            <button
              onClick={onDiscardProposal}
              className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
              title="Discard this draft proposal"
            >
              <Trash2 className="w-3 h-3" />
              <span>Discard</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
