import { describe, it, expect } from 'vitest';
import { calcSavings, buildMonthlyChart, build5YearChart } from './calculations';

describe('calculations.js utility tests', () => {
  describe('calcSavings', () => {
    it('calculates correct savings for a standard petrol car commute', () => {
      const result = calcSavings({
        distanceKm: 25,
        mode: 'car_petrol',
        officeDaysPerWeek: 5,
        wfhDaysRequested: 2,
        customFuelPrice: '',
        customMileage: '',
        customEvCost: '',
        customTransitFare: ''
      });

      // Daily: 25 * 2 * 0.192 = 9.6 kg CO2
      // Saved Annual: 9.6 * 2 days * 48 weeks = 921.6 kg
      expect(result.savedAnnualKg).toBeCloseTo(921.6);
      expect(result.treesEquiv).toBe(Math.round(921.6 / 21));
      expect(result.pctReduction).toBe(40); // 2 WFH days out of 5 office days = 40%
    });

    it('applies custom fuel price overrides correctly for combustion vehicles', () => {
      const result = calcSavings({
        distanceKm: 20,
        mode: 'car_petrol',
        officeDaysPerWeek: 5,
        wfhDaysRequested: 3,
        customFuelPrice: '100', // Rs 100 per liter
        customMileage: '10',    // 10 km/liter -> cost per km = Rs 10
        customEvCost: '',
        customTransitFare: ''
      });

      // Saved fuel cost: distanceKm * 2 * fuelCost * wfhDaysRequested * 48
      // fuelCost = 100/10 = 10 Rs/km
      // savedFuelCost = 20 * 2 * 10 * 3 * 48 = 57,600
      expect(result.savedFuelCost).toBe(57600);
    });

    it('applies custom EV charging cost overrides correctly', () => {
      const result = calcSavings({
        distanceKm: 15,
        mode: 'car_electric',
        officeDaysPerWeek: 4,
        wfhDaysRequested: 2,
        customFuelPrice: '',
        customMileage: '',
        customEvCost: '2.5', // Rs 2.5 per km
        customTransitFare: ''
      });

      // savedFuelCost = 15 * 2 * 2.5 * 2 * 48 = 7,200
      expect(result.savedFuelCost).toBe(7200);
    });

    it('applies custom round trip transit fares correctly', () => {
      const result = calcSavings({
        distanceKm: 30,
        mode: 'bus',
        officeDaysPerWeek: 5,
        wfhDaysRequested: 1,
        customFuelPrice: '',
        customMileage: '',
        customEvCost: '',
        customTransitFare: '120' // Rs 120 round trip
      });

      // cost per km = 120 / (30 * 2) = 2 Rs/km
      // savedFuelCost = 30 * 2 * 2 * 1 * 48 = 5,760
      expect(result.savedFuelCost).toBe(5760);
    });
  });

  describe('chart building functions', () => {
    const mockSavings = {
      currentAnnualKg: 1200,
      savedAnnualKg: 480,
      savedFuelCost: 24000
    };

    it('buildMonthlyChart compiles correct growth data', () => {
      const result = buildMonthlyChart(mockSavings);
      expect(result).toHaveLength(12);
      expect(result[0].month).toBe('Jan');
      expect(result[0].cumSaved).toBe(Math.round(480 / 12));
      expect(result[11].cumSaved).toBe(480);
    });

    it('build5YearChart projects correctly over 5 years', () => {
      const result = build5YearChart(mockSavings);
      expect(result).toHaveLength(5);
      expect(result[0].year).toBe('Year 1');
      expect(result[0].co2Saved).toBe(480);
      expect(result[4].co2Saved).toBe(480 * 5);
      expect(result[4].moneySaved).toBe(24000 * 5);
    });
  });
});
