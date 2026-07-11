import { motion } from 'framer-motion';
import { X, LogOut, Mail, Shield, Settings } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function ProfilePanel() {
  const { showProfile, toggleProfile, userProfile, setRole, setUserProfile } = useAppStore();
  const navigate = useNavigate();

  if (!showProfile) return null;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // Firebase not configured — just navigate away
    }
    setRole('fan' as any); // reset
    setUserProfile(null);
    toggleProfile();
    navigate('/');
  };

  const displayName = userProfile?.displayName || 'Ops Administrator';
  const email = userProfile?.email || 'admin@fanflow.ai';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={toggleProfile} />

      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        className="absolute right-4 top-12 w-72 bg-white border border-[#E2E8F0] rounded-lg shadow-[0_4px_24px_rgba(15,23,42,.1)] z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-5 bg-[#0F172A] text-white relative">
          <button onClick={toggleProfile} className="absolute top-3 right-3 text-white/60 hover:text-white p-1 rounded transition-colors">
            <X size={16} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#16A34A]/20 border-2 border-[#16A34A]/40 flex items-center justify-center">
              <span className="text-sm font-bold text-[#22C55E]">{initials}</span>
            </div>
            <div>
              <div className="font-semibold text-sm">{displayName}</div>
              <div className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                <Mail size={12} />
                {email}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <div className="px-4 py-1 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Account</div>
          
          <button className="w-full text-left px-5 py-2.5 text-sm text-[#0F172A] hover:bg-[#F8FAFC] transition-colors flex items-center gap-3">
            <Settings size={16} className="text-[#64748B]" />
            Settings
          </button>
          
          <button className="w-full text-left px-5 py-2.5 text-sm text-[#0F172A] hover:bg-[#F8FAFC] transition-colors flex items-center gap-3">
            <Shield size={16} className="text-[#64748B]" />
            Security & Access
          </button>
        </div>

        <div className="border-t border-[#E5E7EB] py-2">
          <button
            onClick={handleSignOut}
            className="w-full text-left px-5 py-2.5 text-sm text-[#EF4444] hover:bg-[#FEF2F2] transition-colors flex items-center gap-3"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </motion.div>
    </>
  );
}
