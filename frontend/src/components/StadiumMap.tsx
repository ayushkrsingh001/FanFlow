
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';

export default function StadiumMap({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 280 }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-[#F8FAFC] border-b border-[#E5E7EB] relative overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-white border border-[#E2E8F0] rounded-md shadow-sm text-[#64748B] hover:text-[#0F172A] z-20 transition-colors"
          >
            <X size={16} />
          </button>
          
          <div className="absolute top-4 left-4 z-20 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-md shadow-sm text-xs font-semibold text-[#0F172A]">
            Venue Map Preview
          </div>

          <div className="w-full h-full relative flex items-center justify-center">
            {/* Minimal SVG Stadium Representation */}
            <svg viewBox="0 0 400 200" className="w-full h-full opacity-80">
              <ellipse cx="200" cy="100" rx="150" ry="80" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
              <ellipse cx="200" cy="100" rx="130" ry="60" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
              <rect x="150" y="70" width="100" height="60" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1"/>
              <circle cx="200" cy="100" r="10" fill="none" stroke="#CBD5E1" strokeWidth="1"/>
              <line x1="200" y1="70" x2="200" y2="130" stroke="#CBD5E1" strokeWidth="1"/>
              
              {/* Zones */}
              <text x="50" y="105" fill="#64748B" fontSize="10" fontWeight="600">Gate W</text>
              <text x="320" y="105" fill="#64748B" fontSize="10" fontWeight="600">Gate E</text>
              <text x="180" y="35" fill="#64748B" fontSize="10" fontWeight="600">Gate N</text>
              <text x="180" y="175" fill="#64748B" fontSize="10" fontWeight="600">Gate S</text>
            </svg>

            {/* Simulated Path / Pin */}
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute text-[#16A34A] flex flex-col items-center"
              style={{ top: '35%', left: '48%' }}
            >
              <MapPin fill="currentColor" size={24} className="text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
              <span className="text-[10px] font-bold bg-white border border-[#E2E8F0] shadow-sm px-1.5 py-0.5 rounded text-[#0F172A] mt-1">
                Sec 112
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
