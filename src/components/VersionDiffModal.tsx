import React, { useState } from 'react';
import { ItineraryVersion, Activity } from '../types';
import { 
  X, 
  ArrowLeftRight, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Edit3, 
  DollarSign, 
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface VersionDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: ItineraryVersion[];
  initialV1?: string;
  initialV2?: string;
}

export const VersionDiffModal: React.FC<VersionDiffModalProps> = ({
  isOpen,
  onClose,
  versions,
  initialV1,
  initialV2
}) => {
  if (!isOpen || versions.length < 1) return null;

  // Default to comparing the latest two versions if available, or first and last
  const defaultV1 = initialV1 || (versions.length > 1 ? versions[0].versionNumber : versions[0].versionNumber);
  const defaultV2 = initialV2 || (versions.length > 1 ? versions[versions.length - 1].versionNumber : versions[0].versionNumber);

  const [v1Number, setV1Number] = useState<string>(defaultV1);
  const [v2Number, setV2Number] = useState<string>(defaultV2);

  const ver1 = versions.find(v => v.versionNumber === v1Number) || versions[0];
  const ver2 = versions.find(v => v.versionNumber === v2Number) || versions[versions.length - 1];

  const getTripCost = (trip: typeof ver1.tripSnapshot) => {
    return trip.days.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + (a.estimatedCost || 0), 0), 0);
  };

  const cost1 = getTripCost(ver1.tripSnapshot);
  const cost2 = getTripCost(ver2.tripSnapshot);
  const costDelta = cost2 - cost1;

  // Compute diff per day
  const maxDays = Math.max(ver1.tripSnapshot.days.length, ver2.tripSnapshot.days.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-700 bg-[#0d121f] p-6 shadow-2xl flex flex-col text-slate-200 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Consensus Version Diff Inspector
              </h3>
              <p className="text-xs text-slate-400">
                Compare approved itinerary changes and cryptographic state deltas
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

        {/* Version Pickers & Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 border-b border-slate-800 items-center">
          
          {/* Base Version Picker */}
          <div className="md:col-span-5 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <label className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
              Base Version (Left)
            </label>
            <select
              value={v1Number}
              onChange={e => setV1Number(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            >
              {versions.map(v => (
                <option key={v.versionNumber} value={v.versionNumber}>
                  {v.versionNumber} - Block #{v.blockNumber} ({v.changeSummary.substring(0, 30)}...)
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs flex justify-between text-slate-400">
              <span>Cost: <strong className="text-white font-mono">${cost1}</strong></span>
              <span className="font-mono text-[10px] text-indigo-300 truncate max-w-[150px]">{ver1.hash.substring(0, 14)}...</span>
            </div>
          </div>

          {/* Delta Center Indicator */}
          <div className="md:col-span-2 text-center">
            <div className="inline-flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Budget Delta</span>
              <span className={`font-mono text-xs font-bold ${
                costDelta > 0 ? 'text-rose-400' : costDelta < 0 ? 'text-emerald-400' : 'text-slate-300'
              }`}>
                {costDelta > 0 ? `+$${costDelta}` : costDelta < 0 ? `-$${Math.abs(costDelta)}` : '$0'}
              </span>
            </div>
          </div>

          {/* Target Version Picker */}
          <div className="md:col-span-5 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <label className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
              Compare With (Right)
            </label>
            <select
              value={v2Number}
              onChange={e => setV2Number(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            >
              {versions.map(v => (
                <option key={v.versionNumber} value={v.versionNumber}>
                  {v.versionNumber} - Block #{v.blockNumber} ({v.changeSummary.substring(0, 30)}...)
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs flex justify-between text-slate-400">
              <span>Cost: <strong className="text-white font-mono">${cost2}</strong></span>
              <span className="font-mono text-[10px] text-cyan-300 truncate max-w-[150px]">{ver2.hash.substring(0, 14)}...</span>
            </div>
          </div>

        </div>

        {/* Scrollable Day-by-Day Diff Section */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          {Array.from({ length: maxDays }).map((_, dayIdx) => {
            const dayNum = dayIdx + 1;
            const day1 = ver1.tripSnapshot.days.find(d => d.dayNumber === dayNum);
            const day2 = ver2.tripSnapshot.days.find(d => d.dayNumber === dayNum);

            const isThemeChanged = day1?.theme !== day2?.theme;

            return (
              <div key={dayNum} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                
                {/* Day Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400 uppercase">
                      Day {dayNum}
                    </span>
                    {isThemeChanged && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                        Theme Modified
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{day2?.date || day1?.date}</span>
                </div>

                {/* Side-by-side or combined activity breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Left Column: Version 1 activities */}
                  <div className="space-y-2">
                    <div className="font-semibold text-slate-400 text-[11px] uppercase">
                      {ver1.versionNumber} ({day1?.theme || 'N/A'})
                    </div>
                    {day1?.activities.map((act) => {
                      // Check if matching in day2
                      const matchedInDay2 = day2?.activities.find(a => a.id === act.id || a.title === act.title);
                      const isRemoved = !matchedInDay2;
                      const isModified = matchedInDay2 && (matchedInDay2.estimatedCost !== act.estimatedCost || matchedInDay2.time !== act.time);

                      return (
                        <div 
                          key={act.id} 
                          className={`p-2.5 rounded-lg border transition-all ${
                            isRemoved 
                              ? 'bg-rose-950/30 border-rose-500/30 text-rose-200 line-through opacity-70' 
                              : isModified 
                                ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' 
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-[10px] text-slate-400">{act.time}</span>
                            <span className="font-mono font-semibold">${act.estimatedCost}</span>
                          </div>
                          <div className="font-medium text-white">{act.title}</div>
                          <div className="text-[11px] text-slate-400 truncate">{act.location}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Version 2 activities */}
                  <div className="space-y-2">
                    <div className="font-semibold text-cyan-400 text-[11px] uppercase">
                      {ver2.versionNumber} ({day2?.theme || 'N/A'})
                    </div>
                    {day2?.activities.map((act) => {
                      const matchedInDay1 = day1?.activities.find(a => a.id === act.id || a.title === act.title);
                      const isAdded = !matchedInDay1;
                      const isModified = matchedInDay1 && (matchedInDay1.estimatedCost !== act.estimatedCost || matchedInDay1.time !== act.time);

                      return (
                        <div 
                          key={act.id} 
                          className={`p-2.5 rounded-lg border transition-all ${
                            isAdded 
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                              : isModified 
                                ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' 
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-[10px] text-slate-400">{act.time}</span>
                            <div className="flex items-center gap-1.5">
                              {isAdded && (
                                <span className="text-[9px] uppercase px-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                  + Added
                                </span>
                              )}
                              {isModified && (
                                <span className="text-[9px] uppercase px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                                  ~ Modified
                                </span>
                              )}
                              <span className="font-mono font-semibold text-emerald-300">${act.estimatedCost}</span>
                            </div>
                          </div>
                          <div className="font-medium text-white">{act.title}</div>
                          <div className="text-[11px] text-slate-400 truncate">{act.location}</div>
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-400" /> Added</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-400" /> Modified</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-400" /> Removed</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
          >
            Close Diff Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
