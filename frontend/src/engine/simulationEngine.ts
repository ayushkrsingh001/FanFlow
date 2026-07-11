// ============================================================
// FanFlow Simulation Engine — Realistic Stadium Operations Data
// Generates correlated, time-aware operational metrics
// Updates smoothly every 20-30 seconds
// ============================================================

import stadiumsData from '../data/stadiums.json';

// ---------- Utility ----------
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }
function rand(min: number, max: number) { return Math.random() * (max - min) + min; }
function randInt(min: number, max: number) { return Math.floor(rand(min, max + 1)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
// pick removed — unused

// ---------- Types ----------
export interface GateData {
  id: string; name: string; crowd: number; queueLength: number;
  waitTime: number; scanSpeed: number; securityQueue: number;
}
export interface ParkingData {
  id: string; name: string; capacity: number; occupied: number;
  remaining: number; occupancyPct: number;
}
export interface FoodCourtData {
  id: string; name: string; queueLength: number; waitTime: number;
  densityPct: number;
}
export interface WeatherData {
  temperature: number; humidity: number; airQuality: number;
  windSpeed: number; uvIndex: number; condition: string;
}
export interface MatchData {
  homeTeam: string; awayTeam: string; score: string;
  kickoffTime: string; currentMinute: number; status: string;
  possession: number; shotsHome: number; shotsAway: number;
  cornersHome: number; cornersAway: number;
  yellowCards: number; redCards: number;
  referee: string; expectedExitTime: string;
}
export interface PredictionData {
  id: string; message: string; severity: 'info' | 'warning' | 'critical';
  icon: string;
}
export interface InsightData {
  id: string; text: string; category: string;
}
export interface HeatZone {
  zone: string; density: number; label: string;
}
export interface TrendPoint { time: string; value: number; }

export interface StadiumOpsData {
  stadiumId: string;
  stadiumName: string;
  city: string;
  country: string;
  capacity: number;
  timestamp: number;
  // Attendance
  currentAttendance: number;
  occupancyPct: number;
  // Gates
  gates: GateData[];
  avgWaitTime: number;
  // Parking
  parking: ParkingData[];
  totalParkingOccupancy: number;
  totalParkingRemaining: number;
  // Transport
  metroCrowd: number;
  busQueue: number;
  taxiWaitTime: number;
  rideShareAvailability: number;
  // Weather
  weather: WeatherData;
  // Emergency
  emergencyStatus: string;
  medicalRequests: number;
  lostFoundReports: number;
  accessibilityRequests: number;
  // Facilities
  toiletOccupancyPct: number;
  foodCourts: FoodCourtData[];
  waterStationQueue: number;
  chargingStationUsage: number;
  noiseLevel: number;
  // Network
  wifiLoad: number;
  powerStatus: string;
  networkStatus: string;
  // Staff
  volunteerCount: number;
  securityCount: number;
  medicalTeamCount: number;
  cleaningStaffCount: number;
  // Match
  match: MatchData;
  // Predictions
  predictions: PredictionData[];
  // AI Insights
  insights: InsightData[];
  // Heat maps
  crowdHeat: HeatZone[];
  parkingHeat: HeatZone[];
  foodHeat: HeatZone[];
  restroomHeat: HeatZone[];
  // Trends (last 8 data points)
  crowdTrend: TrendPoint[];
  parkingTrend: TrendPoint[];
  gateTrend: TrendPoint[];
  weatherTrend: TrendPoint[];
}

// ---------- Match Templates ----------
const MATCHES: Record<string, { home: string; away: string; referee: string }> = {
  'atl-mbs': { home: 'Brazil', away: 'Germany', referee: 'Daniele Orsato (ITA)' },
  'sea-lumen': { home: 'Argentina', away: 'France', referee: 'Slavko Vinčić (SVN)' },
  'hou-nrg': { home: 'England', away: 'Spain', referee: 'Facundo Tello (ARG)' },
  'nyc-metlife': { home: 'USA', away: 'Mexico', referee: 'Jesús Valenzuela (VEN)' },
  'dal-att': { home: 'Portugal', away: 'Netherlands', referee: 'Ismail Elfath (USA)' },
  'mex-azteca': { home: 'Mexico', away: 'Japan', referee: 'Wilton Sampaio (BRA)' },
};

// Weather presets per city
const WEATHER_BASE: Record<string, { temp: number; humidity: number; condition: string }> = {
  'atl-mbs': { temp: 31, humidity: 65, condition: 'Partly Cloudy' },
  'sea-lumen': { temp: 22, humidity: 55, condition: 'Overcast' },
  'hou-nrg': { temp: 35, humidity: 72, condition: 'Sunny' },
  'nyc-metlife': { temp: 28, humidity: 60, condition: 'Clear' },
  'dal-att': { temp: 37, humidity: 45, condition: 'Sunny' },
  'mex-azteca': { temp: 24, humidity: 58, condition: 'Partly Cloudy' },
};

// ---------- State ----------
const stateMap = new Map<string, StadiumOpsData>();
let tickCount = 0;

function getStadiumInfo(id: string) {
  return (stadiumsData as any[]).find((s: any) => s.id === id);
}

function buildInitialData(stadiumId: string): StadiumOpsData {
  const info = getStadiumInfo(stadiumId);
  if (!info) throw new Error(`Unknown stadium: ${stadiumId}`);

  const cap = info.capacity as number;
  const basePct = rand(0.65, 0.85);
  const attendance = Math.round(cap * basePct);
  const wb = WEATHER_BASE[stadiumId] || WEATHER_BASE['atl-mbs'];
  const matchInfo = MATCHES[stadiumId] || MATCHES['atl-mbs'];

  const gates: GateData[] = (info.gates as any[]).map((g: any) => ({
    id: g.id, name: g.name,
    crowd: randInt(800, 3500),
    queueLength: randInt(20, 180),
    waitTime: randInt(3, 15),
    scanSpeed: randInt(40, 85),
    securityQueue: randInt(10, 90),
  }));

  const parking: ParkingData[] = (info.parking as any[]).map((p: any) => {
    const occ = Math.round(p.capacity * rand(0.55, 0.92));
    return {
      id: p.id, name: p.name, capacity: p.capacity,
      occupied: occ, remaining: p.capacity - occ,
      occupancyPct: Math.round((occ / p.capacity) * 100),
    };
  });

  const foodCourts: FoodCourtData[] = (info.food_courts as any[]).map((f: any) => ({
    id: f.id, name: f.name,
    queueLength: randInt(15, 120),
    waitTime: randInt(3, 18),
    densityPct: randInt(35, 90),
  }));

  const now = new Date();
  const timeStr = (offset: number) => {
    const d = new Date(now.getTime() - offset * 60000);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const crowdTrend: TrendPoint[] = Array.from({ length: 8 }, (_, i) => ({
    time: timeStr((7 - i) * 15), value: Math.round(cap * rand(0.3, basePct)),
  }));
  crowdTrend[7].value = attendance;

  const totalParkCap = parking.reduce((s, p) => s + p.capacity, 0);
  const totalParkOcc = parking.reduce((s, p) => s + p.occupied, 0);

  return {
    stadiumId, stadiumName: info.name, city: info.city, country: info.country,
    capacity: cap, timestamp: Date.now(),
    currentAttendance: attendance, occupancyPct: Math.round(basePct * 100),
    gates, avgWaitTime: Math.round(gates.reduce((s, g) => s + g.waitTime, 0) / gates.length),
    parking, totalParkingOccupancy: totalParkOcc, totalParkingRemaining: totalParkCap - totalParkOcc,
    metroCrowd: randInt(200, 900), busQueue: randInt(15, 80),
    taxiWaitTime: randInt(5, 25), rideShareAvailability: randInt(8, 40),
    weather: {
      temperature: wb.temp + rand(-2, 2), humidity: wb.humidity + rand(-5, 5),
      airQuality: randInt(30, 80), windSpeed: rand(5, 25),
      uvIndex: randInt(3, 10), condition: wb.condition,
    },
    emergencyStatus: 'Normal',
    medicalRequests: randInt(2, 12), lostFoundReports: randInt(3, 18),
    accessibilityRequests: randInt(1, 8),
    toiletOccupancyPct: randInt(30, 75),
    foodCourts,
    waterStationQueue: randInt(5, 35), chargingStationUsage: randInt(40, 85),
    noiseLevel: randInt(70, 95),
    wifiLoad: randInt(45, 85), powerStatus: 'Stable', networkStatus: 'Optimal',
    volunteerCount: randInt(80, 160), securityCount: randInt(120, 250),
    medicalTeamCount: randInt(15, 40), cleaningStaffCount: randInt(30, 70),
    match: {
      homeTeam: matchInfo.home, awayTeam: matchInfo.away,
      score: `${randInt(0, 2)}-${randInt(0, 2)}`,
      kickoffTime: '18:00 Local', currentMinute: randInt(25, 75),
      status: 'In Progress',
      possession: randInt(40, 60), shotsHome: randInt(3, 12), shotsAway: randInt(2, 10),
      cornersHome: randInt(1, 7), cornersAway: randInt(1, 6),
      yellowCards: randInt(0, 4), redCards: randInt(0, 1),
      referee: matchInfo.referee, expectedExitTime: '20:15 Local',
    },
    predictions: generatePredictions(stadiumId, gates, parking, foodCourts),
    insights: generateInsights(stadiumId, attendance, cap, gates, parking, foodCourts),
    crowdHeat: generateCrowdHeat(gates),
    parkingHeat: parking.map(p => ({ zone: p.name, density: p.occupancyPct, label: `${p.occupancyPct}%` })),
    foodHeat: foodCourts.map(f => ({ zone: f.name, density: f.densityPct, label: `${f.densityPct}%` })),
    restroomHeat: (info.toilets as any[]).map((t: any) => ({
      zone: t.location, density: randInt(25, 85), label: `${randInt(25, 85)}%`,
    })),
    crowdTrend,
    parkingTrend: Array.from({ length: 8 }, (_, i) => ({
      time: timeStr((7 - i) * 15), value: Math.round(totalParkCap * rand(0.3, 0.85)),
    })),
    gateTrend: Array.from({ length: 8 }, (_, i) => ({
      time: timeStr((7 - i) * 15), value: randInt(500, 3000),
    })),
    weatherTrend: Array.from({ length: 8 }, (_, i) => ({
      time: timeStr((7 - i) * 15), value: Math.round((wb.temp + rand(-3, 3)) * 10) / 10,
    })),
  };
}

function generatePredictions(
  _id: string, gates: GateData[], parking: ParkingData[], food: FoodCourtData[]
): PredictionData[] {
  const preds: PredictionData[] = [];
  const busiestGate = [...gates].sort((a, b) => b.crowd - a.crowd)[0];
  const quietestGate = [...gates].sort((a, b) => a.crowd - b.crowd)[0];
  const fullestParking = [...parking].sort((a, b) => b.occupancyPct - a.occupancyPct)[0];
  const quietestFood = [...food].sort((a, b) => a.queueLength - b.queueLength)[0];

  preds.push({
    id: '1', severity: 'warning', icon: '⚠️',
    message: `${busiestGate.name} may become crowded in 15 minutes. Current queue: ${busiestGate.queueLength} people.`,
  });
  if (fullestParking.occupancyPct > 80) {
    preds.push({
      id: '2', severity: 'critical', icon: '🅿️',
      message: `${fullestParking.name} at ${fullestParking.occupancyPct}% — likely full within 20 min.`,
    });
  }
  preds.push({
    id: '3', severity: 'info', icon: '🍽️',
    message: `${quietestFood.name} has the shortest queue (${quietestFood.queueLength} people, ~${quietestFood.waitTime} min wait).`,
  });
  preds.push({
    id: '4', severity: 'info', icon: '🚪',
    message: `Best exit route after match: ${quietestGate.name} (lowest crowd density).`,
  });
  preds.push({
    id: '5', severity: 'info', icon: '🔒',
    message: `Fastest security lane: ${quietestGate.name} (~${quietestGate.waitTime} min).`,
  });
  return preds;
}

function generateInsights(
  _id: string, attendance: number, capacity: number,
  gates: GateData[], parking: ParkingData[], food: FoodCourtData[]
): InsightData[] {
  const busiestGate = [...gates].sort((a, b) => b.crowd - a.crowd)[0];
  const quietGates = gates.filter(g => g.id !== busiestGate.id).slice(0, 2).map(g => g.name).join(' or ');
  const fullParking = parking.filter(p => p.occupancyPct > 85);
  const busiestFood = [...food].sort((a, b) => b.densityPct - a.densityPct)[0];
  const occPct = Math.round((attendance / capacity) * 100);

  const insights: InsightData[] = [
    { id: '1', category: 'Crowd', text: `${busiestGate.name} is currently experiencing high footfall. Visitors entering through ${quietGates} will experience significantly shorter waiting times.` },
    { id: '2', category: 'Attendance', text: `Stadium is at ${occPct}% capacity with ${attendance.toLocaleString()} fans. Peak entry period has passed.` },
  ];
  if (fullParking.length > 0) {
    insights.push({ id: '3', category: 'Parking', text: `${fullParking.map(p => p.name).join(', ')} ${fullParking.length > 1 ? 'have' : 'has'} reached ${fullParking[0].occupancyPct}% occupancy. Redirecting incoming vehicles to available lots.` });
  }
  insights.push({ id: '4', category: 'Food', text: `${busiestFood.name} experiencing peak demand at ${busiestFood.densityPct}% density. Consider opening overflow service counters.` });
  return insights;
}

function generateCrowdHeat(gates: GateData[]): HeatZone[] {
  return gates.map(g => ({
    zone: g.name, density: clamp(Math.round((g.crowd / 4000) * 100), 10, 100),
    label: g.crowd > 2500 ? 'High' : g.crowd > 1500 ? 'Medium' : 'Low',
  }));
}

// ---------- Tick (smooth update) ----------
function tickState(prev: StadiumOpsData): StadiumOpsData {
  const next = { ...prev, timestamp: Date.now() };
  const t = 0.15; // smoothing factor

  // Attendance drifts slightly
  const attDelta = randInt(-150, 200);
  next.currentAttendance = clamp(prev.currentAttendance + attDelta, Math.round(prev.capacity * 0.5), prev.capacity);
  next.occupancyPct = Math.round((next.currentAttendance / prev.capacity) * 100);

  // Gates
  next.gates = prev.gates.map(g => ({
    ...g,
    crowd: clamp(Math.round(lerp(g.crowd, g.crowd + randInt(-200, 250), t)), 200, 5000),
    queueLength: clamp(Math.round(lerp(g.queueLength, g.queueLength + randInt(-15, 20), t)), 5, 300),
    waitTime: clamp(Math.round(lerp(g.waitTime, g.waitTime + randInt(-2, 2), t)), 2, 25),
    scanSpeed: clamp(Math.round(lerp(g.scanSpeed, g.scanSpeed + randInt(-5, 5), t)), 30, 95),
    securityQueue: clamp(Math.round(lerp(g.securityQueue, g.securityQueue + randInt(-8, 10), t)), 5, 150),
  }));
  next.avgWaitTime = Math.round(next.gates.reduce((s, g) => s + g.waitTime, 0) / next.gates.length);

  // Parking
  next.parking = prev.parking.map(p => {
    const delta = randInt(-20, 30);
    const occ = clamp(p.occupied + delta, Math.round(p.capacity * 0.3), p.capacity);
    return { ...p, occupied: occ, remaining: p.capacity - occ, occupancyPct: Math.round((occ / p.capacity) * 100) };
  });
  next.totalParkingOccupancy = next.parking.reduce((s, p) => s + p.occupied, 0);
  next.totalParkingRemaining = next.parking.reduce((s, p) => s + p.remaining, 0);

  // Transport
  next.metroCrowd = clamp(prev.metroCrowd + randInt(-50, 60), 100, 1500);
  next.busQueue = clamp(prev.busQueue + randInt(-5, 8), 5, 120);
  next.taxiWaitTime = clamp(prev.taxiWaitTime + randInt(-3, 3), 3, 40);
  next.rideShareAvailability = clamp(prev.rideShareAvailability + randInt(-3, 4), 3, 60);

  // Weather (slow drift)
  next.weather = {
    ...prev.weather,
    temperature: Math.round((prev.weather.temperature + rand(-0.3, 0.3)) * 10) / 10,
    humidity: clamp(Math.round(prev.weather.humidity + rand(-1, 1)), 20, 95),
    airQuality: clamp(prev.weather.airQuality + randInt(-2, 2), 15, 120),
    windSpeed: Math.round(clamp(prev.weather.windSpeed + rand(-1, 1), 0, 50) * 10) / 10,
  };

  // Emergency / Facilities
  next.medicalRequests = clamp(prev.medicalRequests + (Math.random() > 0.7 ? 1 : 0), 0, 50);
  next.lostFoundReports = clamp(prev.lostFoundReports + (Math.random() > 0.8 ? 1 : 0), 0, 50);
  next.accessibilityRequests = clamp(prev.accessibilityRequests + (Math.random() > 0.85 ? 1 : 0), 0, 30);
  next.toiletOccupancyPct = clamp(prev.toiletOccupancyPct + randInt(-3, 4), 15, 95);

  next.foodCourts = prev.foodCourts.map(f => ({
    ...f,
    queueLength: clamp(f.queueLength + randInt(-8, 10), 5, 200),
    waitTime: clamp(f.waitTime + randInt(-2, 2), 2, 30),
    densityPct: clamp(f.densityPct + randInt(-3, 4), 15, 98),
  }));

  next.waterStationQueue = clamp(prev.waterStationQueue + randInt(-3, 4), 2, 60);
  next.chargingStationUsage = clamp(prev.chargingStationUsage + randInt(-3, 3), 20, 98);
  next.noiseLevel = clamp(prev.noiseLevel + randInt(-2, 3), 60, 110);
  next.wifiLoad = clamp(prev.wifiLoad + randInt(-3, 3), 25, 98);

  // Staff (minor fluctuations)
  next.volunteerCount = clamp(prev.volunteerCount + randInt(-2, 2), 50, 200);
  next.securityCount = clamp(prev.securityCount + randInt(-1, 1), 80, 300);

  // Match progress
  if (prev.match.currentMinute < 90) {
    const newMin = prev.match.currentMinute + 1;
    const goalChance = Math.random();
    let score = prev.match.score;
    if (goalChance > 0.97) {
      const [h, a] = score.split('-').map(Number);
      score = Math.random() > 0.5 ? `${h + 1}-${a}` : `${h}-${a + 1}`;
    }
    next.match = {
      ...prev.match, currentMinute: newMin, score,
      possession: clamp(prev.match.possession + randInt(-3, 3), 30, 70),
      shotsHome: prev.match.shotsHome + (Math.random() > 0.85 ? 1 : 0),
      shotsAway: prev.match.shotsAway + (Math.random() > 0.85 ? 1 : 0),
      cornersHome: prev.match.cornersHome + (Math.random() > 0.92 ? 1 : 0),
      cornersAway: prev.match.cornersAway + (Math.random() > 0.92 ? 1 : 0),
      yellowCards: prev.match.yellowCards + (Math.random() > 0.97 ? 1 : 0),
      status: newMin >= 90 ? 'Full Time' : newMin >= 45 && newMin <= 47 ? 'Half Time' : 'In Progress',
    };
  }

  // Regenerate predictions & insights
  next.predictions = generatePredictions(prev.stadiumId, next.gates, next.parking, next.foodCourts);
  next.insights = generateInsights(prev.stadiumId, next.currentAttendance, prev.capacity, next.gates, next.parking, next.foodCourts);
  next.crowdHeat = generateCrowdHeat(next.gates);
  next.parkingHeat = next.parking.map(p => ({ zone: p.name, density: p.occupancyPct, label: `${p.occupancyPct}%` }));
  next.foodHeat = next.foodCourts.map(f => ({ zone: f.name, density: f.densityPct, label: `${f.densityPct}%` }));

  // Append to trends (keep last 8)
  const now = new Date();
  const ts = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  next.crowdTrend = [...prev.crowdTrend.slice(-7), { time: ts, value: next.currentAttendance }];
  next.parkingTrend = [...prev.parkingTrend.slice(-7), { time: ts, value: next.totalParkingOccupancy }];
  next.gateTrend = [...prev.gateTrend.slice(-7), { time: ts, value: next.gates.reduce((s, g) => s + g.crowd, 0) }];
  next.weatherTrend = [...prev.weatherTrend.slice(-7), { time: ts, value: next.weather.temperature }];

  return next;
}

// ---------- Public API ----------
export function getStadiumOps(stadiumId: string): StadiumOpsData {
  if (!stateMap.has(stadiumId)) {
    stateMap.set(stadiumId, buildInitialData(stadiumId));
  }
  return stateMap.get(stadiumId)!;
}

export function tickStadiumOps(stadiumId: string): StadiumOpsData {
  const prev = getStadiumOps(stadiumId);
  const next = tickState(prev);
  stateMap.set(stadiumId, next);
  tickCount++;
  return next;
}

export function getAllStadiumIds(): string[] {
  return (stadiumsData as any[]).map((s: any) => s.id);
}

export function getStadiumMeta(stadiumId: string) {
  const info = getStadiumInfo(stadiumId);
  return info ? { id: info.id, name: info.name, city: info.city, country: info.country, capacity: info.capacity } : null;
}

export { tickCount };
