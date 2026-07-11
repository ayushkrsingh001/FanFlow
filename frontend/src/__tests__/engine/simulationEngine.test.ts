/**
 * Tests for the simulation engine — validates data generation,
 * tick updates, and stadium operations data integrity.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getStadiumOps,
  tickStadiumOps,
  getAllStadiumIds,
  getStadiumMeta,
  type StadiumOpsData,
  type GateData,
  type ParkingData,
} from '../../engine/simulationEngine'

describe('simulationEngine', () => {
  describe('getAllStadiumIds', () => {
    it('returns an array of stadium IDs', () => {
      const ids = getAllStadiumIds()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
    })

    it('includes the default Atlanta stadium', () => {
      const ids = getAllStadiumIds()
      expect(ids).toContain('atl-mbs')
    })
  })

  describe('getStadiumMeta', () => {
    it('returns metadata for a valid stadium', () => {
      const meta = getStadiumMeta('atl-mbs')
      expect(meta).not.toBeNull()
      expect(meta!.name).toBeTruthy()
      expect(meta!.city).toBeTruthy()
      expect(meta!.capacity).toBeGreaterThan(0)
    })

    it('returns null for an invalid stadium', () => {
      const meta = getStadiumMeta('nonexistent-stadium-xyz')
      expect(meta).toBeNull()
    })
  })

  describe('getStadiumOps', () => {
    let data: StadiumOpsData

    beforeEach(() => {
      data = getStadiumOps('atl-mbs')
    })

    it('returns valid StadiumOpsData with all required fields', () => {
      expect(data.stadiumId).toBe('atl-mbs')
      expect(data.stadiumName).toBeTruthy()
      expect(data.capacity).toBeGreaterThan(0)
      expect(data.currentAttendance).toBeGreaterThan(0)
      expect(data.currentAttendance).toBeLessThanOrEqual(data.capacity)
    })

    it('generates gates with valid data ranges', () => {
      expect(data.gates.length).toBeGreaterThan(0)
      for (const gate of data.gates) {
        expect(gate.crowd).toBeGreaterThanOrEqual(0)
        expect(gate.waitTime).toBeGreaterThanOrEqual(0)
        expect(gate.scanSpeed).toBeGreaterThanOrEqual(0)
      }
    })

    it('generates parking with valid occupancy', () => {
      expect(data.parking.length).toBeGreaterThan(0)
      for (const lot of data.parking) {
        expect(lot.occupied).toBeLessThanOrEqual(lot.capacity)
        expect(lot.remaining).toBe(lot.capacity - lot.occupied)
        expect(lot.occupancyPct).toBeGreaterThanOrEqual(0)
        expect(lot.occupancyPct).toBeLessThanOrEqual(100)
      }
    })

    it('generates valid weather data', () => {
      expect(data.weather.temperature).toBeGreaterThan(-50)
      expect(data.weather.temperature).toBeLessThan(60)
      expect(data.weather.humidity).toBeGreaterThanOrEqual(0)
      expect(data.weather.condition).toBeTruthy()
    })

    it('generates valid match data', () => {
      expect(data.match.homeTeam).toBeTruthy()
      expect(data.match.awayTeam).toBeTruthy()
      expect(data.match.score).toMatch(/^\d+-\d+$/)
      expect(data.match.currentMinute).toBeGreaterThanOrEqual(0)
    })

    it('generates heat maps with valid density values', () => {
      expect(data.crowdHeat.length).toBeGreaterThan(0)
      for (const zone of data.crowdHeat) {
        expect(zone.density).toBeGreaterThanOrEqual(0)
        expect(zone.density).toBeLessThanOrEqual(100)
      }
    })

    it('generates trend data with 8 points', () => {
      expect(data.crowdTrend).toHaveLength(8)
      expect(data.parkingTrend).toHaveLength(8)
      expect(data.gateTrend).toHaveLength(8)
      expect(data.weatherTrend).toHaveLength(8)
    })

    it('generates predictions and insights', () => {
      expect(data.predictions.length).toBeGreaterThan(0)
      expect(data.insights.length).toBeGreaterThan(0)
    })
  })

  describe('tickStadiumOps', () => {
    it('updates data smoothly without crashes', () => {
      const before = getStadiumOps('atl-mbs')
      const after = tickStadiumOps('atl-mbs')
      // timestamp should advance
      expect(after.timestamp).toBeGreaterThanOrEqual(before.timestamp)
      // core structure should be maintained
      expect(after.stadiumId).toBe('atl-mbs')
      expect(after.gates.length).toBe(before.gates.length)
      expect(after.parking.length).toBe(before.parking.length)
    })

    it('match minute progresses forward', () => {
      // Get fresh data
      const data1 = getStadiumOps('sea-lumen')
      if (data1.match.currentMinute < 90) {
        const data2 = tickStadiumOps('sea-lumen')
        expect(data2.match.currentMinute).toBeGreaterThanOrEqual(data1.match.currentMinute)
      }
    })

    it('crowd values remain within valid bounds after multiple ticks', () => {
      let data = getStadiumOps('atl-mbs')
      for (let i = 0; i < 10; i++) {
        data = tickStadiumOps('atl-mbs')
      }
      // Attendance should stay within [50% capacity, 100% capacity]
      expect(data.currentAttendance).toBeGreaterThanOrEqual(Math.round(data.capacity * 0.5))
      expect(data.currentAttendance).toBeLessThanOrEqual(data.capacity)
      // Parking occupancy should stay valid
      for (const lot of data.parking) {
        expect(lot.occupied).toBeLessThanOrEqual(lot.capacity)
        expect(lot.occupied).toBeGreaterThanOrEqual(0)
      }
    })
  })
})
