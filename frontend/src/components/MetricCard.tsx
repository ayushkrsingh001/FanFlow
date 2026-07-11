import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  warning?: boolean;
  critical?: boolean;
}

export default function MetricCard({ label, value, icon, subtitle, trend, trendUp, warning, critical }: MetricCardProps) {
  const borderColor = critical ? 'border-[#FCA5A5]' : warning ? 'border-[#FDE68A]' : 'border-[#E2E8F0]';
  const bg = critical ? 'bg-[#FEF2F2]' : warning ? 'bg-[#FFFBEB]' : 'bg-white';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bg} border ${borderColor} rounded-lg p-4 shadow-[0_2px_8px_rgba(15,23,42,.05)]`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">{label}</span>
        {icon && <span className="text-[#16A34A]">{icon}</span>}
      </div>
      <span className={`text-2xl font-bold ${critical ? 'text-[#EF4444]' : 'text-[#0F172A]'}`}>{value}</span>
      {subtitle && <div className="mt-1 text-xs text-[#64748B]">{subtitle}</div>}
      {trend && (
        <div className={`mt-1 text-xs font-medium flex items-center gap-1 ${trendUp ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      )}
    </motion.div>
  );
}
