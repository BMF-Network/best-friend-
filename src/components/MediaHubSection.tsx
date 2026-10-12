import React, { useState } from 'react';
import { 
  Play, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  X, 
  Eye, 
  Crown, 
  Lock 
} from 'lucide-react';
import { MediaItem, BMFUser } from '../types/bmf';

interface MediaHubSectionProps {
  currentUser: BMFUser | null;
  mediaItems: MediaItem[];
  onAddMedia: (item: Omit<MediaItem, 'id' | 'dateAdded'>) => void;
  onDeleteMedia: (id: string) => void;
  onOpenAuth: () => void;
}

export const MediaHubSection: React.FC<MediaHubSectionProps> = ({
  currentUser,
  mediaItems,
  onAddMedia,
  onDeleteMedia,
  onOpenAuth,
}) => {
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Active view states
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [activePhoto, setActivePhoto] = useState<{ url: string; title: string; subtitle: string } | null>(null);

  // Add media modal for Admin
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaSubtitle, setMediaSubtitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaThumbnail, setMediaThumbnail] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('video');
  const [mediaCategory, setMediaCategory] = useState('Outreach Testimonies');

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim() || !mediaUrl.trim()) return;

    onAddMedia({
      type: mediaType,
      title: mediaTitle.trim(),
      subtitle: mediaSubtitle.trim() || 'Shared with the Best Mate Family.',
      url: mediaUrl.trim(),
      thumbnail: mediaThumbnail.trim() || (mediaType === 'photo' ? mediaUrl.trim() : 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'),
      category: mediaCategory,
    });

    setMediaTitle('');
    setMediaSubtitle('');
    setMediaUrl('');
    setMediaThumbnail('');
    setIsAddModalOpen(false);
  };

  return (
    <section id="media" className="py-20 border-t border-blue-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              Shared Family Gallery
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Pictures &amp; Video Testimonies
            </h2>
            <p className="text-sm text-blue-200 mt-2 max-w-2xl leading-relaxed">
              All members can watch inspiring video testimonies, view photographs of our benevolence drives, and celebrate peace.
            </p>
          </div>

          <div>
            {isSuperAdmin ? (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/40 hover:opacity-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                + Add Media (Admin)
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#071740] border border-blue-800 text-xs text-blue-300">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Media uploads managed by Super Admins</span>
              </div>
            )}
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.type === 'video') {
                  setActiveVideo({ url: item.url, title: item.title });
                } else {
                  setActivePhoto({ url: item.url, title: item.title, subtitle: item.subtitle });
                }
              }}
              className="relative rounded-2xl overflow-hidden border border-blue-900/80 bg-[#071740] min-h-[300px] flex flex-col justify-end p-5 group cursor-pointer hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              {/* Background Thumbnail Image */}
              <img
                src={item.thumbnail}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040d27] via-[#040d27]/70 to-transparent" />

              {/* Play Badge if Video */}
              {item.type === 'video' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-amber-400 transition-all">
                  <Play className="w-6 h-6 fill-slate-950 ml-1" />
                </div>
              )}

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-amber-400 font-extrabold uppercase tracking-wider">
                    {item.type === 'video' ? 'Playable Video' : 'Photo'} · {item.category}
                  </span>

                  {isSuperAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete ${item.title}?`)) {
                          onDeleteMedia(item.id);
                        }
                      }}
                      className="p-1 rounded-md bg-rose-950/80 hover:bg-rose-900 text-rose-300 transition-colors"
                      title="Delete as Admin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-blue-200/90 mt-1 line-clamp-2">
                  {item.subtitle}
                </p>

                <div className="mt-3 flex items-center justify-between text-[10px] text-blue-300">
                  <span>{item.dateAdded}</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Click to {item.type === 'video' ? 'Watch' : 'View'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-[#061234] border-2 border-amber-500 rounded-3xl p-5 text-white shadow-2xl relative">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-[#071740] border border-blue-900 text-blue-300 hover:text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-3 pr-10 font-display">
              {activeVideo.title}
            </h3>

            <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-blue-900">
              <video
                src={activeVideo.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            <div className="mt-3 text-xs text-blue-300 text-center italic">
              BMF Video Vault · &ldquo;Our love never fail&rdquo;
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#061234] border-2 border-amber-500 rounded-3xl p-5 text-white shadow-2xl relative">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-[#071740] border border-blue-900 text-blue-300 hover:text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 font-display">
              {activePhoto.title}
            </h3>
            <p className="text-xs text-blue-200 mb-3">{activePhoto.subtitle}</p>

            <div className="rounded-2xl overflow-hidden bg-black max-h-[460px] flex items-center justify-center border border-blue-900">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Super Admin Add Media Modal */}
      {isAddModalOpen && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#061234] border-2 border-amber-500/80 rounded-3xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900 mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Add Media to Library (Super Admin)
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-blue-300 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                  Media Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`py-2 rounded-xl font-bold ${
                      mediaType === 'video' ? 'bg-amber-500 text-slate-950' : 'bg-blue-950 text-blue-300'
                    }`}
                  >
                    Playable Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('photo')}
                    className={`py-2 rounded-xl font-bold ${
                      mediaType === 'photo' ? 'bg-amber-500 text-slate-950' : 'bg-blue-950 text-blue-300'
                    }`}
                  >
                    High-Res Photo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  placeholder="e.g. Summer Peace Gathering Recap"
                  className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                  Description / Caption
                </label>
                <input
                  type="text"
                  value={mediaSubtitle}
                  onChange={(e) => setMediaSubtitle(e.target.value)}
                  placeholder="e.g. Fellowship testimonies and blessings..."
                  className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                  Media URL (MP4 Video or Image URL)
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                  Thumbnail Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={mediaThumbnail}
                  onChange={(e) => setMediaThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#03091e] border border-blue-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-blue-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-blue-950 text-blue-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold"
                >
                  Publish Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
