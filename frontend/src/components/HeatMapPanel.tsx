import { motion } from 'framer-motion';
import type { HeatZone } from '../engine/simulationEngine';

interface Props { title: string; zones: HeatZone[]; }

const getColor = (d: number) =>
  d > 80 ? '#EF4444' : d > 60 ? '#F59E0B' : d > 40 ? '#16A34A' : '#2563EB';

export default function HeatMapPanel({ title, zones }: Props) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-[0_2px_8px_rgba(15,23,42,.05)]">
      <h4 className="text-sm font-bold text-[#0F172A] mb-3">{title}</h4>
      <div className="space-y-2">
        {zones.map((z, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-[#64748B] w-28 truncate">{z.zone}</span>
            <div className="flex-1 h-4 bg-[#F1F5F9] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${z.density}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full"
                style={{ backgroundColor: getColor(z.density) }}
              />
            </div>
            <span className="text-xs font-semibold w-10 text-right" style={{ color: getColor(z.density) }}>
              {z.density}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
