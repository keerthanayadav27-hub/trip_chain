import React from 'react';
import { Trip, Member } from '../types';
import { calculateTripExpenses } from '../services/expenseSplitService';
import { 
  DollarSign, 
  PieChart, 
  Coins, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  Wallet,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface BudgetSectionProps {
  trip: Trip;
  members: Member[];
  currentMember: Member;
  onPayShare: (memberId: string, tripAmount: number) => void;
  isPayingShare: boolean;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({
  trip,
  members,
  currentMember,
  onPayShare,
  isPayingShare
}) => {
  const expenseSummary = calculateTripExpenses(trip, members.length);
  const isOverBudget = expenseSummary.remainingBudget < 0;
  const budgetPercent = Math.min(100, Math.round((expenseSummary.totalEstimated / (trip.totalBudget || 1)) * 100));

  const hasCurrentMemberPaid = currentMember.hasPaidShare;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Budget Tracking & Token Expense Splitting
            </h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
              Live Ledger
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time daily cost aggregation and group expense settlement using $TRIP utility test tokens.
          </p>
        </div>

        {/* Total Budget Card */}
        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800 self-start sm:self-auto">
          <div>
            <div className="text-[11px] uppercase font-semibold text-slate-400">Total Group Budget</div>
            <div className="text-lg font-bold text-white font-mono">${trip.totalBudget.toLocaleString()}</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-[11px] uppercase font-semibold text-slate-400">Total Estimated</div>
            <div className={`text-lg font-bold font-mono ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
              ${expenseSummary.totalEstimated.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Budget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Progress & Per-Day Breakdown */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Progress Bar Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Budget Consumption</span>
              <span className={`font-mono font-bold ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
                {budgetPercent}% ({isOverBudget ? `+$${Math.abs(expenseSummary.remainingBudget)} Over` : `$${expenseSummary.remainingBudget} Buffer`})
              </span>
            </div>
            
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  isOverBudget 
                    ? 'bg-rose-500' 
                    : budgetPercent > 85 
                      ? 'bg-amber-400' 
                      : 'bg-emerald-400'
                }`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>$0 Spent</span>
              <span>Target: ${trip.totalBudget}</span>
            </div>
          </div>

          {/* Daily Breakdown Cards */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Estimated Expenses by Day
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {expenseSummary.dailyBreakdown.map(day => (
                <div key={day.dayNumber} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[11px] font-bold text-indigo-400 uppercase">Day {day.dayNumber}</div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">${day.amount}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{day.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown Chips */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Category Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(expenseSummary.categoryBreakdown).map(([cat, amount]) => {
                if (amount === 0) return null;
                return (
                  <div key={cat} className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                    <span className="text-slate-400 text-[10px] block">{cat}</span>
                    <span className="font-mono font-bold text-slate-200">${amount}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Shared Expense Splitting with Test Tokens */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-slate-950/70 p-5 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                  <Coins className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Equal Split per Traveler</h4>
                  <p className="text-[11px] text-slate-400">Automated multi-member settlement in $TRIP</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-base font-extrabold text-cyan-300">
                  {expenseSummary.perPersonShareTRIP} $TRIP
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  ≈ ${expenseSummary.perPersonShareUSD} USD / person
                </div>
              </div>
            </div>

            {/* Member Payment Status List */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              {members.map(member => (
                <div 
                  key={member.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <div className="font-medium text-white flex items-center gap-1.5">
                        {member.name}
                        {member.id === currentMember.id && (
                          <span className="text-[9px] bg-indigo-500/30 text-indigo-300 px-1 rounded">You</span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Balance: {member.testTokenBalance} $TRIP
                      </div>
                    </div>
                  </div>

                  <div>
                    {member.hasPaidShare ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Settled
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pay Share Action for Active Persona */}
            <div className="pt-2">
              {!hasCurrentMemberPaid ? (
                <button
                  onClick={() => onPayShare(currentMember.id, expenseSummary.perPersonShareTRIP)}
                  disabled={isPayingShare || currentMember.testTokenBalance < expenseSummary.perPersonShareTRIP}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-glow-indigo transition-all disabled:opacity-50"
                >
                  <Wallet className="w-4 h-4" />
                  <span>
                    {isPayingShare 
                      ? 'Confirming $TRIP Transfer...' 
                      : `Pay My Share (${expenseSummary.perPersonShareTRIP} $TRIP)`}
                  </span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Your trip share has been settled in $TRIP</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
