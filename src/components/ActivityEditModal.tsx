import React, { useState, useEffect } from 'react';
import { Activity, ActivityCategory } from '../types';
import { X, Save, Plus, Edit3, DollarSign, Clock, MapPin } from 'lucide-react';

interface ActivityEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  activityToEdit?: Activity | null;
  onSave: (dayNumber: number, activity: Activity) => void;
}

const CATEGORIES: ActivityCategory[] = [
  'Culture',
  'Food',
  'Sightseeing',
  'Nightlife',
  'Outdoor',
  'Shopping',
  'Activity'
];

export const ActivityEditModal: React.FC<ActivityEditModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  activityToEdit,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00 AM - 12:30 PM');
  const [category, setCategory] = useState<ActivityCategory>('Culture');
  const [location, setLocation] = useState('');
  const [cost, setCost] = useState<number>(25);
  const [description, setDescription] = useState('');
  const [highlight, setHighlight] = useState('');

  useEffect(() => {
    if (activityToEdit) {
      setTitle(activityToEdit.title);
      setTime(activityToEdit.time);
      setCategory(activityToEdit.category);
      setLocation(activityToEdit.location);
      setCost(activityToEdit.estimatedCost);
      setDescription(activityToEdit.description);
      setHighlight(activityToEdit.highlight || '');
    } else {
      setTitle('');
      setTime('10:00 AM - 12:30 PM');
      setCategory('Culture');
      setLocation('');
      setCost(25);
      setDescription('');
      setHighlight('');
    }
  }, [activityToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const activity: Activity = {
      id: activityToEdit ? activityToEdit.id : `act-${dayNumber}-${Date.now()}`,
      title: title.trim(),
      time: time.trim(),
      category,
      location: location.trim() || 'Central District',
      estimatedCost: Number(cost) || 0,
      description: description.trim() || 'Custom group scheduled event.',
      highlight: highlight.trim() || undefined
    };

    onSave(dayNumber, activity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0d121f] p-6 shadow-2xl space-y-4 text-slate-200 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              {activityToEdit ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {activityToEdit ? 'Edit Activity' : 'Add New Activity'}
              </h3>
              <p className="text-xs text-slate-400">
                Scheduled for Day {dayNumber} • Proposes a consensus amendment
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

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Activity Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Roppongi Hills Sunset Observatory & Cocktail"
              className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Time Slot</label>
              <input
                type="text"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="02:30 PM - 05:00 PM"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ActivityCategory)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Roppongi Hills Tower"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Estimated Cost ($ USD)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={cost}
                onChange={e => setCost(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief details about what the group will experience..."
              className="w-full h-18 rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Key Highlight / Secret Tip</label>
            <input
              type="text"
              value={highlight}
              onChange={e => setHighlight(e.target.value)}
              placeholder="e.g. Tokyo Tower glowing crimson at sunset"
              className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-glow-indigo transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Propose Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
