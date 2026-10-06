import React from 'react';
import { Activity, ActivityCategory } from '../types';
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Edit3, 
  Trash2,
  Utensils,
  Camera,
  Landmark,
  Compass,
  Moon,
  TreePine,
  ShoppingBag
} from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  dayNumber: number;
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
  canEdit?: boolean;
}

export const getCategoryStyles = (category: ActivityCategory) => {
  switch (category) {
    case 'Food':
      return {
        bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        icon: Utensils,
        dot: 'bg-amber-400'
      };
    case 'Culture':
      return {
        bg: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
        icon: Landmark,
        dot: 'bg-violet-400'
      };
    case 'Sightseeing':
      return {
        bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
        icon: Camera,
        dot: 'bg-cyan-400'
      };
    case 'Nightlife':
      return {
        bg: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30',
        icon: Moon,
        dot: 'bg-fuchsia-400'
      };
    case 'Outdoor':
      return {
        bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        icon: TreePine,
        dot: 'bg-emerald-400'
      };
    case 'Shopping':
      return {
        bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        icon: ShoppingBag,
        dot: 'bg-rose-400'
      };
    default:
      return {
        bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
        icon: Compass,
        dot: 'bg-indigo-400'
      };
  }
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  dayNumber: _dayNumber,
  onEdit,
  onDelete,
  canEdit = true
}) => {
  const catStyle = getCategoryStyles(activity.category);
  const IconComponent = catStyle.icon;

  return (
    <div className="group relative rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-850 hover:border-slate-700/80 p-4 transition-all duration-200">
      
      {/* Top Header: Time, Category, Actions */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
            <Clock className="w-3 h-3 text-cyan-400" />
            {activity.time}
          </span>
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${catStyle.bg}`}>
            <IconComponent className="w-3 h-3" />
            {activity.category}
          </span>
        </div>

        {/* Cost & Edit/Delete buttons */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
            {activity.estimatedCost > 0 ? `$${activity.estimatedCost}` : 'Free'}
          </span>

          {canEdit && (
            <div className="flex items-center opacity-60 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(activity)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Edit Activity"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(activity.id)}
                className="p-1 rounded hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition-colors"
                title="Remove Activity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-white group-hover:text-indigo-200 transition-colors mb-1">
        {activity.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed mb-3">
        {activity.description}
      </p>

      {/* Footer: Location & Highlight */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
          <span className="truncate max-w-[220px]">{activity.location}</span>
        </div>

        {activity.highlight && (
          <div className="flex items-center gap-1 text-indigo-300 font-medium bg-indigo-500/10 px-2 py-0.5 rounded">
            <Sparkles className="w-3 h-3 text-indigo-400 flex-shrink-0" />
            <span className="truncate max-w-[260px]">{activity.highlight}</span>
          </div>
        )}
      </div>

    </div>
  );
};
