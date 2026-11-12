import { useState } from "react";
import { LeafIcon } from "./Icons.jsx";
import { Label, Input, SelectEl, Btn, ProgressBar } from "./UI.jsx";
import { MODE_LABELS, calcSavings } from "../utils/calculations.js";

export default function Step1({ form, setForm, onNext }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const valid =
    form.distanceKm &&
    Number(form.distanceKm) > 0 &&
    Number(form.officeDaysPerWeek) > Number(form.wfhDaysRequested);

  const preview = valid
    ? calcSavings({
        distanceKm: Number(form.distanceKm),
        mode: form.mode,
        officeDaysPerWeek: Number(form.officeDaysPerWeek),
        wfhDaysRequested: Number(form.wfhDaysRequested),
        customFuelPrice: form.customFuelPrice,
        customMileage: form.customMileage,
        customEvCost: form.customEvCost,
        customTransitFare: form.customTransitFare,
      })
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
      {/* Left Column: Hero & Live Estimate */}
      <div className="md:col-span-5 space-y-4 md:sticky md:top-20">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Carbon × Career
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
            Your commute costs the planet.
            <br />
            <span className="text-emerald-500">Use that to negotiate WFH.</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Calculate the CO₂ footprint of your commute → see the full impact dashboard → get an AI-written proposal your manager can't argue with.
          </p>
        </div>

        {/* Live preview */}
        {preview ? (
          <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 text-white shadow-xl border border-slate-700/30 relative overflow-hidden">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Live estimate</p>
            <div className="flex items-end gap-1.5 mb-3">
              <span className="text-4xl font-extrabold text-emerald-400 leading-none">
                {Math.round(preview.savedAnnualKg)}
              </span>
              <span className="text-slate-300 text-xs mb-0.5">kg CO₂e saved per year</span>
            </div>
            <div className="space-y-1.5 mb-3">
              <div>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-slate-400">Now (office every day)</span>
                  <span className="text-red-400 font-medium">{Math.round(preview.currentAnnualKg)} kg</span>
                </div>
                <ProgressBar pct={100} color="bg-red-400" />
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-slate-400">With your WFH request</span>
                  <span className="text-emerald-400 font-medium">{Math.round(preview.futureAnnualKg)} kg</span>
                </div>
                <ProgressBar
                  pct={preview.currentAnnualKg > 0 ? (preview.futureAnnualKg / preview.currentAnnualKg) * 100 : 0}
                  color="bg-emerald-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-700 text-center">
              <div>
                <p className="text-base font-bold text-white leading-none mb-0.5">{preview.treesEquiv}</p>
                <p className="text-[9px] text-slate-400 leading-none">trees/yr</p>
              </div>
              <div>
                <p className="text-base font-bold text-white leading-none mb-0.5">{preview.flightsEquiv}</p>
                <p className="text-[9px] text-slate-400 leading-none">flights</p>
              </div>
              <div>
                <p className="text-base font-bold text-white leading-none mb-0.5">{preview.pctReduction}%</p>
                <p className="text-[9px] text-slate-400 leading-none">CO₂ cut</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-5 text-center text-slate-400 text-xs hidden md:block">
            <LeafIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            Enter distance to see your savings calculations in real-time.
          </div>
        )}
      </div>

      {/* Right Column: Form */}
      <div className="md:col-span-7 space-y-4">
        <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 space-y-4 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your commute info</h2>
            <p className="text-xs text-slate-400">We'll calculate your emissions footprint automatically.</p>
          </div>
          <div>
            <Label htmlFor="distance-input">One-way distance to office (km)</Label>
            <Input
              id="distance-input"
              type="number"
              min="0.5"
              max="500"
              step="0.5"
              placeholder="e.g. 22"
              value={form.distanceKm}
              onChange={(e) => setForm((p) => ({ ...p, distanceKm: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="mode-select">Primary transport mode</Label>
            <SelectEl id="mode-select" value={form.mode} onChange={(e) => setForm((p) => ({ ...p, mode: e.target.value }))}>
              {Object.entries(MODE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </SelectEl>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="office-days-select">Office days / week</Label>
              <SelectEl
                id="office-days-select"
                value={form.officeDaysPerWeek}
                onChange={(e) => setForm((p) => ({ ...p, officeDaysPerWeek: e.target.value }))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                    {n === 5 ? " (full-time)" : ""}
                  </option>
                ))}
              </SelectEl>
            </div>
            <div>
              <Label htmlFor="wfh-days-select">WFH days you want</Label>
              <SelectEl
                id="wfh-days-select"
                value={form.wfhDaysRequested}
                onChange={(e) => setForm((p) => ({ ...p, wfhDaysRequested: e.target.value }))}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} day{n > 1 ? "s" : ""}/wk
                  </option>
                ))}
              </SelectEl>
            </div>
          </div>

          {/* Advanced settings accordion */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-800 transition cursor-pointer"
            >
              <span>⚙️ Advanced Commute Settings</span>
              <span>{showAdvanced ? "▲ Hide" : "▼ Show"}</span>
            </button>

            {showAdvanced && (
              <div className="mt-3 pt-3 border-t border-dashed border-slate-100 space-y-3 animate-fade-in">
                <p className="text-[11px] text-slate-400">Override defaults with your actual vehicle efficiency and costs.</p>

                {(form.mode === "car_petrol" || form.mode === "car_diesel" || form.mode === "motorcycle") && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="fuel-price-input">Fuel Price (₹/liter)</Label>
                      <Input
                        id="fuel-price-input"
                        type="number"
                        min="1"
                        max="500"
                        step="0.1"
                        placeholder="e.g. 104"
                        value={form.customFuelPrice}
                        onChange={(e) => setForm((p) => ({ ...p, customFuelPrice: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mileage-input">Vehicle Mileage (km/l)</Label>
                      <Input
                        id="mileage-input"
                        type="number"
                        min="1"
                        max="150"
                        step="0.1"
                        placeholder="e.g. 15"
                        value={form.customMileage}
                        onChange={(e) => setForm((p) => ({ ...p, customMileage: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {form.mode === "car_electric" && (
                  <div>
                    <Label htmlFor="ev-cost-input">EV Charging Cost (₹/km)</Label>
                    <Input
                      id="ev-cost-input"
                      type="number"
                      min="0.1"
                      max="50"
                      step="0.1"
                      placeholder="e.g. 1.8"
                      value={form.customEvCost}
                      onChange={(e) => setForm((p) => ({ ...p, customEvCost: e.target.value }))}
                    />
                  </div>
                )}

                {(form.mode === "bus" || form.mode === "metro" || form.mode === "train" || form.mode === "auto") && (
                  <div>
                    <Label htmlFor="transit-fare-input">Custom Daily Round-Trip Fare (₹)</Label>
                    <Input
                      id="transit-fare-input"
                      type="number"
                      min="1"
                      max="5000"
                      step="1"
                      placeholder="e.g. 80"
                      value={form.customTransitFare}
                      onChange={(e) => setForm((p) => ({ ...p, customTransitFare: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {!valid && form.distanceKm && Number(form.wfhDaysRequested) >= Number(form.officeDaysPerWeek) && (
          <p className="text-xs text-red-500 px-1">WFH days must be fewer than your current office days.</p>
        )}

        <div className="flex justify-end pt-2">
          <Btn onClick={onNext} disabled={!valid} variant="green" className="w-full sm:w-auto">
            Next, personalize →
          </Btn>
        </div>
      </div>
    </div>
  );
}
