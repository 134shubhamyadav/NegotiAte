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

export const CITY_BENCHMARKS = {
  Mumbai: 980,
  Delhi: 1120,
  Bangalore: 890,
  Pune: 760,
  Global: 850,
};

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

  // Calculate cost per kilometer dynamically based on overrides
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
    // fare is custom daily round-trip transit cost, so cost per km is fare / (distanceKm * 2)
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
  const savedHoursPerYear = (distanceKm / 25) * 2 * wfhDaysRequested * weeksPerYear; // ~25kmh avg
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

export function buildMonthlyChart(savings) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((m, i) => ({
    month: m,
    current: Math.round(savings.currentAnnualKg / 12),
    saved: Math.round(savings.savedAnnualKg / 12),
    cumSaved: Math.round((savings.savedAnnualKg / 12) * (i + 1)),
  }));
}

export function build5YearChart(savings) {
  return [1, 2, 3, 4, 5].map((yr) => ({
    year: `Year ${yr}`,
    co2Saved: Math.round(savings.savedAnnualKg * yr),
    moneySaved: Math.round(savings.savedFuelCost * yr),
  }));
}
