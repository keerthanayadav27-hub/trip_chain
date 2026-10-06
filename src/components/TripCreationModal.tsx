import React, { useState } from 'react';
import { PRESET_TRIPS } from '../data/initialData';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  X, 
  Plane, 
  Wand2,
  Check
} from 'lucide-react';

interface TripCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: {
    destination: string;
    startDate: string;
    endDate: string;
    totalBudget: number;
    interests: string[];
  }) => void;
  isGenerating: boolean;
}

const ALL_INTERESTS = [
  'Culture',
  'Gastronomy',
  'Nightlife',
  'Sightseeing',
  'Outdoor',
  'Shopping',
  'Art & Design',
  'Relaxation'
];

export const TripCreationModal: React.FC<TripCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isGenerating
}) => {
  const [destination, setDestination] = useState('Tokyo');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-18');
  const [totalBudget, setTotalBudget] = useState(1500);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Culture',
    'Gastronomy',
    'Sightseeing'
  ]);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_TRIPS[0]) => {
    setDestination(preset.destination);
    setTotalBudget(preset.budget);
    setSelectedInterests(preset.interests);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    onSubmit({
      destination: destination.trim(),
      startDate,
      endDate,
      totalBudget: Number(totalBudget) || 1500,
      interests: selectedInterests.length > 0 ? selectedInterests : ['Culture', 'Gastronomy']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl max-h-[90vh] rounded-2xl border border-slate-700 bg-[#0d121f] p-6 shadow-2xl overflow-y-auto text-slate-200 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Plan New Trip with AI Consensus
              </h3>
              <p className="text-xs text-slate-400">
                AI generates a 3-day baseline itinerary ready for group collaboration
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

        {/* Quick Presets for Hackathon Demos */}
        <div className="pt-4">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Instant Demo Presets (1-Click Fill)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_TRIPS.map(preset => {
              const isSelected = destination.toLowerCase() === preset.destination.toLowerCase();
              return (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500/60 shadow-glow-indigo text-white'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{preset.destination}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                      ${preset.budget}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {preset.country}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Destination City</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-rose-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="e.g. Tokyo, Paris, Bali, New York, Rome, London..."
                className="w-full rounded-xl bg-slate-950 border border-slate-700 pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Total Budget ($ USD)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  min="200"
                  step="50"
                  required
                  value={totalBudget}
                  onChange={e => setTotalBudget(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 pl-8 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Interests Tags */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Group Interests & Focus</label>
            <div className="flex flex-wrap gap-2">
              {ALL_INTERESTS.map(interest => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500/80 text-indigo-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generation Progress Display if Generating */}
          {isGenerating && (
            <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
                <span className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 animate-spin text-cyan-400" />
                  Generating 3-Day Realistic Itinerary...
                </span>
                <span className="font-mono text-[10px]">Step 3 of 3</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Optimizing morning, afternoon & evening activities for {destination}, calculating local costs, and preparing genesis consensus state.
              </p>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-teal-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold shadow-glow-indigo transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Itinerary with AI</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
