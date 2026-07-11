import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PulseDashboard from '../components/PulseDashboard';
import StaffRoster from '../components/StaffRoster';
import NotificationsPanel from '../components/NotificationsPanel';
import ProfilePanel from '../components/ProfilePanel';
import { useAppStore } from '../store/useAppStore';
import { auth } from '../lib/firebase';
import { LayoutDashboard, Users, Bell, Search, LogOut } from 'lucide-react';

export default function OpsConsole() {
  const navigate = useNavigate();
  const {
    selectedVenue,
    setSelectedVenue,
    activeOpsTab,
    setActiveOpsTab,
    notifications,
    toggleNotifications,
    showNotifications,
    toggleProfile,
    showProfile,
    setUserProfile,
    userProfile,
    venues,
  } = useAppStore();

  // Sync Firebase auth user into store
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserProfile({
          displayName: user.displayName || 'Ops Admin',
          email: user.email || 'admin@fanflow.ai',
          photoURL: user.photoURL,
        });
      }
    });
    return () => unsub();
  }, [setUserProfile]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayName = userProfile?.displayName || 'Ops Admin';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sidebarItems = [
    { id: 'dashboard' as const, label: 'Pulse Dashboard', icon: LayoutDashboard },
    { id: 'roster' as const, label: 'Staff Roster', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col hidden md:flex">
        <div className="h-14 border-b border-[#E5E7EB] flex items-center px-4 gap-2">
           <img src="/logo-nav.webp" alt="FanFlow AI" width="146" height="32" className="h-8 mix-blend-multiply object-contain" fetchPriority="high" />
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
           <div className="px-3 mb-2 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Main Menu</div>
           <nav className="space-y-1 px-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveOpsTab(item.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium w-full text-left transition-colors ${
                    activeOpsTab === item.id
                      ? 'bg-[#F0FDF4] text-[#16A34A]'
                      : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
           </nav>
        </div>

        <div className="p-4 border-t border-[#E5E7EB]">
           <button onClick={() => navigate('/')} className="flex items-center gap-3 px-3 py-2 text-[#64748B] hover:text-[#0F172A] w-full text-sm font-medium transition-colors">
              <LogOut size={18} /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sm:px-6 lg:px-8 relative">
           <div className="flex items-center flex-1">
              <div className="max-w-md w-full lg:max-w-xs hidden sm:block relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-[#94A3B8]" />
                 </div>
                 <label htmlFor="ops-search" className="sr-only">Search</label>
                 <input id="ops-search" className="input-enterprise block w-full pl-10 pr-3 py-1.5 text-sm placeholder-[#94A3B8]" placeholder="Search metrics or zones..." type="search" />
              </div>
           </div>
           
           <div className="flex items-center gap-4 ml-4">
              <select 
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="input-enterprise text-sm py-1.5 pl-3 pr-8 hidden sm:block font-medium"
              >
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.city} - {v.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-3 border-l border-[#E5E7EB] pl-4">
                 {/* Notifications Button */}
                 <button 
                   onClick={toggleNotifications} 
                   aria-label="Toggle notifications"
                   className={`text-[#64748B] hover:text-[#0F172A] relative p-1 rounded transition-colors ${showNotifications ? 'text-[#16A34A]' : ''}`}
                 >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#EF4444] rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">{unreadCount}</span>
                      </span>
                    )}
                 </button>
                 
                 {/* Profile Button */}
                 <button
                   onClick={toggleProfile}
                   className={`w-8 h-8 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center cursor-pointer hover:border-[#16A34A] transition-colors ${showProfile ? 'border-[#16A34A]' : ''}`}
                 >
                    <span className="text-xs font-bold text-[#16A34A]">{initials}</span>
                 </button>
              </div>
           </div>

           {/* Dropdown Panels */}
           <NotificationsPanel />
           <ProfilePanel />
        </header>

        {/* Dashboard / Roster Area */}
        <main className="flex-1 overflow-hidden">
          {activeOpsTab === 'dashboard' && <PulseDashboard />}
          {activeOpsTab === 'roster' && <StaffRoster />}
        </main>
      </div>
    </div>
  );
}
