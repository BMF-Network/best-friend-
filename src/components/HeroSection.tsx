import React from 'react';
import { ShieldCheck, Video, Heart, Sparkles, MessageSquare } from 'lucide-react';
import { BMFUser } from '../types/bmf';

interface HeroSectionProps {
  currentUser: BMFUser | null;
  onOpenAuth: () => void;
  liveCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  onOpenAuth,
  liveCount,
}) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Serving Since 2021 · Peace &amp; Harmony
            </div>

            {/* Slogan Banner */}
            <div className="border-l-4 border-amber-400 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent px-4 py-2.5 rounded-r-2xl max-w-xl">
              <span className="font-display text-2xl sm:text-3xl font-extrabold text-amber-300 italic tracking-wide">
                &ldquo;Our love never fail&rdquo;
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] font-display">
              B M F
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 mt-1">
                The Best Mate Family
              </span>
            </h1>

            <p className="text-base sm:text-lg text-blue-200/90 max-w-2xl leading-relaxed">
              A united community family founded in 2021, dedicated to helping others, nurturing unshakeable peace and harmony among our members, and loving each other unconditionally.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#meeting"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-950/40 hover:opacity-95 hover:-translate-y-0.5 transition-all"
              >
                <Video className="w-4 h-4 text-slate-950" />
                Attend Lounge Call
              </a>

              {!currentUser ? (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#071740] border border-amber-500/50 text-white font-bold text-sm hover:bg-[#0c2466] hover:border-amber-400 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Sign In with Gmail
                </button>
              ) : (
                <a
                  href="#chat"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#071740] border border-blue-700 text-white font-bold text-sm hover:bg-[#0c2466] hover:border-amber-400 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-blue-300" />
                  Open Live Messages
                </a>
              )}

              <a
                href="#announcements"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-950/40 border border-blue-900 text-blue-300 hover:text-white font-semibold text-sm transition-colors"
              >
                View Bulletins
              </a>
            </div>

            {/* Verified Access Note */}
            <div className="pt-2 text-xs text-blue-300/80 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Super Admin governance by <strong className="text-amber-300 font-semibold">concoituze@gmail.com</strong> &amp; <strong className="text-amber-300 font-semibold">concorderuhungande@gmail.com</strong>
              </span>
            </div>
          </div>

          {/* Hero Right: Family Crest Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md p-7 rounded-3xl bg-gradient-to-b from-[#091e57] via-[#06143b] to-[#03091e] border-2 border-amber-500/80 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(245,158,11,0.25)] text-center relative overflow-hidden group">
              <div className="inline-block px-3.5 py-1 rounded-full bg-blue-950/80 border border-amber-500/40 text-[11px] font-black uppercase text-amber-400 tracking-wider mb-5">
                Official Family Crest · EST. 2021
              </div>

              {/* Large Crest SVG */}
              <div className="w-32 h-32 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-950 border-2 border-amber-400 flex items-center justify-center shadow-2xl shadow-black/80 group-hover:scale-105 transition-transform duration-300">
                <svg viewBox="0 0 100 100" className="w-20 h-20 fill-amber-400">
                  <path d="M25 20 H45 V75 L35 85 L25 75 Z" />
                  <path d="M55 20 H75 V75 L65 85 L55 75 Z" />
                  <path d="M35 20 L50 48 L65 20 Z" />
                  <path d="M15 25 H35 C50 25 50 48 35 48 H15 Z" />
                  <path d="M15 48 H38 C55 48 55 75 38 75 H15 Z" />
                  <path d="M65 25 H90 V38 H78 V50 H88 V62 H78 V75 H65 Z" />
                </svg>
              </div>

              <h3 className="font-display text-2xl font-black text-white tracking-wide">
                B M F
              </h3>
              <p className="text-xs uppercase tracking-widest text-blue-200 font-bold mt-0.5">
                The Best Mate Family
              </p>
              
              <div className="mt-2 text-sm font-extrabold text-amber-400 italic">
                &ldquo;Our love never fail&rdquo;
              </div>

              <div className="mt-6 pt-5 border-t border-blue-900/80 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-blue-300 uppercase block font-semibold">Founded</span>
                  <strong className="text-white font-bold text-sm">2021</strong>
                </div>
                <div className="border-x border-blue-900/80">
                  <span className="text-[10px] text-blue-300 uppercase block font-semibold">Motto</span>
                  <strong className="text-amber-300 font-bold text-xs">Love Never Fails</strong>
                </div>
                <div>
                  <span className="text-[10px] text-blue-300 uppercase block font-semibold">Active Live</span>
                  <strong className="text-emerald-400 font-bold text-sm">{liveCount.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-10 border-t border-blue-900/60">
          <div className="p-5 rounded-2xl bg-[#071740]/60 border border-blue-900/80 text-center">
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-white">2021</div>
            <div className="text-xs uppercase text-blue-300 font-bold tracking-wider mt-1">Founded Year</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#071740]/60 border border-blue-900/80 text-center">
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-amber-400">
              {liveCount.toLocaleString()}<span className="text-amber-500">+</span>
            </div>
            <div className="text-xs uppercase text-blue-300 font-bold tracking-wider mt-1">Live Concurrent Members</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#071740]/60 border border-blue-900/80 text-center">
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              100<span className="text-amber-400">%</span>
            </div>
            <div className="text-xs uppercase text-blue-300 font-bold tracking-wider mt-1">Peace &amp; Harmony</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#071740]/60 border border-blue-900/80 text-center">
            <div className="font-display text-xl sm:text-2xl font-extrabold text-amber-400 pt-2 tracking-wide">
              &ldquo;NEVER FAILS&rdquo;
            </div>
            <div className="text-xs uppercase text-blue-300 font-bold tracking-wider mt-1">Family Promise</div>
          </div>
        </div>
      </div>
    </section>
  );
};
