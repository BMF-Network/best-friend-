import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Hand, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Crown, 
  PhoneCall, 
  PhoneOff, 
  Users, 
  CheckCircle2,
  Lock,
  Edit2
} from 'lucide-react';
import { CallParticipant, BMFUser, FamilySticker } from '../types/bmf';
import { FAMILY_STICKERS } from '../data/initialData';

interface MeetingCallLoungeProps {
  currentUser: BMFUser | null;
  participants: CallParticipant[];
  onOpenAuth: () => void;
}

export const MeetingCallLounge: React.FC<MeetingCallLoungeProps> = ({
  currentUser,
  participants,
  onOpenAuth,
}) => {
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [isInCall, setIsInCall] = useState(true);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>('cp-1');
  const [recentReactions, setRecentReactions] = useState<{ id: string; emoji: string; left: number }[]>([]);
  const [showCallStickers, setShowCallStickers] = useState(false);
  const [activeStickerPopup, setActiveStickerPopup] = useState<FamilySticker | null>(null);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Agenda list (editable by Admin)
  const [agenda, setAgenda] = useState([
    { id: 1, title: '1. Promoting Peace & Harmony', desc: 'Fraternal check-in on every member, reconciliation, and mutual prayer.' },
    { id: 2, title: '2. Helping Others in Need', desc: 'Logistics for municipal shelter food drive & warm winter clothing packages.' },
    { id: 3, title: '3. Member Welfare & Sick Visits', desc: 'Hospital updates and benevolent fund allocations.' },
  ]);
  const [isEditingAgenda, setIsEditingAgenda] = useState(false);
  const [agendaDraft, setAgendaDraft] = useState('');

  // Speaker simulation every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const ids = ['cp-1', 'cp-2', 'cp-3', 'cp-4', 'you'];
      const randomId = ids[Math.floor(Math.random() * ids.length)];
      setActiveSpeakerId(randomId);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Web camera toggle handling
  const toggleCamera = async () => {
    if (cameraOff) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setWebcamStream(stream);
        setCameraOff(false);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.debug('Camera access fallback used', err);
        setCameraOff(false);
      }
    } else {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        setWebcamStream(null);
      }
      setCameraOff(true);
    }
  };

  // Reactions burst
  const triggerReaction = (emoji: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const left = Math.floor(Math.random() * 80) + 10;
    setRecentReactions(prev => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setRecentReactions(prev => prev.filter(r => r.id !== id));
    }, 2500);
  };

  const triggerSticker = (stk: FamilySticker) => {
    setActiveStickerPopup(stk);
    triggerReaction(stk.emoji);
    setTimeout(() => {
      setActiveStickerPopup(null);
    }, 3800);
  };

  const toggleMic = () => {
    setMicMuted(!micMuted);
  };

  const toggleHand = () => {
    setHandRaised(!handRaised);
  };

  return (
    <section id="meeting" className="py-20 border-t border-blue-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Family Video Lounge
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              BMF Group Call &amp; Meeting Room
            </h2>
            <p className="text-sm text-blue-200 mt-2 max-w-2xl leading-relaxed">
              All members can attend the call, listen to brothers and sisters, pray, and coordinate mutual community relief.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Room Active · Weekly Fellowship
            </span>
          </div>
        </div>

        {/* Video Lounge Container */}
        <div className="rounded-3xl bg-[#061234] border border-blue-900/90 shadow-2xl overflow-hidden relative">
          {/* Reaction Float Layer */}
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {recentReactions.map(r => (
              <span
                key={r.id}
                style={{ left: `${r.left}%` }}
                className="absolute bottom-16 text-3xl animate-in fade-in slide-in-from-bottom duration-1000"
              >
                {r.emoji}
              </span>
            ))}

            {/* Floating Active Sticker in Video Call */}
            {activeStickerPopup && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 p-4 rounded-3xl bg-gradient-to-br from-[#091f57] via-[#040e2d] to-black border-2 border-amber-400 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.5)] flex items-center gap-4 animate-in zoom-in-90 duration-300">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-inner animate-bounce">
                  {activeStickerPopup.emoji}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    BMF Live Family Sticker
                  </div>
                  <div className="text-base font-black text-white">
                    {activeStickerPopup.title}
                  </div>
                  <div className="text-xs text-blue-200 italic font-semibold">
                    &ldquo;{activeStickerPopup.slogan}&rdquo;
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lounge Top Bar */}
          <div className="p-4 bg-[#040e2d] border-b border-blue-900/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <strong className="text-white text-sm">BMF Peace &amp; Outreach Gathering</strong>
              </div>
              <span className="hidden sm:inline text-blue-300">•</span>
              <span className="text-blue-300 hidden sm:inline">
                Slogan: <strong className="text-amber-400 italic font-semibold">&ldquo;Our love never fail&rdquo;</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-blue-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                {participants.length + (isInCall ? 1 : 0)} Attending
              </span>
              {isSuperAdmin && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                  Admin Moderator Privileges
                </span>
              )}
            </div>
          </div>

          {/* Main Lounge Grid & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Attendees Video Tiles */}
            <div className="lg:col-span-8 p-4 bg-[#03091e] grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {/* Participant Tiles */}
              {participants.map((p) => {
                const isSpeaking = activeSpeakerId === p.id;
                return (
                  <div
                    key={p.id}
                    className={`relative rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 border ${
                      isSpeaking
                        ? 'bg-gradient-to-b from-[#0e2a78] to-[#06143b] border-amber-400 shadow-lg shadow-amber-950/40 ring-2 ring-amber-400/40'
                        : 'bg-[#071740] border-blue-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      {isSpeaking ? (
                        <span className="text-amber-400 font-extrabold flex items-center gap-1 text-[10px] uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          Speaking
                        </span>
                      ) : (
                        <span className="text-blue-300 text-[10px] truncate max-w-[90px]">{p.role}</span>
                      )}

                      {p.handRaised && (
                        <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                          ✋ Raised
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="my-auto py-2 text-center">
                      <div 
                        style={{ backgroundColor: p.color }}
                        className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl border-2 border-amber-400/70 flex items-center justify-center text-lg sm:text-xl font-black text-white shadow-lg"
                      >
                        {p.initial}
                      </div>
                    </div>

                    {/* Tile Footer */}
                    <div className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white truncate max-w-[110px]">
                        {p.name}
                      </span>
                      <span>{p.micMuted ? '🔇' : '🎙️'}</span>
                    </div>
                  </div>
                );
              })}

              {/* Current User Tile ("You / Member") */}
              {isInCall && (
                <div
                  className={`relative rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 border ${
                    activeSpeakerId === 'you' && !micMuted
                      ? 'bg-gradient-to-b from-[#047857]/40 to-[#06143b] border-emerald-400 shadow-lg ring-2 ring-emerald-400/40'
                      : 'bg-[#071740] border-emerald-600/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-extrabold flex items-center gap-1 text-[10px] uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active (You)
                    </span>
                    {handRaised && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-black flex items-center gap-0.5">
                        ✋ Hand Up
                      </span>
                    )}
                  </div>

                  {/* Avatar or Real Webcam preview */}
                  <div className="my-auto py-2 text-center relative overflow-hidden rounded-xl">
                    {!cameraOff && webcamStream ? (
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-24 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-emerald-700 border-2 border-emerald-400 flex items-center justify-center text-lg font-black text-white shadow-lg">
                        {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'Y'}
                      </div>
                    )}
                  </div>

                  <div className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-300 truncate max-w-[110px]">
                      {currentUser ? currentUser.name : 'You (Member)'}
                    </span>
                    <span>{micMuted ? '🔇' : '🎙️'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Agenda & Fraternal Fellowship Panel */}
            <div className="lg:col-span-4 p-5 bg-[#050f2e] border-t lg:border-t-0 lg:border-l border-blue-900/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-blue-900 mb-3">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    Meeting Agenda &amp; Focus
                  </div>
                  {isSuperAdmin && (
                    <button
                      onClick={() => setIsEditingAgenda(!isEditingAgenda)}
                      className="text-[11px] text-blue-300 hover:text-amber-300 flex items-center gap-1 font-semibold"
                    >
                      <Edit2 className="w-3 h-3" />
                      {isEditingAgenda ? 'Done' : 'Edit'}
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {agenda.map((ag) => (
                    <div key={ag.id} className="p-3 rounded-xl bg-[#071740]/80 border border-blue-900 text-xs">
                      <strong className="text-white block font-bold mb-1">{ag.title}</strong>
                      <p className="text-blue-200 text-[11px] leading-relaxed">{ag.desc}</p>
                    </div>
                  ))}
                </div>

                {isEditingAgenda && isSuperAdmin && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-950/80 border border-amber-500/40 text-xs">
                    <span className="text-[10px] uppercase font-bold text-amber-300 block mb-1">
                      Add Custom Agenda Item (Super Admin):
                    </span>
                    <input
                      type="text"
                      value={agendaDraft}
                      onChange={(e) => setAgendaDraft(e.target.value)}
                      placeholder="e.g. 4. Special Prayer for Sick Members..."
                      className="w-full bg-[#03091e] border border-blue-800 rounded-lg p-2 text-white text-xs mb-2 outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (agendaDraft.trim()) {
                          setAgenda(prev => [...prev, {
                            id: Date.now(),
                            title: agendaDraft.trim(),
                            desc: 'Added by Super Admin governance.'
                          }]);
                          setAgendaDraft('');
                        }
                      }}
                      className="w-full py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                    >
                      + Append Agenda Item
                    </button>
                  </div>
                )}
              </div>

              {/* Call Room Motto Note */}
              <div className="pt-4 border-t border-blue-900/60 mt-4 text-center">
                <div className="text-xs text-amber-300 font-extrabold italic">
                  &ldquo;Our love never fail&rdquo;
                </div>
                <div className="text-[11px] text-blue-300 mt-1">
                  1 Cor. 13:8 · Unconditional Fraternal Bond
                </div>
              </div>
            </div>
          </div>

          {/* Call Controls Bar */}
          <div className="p-4 bg-[#06143d] border-t border-blue-900/80 flex flex-wrap items-center justify-between gap-3">
            {/* Left audio/video buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMic}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  micMuted 
                    ? 'bg-rose-950/80 border border-rose-600 text-rose-300' 
                    : 'bg-[#0a1f5c] border border-blue-800 text-white hover:bg-blue-800'
                }`}
              >
                {micMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                <span>{micMuted ? 'Muted' : 'Mute Mic'}</span>
              </button>

              <button
                type="button"
                onClick={toggleCamera}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  cameraOff 
                    ? 'bg-rose-950/80 border border-rose-600 text-rose-300' 
                    : 'bg-[#0a1f5c] border border-blue-800 text-white hover:bg-blue-800'
                }`}
              >
                {cameraOff ? <VideoOff className="w-4 h-4 text-rose-400" /> : <Video className="w-4 h-4 text-blue-300" />}
                <span>{cameraOff ? 'Cam Off' : 'Toggle Cam'}</span>
              </button>

              <button
                type="button"
                onClick={toggleHand}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  handRaised 
                    ? 'bg-amber-500 text-slate-950' 
                    : 'bg-[#0a1f5c] border border-blue-800 text-white hover:bg-blue-800'
                }`}
              >
                <Hand className="w-4 h-4" />
                <span>{handRaised ? 'Lower Hand' : 'Raise Hand'}</span>
              </button>
            </div>

            {/* Reactions & Stickers */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['❤️', '🕊️', '🤝', '🙏', '👑', '🔥', '✨', '👏'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => triggerReaction(emoji)}
                  className="w-8 h-8 rounded-lg bg-[#071740] border border-blue-800 hover:border-amber-400 flex items-center justify-center text-sm transition-transform active:scale-125"
                  title={`React ${emoji}`}
                >
                  {emoji}
                </button>
              ))}

              {/* Call Sticker Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCallStickers(!showCallStickers)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    showCallStickers 
                      ? 'bg-amber-500 text-slate-950 border-amber-400' 
                      : 'bg-[#071740] border-amber-500/50 text-amber-300 hover:border-amber-400'
                  }`}
                  title="Send Family Sticker to Call"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Stickers</span>
                </button>

                {/* Sticker Dropdown */}
                {showCallStickers && (
                  <div className="absolute right-0 bottom-full mb-2 z-40 w-64 p-3 rounded-2xl bg-[#061234] border-2 border-amber-500 shadow-2xl animate-in zoom-in-95">
                    <div className="text-[10px] uppercase font-bold text-amber-400 mb-2 flex items-center justify-between">
                      <span>Call Lounge Stickers</span>
                      <button onClick={() => setShowCallStickers(false)} className="text-blue-300 hover:text-white">✕</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {FAMILY_STICKERS.map(stk => (
                        <button
                          key={stk.id}
                          type="button"
                          onClick={() => {
                            triggerSticker(stk);
                            setShowCallStickers(false);
                          }}
                          className="p-2 rounded-xl bg-[#071740] border border-blue-900 hover:border-amber-400 text-left hover:scale-105 transition-transform"
                        >
                          <div className="text-xl mb-0.5">{stk.emoji}</div>
                          <div className="text-[10px] font-bold text-white truncate">{stk.title}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Join / Leave or Admin Mute All */}
            <div className="flex items-center gap-2">
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => alert('Super Admin Action: All attendee microphones muted.')}
                  className="px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500 text-amber-300 font-bold text-xs hover:bg-amber-500/30 transition-all"
                >
                  Mute All (Admin)
                </button>
              )}

              {isInCall ? (
                <button
                  type="button"
                  onClick={() => setIsInCall(false)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-950"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  Leave Lounge
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsInCall(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-95 text-white font-bold text-xs transition-all shadow-md shadow-emerald-950"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Rejoin Lounge
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
