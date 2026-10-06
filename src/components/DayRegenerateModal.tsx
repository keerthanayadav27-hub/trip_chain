import React, { useState } from 'react';
import { Sparkles, X, Wand2, Compass } from 'lucide-react';

interface DayRegenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  destination: string;
  onConfirm: (dayNumber: number, customInstructions: string) => void;
  isGenerating: boolean;
}

const PRESET_INSTRUCTIONS = [
  'Focus on authentic street food, ramen & culinary hidden gems',
  'Make this day budget-friendly with free scenic spots and low costs',
  'More open-air scenic nature, coastal views and hiking',
  'Slow, relaxing pace with gardens, tea houses and wellness',
  'Add lively evening nightlife, craft cocktail bars and music'
];

export const DayRegenerateModal: React.FC<DayRegenerateModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  destination,
  onConfirm,
  isGenerating
}) => {
  const [instructions, setInstructions] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(dayNumber, instructions);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0d121f] p-6 shadow-2xl space-y-5 text-slate-200 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Regenerate Day {dayNumber} with AI
              </h3>
              <p className="text-xs text-slate-400">
                Independent regeneration without modifying Day 1 or Day 3
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Custom AI Guidance (Optional)
            </label>
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder={`e.g. "Focus on authentic street food, replace tourist traps, and keep costs under $50 for this day in ${destination}"`}
              className="w-full h-24 rounded-xl bg-slate-950 border border-slate-700 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Quick preset chips */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_INSTRUCTIONS.map(preset => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setInstructions(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border text-left transition-all ${
                    instructions === preset
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-glow-indigo transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Day {dayNumber}...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Regenerate Day {dayNumber}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
