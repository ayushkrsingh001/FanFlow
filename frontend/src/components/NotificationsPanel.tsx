import { motion } from 'framer-motion';
import { X, AlertTriangle, Info, CheckCircle, Bell } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const TYPE_ICONS = {
  alert: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

const TYPE_COLORS = {
  alert: 'text-[#F59E0B] bg-[#FFFBEB]',
  info: 'text-[#2563EB] bg-[#EFF6FF]',
  success: 'text-[#16A34A] bg-[#F0FDF4]',
};

export default function NotificationsPanel() {
  const { notifications, showNotifications, toggleNotifications, markNotificationRead } = useAppStore();

  if (!showNotifications) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={toggleNotifications} />

      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        className="absolute right-12 top-12 w-96 max-h-[480px] bg-white border border-[#E2E8F0] rounded-lg shadow-[0_4px_24px_rgba(15,23,42,.1)] z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[#16A34A]" />
            <span className="font-semibold text-[#0F172A] text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-[#16A34A] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={toggleNotifications} className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#64748B]">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = TYPE_ICONS[notif.type];
              const colorClass = TYPE_COLORS[notif.type];
              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`px-5 py-4 border-b border-[#E5E7EB] last:border-b-0 cursor-pointer hover:bg-[#F8FAFC] transition-colors ${
                    !notif.read ? 'bg-[#F0FDF4]' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${colorClass}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm text-[#0F172A] truncate ${!notif.read ? 'font-semibold' : 'font-medium'}`}>
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#16A34A] flex-shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed line-clamp-2">{notif.message}</p>
                      <span className="text-xs text-[#94A3B8] mt-1.5 block">{notif.time}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </>
  );
}
