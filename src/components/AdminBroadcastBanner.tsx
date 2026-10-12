import React from 'react';
import { Crown, BellRing, X, Volume2 } from 'lucide-react';
import { AdminBroadcastAlert } from '../types/bmf';

interface AdminBroadcastBannerProps {
  alert: AdminBroadcastAlert | null;
  onDismiss: () => void;
}

export const AdminBroadcastBanner: React.FC<AdminBroadcastBannerProps> = ({ alert, onDismiss }) => {
  if (!alert) return null;

  return (
    <aside 
      aria-label="Official Admin Broadcast Announcement"
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-top-6 duration-300"
    >
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d276b] via-[#091f57] to-[#041133] border-2 border-amber-400 text-white shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.4)] flex items-start justify-between gap-3 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Crown className="w-6 h-6 fill-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded shadow">
                Official Admin Broadcast
              </span>
              <span className="text-amber-300 font-bold text-xs">{alert.senderName}</span>
              <span className="text-[11px] text-blue-300 font-mono">({alert.senderEmail})</span>
              <span className="text-[10px] text-blue-400">• {alert.timestamp}</span>
            </div>

            <p className="text-sm font-semibold text-white leading-relaxed">
              {alert.message}
            </p>

            <div className="mt-2 text-[11px] text-amber-300 flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Chime broadcasted to all active members</span>
              <span className="italic font-bold ml-auto">&ldquo;Our love never fail&rdquo;</span>
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-blue-300 hover:text-white p-1 rounded-lg bg-black/40 hover:bg-black/60 transition-colors shrink-0"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
