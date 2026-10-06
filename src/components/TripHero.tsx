import React from 'react';
import { Trip, OnChainRecord } from '../types';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  CalendarPlus, 
  GitFork, 
  Sparkles,
  ArrowRight,
  Clock,
  Layers
} from 'lucide-react';

interface TripHeroProps {
  trip: Trip;
  onChainRecord: OnChainRecord | null;
  totalEstimated: number;
  onExportCalendar: () => void;
  onOpenVerification: () => void;
  onProposeChange: () => void;
  onOpenDiffModal: () => void;
  hasActiveProposal: boolean;
  versionCount: number;
}

export const TripHero: React.FC<TripHeroProps> = ({
  trip,
  onChainRecord,
  totalEstimated,
  onExportCalendar,
  onOpenVerification,
  onProposeChange,
  onOpenDiffModal,
  hasActiveProposal,
  versionCount
}) => {
  const budgetPercent = Math.min(100, Math.round((totalEstimated / (trip.totalBudget || 1)) * 100));
  const isOverBudget = totalEstimated > trip.totalBudget;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl mb-8">
      {/* Background Cover Image with Gradient Mask */}
      <div className="absolute inset-0 z-0">
        <img 
          src={trip.coverImage || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'} 
          alt={trip.destination} 
          className="w-full h-full object-cover object-center opacity-25 filter blur-[1px] scale-105 transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/70 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 p-6 sm:p-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              AI Consensus Itinerary
            </span>

            {onChainRecord ? (
              <button 
                onClick={onOpenVerification}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all"
                title="Click to view cryptographic proof on-chain"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified {onChainRecord.currentVersion} • Block #{onChainRecord.blockNumber}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Draft Pending Genesis Commit
              </span>
            )}

            {hasActiveProposal && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                Proposal in Voting
              </span>
            )}
          </div>

          {/* Quick Version Timeline Badge */}
          {versionCount > 1 && (
            <button
              onClick={onOpenDiffModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{versionCount} On-Chain Versions</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>

        {/* Title and Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
              {trip.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span className="font-semibold text-white">{trip.destination}</span>, {trip.country}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>{trip.startDate} – {trip.endDate}</span>
                <span className="text-slate-500 font-mono text-xs">(3 Days)</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Budget: <strong className="text-white">${trip.totalBudget.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Interest Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {trip.interests.map(interest => (
                <span 
                  key={interest}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/90 text-slate-300 border border-slate-700/60"
                >
                  #{interest}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons & Budget Meter */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Quick Budget Meter */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 backdrop-blur-md">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-400">Estimated Expenses</span>
                <span className={`font-mono font-bold ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ${totalEstimated} / ${trip.totalBudget}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    isOverBudget 
                      ? 'bg-rose-500 shadow-glow-rose' 
                      : budgetPercent > 80 
                        ? 'bg-amber-400' 
                        : 'bg-emerald-400'
                  }`}
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 font-mono">
                <span>{budgetPercent}% allocated</span>
                <span>{isOverBudget ? `+$${totalEstimated - trip.totalBudget} over` : `$${trip.totalBudget - totalEstimated} remaining`}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <button
                onClick={onExportCalendar}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all shadow-sm"
                title="Download standard .ics file for Google, Apple or Outlook calendar"
              >
                <CalendarPlus className="w-4 h-4 text-cyan-400" />
                <span>Export Calendar</span>
              </button>

              <button
                onClick={onOpenVerification}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-all shadow-sm"
                title="Inspect on-chain Merkle root hash & signatures"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify On-Chain</span>
              </button>

              <button
                onClick={onProposeChange}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-glow-indigo"
                title="Suggest a new activity or edit existing schedule"
              >
                <GitFork className="w-4 h-4" />
                <span>Propose Change</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
