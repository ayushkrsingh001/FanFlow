import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getStadiumOps, tickStadiumOps } from '../engine/simulationEngine';
import type { StadiumOpsData } from '../engine/simulationEngine';
import { motion } from 'framer-motion';
import {
  Activity, Users, Car, CloudSun, Shield, Wifi, Volume2,
  Zap, Droplets, Wind, Thermometer, AlertTriangle, Brain,
  Clock, Trophy, Radio, Heart, Footprints
} from 'lucide-react';
import MetricCard from './MetricCard';
import HeatMapPanel from './HeatMapPanel';
import MiniChart from './MiniChart';

export default function PulseDashboard() {
  const { selectedVenue } = useAppStore();
  const [ops, setOps] = useState<StadiumOpsData>(() => getStadiumOps(selectedVenue));
  const [isLive, setIsLive] = useState(true);

  useEffect(() => { setOps(getStadiumOps(selectedVenue)); }, [selectedVenue]);

  const tick = useCallback(() => {
    setOps(tickStadiumOps(selectedVenue));
  }, [selectedVenue]);

  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(tick, 25000);
    return () => clearInterval(id);
  }, [isLive, tick]);

  const fmtTime = new Date(ops.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Stadium Command Center</h2>
            <span className="text-[10px] bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] px-2 py-0.5 rounded-full font-semibold">SIMULATED LIVE OPS</span>
          </div>
          <p className="text-sm text-[#64748B] mt-0.5">
            {ops.stadiumName} — {ops.city} · Last update: {fmtTime}
          </p>
        </div>
        <button onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md border flex items-center gap-1.5 ${
            isLive ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]' : 'bg-white border-[#E2E8F0] text-[#64748B]'
          }`}>
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#22C55E] animate-pulse' : 'bg-[#94A3B8]'}`} />
          {isLive ? 'Live' : 'Paused'}
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard label="Attendance" value={ops.currentAttendance.toLocaleString()} icon={<Users size={14} />} subtitle={`${ops.occupancyPct}% capacity`} />
        <MetricCard label="Avg Wait" value={`${ops.avgWaitTime} min`} icon={<Clock size={14} />} subtitle="Gate entry" warning={ops.avgWaitTime > 12} />
        <MetricCard label="Parking" value={ops.totalParkingRemaining.toLocaleString()} icon={<Car size={14} />} subtitle="Spots remaining" warning={ops.totalParkingRemaining < 1000} />
        <MetricCard label="Temperature" value={`${Math.round(ops.weather.temperature)}°C`} icon={<Thermometer size={14} />} subtitle={ops.weather.condition} />
        <MetricCard label="Medical" value={ops.medicalRequests} icon={<Heart size={14} />} subtitle="Active requests" critical={ops.medicalRequests > 10} />
        <MetricCard label="WiFi Load" value={`${ops.wifiLoad}%`} icon={<Wifi size={14} />} subtitle={ops.networkStatus} warning={ops.wifiLoad > 80} />
      </div>

      {/* Match Banner */}
      <div className="bg-[#0F172A] rounded-lg p-5 text-white flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          <Trophy size={14} className="text-[#F59E0B]" /> Live Match
        </div>
        <div className="flex-1 flex items-center justify-center gap-6 text-center">
          <span className="text-lg font-bold">{ops.match.homeTeam}</span>
          <span className="text-3xl font-black text-[#22C55E]">{ops.match.score}</span>
          <span className="text-lg font-bold">{ops.match.awayTeam}</span>
        </div>
        <div className="flex gap-6 text-xs text-[#94A3B8]">
          <div><span className="text-white font-bold">{ops.match.currentMinute}'</span> min</div>
          <div>Poss <span className="text-white font-bold">{ops.match.possession}%</span></div>
          <div>Shots <span className="text-white font-bold">{ops.match.shotsHome}-{ops.match.shotsAway}</span></div>
          <div>Corners <span className="text-white font-bold">{ops.match.cornersHome}-{ops.match.cornersAway}</span></div>
          <div>Cards <span className="text-[#F59E0B] font-bold">{ops.match.yellowCards}Y</span> <span className="text-[#EF4444] font-bold">{ops.match.redCards}R</span></div>
        </div>
      </div>

      {/* Gate & Parking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-[0_2px_8px_rgba(15,23,42,.05)]">
          <h3 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2"><Footprints size={14} className="text-[#16A34A]" /> Gate Operations</h3>
          <div className="space-y-2">
            {ops.gates.map(g => (
              <div key={g.id} className="flex items-center gap-3 text-xs">
                <span className="w-16 font-semibold text-[#0F172A]">{g.name}</span>
                <div className="flex-1 h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${Math.min((g.crowd / 4000) * 100, 100)}%` }} transition={{ duration: 0.6 }}
                    className={`h-full rounded-full ${g.crowd > 3000 ? 'bg-[#EF4444]' : g.crowd > 2000 ? 'bg-[#F59E0B]' : 'bg-[#16A34A]'}`} />
                </div>
                <span className="w-16 text-right text-[#64748B]">{g.crowd.toLocaleString()}</span>
                <span className="w-16 text-right text-[#64748B]">Q: {g.queueLength}</span>
                <span className="w-16 text-right text-[#64748B]">{g.waitTime}m wait</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-[0_2px_8px_rgba(15,23,42,.05)]">
          <h3 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2"><Car size={14} className="text-[#16A34A]" /> Parking Status</h3>
          <div className="space-y-2">
            {ops.parking.map(p => (
              <div key={p.id} className="flex items-center gap-3 text-xs">
                <span className="w-28 font-semibold text-[#0F172A] truncate">{p.name}</span>
                <div className="flex-1 h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${p.occupancyPct}%` }} transition={{ duration: 0.6 }}
                    className={`h-full rounded-full ${p.occupancyPct > 85 ? 'bg-[#EF4444]' : p.occupancyPct > 65 ? 'bg-[#F59E0B]' : 'bg-[#16A34A]'}`} />
                </div>
                <span className={`w-10 text-right font-bold ${p.occupancyPct > 85 ? 'text-[#EF4444]' : 'text-[#0F172A]'}`}>{p.occupancyPct}%</span>
                <span className="w-20 text-right text-[#64748B]">{p.remaining} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Environment & Staff */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <MetricCard label="Humidity" value={`${Math.round(ops.weather.humidity)}%`} icon={<Droplets size={14} />} />
        <MetricCard label="Wind" value={`${ops.weather.windSpeed.toFixed(1)} km/h`} icon={<Wind size={14} />} />
        <MetricCard label="AQI" value={ops.weather.airQuality} icon={<CloudSun size={14} />} subtitle={ops.weather.airQuality > 60 ? 'Moderate' : 'Good'} />
        <MetricCard label="Noise" value={`${ops.noiseLevel} dB`} icon={<Volume2 size={14} />} warning={ops.noiseLevel > 90} />
        <MetricCard label="Metro" value={ops.metroCrowd} icon={<Activity size={14} />} subtitle="Crowd level" />
        <MetricCard label="Taxi Wait" value={`${ops.taxiWaitTime} min`} icon={<Clock size={14} />} />
        <MetricCard label="Security" value={ops.securityCount} icon={<Shield size={14} />} subtitle="Personnel" />
        <MetricCard label="Volunteers" value={ops.volunteerCount} icon={<Users size={14} />} subtitle="Active" />
      </div>

      {/* Facilities */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard label="Toilets" value={`${ops.toiletOccupancyPct}%`} subtitle="Occupancy" warning={ops.toiletOccupancyPct > 70} />
        <MetricCard label="Water Queue" value={ops.waterStationQueue} subtitle="People waiting" />
        <MetricCard label="Charging" value={`${ops.chargingStationUsage}%`} icon={<Zap size={14} />} subtitle="Station usage" />
        <MetricCard label="Lost & Found" value={ops.lostFoundReports} subtitle="Active reports" />
        <MetricCard label="Accessibility" value={ops.accessibilityRequests} subtitle="Requests" />
        <MetricCard label="Power" value={ops.powerStatus} icon={<Radio size={14} />} subtitle={ops.emergencyStatus} />
      </div>

      {/* Food Courts */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-[0_2px_8px_rgba(15,23,42,.05)]">
        <h3 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2">Food Court Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {ops.foodCourts.map(f => (
            <div key={f.id} className={`border rounded-md p-3 ${f.densityPct > 80 ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-[#E2E8F0] bg-white'}`}>
              <div className="text-sm font-semibold text-[#0F172A]">{f.name}</div>
              <div className="flex justify-between text-xs text-[#64748B] mt-1">
                <span>Queue: {f.queueLength}</span>
                <span>Wait: {f.waitTime}m</span>
                <span className={`font-bold ${f.densityPct > 80 ? 'text-[#EF4444]' : 'text-[#0F172A]'}`}>{f.densityPct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heat Maps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HeatMapPanel title="Crowd Density" zones={ops.crowdHeat} />
        <HeatMapPanel title="Parking Density" zones={ops.parkingHeat} />
        <HeatMapPanel title="Food Court Load" zones={ops.foodHeat} />
        <HeatMapPanel title="Restroom Usage" zones={ops.restroomHeat} />
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniChart title="Crowd Trend" data={ops.crowdTrend} color="#16A34A" />
        <MiniChart title="Parking Trend" data={ops.parkingTrend} color="#F59E0B" />
        <MiniChart title="Gate Traffic" data={ops.gateTrend} color="#2563EB" />
        <MiniChart title="Temperature" data={ops.weatherTrend} color="#64748B" unit="°C" />
      </div>

      {/* AI Predictions & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-[0_2px_8px_rgba(15,23,42,.05)]">
          <h3 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2"><Brain size={14} className="text-[#16A34A]" /> AI Predictions</h3>
          <div className="space-y-2">
            {ops.predictions.map(p => (
              <div key={p.id} className={`flex items-start gap-2 text-xs p-2.5 rounded-md border ${
                p.severity === 'critical' ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]' :
                p.severity === 'warning' ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]' : 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
              }`}>
                <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{p.message}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-[0_2px_8px_rgba(15,23,42,.05)]">
          <h3 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2"><Brain size={14} className="text-[#2563EB]" /> AI Insights</h3>
          <div className="space-y-2">
            {ops.insights.map(ins => (
              <div key={ins.id} className="flex items-start gap-2 text-xs p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#16A34A] font-bold uppercase text-[10px] bg-[#F0FDF4] border border-[#BBF7D0] px-1.5 py-0.5 rounded flex-shrink-0">{ins.category}</span>
                <span className="text-[#64748B] leading-relaxed">{ins.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Match Details */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-[0_2px_8px_rgba(15,23,42,.05)]">
        <h3 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2"><Trophy size={14} className="text-[#F59E0B]" /> Match Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div><span className="text-[#64748B]">Status</span><div className="font-bold text-[#0F172A] mt-0.5">{ops.match.status}</div></div>
          <div><span className="text-[#64748B]">Kickoff</span><div className="font-bold text-[#0F172A] mt-0.5">{ops.match.kickoffTime}</div></div>
          <div><span className="text-[#64748B]">Referee</span><div className="font-bold text-[#0F172A] mt-0.5">{ops.match.referee}</div></div>
          <div><span className="text-[#64748B]">Attendance</span><div className="font-bold text-[#0F172A] mt-0.5">{ops.currentAttendance.toLocaleString()}</div></div>
          <div><span className="text-[#64748B]">Expected Exit</span><div className="font-bold text-[#0F172A] mt-0.5">{ops.match.expectedExitTime}</div></div>
          <div><span className="text-[#64748B]">Weather</span><div className="font-bold text-[#0F172A] mt-0.5">{ops.weather.condition}, {Math.round(ops.weather.temperature)}°C</div></div>
        </div>
      </div>
    </div>
  );
}
