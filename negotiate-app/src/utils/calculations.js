/**
 * @fileoverview Core calculation functions for commute carbon footprint,
 * cost savings, and time reclaimed for the NegotiAte application.
 */

import {
  EMISSION_FACTORS,
  FUEL_COST_PER_KM,
  MODE_LABELS,
  INDUSTRY_OPTIONS,
  CITY_BENCHMARKS,
} from "./constants.js";

// Re-export constants so existing imports from calculations.js still work.
export { EMISSION_FACTORS, FUEL_COST_PER_KM, MODE_LABELS, INDUSTRY_OPTIONS, CITY_BENCHMARKS };

/**
 * @typedef {Object} CommuteInputs
 * @property {number} distanceKm - One-way commute distance in kilometres.
 * @property {string} mode - Transport mode key (e.g. 'car_petrol').
 * @property {number} officeDaysPerWeek - Current number of in-office days per week.
 * @property {number} wfhDaysRequested - Number of WFH days requested per week.
 * @property {string} [customFuelPrice] - Override: fuel price in ₹/litre.
 * @property {string} [customMileage] - Override: vehicle mileage in km/l.
 * @property {string} [customEvCost] - Override: EV charging cost in ₹/km.
 * @property {string} [customTransitFare] - Override: daily round-trip fare in ₹.
 */

/**
 * @typedef {Object} SavingsResult
 * @property {number} currentAnnualKg - Current annual CO₂e emissions in kg.
 * @property {number} futureAnnualKg - Projected annual CO₂e emissions with WFH in kg.
 * @property {number} savedAnnualKg - Annual CO₂e savings in kg.
 * @property {number} savedTonnes - Annual CO₂e savings in tonnes.
 * @property {number} savedFuelCost - Annual fuel/transport cost savings in ₹.
 * @property {number} savedHoursPerYear - Annual commute hours reclaimed.
 * @property {number} treesEquiv - Equivalent trees planted per year.
 * @property {number} kmEquiv - Equivalent km driven offset per year.
 * @property {string} flightsEquiv - Equivalent short-haul flights offset per year.
 * @property {number} pctReduction - Percentage reduction in annual emissions.
 */

/**
 * Calculates annual commute savings in carbon, cost, and time
 * when a WFH schedule is adopted.
 *
 * @param {CommuteInputs} inputs - Commute and preference inputs.
 * @returns {SavingsResult} The computed annual savings metrics.
 */
export function calcSavings({
  distanceKm,
  mode,
  officeDaysPerWeek,
  wfhDaysRequested,
  customFuelPrice,
  customMileage,
  customEvCost,
  customTransitFare,
}) {
  const factor = EMISSION_FACTORS[mode] ?? 0;

  // Determine cost per km — honour user overrides over defaults.
  let fuelCost = FUEL_COST_PER_KM[mode] ?? 0;

  if (mode === "car_petrol" || mode === "car_diesel" || mode === "motorcycle") {
    const price = Number(customFuelPrice);
    const mileage = Number(customMileage);
    if (price > 0 && mileage > 0) {
      fuelCost = price / mileage;
    }
  } else if (mode === "car_electric") {
    const evCost = Number(customEvCost);
    if (evCost > 0) {
      fuelCost = evCost;
    }
  } else if (mode === "bus" || mode === "metro" || mode === "train" || mode === "auto") {
    const fare = Number(customTransitFare);
    // fare is a custom daily round-trip cost, so cost/km = fare / (distanceKm * 2)
    if (fare > 0 && distanceKm > 0) {
      fuelCost = fare / (distanceKm * 2);
    }
  }

  const weeksPerYear = 48;
  const currentDailyKg = distanceKm * 2 * factor;
  const currentAnnualKg = currentDailyKg * officeDaysPerWeek * weeksPerYear;
  const savedDailyKg = distanceKm * 2 * factor * wfhDaysRequested;
  const savedAnnualKg = savedDailyKg * weeksPerYear;
  const futureAnnualKg = currentAnnualKg - savedAnnualKg;
  const savedFuelCost = distanceKm * 2 * fuelCost * wfhDaysRequested * weeksPerYear;
  const savedHoursPerYear = (distanceKm / 25) * 2 * wfhDaysRequested * weeksPerYear;

  return {
    currentAnnualKg,
    futureAnnualKg,
    savedAnnualKg,
    savedTonnes: savedAnnualKg / 1000,
    savedFuelCost,
    savedHoursPerYear,
    treesEquiv: Math.round(savedAnnualKg / 21),
    kmEquiv: Math.round(savedAnnualKg / 0.192),
    flightsEquiv: (savedAnnualKg / 255).toFixed(1),
    pctReduction: currentAnnualKg > 0 ? Math.round((savedAnnualKg / currentAnnualKg) * 100) : 0,
  };
}

/**
 * Builds monthly chart data for cumulative CO₂ savings visualization.
 *
 * @param {SavingsResult} savings - The computed savings result.
 * @returns {Array<{month: string, current: number, saved: number, cumSaved: number}>}
 */
export function buildMonthlyChart(savings) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((m, i) => ({
    month: m,
    current: Math.round(savings.currentAnnualKg / 12),
    saved: Math.round(savings.savedAnnualKg / 12),
    cumSaved: Math.round((savings.savedAnnualKg / 12) * (i + 1)),
  }));
}

/**
 * Builds a 5-year cumulative CO₂ and money savings projection dataset.
 *
 * @param {SavingsResult} savings - The computed savings result.
 * @returns {Array<{year: string, co2Saved: number, moneySaved: number}>}
 */
export function build5YearChart(savings) {
  return [1, 2, 3, 4, 5].map((yr) => ({
    year: `Year ${yr}`,
    co2Saved: Math.round(savings.savedAnnualKg * yr),
    moneySaved: Math.round(savings.savedFuelCost * yr),
  }));
}
