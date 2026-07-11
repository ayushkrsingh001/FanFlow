import { useRef } from 'react';
import ChatInterface, { type ChatInterfaceHandle } from '../components/ChatInterface';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, Navigation, Accessibility, ShieldAlert, Train, Thermometer, Coffee, ShoppingBag, Wifi, Info, Ticket } from 'lucide-react';

export default function FanApp() {
  const navigate = useNavigate();
  const { selectedVenue, setSelectedVenue, venues } = useAppStore();
  const chatRef = useRef<ChatInterfaceHandle>(null);

  const quickActions = [
    { label: 'Find My Seat', message: 'How do I find my seat in Section 112?', icon: Navigation },
    { label: 'Accessible Routes', message: 'What are the step-free accessible routes from the nearest gate?', icon: Accessibility },
    { label: 'Emergency Info', message: 'Where is the nearest first-aid station and emergency exit?', icon: ShieldAlert },
    { label: 'Transit Options', message: 'What is the cheapest and greenest way back to downtown?', icon: Train },
    { label: 'Weather & Climate', message: 'Will it rain during the match? Is this stadium air-conditioned?', icon: Thermometer },
    { label: 'Food & Dining', message: 'Are there any vegan or halal food options?', icon: Coffee },
    { label: 'Clear Bag Policy', message: 'What is the stadium clear bag policy? Can I bring a backpack?', icon: ShoppingBag },
    { label: 'Wi-Fi & Connectivity', message: 'What is the stadium Wi-Fi network and password?', icon: Wifi },
    { label: 'Ticketing Issues', message: 'What if I lost my digital ticket or my phone died?', icon: Ticket },
    { label: 'Restrooms', message: 'Where is the nearest restroom from the main entrance?', icon: Info },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r border-[#E5E7EB] flex-col">
        <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-2">
          <img src="/logo-nav.webp" alt="FanFlow AI" width="146" height="32" className="h-8 mix-blend-multiply object-contain" fetchPriority="high" />
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">Current Venue</label>
          <select 
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            className="w-full p-2 text-sm bg-white border border-[#E2E8F0] rounded-md text-[#0F172A] focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] outline-none"
          >
            {venues.map(v => (
              <option key={v.id} value={v.id}>{v.city} - {v.name}</option>
            ))}
          </select>

          <div className="mt-8">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">Quick Actions</label>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => chatRef.current?.sendMessage(action.message)}
                  className="w-full text-left px-3 py-2.5 text-sm text-[#334155] hover:bg-[#F0FDF4] hover:text-[#16A34A] rounded-md transition-colors flex items-center gap-2.5"
                >
                  <action.icon size={16} className="text-[#94A3B8] flex-shrink-0" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-[#E5E7EB]">
           <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors w-full">
            <ArrowLeft size={16} /> Exit App
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-white">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate('/')} aria-label="Go back" className="text-[#64748B]">
                <ArrowLeft size={20} />
             </button>
             <img src="/logo-nav.webp" alt="FanFlow AI" width="146" height="32" className="h-8 mix-blend-multiply object-contain" fetchPriority="high" />
          </div>
          <button aria-label="Open menu" className="text-[#64748B]">
             <Menu size={20} />
          </button>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface ref={chatRef} />
        </div>
      </div>
    </div>
  );
}
