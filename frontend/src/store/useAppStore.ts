import { create } from 'zustand';
import { getAllStadiumIds, getStadiumMeta } from '../engine/simulationEngine';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}

interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string | null;
}

interface AppState {
  role: 'fan' | 'volunteer' | null;
  setRole: (role: 'fan' | 'volunteer') => void;
  selectedVenue: string;
  setSelectedVenue: (venueId: string) => void;

  // Ops Console active tab
  activeOpsTab: 'dashboard' | 'roster';
  setActiveOpsTab: (tab: 'dashboard' | 'roster') => void;

  // Notifications
  notifications: Notification[];
  showNotifications: boolean;
  toggleNotifications: () => void;
  markNotificationRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;

  // Profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  showProfile: boolean;
  toggleProfile: () => void;

  // Available venues
  venues: { id: string; name: string; city: string }[];
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'High Query Volume — Gate C',
    message: 'Navigation queries at Gate C zone have exceeded the threshold. Consider deploying additional signage.',
    time: '2 min ago',
    read: false,
    type: 'alert',
  },
  {
    id: '2',
    title: 'AI Briefing Generated',
    message: 'A new shift briefing has been generated for the current time window. Review it in the Pulse Dashboard.',
    time: '8 min ago',
    read: false,
    type: 'info',
  },
  {
    id: '3',
    title: 'Shift Change Reminder',
    message: 'Volunteer shift rotation starts in 15 minutes. Ensure handoff notes are updated.',
    time: '12 min ago',
    read: true,
    type: 'info',
  },
  {
    id: '4',
    title: 'System Health: All Clear',
    message: 'All backend services are running optimally. Gemini API latency: 340ms avg.',
    time: '25 min ago',
    read: true,
    type: 'success',
  },
];

// Build venue list from simulation engine
const venueList = getAllStadiumIds().map(id => {
  const meta = getStadiumMeta(id);
  return { id, name: meta?.name || id, city: meta?.city || '' };
});

export const useAppStore = create<AppState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
  selectedVenue: 'atl-mbs',
  setSelectedVenue: (selectedVenue) => set({ selectedVenue }),

  activeOpsTab: 'dashboard',
  setActiveOpsTab: (activeOpsTab) => set({ activeOpsTab }),

  notifications: INITIAL_NOTIFICATIONS,
  showNotifications: false,
  toggleNotifications: () => set((s) => ({ showNotifications: !s.showNotifications, showProfile: false })),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  addNotification: (notification) =>
    set((s) => ({
      notifications: [
        { ...notification, id: Date.now().toString(), read: false },
        ...s.notifications,
      ],
    })),

  userProfile: null,
  setUserProfile: (userProfile) => set({ userProfile }),
  showProfile: false,
  toggleProfile: () => set((s) => ({ showProfile: !s.showProfile, showNotifications: false })),

  venues: venueList,
}));
