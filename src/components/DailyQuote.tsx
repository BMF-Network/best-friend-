import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Quote, 
  Heart, 
  Copy, 
  Check, 
  RefreshCw, 
  Volume2, 
  Share2,
  Calendar
} from 'lucide-react';
import { playAdminBroadcastChime } from '../utils/auth';

interface PeaceQuote {
  id: string;
  text: string;
  author: string;
  theme: 'Peace & Harmony' | 'Unconditional Love' | 'Helping Others' | 'Patience & Forgiveness' | 'Brotherhood';
  reference: string;
}

export const DAILY_PEACE_QUOTES: PeaceQuote[] = [
  {
    id: 'pq-1',
    text: 'Love never fails. It always protects, always trusts, always hopes, and always perseveres in times of trial.',
    author: 'BMF Founding Charter',
    theme: 'Unconditional Love',
    reference: '1 Corinthians 13:8 · Foundation Motto 2021',
  },
  {
    id: 'pq-2',
    text: 'Where there is anger, let us sow gentleness. Where there is division, let us build bridges of peaceful understanding.',
    author: 'Marcus Sterling & Family Elders',
    theme: 'Peace & Harmony',
    reference: 'Covenant of Fraternal Unity',
  },
  {
    id: 'pq-3',
    text: 'The highest calling of our brotherhood is to lift the fallen, comfort the grieving, and share our bread with the hungry.',
    author: 'Alex Vance',
    theme: 'Helping Others',
    reference: 'Shelter Outreach & Benevolence Drive',
  },
  {
    id: 'pq-4',
    text: 'Peace is not merely the absence of conflict; it is the presence of unconditional grace, mutual respect, and brotherly affection.',
    author: 'Concoituze & Concorde Ruhungande',
    theme: 'Peace & Harmony',
    reference: 'Super Admin Peace Assembly',
  },
  {
    id: 'pq-5',
    text: 'Forgiveness is the key that unlocks the door of resentment and opens the holy sanctuary of family fellowship.',
    author: 'Sarah Laurent',
    theme: 'Patience & Forgiveness',
    reference: 'Welfare & Reconciliation Circle',
  },
  {
    id: 'pq-6',
    text: 'Let no brother or sister walk alone. In joy we celebrate together; in sorrow we carry each other’s burden.',
    author: 'Jordan Rivera',
    theme: 'Brotherhood',
    reference: 'Youth Mentorship Fellowship',
  },
  {
    id: 'pq-7',
    text: 'Blessed are the peacemakers, for their gentle words turn away wrath and preserve the sanctuary of home.',
    author: 'Family Assembly Beatitude',
    theme: 'Peace & Harmony',
    reference: 'Weekly Wednesday Assembly Meditation',
  },
  {
    id: 'pq-8',
    text: 'True love does not keep a record of wrongs. It covers all shortcomings with compassion and endures through every season.',
    author: 'The Best Mate Family Wisdom',
    theme: 'Unconditional Love',
    reference: 'Established 2021 · Unfailing Bond',
  },
];

export const DailyQuote: React.FC = () => {
  // Compute daily quote index based on the day of year
  const getTodayIndex = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - startOfYear.getTime()) + ((startOfYear.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % DAILY_PEACE_QUOTES.length;
  };

  const [currentIndex, setCurrentIndex] = useState(getTodayIndex);
  const [copied, setCopied] = useState(false);
  const [reflectionCount, setReflectionCount] = useState(48);
  const [hasReflected, setHasReflected] = useState(false);

  const currentQuote = DAILY_PEACE_QUOTES[currentIndex];

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleNextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % DAILY_PEACE_QUOTES.length);
  };

  const handleCopyQuote = () => {
    const textToCopy = `"${currentQuote.text}" — ${currentQuote.author} (${currentQuote.reference}) · B M F "Our love never fail"`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReflect = () => {
    if (!hasReflected) {
      setReflectionCount((c) => c + 1);
      setHasReflected(true);
      playAdminBroadcastChime();
    }
  };

  const handlePlayChime = () => {
    playAdminBroadcastChime();
  };

  return (
    <section 
      aria-label="Daily Peace and Harmony Reflection"
      className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#091e57] via-[#06143b] to-[#040e2d] border-2 border-amber-500/70 shadow-[0_15px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(245,158,11,0.2)] p-6 sm:p-7 text-white">
        {/* Decorative background glow accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-600/15 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-blue-900/80 text-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-blue-900/60 border border-amber-500/50 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              Daily Peace &amp; Harmony Reflection
            </span>

            <span className="text-blue-300 text-[11px] flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-950/80 border border-blue-800 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
              Theme: {currentQuote.theme}
            </span>
            <span className="text-[10px] text-amber-400 font-semibold italic hidden md:inline">
              &ldquo;Our love never fail&rdquo;
            </span>
          </div>
        </div>

        {/* Quote Content Row */}
        <div className="pt-5 pb-3 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-9 flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/60 items-center justify-center shrink-0 shadow-inner">
              <Quote className="w-6 h-6 text-amber-400 rotate-180" />
            </div>

            <div className="space-y-2">
              <blockquote className="font-display text-lg sm:text-xl lg:text-2xl font-black text-white leading-snug tracking-tight">
                &ldquo;{currentQuote.text}&rdquo;
              </blockquote>

              <div className="flex flex-wrap items-center gap-2 text-xs text-blue-200">
                <span className="font-extrabold text-amber-300">
                  — {currentQuote.author}
                </span>
                <span className="text-blue-400">•</span>
                <span className="text-blue-300/90 font-medium">
                  {currentQuote.reference}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Actions */}
          <div className="lg:col-span-3 flex flex-wrap lg:flex-col justify-end gap-2">
            <div className="flex items-center gap-2 w-full">
              {/* Reflect / Amen Heart Button */}
              <button
                type="button"
                onClick={handleReflect}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  hasReflected
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-md shadow-rose-950'
                    : 'bg-[#071740] border-blue-800 text-blue-200 hover:border-amber-400 hover:text-white'
                }`}
                title="Say Amen & Meditate on Peace"
              >
                <Heart className={`w-3.5 h-3.5 ${hasReflected ? 'fill-rose-400 text-rose-400' : 'text-amber-400'}`} />
                <span>{hasReflected ? 'Amen ❤️' : 'Amen / Reflect'}</span>
                <span className="text-[10px] text-amber-300 font-extrabold ml-0.5">({reflectionCount})</span>
              </button>

              {/* Audio Chime Button */}
              <button
                type="button"
                onClick={handlePlayChime}
                className="p-2 rounded-xl bg-[#071740] border border-blue-800 text-blue-300 hover:text-amber-400 hover:border-amber-500/60 transition-all shrink-0"
                title="Play Peace Harmony Chime"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            <div className="flex items-center gap-2 w-full">
              {/* Copy Quote Button */}
              <button
                type="button"
                onClick={handleCopyQuote}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#071740] border border-blue-800 text-xs font-bold text-blue-200 hover:border-amber-400 hover:text-white transition-all"
                title="Copy Reflection to Clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? 'Copied ✓' : 'Share Quote'}</span>
              </button>

              {/* Cycle to Next Quote */}
              <button
                type="button"
                onClick={handleNextQuote}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-extrabold hover:opacity-95 shadow-md shadow-amber-950/40 transition-all shrink-0 cursor-pointer"
                title="Explore Next Reflection"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
