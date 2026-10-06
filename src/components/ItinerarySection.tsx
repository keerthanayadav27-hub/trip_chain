import React, { useState } from 'react';
import { Trip, DayPlan, Activity } from '../types';
import { ActivityCard } from './ActivityCard';
import { 
  Sparkles, 
  Plus, 
  RotateCw, 
  Calendar, 
  DollarSign, 
  Compass, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface ItinerarySectionProps {
  trip: Trip;
  onRegenerateDay: (dayNumber: number) => void;
  onAddActivity: (dayNumber: number) => void;
  onEditActivity: (dayNumber: number, activity: Activity) => void;
  onDeleteActivity: (dayNumber: number, activityId: string) => void;
  isRegeneratingDay: number | null; // dayNumber currently generating
}

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  trip,
  onRegenerateDay,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  isRegeneratingDay
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  const selectedDay = trip.days.find(d => d.dayNumber === selectedDayNumber) || trip.days[0];

  const getDayCost = (day: DayPlan) => {
    return day.activities.reduce((sum, a) => sum + (a.estimatedCost || 0), 0);
  };

  return (
    <section className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              Collaborative 3-Day Itinerary
            </h2>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
              Independently Editable
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Each day can be independently regenerated with custom AI prompts or edited without rebuilding the entire trip.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'single'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Day-by-Day View
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Full 3-Day Overview
          </button>
        </div>
      </div>

      {/* Day Selector Tabs (if single view) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {trip.days.map(day => {
          const isSelected = selectedDayNumber === day.dayNumber;
          const dayCost = getDayCost(day);
          const isCurrentRegenerating = isRegeneratingDay === day.dayNumber;

          return (
            <button
              key={day.dayNumber}
              onClick={() => {
                setSelectedDayNumber(day.dayNumber);
                if (viewMode === 'all') setViewMode('single');
              }}
              className={`relative text-left p-4 rounded-xl border transition-all duration-200 ${
                isSelected && viewMode === 'single'
                  ? 'bg-slate-900 border-indigo-500/70 shadow-glow-indigo'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isSelected ? 'text-indigo-400' : 'text-slate-400'
                }`}>
                  Day {day.dayNumber}
                </span>
                <span className="font-mono text-xs text-slate-300 font-semibold bg-slate-800 px-2 py-0.5 rounded">
                  ${dayCost}
                </span>
              </div>

              <div className="font-medium text-sm text-slate-100 line-clamp-1 mb-1">
                {day.theme}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  {day.date}
                </span>
                <span>{day.activities.length} activities</span>
              </div>

              {isCurrentRegenerating && (
                <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 text-indigo-300 text-xs font-semibold">
                  <RotateCw className="w-4 h-4 animate-spin text-indigo-400" />
                  Regenerating Day {day.dayNumber}...
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Single Day View vs All Days View */}
      {viewMode === 'single' ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
          
          {/* Day Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                <span>Day {selectedDay.dayNumber}</span>
                <span>•</span>
                <span className="text-slate-300">{selectedDay.date}</span>
                <span>•</span>
                <span className="text-emerald-400 font-mono font-bold">${getDayCost(selectedDay)} Est.</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {selectedDay.theme}
              </h3>
            </div>

            {/* Actions: Regenerate Day & Add Activity */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onRegenerateDay(selectedDay.dayNumber)}
                disabled={isRegeneratingDay !== null}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
                title="Regenerate only this day with custom AI prompt adjustments"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Regenerate Day {selectedDay.dayNumber}</span>
              </button>

              <button
                onClick={() => onAddActivity(selectedDay.dayNumber)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>Add Activity</span>
              </button>
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-3">
            {selectedDay.activities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                dayNumber={selectedDay.dayNumber}
                onEdit={(act) => onEditActivity(selectedDay.dayNumber, act)}
                onDelete={(id) => onDeleteActivity(selectedDay.dayNumber, id)}
              />
            ))}
          </div>

        </div>
      ) : (
        /* Full 3-Day Column View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {trip.days.map(day => (
            <div key={day.dayNumber} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-xs font-bold uppercase text-indigo-400">Day {day.dayNumber}</div>
                  <div className="text-sm font-semibold text-white line-clamp-1">{day.theme}</div>
                </div>
                <button
                  onClick={() => onRegenerateDay(day.dayNumber)}
                  className="p-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/70 border border-indigo-500/30 text-indigo-300"
                  title="Regenerate this day"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                </button>
              </div>

              <div className="space-y-3">
                {day.activities.map(activity => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    dayNumber={day.dayNumber}
                    onEdit={(act) => onEditActivity(day.dayNumber, act)}
                    onDelete={(id) => onDeleteActivity(day.dayNumber, id)}
                  />
                ))}
              </div>

              <button
                onClick={() => onAddActivity(day.dayNumber)}
                className="w-full py-2 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500/50 text-slate-400 hover:text-indigo-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Activity to Day {day.dayNumber}</span>
              </button>

            </div>
          ))}
        </div>
      )}

    </section>
  );
};
