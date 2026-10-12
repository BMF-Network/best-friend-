import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Crown, 
  ShieldCheck, 
  Trash2, 
  Radio, 
  EyeOff, 
  Sparkles,
  Smile,
  X,
  Heart
} from 'lucide-react';
import { ChatMessage, BMFUser, AdminBroadcastAlert, FamilySticker } from '../types/bmf';
import { FAMILY_STICKERS } from '../data/initialData';
import { playAdminBroadcastChime } from '../utils/auth';

interface GroupChatSectionProps {
  currentUser: BMFUser | null;
  messages: ChatMessage[];
  onSendMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  onDeleteMessage: (id: string) => void;
  onTriggerAdminAlert: (alert: AdminBroadcastAlert) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onOpenAuth: () => void;
}

export const GroupChatSection: React.FC<GroupChatSectionProps> = ({
  currentUser,
  messages,
  onSendMessage,
  onDeleteMessage,
  onTriggerAdminAlert,
  onToggleReaction,
  onOpenAuth,
}) => {
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const [inputText, setInputText] = useState('');
  const [broadcastAsAdmin, setBroadcastAsAdmin] = useState(true);
  const [showStickerDrawer, setShowStickerDrawer] = useState(false);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUICK_EMOJIS = ['❤️', '🕊️', '🤝', '🙏', '👑', '🔥', '✨', '👏', '🎉', '💯'];

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Privacy Filtering Logic:
  // "so hide the message that written by others only me write and notify other as admin"
  const visibleMessages = messages.filter((msg) => {
    if (!currentUser) {
      // Unauthenticated visitor only sees official Admin broadcasts
      return msg.isAdmin;
    }

    if (isSuperAdmin) {
      // Admin sees ALL messages from all members
      return true;
    }

    // Regular member:
    // 1. See messages written by Admin
    // 2. See messages written by themselves
    // 3. Hide messages written by other members!
    if (msg.isAdmin) return true;
    if (msg.senderEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
    return false;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !currentUser) return;

    const isAdminMsg = isSuperAdmin;
    const isBroadcast = isSuperAdmin && broadcastAsAdmin;

    onSendMessage({
      senderName: currentUser.name,
      senderEmail: currentUser.email,
      text,
      isAdmin: isAdminMsg,
      isBroadcast,
      reactions: {},
    });

    // If Admin sends message, notify others as Admin!
    if (isAdminMsg && isBroadcast) {
      playAdminBroadcastChime();
      onTriggerAdminAlert({
        id: `alert-${Date.now()}`,
        senderName: currentUser.name,
        senderEmail: currentUser.email,
        title: '👑 Official Admin Broadcast Announcement',
        message: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    setInputText('');
  };

  const handleSendSticker = (sticker: FamilySticker) => {
    if (!currentUser) return;

    const isAdminMsg = isSuperAdmin;
    const isBroadcast = isSuperAdmin && broadcastAsAdmin;

    onSendMessage({
      senderName: currentUser.name,
      senderEmail: currentUser.email,
      text: `${sticker.emoji} [BMF Sticker: ${sticker.title}]`,
      isAdmin: isAdminMsg,
      isBroadcast,
      sticker,
      reactions: { [sticker.emoji]: 1 },
    });

    if (isAdminMsg && isBroadcast) {
      playAdminBroadcastChime();
      onTriggerAdminAlert({
        id: `alert-${Date.now()}`,
        senderName: currentUser.name,
        senderEmail: currentUser.email,
        title: `👑 Official Admin Sticker Broadcast: ${sticker.title}`,
        message: `${sticker.emoji} "${sticker.slogan}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    setShowStickerDrawer(false);
  };

  const addEmojiToInput = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  return (
    <section id="chat" className="py-20 border-t border-blue-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              Live Group Communication
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              BMF Live Messaging &amp; Admin Broadcasts
            </h2>
            <p className="text-sm text-blue-200 mt-2 max-w-2xl leading-relaxed">
              Official admin directives are broadcast to all members. Regular member conversations remain strictly private. Use reaction emojis and family stickers to spread joy.
            </p>
          </div>

          {/* Privacy Status Badge */}
          <div>
            {isSuperAdmin ? (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/60 text-xs text-amber-300 font-bold">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Super Admin Console · All Member Inquiries Visible</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-950/80 border border-blue-800 text-xs text-blue-300">
                <EyeOff className="w-4 h-4 text-emerald-400" />
                <span>Confidential Mode: Peer messages hidden · Only you &amp; Admins visible</span>
              </div>
            )}
          </div>
        </div>

        {/* Chat Container */}
        <div className="rounded-3xl bg-[#061234] border border-blue-900/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Panel: Online Leadership & Guidance */}
          <div className="lg:col-span-4 p-5 bg-[#050f2e] border-b lg:border-b-0 lg:border-r border-blue-900/80 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider pb-3 border-b border-blue-900 mb-4 flex items-center justify-between">
                <span>Authorized Leadership</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  Active
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#071740] border border-amber-500/50">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <strong className="text-white flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      Concoituze
                    </strong>
                    <span className="text-emerald-400 text-[10px] font-bold">● Online</span>
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono">concoituze@gmail.com</div>
                  <div className="text-[10px] text-blue-300 mt-1">Super Admin · Full Governance</div>
                </div>

                <div className="p-3 rounded-xl bg-[#071740] border border-amber-500/50">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <strong className="text-white flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      Concorde Ruhungande
                    </strong>
                    <span className="text-emerald-400 text-[10px] font-bold">● Online</span>
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono">concorderuhungande@gmail.com</div>
                  <div className="text-[10px] text-blue-300 mt-1">Super Admin · Full Governance</div>
                </div>

                {/* Family Stickers Preview Widget */}
                <div className="p-3.5 rounded-xl bg-[#040e2d] border border-amber-500/30">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-2">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Family Stickers Available
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowStickerDrawer(true)}
                      className="text-[10px] text-amber-400 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {FAMILY_STICKERS.slice(0, 4).map(stk => (
                      <button
                        key={stk.id}
                        type="button"
                        onClick={() => handleSendSticker(stk)}
                        className="p-1.5 rounded-lg bg-[#071740] border border-blue-900 hover:border-amber-400 text-lg hover:scale-110 transition-transform"
                        title={stk.title}
                      >
                        {stk.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-900/60 mt-4 text-center">
              <span className="text-xs text-amber-300 font-bold italic">
                &ldquo;Our love never fail&rdquo;
              </span>
            </div>
          </div>

          {/* Right Panel: Chat Messages Feed */}
          <div className="lg:col-span-8 p-5 bg-[#03091e] flex flex-col justify-between relative">
            {/* Messages Scroll Area */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
              {visibleMessages.length === 0 ? (
                <div className="text-center py-16 text-blue-300 text-xs">
                  No messages yet. Write a message below to reach the Super Admins.
                </div>
              ) : (
                visibleMessages.map((msg) => {
                  const isYou = currentUser && msg.senderEmail.toLowerCase() === currentUser.email.toLowerCase();
                  const isAdminMsg = msg.isAdmin;
                  const reactions = msg.reactions || {};

                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl transition-all relative group ${
                        isAdminMsg
                          ? 'bg-gradient-to-r from-[#0d276b] via-[#091f57] to-[#041133] border-2 border-amber-500/80 shadow-lg shadow-black/60'
                          : isYou
                            ? 'bg-[#0a2366] border border-blue-700 ml-auto max-w-xl'
                            : 'bg-[#071740] border border-blue-900 mr-auto max-w-xl'
                      }`}
                    >
                      {/* Message Header */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          {isAdminMsg ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
                              <Crown className="w-3 h-3 text-slate-950" />
                              Official Admin Broadcast
                            </span>
                          ) : isYou ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs">
                              You ({msg.senderName})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-blue-300 font-bold text-xs">
                              {msg.senderName}
                            </span>
                          )}

                          <span className="text-[10px] text-blue-300 font-mono">
                            {msg.senderEmail}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-blue-300">{msg.timestamp}</span>
                          {isSuperAdmin && (
                            <button
                              onClick={() => onDeleteMessage(msg.id)}
                              className="text-blue-400 hover:text-rose-400 p-0.5 transition-colors"
                              title="Delete message as Super Admin"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Sticker Render if present */}
                      {msg.sticker && (
                        <div className="my-2.5 p-3.5 rounded-2xl bg-gradient-to-br from-[#06143b] to-[#03091e] border-2 border-amber-400/80 shadow-lg flex items-center gap-3.5 max-w-md">
                          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl shadow-inner">
                            {msg.sticker.emoji}
                          </div>
                          <div>
                            <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                              {msg.sticker.title}
                            </div>
                            <div className="text-[11px] text-blue-200 italic font-semibold">
                              &ldquo;{msg.sticker.slogan}&rdquo;
                            </div>
                            <div className="text-[9px] text-amber-400/80 font-bold uppercase tracking-widest mt-0.5">
                              BMF Official Family Sticker
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Message Body text */}
                      {!msg.sticker && (
                        <p className={`text-sm leading-relaxed ${isAdminMsg ? 'text-white font-medium' : 'text-blue-100'}`}>
                          {msg.text}
                        </p>
                      )}

                      {isAdminMsg && (
                        <div className="mt-2 pt-2 border-t border-amber-500/30 flex items-center justify-between text-[10px] text-amber-300">
                          <span>🔔 Dispatched to all 1,024+ family members</span>
                          <span className="italic font-semibold">&ldquo;Our love never fail&rdquo;</span>
                        </div>
                      )}

                      {/* Reaction Emojis Bar */}
                      <div className="mt-2.5 flex items-center flex-wrap gap-1.5 pt-1.5 border-t border-blue-900/40">
                        {/* Existing reaction badges */}
                        {Object.entries(reactions).map(([emoji, count]) => {
                          if (count <= 0) return null;
                          return (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => onToggleReaction(msg.id, emoji)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#040e2d] border border-blue-800 text-xs hover:border-amber-400 transition-colors"
                            >
                              <span>{emoji}</span>
                              <span className="text-[10px] font-bold text-amber-300">{count}</span>
                            </button>
                          );
                        })}

                        {/* Add reaction trigger */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveReactionMessageId(activeReactionMessageId === msg.id ? null : msg.id)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-[#040e2d]/60 border border-blue-900 hover:border-amber-400 text-[11px] text-blue-300 hover:text-white transition-all"
                            title="Add reaction emoji"
                          >
                            <Smile className="w-3 h-3 text-amber-400" />
                            <span>+</span>
                          </button>

                          {/* Quick Emoji Picker popover for message */}
                          {activeReactionMessageId === msg.id && (
                            <div className="absolute left-0 bottom-full mb-1 z-30 p-1.5 rounded-xl bg-[#061234] border border-amber-500/60 shadow-xl flex items-center gap-1 animate-in zoom-in-95">
                              {QUICK_EMOJIS.map(emoji => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    onToggleReaction(msg.id, emoji);
                                    setActiveReactionMessageId(null);
                                  }}
                                  className="w-7 h-7 rounded-lg hover:bg-blue-950 flex items-center justify-center text-sm hover:scale-125 transition-transform"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Sticker Drawer Popup */}
            {showStickerDrawer && (
              <div className="absolute inset-x-5 bottom-24 z-40 p-4 rounded-2xl bg-[#061234] border-2 border-amber-500 shadow-2xl animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-blue-900">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      BMF Family Stickers Collection
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowStickerDrawer(false)}
                    className="text-blue-300 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {FAMILY_STICKERS.map(stk => (
                    <button
                      key={stk.id}
                      type="button"
                      onClick={() => handleSendSticker(stk)}
                      className="p-3 rounded-xl bg-gradient-to-b from-[#071740] to-[#040e2d] border border-blue-900 hover:border-amber-400 hover:scale-102 text-left transition-all group"
                    >
                      <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                        {stk.emoji}
                      </div>
                      <div className="text-[11px] font-bold text-white group-hover:text-amber-300">
                        {stk.title}
                      </div>
                      <div className="text-[9px] text-blue-300 truncate mt-0.5">
                        {stk.slogan}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form & Emoji Bar */}
            <div className="mt-4 pt-3 border-t border-blue-900/80">
              {currentUser ? (
                <form onSubmit={handleSend} className="space-y-2">
                  {/* Super Admin Broadcast Toggle */}
                  {isSuperAdmin && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/40 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={broadcastAsAdmin}
                          onChange={(e) => setBroadcastAsAdmin(e.target.checked)}
                          className="rounded bg-slate-950 border-amber-500 text-amber-500 focus:ring-0"
                        />
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5" />
                          Broadcast &amp; Notify All Members as Admin
                        </span>
                      </label>
                      <span className="text-[10px] text-blue-300">
                        Plays royal chime &amp; displays alert banner
                      </span>
                    </div>
                  )}

                  {/* Quick Emoji bar */}
                  {showEmojiBar && (
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#040e2d] border border-blue-900 overflow-x-auto">
                      <span className="text-[10px] font-bold text-blue-300 uppercase shrink-0 mr-1">Reactions:</span>
                      {QUICK_EMOJIS.map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => addEmojiToInput(emoji)}
                          className="w-7 h-7 rounded-lg hover:bg-blue-950 flex items-center justify-center text-sm shrink-0 hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 items-center">
                    {/* Emoji Bar toggle button */}
                    <button
                      type="button"
                      onClick={() => setShowEmojiBar(!showEmojiBar)}
                      className={`p-2.5 rounded-xl border text-sm transition-all ${
                        showEmojiBar 
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' 
                          : 'bg-[#040e2d] border-blue-900 text-blue-300 hover:text-amber-400 hover:border-amber-500/50'
                      }`}
                      title="Quick Reaction Emojis"
                    >
                      <Smile className="w-4 h-4" />
                    </button>

                    {/* Stickers button */}
                    <button
                      type="button"
                      onClick={() => setShowStickerDrawer(!showStickerDrawer)}
                      className={`p-2.5 rounded-xl border text-sm transition-all flex items-center gap-1.5 ${
                        showStickerDrawer 
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' 
                          : 'bg-[#040e2d] border-blue-900 text-amber-300 hover:text-amber-200 hover:border-amber-500/50'
                      }`}
                      title="Send Family Sticker"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-[11px] font-bold hidden sm:inline">Stickers</span>
                    </button>

                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={
                        isSuperAdmin 
                          ? 'Write official admin announcement or response...' 
                          : 'Write private message to family administration...'
                      }
                      className="flex-1 bg-[#03091e] border border-blue-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-blue-400/50 focus:border-amber-400 outline-none transition-all"
                      required
                    />

                    <button
                      type="submit"
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                        isSuperAdmin
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:opacity-95 shadow-amber-950 cursor-pointer'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:opacity-95 shadow-blue-950 cursor-pointer'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSuperAdmin && broadcastAsAdmin ? 'Broadcast' : 'Send'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-[#071740] border border-amber-500/40 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-left">
                    <strong className="text-white block">Sign in to write messages and send stickers</strong>
                    <span className="text-blue-300">Members can attend calls, watch videos, react with emojis, and send private inquiries.</span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs hover:opacity-95 cursor-pointer"
                  >
                    Enter with Google Gmail
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
