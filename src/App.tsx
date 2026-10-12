/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BMFUser, Announcement, ChatMessage, BoardNote, MediaItem, RosterMember, AdminBroadcastAlert } from './types/bmf';
import { 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_BOARD_NOTES, 
  INITIAL_MEDIA_ITEMS, 
  INITIAL_ROSTER, 
  INITIAL_CALL_PARTICIPANTS 
} from './data/initialData';
import { getDefaultUser, saveUserSession, playAdminBroadcastChime, isSuperAdminEmail } from './utils/auth';

import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { MeetingCallLounge } from './components/MeetingCallLounge';
import { MediaHubSection } from './components/MediaHubSection';
import { GroupChatSection } from './components/GroupChatSection';
import { FamilyRosterSection } from './components/FamilyRosterSection';
import { MessageBoardSection } from './components/MessageBoardSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AdminBroadcastBanner } from './components/AdminBroadcastBanner';
import { DailyQuote } from './components/DailyQuote';

export default function App() {
  // Current logged in user (defaults to stored session or initializes with concoituze@gmail.com from metadata if first time)
  const [currentUser, setCurrentUser] = useState<BMFUser | null>(() => {
    const saved = getDefaultUser();
    if (saved) return saved;

    // First time default initialization with the authenticated user from metadata
    const initialAdmin: BMFUser = {
      id: 'usr-admin-concoituze',
      name: 'Concoituze (Super Admin)',
      email: 'concoituze@gmail.com',
      role: 'super_admin',
      authMethod: 'google',
      verifiedAt: 'Just Now',
    };
    saveUserSession(initialAdmin);
    return initialAdmin;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [liveCount, setLiveCount] = useState(1024);

  // Core Data States with localStorage persistence
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('bmf_announcements');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('bmf_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CHAT_MESSAGES;
  });

  const [boardNotes, setBoardNotes] = useState<BoardNote[]>(() => {
    try {
      const saved = localStorage.getItem('bmf_board_notes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BOARD_NOTES;
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('bmf_media_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MEDIA_ITEMS;
  });

  const [roster, setRoster] = useState<RosterMember[]>(() => {
    try {
      const saved = localStorage.getItem('bmf_roster');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ROSTER;
  });

  // Admin Broadcast Alerts
  const [broadcastAlerts, setBroadcastAlerts] = useState<AdminBroadcastAlert[]>([
    {
      id: 'alert-initial',
      senderName: 'Concoituze (Super Admin)',
      senderEmail: 'concoituze@gmail.com',
      title: '👑 Official Admin Broadcast Announcement',
      message: 'Welcome all family members! Our love never fail. Shelter relief assembling this Saturday at 10 AM.',
      timestamp: '08:00 AM',
    },
  ]);
  const [activeBannerAlert, setActiveBannerAlert] = useState<AdminBroadcastAlert | null>(null);
  const [unreadAlertCount, setUnreadAlertCount] = useState(1);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('bmf_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('bmf_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('bmf_board_notes', JSON.stringify(boardNotes));
  }, [boardNotes]);

  useEffect(() => {
    localStorage.setItem('bmf_media_items', JSON.stringify(mediaItems));
  }, [mediaItems]);

  useEffect(() => {
    localStorage.setItem('bmf_roster', JSON.stringify(roster));
  }, [roster]);

  // Auth actions
  const handleLoginSuccess = (user: BMFUser) => {
    setCurrentUser(user);
    saveUserSession(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveUserSession(null);
  };

  const handleSwitchToAdmin = (email: 'concoituze@gmail.com' | 'concorderuhungande@gmail.com') => {
    const isConcoituze = email === 'concoituze@gmail.com';
    const adminUser: BMFUser = {
      id: `usr-admin-${Date.now()}`,
      name: isConcoituze ? 'Concoituze (Super Admin)' : 'Concorde Ruhungande (Super Admin)',
      email,
      role: 'super_admin',
      authMethod: 'google',
      verifiedAt: 'Just Now',
    };
    setCurrentUser(adminUser);
    saveUserSession(adminUser);
  };

  const handleSwitchToMember = () => {
    const memberUser: BMFUser = {
      id: `usr-member-${Date.now()}`,
      name: 'Brother David',
      email: 'david.care@gmail.com',
      role: 'member',
      authMethod: 'google',
      verifiedAt: 'Just Now',
    };
    setCurrentUser(memberUser);
    saveUserSession(memberUser);
  };

  // Broadcast Alert trigger
  const handleTriggerAdminAlert = (alert: AdminBroadcastAlert) => {
    setBroadcastAlerts(prev => [alert, ...prev]);
    setActiveBannerAlert(alert);
    setUnreadAlertCount(prev => prev + 1);
  };

  // Announcements CRUD (Super Admin only)
  const handleAddAnnouncement = (item: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...item,
      id: `ann-${Date.now()}`,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const handleUpdateAnnouncement = (id: string, updated: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Chat message send
  const handleSendMessage = (msgData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const handleDeleteMessage = (id: string) => {
    setChatMessages(prev => prev.filter(m => m.id !== id));
  };

  // Media CRUD (Super Admin only)
  const handleAddMedia = (item: Omit<MediaItem, 'id' | 'dateAdded'>) => {
    const newMedia: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      dateAdded: 'Just Now',
    };
    setMediaItems(prev => [newMedia, ...prev]);
  };

  const handleDeleteMedia = (id: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
  };

  // Roster CRUD (Super Admin only)
  const handleAddRosterMember = (member: Omit<RosterMember, 'id'>) => {
    const newMember: RosterMember = {
      ...member,
      id: `rost-${Date.now()}`,
    };
    setRoster(prev => [...prev, newMember]);
  };

  const handleUpdateRosterMember = (id: string, updated: Partial<RosterMember>) => {
    setRoster(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  };

  // Message Board CRUD
  const handleAddBoardNote = (note: Omit<BoardNote, 'id' | 'timestamp'>) => {
    const newNote: BoardNote = {
      ...note,
      id: `note-${Date.now()}`,
      timestamp: 'Just Now',
    };
    setBoardNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteBoardNote = (id: string) => {
    setBoardNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleToggleFeatureNote = (id: string) => {
    setBoardNotes(prev => prev.map(n => n.id === id ? { ...n, featured: !n.featured } : n));
  };

  const handleToggleChatReaction = (messageId: string, emoji: string) => {
    setChatMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      const currentCount = (msg.reactions && msg.reactions[emoji]) || 0;
      return {
        ...msg,
        reactions: {
          ...(msg.reactions || {}),
          [emoji]: currentCount + 1,
        },
      };
    }));
  };

  const handleToggleBoardReaction = (noteId: string, emoji: string) => {
    setBoardNotes(prev => prev.map(note => {
      if (note.id !== noteId) return note;
      const currentCount = (note.reactions && note.reactions[emoji]) || 0;
      return {
        ...note,
        reactions: {
          ...(note.reactions || {}),
          [emoji]: currentCount + 1,
        },
      };
    }));
  };

  return (
    <div className="min-h-screen bg-[#040d27] text-white selection:bg-amber-500 selection:text-slate-950">
      {/* Top Admin Broadcast Push Alert Banner */}
      <AdminBroadcastBanner 
        alert={activeBannerAlert} 
        onDismiss={() => setActiveBannerAlert(null)} 
      />

      {/* Main App Navigation Header */}
      <Header
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onSwitchToAdmin={handleSwitchToAdmin}
        onSwitchToMember={handleSwitchToMember}
        liveCount={liveCount}
        onSimulateCount={setLiveCount}
        broadcastAlerts={broadcastAlerts}
        unreadAlertCount={unreadAlertCount}
        onClearAlertCount={() => setUnreadAlertCount(0)}
      />

      <main>
        {/* Daily Inspirational Quote for Peace and Harmony */}
        <DailyQuote />

        {/* Hero Section */}
        <HeroSection
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          liveCount={liveCount}
        />

        {/* Announcements & Urgent Notices */}
        <AnnouncementsSection
          announcements={announcements}
          currentUser={currentUser}
          onAddAnnouncement={handleAddAnnouncement}
          onUpdateAnnouncement={handleUpdateAnnouncement}
          onDeleteAnnouncement={handleDeleteAnnouncement}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Live Call Lounge ("Attend Call") */}
        <MeetingCallLounge
          currentUser={currentUser}
          participants={INITIAL_CALL_PARTICIPANTS}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Pictures & Video Testimonies ("Watch") */}
        <MediaHubSection
          currentUser={currentUser}
          mediaItems={mediaItems}
          onAddMedia={handleAddMedia}
          onDeleteMedia={handleDeleteMedia}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Live Group Chat ("Write message & hide peer messages") */}
        <GroupChatSection
          currentUser={currentUser}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onDeleteMessage={handleDeleteMessage}
          onTriggerAdminAlert={handleTriggerAdminAlert}
          onToggleReaction={handleToggleChatReaction}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Family Roster */}
        <FamilyRosterSection
          currentUser={currentUser}
          roster={roster}
          onAddMember={handleAddRosterMember}
          onUpdateMember={handleUpdateRosterMember}
        />

        {/* Family Message Board */}
        <MessageBoardSection
          currentUser={currentUser}
          notes={boardNotes}
          onAddNote={handleAddBoardNote}
          onDeleteNote={handleDeleteBoardNote}
          onToggleFeature={handleToggleFeatureNote}
          onToggleNoteReaction={handleToggleBoardReaction}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Google Gmail & Masked Password Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
