/**
 * @fileoverview Shared constants for emission factors, transport modes,
 * fuel costs, industry options, and city benchmarks used across the
 * NegotiAte application.
 */

/**
 * CO₂ emission factors in kg per kilometer per passenger for each transport mode.
 * Source: UK Dept. for Environment, Food & Rural Affairs (DEFRA) 2023 estimates.
 * @type {Record<string, number>}
 */
export const EMISSION_FACTORS = {
  car_petrol: 0.192,
  car_diesel: 0.171,
  car_electric: 0.053,
  motorcycle: 0.114,
  bus: 0.089,
  metro: 0.041,
  train: 0.037,
  auto: 0.105,
  walk: 0,
  cycle: 0,
};

/**
 * Human-readable display labels for each transport mode key.
 * @type {Record<string, string>}
 */
export const MODE_LABELS = {
  car_petrol: "Car (Petrol)",
  car_diesel: "Car (Diesel)",
  car_electric: "Car (Electric)",
  motorcycle: "Motorcycle",
  bus: "Bus",
  metro: "Metro / Subway",
  train: "Train",
  auto: "Auto-rickshaw",
  walk: "Walk",
  cycle: "Cycle",
};

/**
 * Default fuel / transport cost per kilometer in INR (₹) for each mode.
 * These are overridable by the user's custom inputs.
 * @type {Record<string, number>}
 */
export const FUEL_COST_PER_KM = {
  car_petrol: 8.5,
  car_diesel: 7.2,
  car_electric: 1.8,
  motorcycle: 4.0,
  bus: 2.5,
  metro: 2.0,
  train: 1.5,
  auto: 6.0,
  walk: 0,
  cycle: 0,
};

/**
 * Industry sector options for the proposal personalisation form.
 * @type {string[]}
 */
export const INDUSTRY_OPTIONS = [
  "Technology / IT",
  "Finance / Banking",
  "Consulting",
  "Healthcare",
  "Education",
  "Marketing / Media",
  "Manufacturing",
  "Legal",
  "Government / Public Sector",
  "Retail / E-commerce",
  "Other",
];

/**
 * Average annual commute CO₂ emission benchmarks (in kg) for major Indian
 * cities and a global baseline, used for footprint comparison charts.
 * @type {Record<string, number>}
 */
export const CITY_BENCHMARKS = {
  Mumbai: 980,
  Delhi: 1120,
  Bangalore: 890,
  Pune: 760,
  Global: 850,
};
