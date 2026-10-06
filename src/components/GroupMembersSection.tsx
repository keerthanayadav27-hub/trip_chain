import React, { useState } from 'react';
import { Member, Proposal } from '../types';
import { 
  Users, 
  ShieldCheck, 
  Copy, 
  Check, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRightLeft, 
  Key,
  Coins
} from 'lucide-react';

interface GroupMembersSectionProps {
  members: Member[];
  currentMember: Member;
  proposal: Proposal | null;
  onSelectMember: (member: Member) => void;
  onOpenSignModalForMember?: (member: Member) => void;
}

export const GroupMembersSection: React.FC<GroupMembersSectionProps> = ({
  members,
  currentMember,
  proposal,
  onSelectMember
}) => {
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);

  const handleCopy = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddr(addr);
    setTimeout(() => setCopiedAddr(null), 2000);
  };

  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 6)}`;
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Group Members & Multi-Sig Approvals
            </h2>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
              3-Member Quorum
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Group members sign itinerary amendments with their cryptographic wallets. 2 of 3 approvals are required to write changes on-chain.
          </p>
        </div>

        {proposal && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400">Proposal Quorum:</span>
            <span className="font-mono font-bold text-indigo-300">
              {Object.values(proposal.votes || {}).filter(v => v.vote === 'APPROVED').length} / {proposal.quorumThreshold} Approved
            </span>
          </div>
        )}
      </div>

      {/* Collaborators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {members.map(member => {
          const isCurrentActive = member.id === currentMember.id;
          const voteInfo = proposal?.votes?.[member.id];
          const isApproved = voteInfo?.vote === 'APPROVED';
          const isRejected = voteInfo?.vote === 'REJECTED';

          return (
            <div 
              key={member.id}
              className={`rounded-xl border p-5 transition-all flex flex-col justify-between ${
                isCurrentActive 
                  ? 'bg-slate-900/90 border-indigo-500/50 shadow-glow-indigo' 
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top Row: Avatar & Status */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="relative">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" 
                    />
                    {isCurrentActive && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
                    )}
                  </div>

                  {proposal ? (
                    <div>
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Signed
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          Rejected
                        </span>
                      )}
                      {!isApproved && !isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          <Clock className="w-3 h-3 text-amber-400" />
                          Pending
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      In Sync
                    </span>
                  )}
                </div>

                {/* Name & Role */}
                <div className="mb-2">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-base font-bold text-white">{member.name}</h4>
                    {isCurrentActive && (
                      <span className="text-[10px] font-semibold bg-indigo-500/30 text-indigo-300 px-1.5 py-0.2 rounded">
                        Active You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{member.role}</p>
                </div>

                {/* Wallet Address & Copy */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 mb-3">
                  <span className="truncate">{shortenAddress(member.walletAddress)}</span>
                  <button
                    onClick={() => handleCopy(member.walletAddress)}
                    className="text-slate-400 hover:text-indigo-300 ml-2"
                    title="Copy wallet address"
                  >
                    {copiedAddr === member.walletAddress ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {/* Test Token Balance */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-cyan-400" />
                    $TRIP Balance:
                  </span>
                  <span className="font-mono font-semibold text-slate-200">
                    {member.testTokenBalance} $TRIP
                  </span>
                </div>
              </div>

              {/* Persona Switch Button (For Demo) */}
              {!isCurrentActive ? (
                <button
                  onClick={() => onSelectMember(member)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-indigo-900/50 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 border border-slate-700 text-xs font-medium transition-all"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Switch to {member.name.split(' ')[0]}</span>
                </button>
              ) : (
                <div className="w-full py-1.5 text-center text-[11px] text-emerald-400 font-mono">
                  ● Currently Active Wallet
                </div>
              )}

            </div>
          );
        })}
      </div>

    </section>
  );
};
