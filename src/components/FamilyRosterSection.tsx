import React, { useState } from 'react';
import { 
  Users, 
  Crown, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Lock 
} from 'lucide-react';
import { RosterMember, BMFUser } from '../types/bmf';

interface FamilyRosterSectionProps {
  currentUser: BMFUser | null;
  roster: RosterMember[];
  onAddMember: (member: Omit<RosterMember, 'id'>) => void;
  onUpdateMember: (id: string, updated: Partial<RosterMember>) => void;
}

export const FamilyRosterSection: React.FC<FamilyRosterSectionProps> = ({
  currentUser,
  roster,
  onAddMember,
  onUpdateMember,
}) => {
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [accentColor, setAccentColor] = useState('#3b82f6');

  const openAdd = () => {
    if (!isSuperAdmin) return;
    setEditingId(null);
    setName('');
    setEmail('');
    setRole('Community Brother / Sister');
    setBio('Serving the family with unconditional love and promoting peace.');
    setAccentColor('#3b82f6');
    setIsModalOpen(true);
  };

  const openEdit = (member: RosterMember) => {
    if (!isSuperAdmin) return;
    setEditingId(member.id);
    setName(member.name);
    setEmail(member.email || '');
    setRole(member.role);
    setBio(member.bio);
    setAccentColor(member.accentColor);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    if (editingId) {
      onUpdateMember(editingId, {
        name: name.trim(),
        email: email.trim() || undefined,
        role: role.trim(),
        bio: bio.trim(),
        accentColor,
      });
    } else {
      onAddMember({
        name: name.trim(),
        email: email.trim() || undefined,
        role: role.trim(),
        bio: bio.trim(),
        status: 'online',
        initial: name.trim().charAt(0).toUpperCase(),
        accentColor,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <section id="squad" className="py-20 border-t border-blue-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              United Brotherhood &amp; Fellowship
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              The Family Roster
            </h2>
            <p className="text-sm text-blue-200 mt-2 max-w-2xl leading-relaxed">
              Brothers and sisters dedicated to helping others, upholding peace, and loving one another since 2021.
            </p>
          </div>

          <div>
            {isSuperAdmin ? (
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/40 hover:opacity-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                + Add Member to Roster (Admin)
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#071740] border border-blue-800 text-xs text-blue-300">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Roster managed by Super Admins</span>
              </div>
            )}
          </div>
        </div>

        {/* Roster Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roster.map((member) => {
            const isLeader = member.email === 'concoituze@gmail.com' || member.email === 'concorderuhungande@gmail.com';

            return (
              <div
                key={member.id}
                className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isLeader
                    ? 'bg-gradient-to-b from-[#0d276b]/70 via-[#071740] to-[#040d27] border-amber-500/80 shadow-xl shadow-amber-950/30'
                    : 'bg-[#071740] border-blue-900/80 hover:border-blue-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: member.accentColor }}
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md border border-white/20"
                      >
                        {member.initial}
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                          {member.name}
                          {isLeader && <Crown className="w-4 h-4 text-amber-400" />}
                        </h3>
                        {member.email && (
                          <div className="text-[11px] text-amber-300/90 font-mono">
                            {member.email}
                          </div>
                        )}
                      </div>
                    </div>

                    {isSuperAdmin && (
                      <button
                        onClick={() => openEdit(member)}
                        className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 hover:text-amber-400 transition-colors"
                        title="Edit Member"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2">
                    {member.role}
                  </div>

                  <p className="text-xs text-blue-200/90 leading-relaxed mb-4">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-blue-900/60 flex items-center justify-between text-[11px]">
                  <span className="text-amber-400 font-bold italic">
                    &ldquo;Our love never fail&rdquo;
                  </span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Add/Edit Member Modal */}
      {isModalOpen && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#061234] border-2 border-amber-500/80 rounded-3xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900 mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {editingId ? 'Edit Roster Member' : 'Add Family Member'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-300 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sister Maria"
                  className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                  Gmail / Contact (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                  Assigned Ministry / Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Hospital Visitation Lead"
                  className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                  Biography &amp; Service Note
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  placeholder="Coordinates welfare drives and weekly fellowship."
                  className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-blue-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-blue-950 text-blue-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
