import React from 'react';
import { Crown, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020617] border-t border-blue-900/80 pt-16 pb-12 text-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-blue-900/50">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 font-black text-sm">
                BMF
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-display tracking-wider">
                  B M F
                </h3>
                <span className="text-xs text-blue-300">The Best Mate Family · Founded 2021</span>
              </div>
            </div>

            <div className="text-amber-400 text-sm font-extrabold italic">
              &ldquo;Our love never fail&rdquo;
            </div>

            <p className="text-xs text-blue-300/90 max-w-md leading-relaxed">
              Founded in 2021 to serve as a sanctuary of brotherhood, charity, and mutual uplifting. Committed to helping others in distress and preserving unconditional harmony among all brothers and sisters.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs text-amber-400">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="hover:text-amber-400 transition-colors">Home Portal</a></li>
              <li><a href="#announcements" className="hover:text-amber-400 transition-colors">Bulletins &amp; Urgent Notices</a></li>
              <li><a href="#meeting" className="hover:text-amber-400 transition-colors">Live Call Lounge</a></li>
              <li><a href="#media" className="hover:text-amber-400 transition-colors">Pictures &amp; Videos</a></li>
              <li><a href="#chat" className="hover:text-amber-400 transition-colors">Live Messages</a></li>
              <li><a href="#squad" className="hover:text-amber-400 transition-colors">Family Roster</a></li>
              <li><a href="#board" className="hover:text-amber-400 transition-colors">Message Board</a></li>
            </ul>
          </div>

          {/* Governance & Privacy */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs text-amber-400">
              Admin Governance
            </h4>
            <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-900 space-y-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Authorized Super Admins:</span>
              </div>
              <div className="font-mono text-blue-200">
                • concoituze@gmail.com<br />
                • concorderuhungande@gmail.com
              </div>
              <div className="text-blue-300 text-[10px] pt-1 border-t border-blue-900">
                Full edit, manage, broadcast, and moderation authority.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-400">
          <div>
            © 2021–2026 B M F (The Best Mate Family). All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-amber-400/90 font-semibold">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>&ldquo;Our love never fail&rdquo;</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
