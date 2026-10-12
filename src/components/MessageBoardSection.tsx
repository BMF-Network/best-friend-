import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Crown, 
  Trash2, 
  Star, 
  ShieldCheck, 
  EyeOff, 
  Lock,
  Heart
} from 'lucide-react';
import { BoardNote, BMFUser } from '../types/bmf';

interface MessageBoardSectionProps {
  currentUser: BMFUser | null;
  notes: BoardNote[];
  onAddNote: (note: Omit<BoardNote, 'id' | 'timestamp'>) => void;
  onDeleteNote: (id: string) => void;
  onToggleFeature: (id: string) => void;
  onToggleNoteReaction: (id: string, emoji: string) => void;
  onOpenAuth: () => void;
}

export const MessageBoardSection: React.FC<MessageBoardSectionProps> = ({
  currentUser,
  notes,
  onAddNote,
  onDeleteNote,
  onToggleFeature,
  onToggleNoteReaction,
  onOpenAuth,
}) => {
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [authorName, setAuthorName] = useState(currentUser ? currentUser.name : '');
  const [tag, setTag] = useState<BoardNote['tag']>('Peace & Harmony');
  const [content, setContent] = useState('');

  // Privacy filtering for the board notes:
  // "so hide the message that written by others only me write and notify other as admin"
  const visibleNotes = notes.filter((n) => {
    if (!currentUser) {
      // Unauthenticated visitor sees Admin featured notes only
      return n.isAdmin || n.featured;
    }

    if (isSuperAdmin) {
      // Admin sees ALL notes submitted by everyone
      return true;
    }

    // Regular member:
    // 1. See notes posted/featured by Admin
    // 2. See notes posted by THEMSELVES
    // 3. Hide notes posted by other members
    if (n.isAdmin || n.featured) return true;
    if (n.email.toLowerCase() === currentUser.email.toLowerCase()) return true;
    return false;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const assignedAuthor = currentUser ? currentUser.name : (authorName.trim() || 'Brother/Sister');
    const assignedEmail = currentUser ? currentUser.email : 'member@bmf.family';

    onAddNote({
      author: assignedAuthor,
      email: assignedEmail,
      tag,
      content: content.trim(),
      isAdmin: isSuperAdmin,
      featured: isSuperAdmin,
    });

    setContent('');
  };

  return (
    <section id="board" className="py-20 border-t border-blue-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              Encouragement &amp; Mutual Prayer
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Family Message Board
            </h2>
            <p className="text-sm text-blue-200 mt-2 max-w-2xl leading-relaxed">
              Share words of comfort, prayer requests, and mutual support. Slogan: <strong className="text-amber-400 italic">&ldquo;Our love never fail&rdquo;</strong>.
            </p>
          </div>

          <div>
            {isSuperAdmin ? (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/60 text-xs text-amber-300 font-bold">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Super Admin Moderation Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-950/80 border border-blue-800 text-xs text-blue-300">
                <EyeOff className="w-4 h-4 text-emerald-400" />
                <span>Member Privacy: Peer submissions are concealed</span>
              </div>
            )}
          </div>
        </div>

        {/* Board Grid: Notes on Left, Submission form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Notes Stream */}
          <div className="lg:col-span-7 space-y-4">
            {visibleNotes.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#071740] border border-blue-900 text-center text-xs text-blue-300">
                No board notes visible. Post an encouraging note to begin fellowship.
              </div>
            ) : (
              visibleNotes.map((note) => {
                const isYou = currentUser && note.email.toLowerCase() === currentUser.email.toLowerCase();

                return (
                  <div
                    key={note.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      note.isAdmin || note.featured
                        ? 'bg-gradient-to-r from-[#0d276b] via-[#071740] to-[#040d27] border-amber-500/70 shadow-lg shadow-black/40'
                        : isYou
                          ? 'bg-[#0a2366] border-blue-600'
                          : 'bg-[#071740] border-blue-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-white text-sm flex items-center gap-1.5">
                          {note.author}
                          {note.isAdmin && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                          {isYou && (
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                              You
                            </span>
                          )}
                        </strong>

                        <span className="text-xs text-blue-300 font-mono text-[11px]">
                          ({note.email})
                        </span>

                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                          {note.tag}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-blue-300 shrink-0">
                        <span>{note.timestamp}</span>

                        {isSuperAdmin && (
                          <>
                            <button
                              onClick={() => onToggleFeature(note.id)}
                              className={`p-1 rounded hover:text-amber-300 transition-colors ${
                                note.featured ? 'text-amber-400' : 'text-blue-400'
                              }`}
                              title={note.featured ? 'Unfeature note' : 'Feature for all members'}
                            >
                              <Star className="w-3.5 h-3.5 fill-current" />
                            </button>
                            <button
                              onClick={() => onDeleteNote(note.id)}
                              className="p-1 rounded text-blue-400 hover:text-rose-400 transition-colors"
                              title="Delete note as Super Admin"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-blue-100 leading-relaxed">
                      {note.content}
                    </p>

                    {/* Reaction Emojis Row on Board Note */}
                    <div className="mt-3 pt-2.5 border-t border-blue-900/60 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {['❤️', '🙏', '🕊️', '🤝', '👑'].map((emoji) => {
                          const count = (note.reactions && note.reactions[emoji]) || 0;
                          return (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => onToggleNoteReaction(note.id, emoji)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs transition-colors ${
                                count > 0 
                                  ? 'bg-[#040e2d] border-amber-500/50 text-white' 
                                  : 'bg-[#040e2d]/60 border-blue-900 text-blue-300 hover:border-amber-400'
                              }`}
                              title={`React ${emoji}`}
                            >
                              <span>{emoji}</span>
                              {count > 0 && <span className="text-[10px] font-bold text-amber-300">{count}</span>}
                            </button>
                          );
                        })}
                      </div>

                      {(note.isAdmin || note.featured) ? (
                        <div className="text-[10px] text-amber-300/90 font-bold italic ml-auto">
                          &ldquo;Our love never fail&rdquo;
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Post Form */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-[#061234] border-2 border-amber-500/60 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white font-display">
                  Post a Family Message
                </h3>
              </div>
              <p className="text-xs text-blue-200 mb-5 leading-relaxed">
                Send words of encouragement, request prayers, or coordinate mutual aid with brothers &amp; sisters.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {!currentUser && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Sister Grace"
                      className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                    Select Fellowship Focus
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value as BoardNote['tag'])}
                    className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                  >
                    <option value="Peace & Harmony">Peace &amp; Harmony</option>
                    <option value="Helping Others">Helping Others</option>
                    <option value="Family Love & Support">Family Love &amp; Support</option>
                    <option value="Prayer & Healing">Prayer &amp; Healing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                    Your Message
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    placeholder="Type words of love, encouragement, or specific prayer requests..."
                    className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-950/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post to Family Message Board</span>
                </button>
              </form>

              {!currentUser && (
                <div className="mt-4 pt-3 border-t border-blue-900/60 text-center">
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="text-[11px] text-amber-400 hover:underline font-semibold"
                  >
                    Sign in with Google Gmail for verified sender badge
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
