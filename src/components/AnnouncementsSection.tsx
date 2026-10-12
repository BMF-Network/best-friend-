import React, { useState } from 'react';
import { 
  BellRing, 
  Pin, 
  AlertTriangle, 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  Lock, 
  CheckCircle,
  Crown
} from 'lucide-react';
import { Announcement, BMFUser } from '../types/bmf';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  currentUser: BMFUser | null;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  onUpdateAnnouncement: (id: string, updated: Partial<Announcement>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onOpenAuth: () => void;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  announcements,
  currentUser,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onOpenAuth,
}) => {
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Modal for Admin adding/editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<Announcement['category']>('Urgent Action');
  const [formAuthor, setFormAuthor] = useState('');
  const [formUrgent, setFormUrgent] = useState(false);
  const [formPinned, setFormPinned] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const openCreateModal = () => {
    if (!isSuperAdmin) return;
    setEditingId(null);
    setFormTitle('');
    setFormContent('');
    setFormCategory('Urgent Action');
    setFormAuthor(currentUser ? currentUser.name : 'Super Admin');
    setFormUrgent(true);
    setFormPinned(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Announcement) => {
    if (!isSuperAdmin) return;
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormContent(item.content);
    setFormCategory(item.category);
    setFormAuthor(item.author);
    setFormUrgent(!!item.urgent);
    setFormPinned(!!item.pinned);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (editingId) {
      onUpdateAnnouncement(editingId, {
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        author: formAuthor.trim() || 'Super Admin',
        urgent: formUrgent,
        pinned: formPinned,
      });
      triggerToast('Bulletin successfully updated by Super Admin.');
    } else {
      onAddAnnouncement({
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        author: formAuthor.trim() || 'Super Admin',
        date: 'Just Now',
        urgent: formUrgent,
        pinned: formPinned,
        actionText: formUrgent ? 'RSVP Attendance' : 'View Details',
      });
      triggerToast('New bulletin published across the family network.');
    }

    setIsModalOpen(false);
  };

  const triggerToast = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <section id="announcements" className="py-20 border-t border-blue-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-amber-400" />
              Official Notices &amp; Bulletins
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Family Announcements Area
            </h2>
            <p className="text-sm text-blue-200 mt-2 max-w-2xl leading-relaxed">
              Timely updates regarding local shelter food drives, peace assemblies, hospital visits, and urgent benevolent relief.
            </p>
          </div>

          {/* Admin Management Button */}
          <div>
            {isSuperAdmin ? (
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/40 hover:opacity-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                + Post New Bulletin (Admin)
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#071740] border border-blue-800 text-xs text-blue-300">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Bulletin editing restricted to Super Admins</span>
              </div>
            )}
          </div>
        </div>

        {actionNotice && (
          <div className="mb-6 p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {actionNotice}
          </div>
        )}

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 relative group border ${
                item.urgent 
                  ? 'bg-gradient-to-b from-[#1b0a26] via-[#071740] to-[#040d27] border-rose-600/70 shadow-lg shadow-rose-950/20' 
                  : item.pinned 
                    ? 'bg-gradient-to-b from-[#0e276b]/70 to-[#071740] border-amber-500/50' 
                    : 'bg-[#071740] border-blue-900/80 hover:border-blue-700'
              }`}
            >
              <div>
                {/* Badge & Date Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  {item.urgent ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-600/20 border border-rose-500 text-rose-300 text-[10px] font-black uppercase tracking-wider">
                      <AlertTriangle className="w-3 h-3" /> Urgent Action
                    </span>
                  ) : item.pinned ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                      <Pin className="w-3 h-3" /> Pinned Bulletin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-950 border border-blue-800 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                  )}

                  <span className="text-[11px] text-blue-300 font-medium">
                    {item.date}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-white mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-blue-200/90 leading-relaxed">
                  {item.content}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-4 border-t border-blue-900/60 flex items-center justify-between text-xs">
                <span className="text-amber-400 font-semibold text-[11px] truncate max-w-[150px]">
                  {item.author}
                </span>

                <div className="flex items-center gap-1.5">
                  {isSuperAdmin && (
                    <>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 hover:text-amber-400 transition-colors"
                        title="Edit as Super Admin"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this announcement?')) {
                            onDeleteAnnouncement(item.id);
                            triggerToast('Bulletin removed.');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors"
                        title="Delete as Super Admin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      if (!currentUser) {
                        onOpenAuth();
                      } else {
                        triggerToast(`Action confirmed: ${item.actionText || 'Acknowledged'}`);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                      item.urgent
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    {item.actionText || 'RSVP'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#061234] border-2 border-amber-500/80 rounded-3xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-900">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {editingId ? 'Edit Announcement (Super Admin)' : 'New Announcement (Super Admin)'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-blue-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Winter Coat Drive..."
                  className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                  Content Details
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={3}
                  placeholder="Provide instructions, meeting time, location..."
                  className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Announcement['category'])}
                    className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                  >
                    <option value="Urgent Action">Urgent Action</option>
                    <option value="Pinned Bulletin">Pinned Bulletin</option>
                    <option value="Care Fund">Care Fund</option>
                    <option value="Assembly">Assembly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                    Author / Signed By
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="Concoituze (Super Admin)"
                    className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formUrgent}
                    onChange={(e) => setFormUrgent(e.target.checked)}
                    className="rounded bg-blue-950 border-blue-800 text-rose-500 focus:ring-0"
                  />
                  <span className="text-rose-300 font-semibold">Mark as Urgent Action</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    className="rounded bg-blue-950 border-blue-800 text-amber-500 focus:ring-0"
                  />
                  <span className="text-amber-300 font-semibold">Pin to Top</span>
                </label>
              </div>

              <div className="pt-3 border-t border-blue-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-blue-950 text-blue-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold"
                >
                  Save Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
