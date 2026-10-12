import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Crown, 
  LogOut, 
  UserCheck, 
  Bell, 
  ChevronDown, 
  Radio
} from 'lucide-react';
import { BMFUser, AdminBroadcastAlert } from '../types/bmf';

interface HeaderProps {
  currentUser: BMFUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchToAdmin: (email: 'concoituze@gmail.com' | 'concorderuhungande@gmail.com') => void;
  onSwitchToMember: () => void;
  liveCount: number;
  onSimulateCount: (count: number) => void;
  broadcastAlerts: AdminBroadcastAlert[];
  unreadAlertCount: number;
  onClearAlertCount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onSwitchToAdmin,
  onSwitchToMember,
  liveCount,
  onSimulateCount,
  broadcastAlerts,
  unreadAlertCount,
  onClearAlertCount,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  const isSuperAdmin = currentUser?.role === 'super_admin';

  return (
    <>
      {/* Tricolor Crest Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-700 via-amber-500 to-blue-700" />

      {/* Live Concurrency Banner */}
      <div className="bg-[#03091e] border-b border-blue-900/60 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-2.5">
            <span className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              High-Concurrency Engine Active
            </span>
            <span className="text-white font-medium text-[11px]">
              <strong className="text-amber-400 font-bold">{liveCount.toLocaleString()}</strong> Active Members Online
            </span>
            <span className="text-blue-300 text-[11px] hidden md:inline">
              • Scaled for <strong className="text-blue-100">5,000+ Concurrent Family Connections</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-blue-300 hidden sm:inline">Simulate Peak:</span>
            <button 
              onClick={() => onSimulateCount(1024)} 
              className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-200 hover:border-amber-400 transition-colors"
            >
              1.0K
            </button>
            <button 
              onClick={() => onSimulateCount(2500)} 
              className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-200 hover:border-amber-400 transition-colors"
            >
              2.5K
            </button>
            <button 
              onClick={() => onSimulateCount(5000)} 
              className="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
            >
              5.0K
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#061234]/95 backdrop-blur-md border-b border-blue-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Motto */}
            <a href="#hero" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-950 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-black/50 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 100 100" className="w-6 h-6 fill-amber-400">
                  <path d="M25 20 H45 V75 L35 85 L25 75 Z" />
                  <path d="M55 20 H75 V75 L65 85 L55 75 Z" />
                  <path d="M35 20 L50 48 L65 20 Z" />
                  <path d="M15 25 H35 C50 25 50 48 35 48 H15 Z" />
                  <path d="M15 48 H38 C55 48 55 75 38 75 H15 Z" />
                  <path d="M65 25 H90 V38 H78 V50 H88 V62 H78 V75 H65 Z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-xl text-white tracking-wider">B M F</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                    Est. 2021
                  </span>
                </div>
                <div className="text-[11px] text-blue-200">
                  The Best Mate Family · <span className="text-amber-400 italic font-semibold">&ldquo;Our love never fail&rdquo;</span>
                </div>
              </div>
            </a>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-blue-200">
              <a href="#announcements" className="hover:text-amber-400 transition-colors">Announcements</a>
              <a href="#meeting" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Call Lounge
              </a>
              <a href="#media" className="hover:text-amber-400 transition-colors">Pictures &amp; Videos</a>
              <a href="#chat" className="hover:text-amber-400 transition-colors">Live Chat</a>
              <a href="#squad" className="hover:text-amber-400 transition-colors">Family Roster</a>
              <a href="#board" className="hover:text-amber-400 transition-colors">Message Board</a>
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notification Alerts Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowAlertsDropdown(!showAlertsDropdown);
                    setShowUserDropdown(false);
                    if (unreadAlertCount > 0) onClearAlertCount();
                  }}
                  className="relative p-2.5 rounded-xl bg-[#071740] border border-blue-900 text-blue-200 hover:text-amber-400 hover:border-amber-500/50 transition-all"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadAlertCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] flex items-center justify-center animate-bounce">
                      {unreadAlertCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showAlertsDropdown && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#061234] border border-blue-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-3 border-b border-blue-900 mb-3">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Official Admin Broadcasts
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full">
                        {broadcastAlerts.length} Broadcasts
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {broadcastAlerts.length === 0 ? (
                        <div className="text-center py-6 text-xs text-blue-300">
                          No active broadcast notices.
                        </div>
                      ) : (
                        broadcastAlerts.map(alert => (
                          <div 
                            key={alert.id}
                            className="p-3 rounded-xl bg-[#071740] border border-amber-500/40 text-xs"
                          >
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="text-amber-400 font-bold flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                {alert.senderName}
                              </span>
                              <span className="text-[10px] text-blue-300">{alert.timestamp}</span>
                            </div>
                            <strong className="text-white block text-xs mb-1">{alert.title}</strong>
                            <p className="text-blue-200 text-[11px] leading-relaxed">{alert.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Account / Login State */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserDropdown(!showUserDropdown);
                      setShowAlertsDropdown(false);
                    }}
                    className={`flex items-center gap-2.5 py-1.5 px-3 rounded-xl border transition-all ${
                      isSuperAdmin 
                        ? 'bg-gradient-to-r from-amber-500/15 via-[#071740] to-blue-950 border-amber-500/60 text-amber-300 shadow-md shadow-amber-950/30'
                        : 'bg-[#071740] border-blue-800 text-blue-200 hover:border-blue-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                      isSuperAdmin ? 'bg-amber-500 text-slate-950' : 'bg-blue-600 text-white'
                    }`}>
                      {isSuperAdmin ? '👑' : currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        {currentUser.name}
                        {isSuperAdmin && (
                          <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1 py-0.2 rounded font-black uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-blue-300 truncate max-w-[140px]">
                        {currentUser.email}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-blue-300 ml-0.5" />
                  </button>

                  {/* Account Switcher & Role Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-[#061234] border border-blue-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 text-xs">
                      <div className="pb-3 border-b border-blue-900 mb-3">
                        <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-1">
                          Current Session
                        </div>
                        <div className="text-sm font-extrabold text-white flex items-center gap-2">
                          {currentUser.name}
                          {isSuperAdmin ? (
                            <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                              Super Admin
                            </span>
                          ) : (
                            <span className="text-[10px] bg-blue-800 text-blue-200 font-semibold px-1.5 py-0.5 rounded">
                              Family Member
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-amber-300/90 font-mono mt-0.5">
                          {currentUser.email}
                        </div>
                        <div className="text-[10px] text-blue-300 mt-1 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Privileges: {isSuperAdmin ? 'Edit, Manage, Broadcast, All Messages' : 'Watch, Attend Call, Private Messaging'}</span>
                        </div>
                      </div>

                      {/* Quick Switch Roles */}
                      <div className="space-y-1.5 mb-3">
                        <div className="text-[10px] font-bold uppercase text-blue-400">
                          Switch Role / Account to Test:
                        </div>

                        <button
                          onClick={() => {
                            onSwitchToAdmin('concoituze@gmail.com');
                            setShowUserDropdown(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors ${
                            currentUser.email === 'concoituze@gmail.com' 
                              ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200 font-bold' 
                              : 'hover:bg-blue-950 text-blue-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span>concoituze@gmail.com</span>
                          </div>
                          <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1 py-0.5 rounded">Admin</span>
                        </button>

                        <button
                          onClick={() => {
                            onSwitchToAdmin('concorderuhungande@gmail.com');
                            setShowUserDropdown(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors ${
                            currentUser.email === 'concorderuhungande@gmail.com' 
                              ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200 font-bold' 
                              : 'hover:bg-blue-950 text-blue-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span>concorderuhungande@gmail.com</span>
                          </div>
                          <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1 py-0.5 rounded">Admin</span>
                        </button>

                        <button
                          onClick={() => {
                            onSwitchToMember();
                            setShowUserDropdown(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors ${
                            !isSuperAdmin 
                              ? 'bg-blue-900/40 border border-blue-700 text-blue-200 font-bold' 
                              : 'hover:bg-blue-950 text-blue-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                            <span>Regular Member (David)</span>
                          </div>
                          <span className="text-[9px] bg-blue-900 text-blue-300 px-1 py-0.5 rounded">Member</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 hover:bg-rose-900 transition-colors font-bold text-xs"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out of Portal
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenAuth}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-950/40 hover:opacity-95 hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5 text-slate-950" />
                    Enter Family Room
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
