import type { TrendPoint } from '../engine/simulationEngine';

interface Props { title: string; data: TrendPoint[]; color?: string; unit?: string; }

export default function MiniChart({ title, data, color = '#16A34A', unit = '' }: Props) {
  if (!data.length) return null;
  const values = data.map(d => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const h = 80;
  const w = 200;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-[0_2px_8px_rgba(15,23,42,.05)]">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">{title}</h4>
        <span className="text-sm font-bold text-[#0F172A]">{values[values.length - 1].toLocaleString()}{unit}</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
        <defs>
          <linearGradient id={`grad-${title.replace(/\s/g,'')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${h} ${points} ${w},${h}`}
          fill={`url(#grad-${title.replace(/\s/g,'')})`}
        />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex justify-between text-[9px] text-[#94A3B8] mt-1">
        <span>{data[0].time}</span>
        <span>{data[data.length - 1].time}</span>
      </div>
    </div>
  );
}
