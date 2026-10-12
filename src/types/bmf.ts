export interface BMFUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'super_admin' | 'member';
  authMethod: 'google' | 'password';
  verifiedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Urgent Action' | 'Pinned Bulletin' | 'Care Fund' | 'Assembly';
  author: string;
  date: string;
  urgent?: boolean;
  pinned?: boolean;
  actionText?: string;
}

export interface FamilySticker {
  id: string;
  title: string;
  slogan: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
  isBroadcast?: boolean;
  sticker?: FamilySticker;
  reactions?: Record<string, number>;
}

export interface BoardNote {
  id: string;
  author: string;
  email: string;
  tag: 'Helping Others' | 'Peace & Harmony' | 'Family Love & Support' | 'Prayer & Healing';
  content: string;
  timestamp: string;
  isAdmin?: boolean;
  featured?: boolean;
  reactions?: Record<string, number>;
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  subtitle: string;
  url: string;
  thumbnail: string;
  category: string;
  dateAdded: string;
}

export interface RosterMember {
  id: string;
  name: string;
  email?: string;
  role: string;
  bio: string;
  location?: string;
  status: 'online' | 'busy' | 'offline';
  initial: string;
  accentColor: string;
}

export interface CallParticipant {
  id: string;
  name: string;
  email?: string;
  role: string;
  initial: string;
  color: string;
  isHost?: boolean;
  isSpeaking?: boolean;
  handRaised?: boolean;
  micMuted?: boolean;
  cameraOff?: boolean;
  reaction?: string;
}

export interface AdminBroadcastAlert {
  id: string;
  senderName: string;
  senderEmail: string;
  title: string;
  message: string;
  timestamp: string;
}
