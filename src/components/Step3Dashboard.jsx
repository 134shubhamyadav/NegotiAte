import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { LeafIcon, RupeeIcon, ClockIcon, TreeIcon } from "./Icons.jsx";
import { StatCard, ProgressBar, Btn, ChartTooltip } from "./UI.jsx";
import { MODE_LABELS, CITY_BENCHMARKS, buildMonthlyChart, build5YearChart } from "../utils/calculations.js";

export default function Step3Dashboard({
  savings,
  commuteForm,
  setCommuteForm,
  onViewProposal,
  onBack,
  onRegenerate,
  isProposalDirty,
  loading,
}) {
  const monthlyData = buildMonthlyChart(savings);
  const fiveYearData = build5YearChart(savings);

  // City comparison
  const userKg = savings.currentAnnualKg;
  const cityAvgs = Object.entries(CITY_BENCHMARKS).map(([city, avg]) => ({
    city,
    avg,
    user: Math.round(userKg),
    saved: Math.round(savings.savedAnnualKg),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your Commute Impact Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">Environmental and financial value of your proposed remote work schedule.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Control Panel, Footprint comparison, ESG */}
        <div className="md:col-span-7 space-y-6">
          {/* Interactive Control Panel */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-4 sm:p-6 text-white shadow-xl border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">Live Commute Simulator</h3>
                  <p className="text-[10px] text-slate-400">Tweak values to see calculations adjust instantly.</p>
                </div>
              </div>
              {(commuteForm.customFuelPrice || commuteForm.customEvCost || commuteForm.customTransitFare) && (
                <span className="text-[9px] font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span>⚙️</span> Custom Rates Active
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  WFH Days Requested
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max={Math.max(1, Number(commuteForm.officeDaysPerWeek) - 1)}
                    step="1"
                    value={commuteForm.wfhDaysRequested}
                    onChange={(e) => setCommuteForm((p) => ({ ...p, wfhDaysRequested: e.target.value }))}
                    className="flex-1 accent-emerald-400 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-emerald-400 w-14 bg-slate-800 border border-slate-700 rounded-xl py-0.5 text-center flex-shrink-0">
                    {commuteForm.wfhDaysRequested} d/wk
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Commute Distance (one-way)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={commuteForm.distanceKm}
                    onChange={(e) => setCommuteForm((p) => ({ ...p, distanceKm: e.target.value }))}
                    className="flex-1 accent-emerald-400 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-emerald-400 w-14 bg-slate-800 border border-slate-700 rounded-xl py-0.5 text-center flex-shrink-0">
                    {commuteForm.distanceKm} km
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Transport Mode
                </label>
                <select
                  value={commuteForm.mode}
                  onChange={(e) => setCommuteForm((p) => ({ ...p, mode: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-transparent"
                >
                  {Object.entries(MODE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isProposalDirty && (
              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between flex-wrap gap-2 animate-fade-in">
                <p className="text-[11px] text-amber-300/95 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Values changed! Re-generate to sync proposal.
                </p>
                <button
                  onClick={() => onRegenerate()}
                  disabled={loading}
                  className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer border-0"
                >
                  {loading && <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                  Update Proposal ✨
                </button>
              </div>
            )}
          </div>

          {/* Footprint comparison */}
          <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm">
            <div className="mb-3">
              <h4 className="text-sm font-bold text-slate-800">Commute Footprint Comparison</h4>
              <p className="text-[11px] text-slate-400">Your annual transit emissions compared to benchmark commuter footprints</p>
            </div>

            <div className="space-y-3.5">
              {cityAvgs.map(({ city, avg }) => (
                <div key={city}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500 font-semibold">{city} Average</span>
                    <span className="text-slate-700 font-bold">{avg} kg</span>
                  </div>
                  <ProgressBar pct={(avg / Math.max(userKg, avg, 500)) * 100} color="bg-slate-200/70" />
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-red-500 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
                      You (Current Commute)
                    </span>
                    <span className="text-red-600 font-extrabold">{Math.round(userKg)} kg</span>
                  </div>
                  <ProgressBar pct={(userKg / Math.max(userKg, 1200)) * 100} color="bg-gradient-to-r from-red-400 to-rose-500" />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      You (With Proposed WFH)
                    </span>
                    <span className="text-emerald-700 font-extrabold">{Math.round(savings.futureAnnualKg)} kg</span>
                  </div>
                  <ProgressBar
                    pct={(savings.futureAnnualKg / Math.max(userKg, 1200)) * 100}
                    color="bg-gradient-to-r from-emerald-400 to-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ESG alignment box */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-2">
              <LeafIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">ESG Corporate Alignment</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Approving your <span className="text-emerald-400 font-semibold">{commuteForm.wfhDaysRequested} WFH day{commuteForm.wfhDaysRequested > 1 ? "s" : ""}</span> request eliminates <span className="text-white font-bold">{Math.round(savings.savedAnnualKg)} kg CO₂e</span> Scope 3 emissions. Over 5 years for a team of 10, that avoids <span className="text-emerald-400 font-bold">{Math.round((savings.savedAnnualKg * 50) / 1000).toFixed(0)} tonnes</span>.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-3.5 border-t border-slate-700/50 text-center">
              <div className="bg-slate-800/40 rounded-xl p-2 border border-slate-700/30">
                <p className="text-lg font-extrabold text-emerald-400 leading-none mb-0.5">{savings.treesEquiv}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Trees/Yr</p>
              </div>
              <div className="bg-slate-800/40 rounded-xl p-2 border border-slate-700/30">
                <p className="text-lg font-extrabold text-white leading-none mb-0.5">{savings.flightsEquiv}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Flights Eq.</p>
              </div>
              <div className="bg-slate-800/40 rounded-xl p-2 border border-slate-700/30">
                <p className="text-lg font-extrabold text-white leading-none mb-0.5">{Math.round(savings.kmEquiv / 1000).toFixed(0)}k</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Km Cut</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats Cards, Charts */}
        <div className="md:col-span-5 space-y-6">
          {/* Hero metric cards arranged in a beautiful 2x2 grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              accent
              label="CO₂ Saved / Year"
              value={`${Math.round(savings.savedAnnualKg)} kg`}
              sub={`${savings.pctReduction}% reduction`}
              icon={<LeafIcon className="w-4 h-4" />}
            />
            <StatCard
              label="Money Saved"
              value={`₹${Math.round(savings.savedFuelCost / 1000).toFixed(1)}k`}
              sub="fuel & transport/yr"
              icon={<RupeeIcon className="w-4 h-4" />}
            />
            <StatCard
              label="Time Reclaimed"
              value={`${Math.round(savings.savedHoursPerYear)}h`}
              sub="commute hours/yr"
              icon={<ClockIcon className="w-4 h-4" />}
            />
            <StatCard
              label="Trees Equivalent"
              value={`${savings.treesEquiv}`}
              sub="planted per year"
              icon={<TreeIcon className="w-4 h-4" />}
            />
          </div>

          {/* Monthly savings area chart */}
          <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm">
            <div className="mb-2">
              <p className="text-xs font-bold text-slate-800">Monthly CO₂ Savings Growth</p>
              <p className="text-[10px] text-slate-400">Cumulative kg CO₂e avoided vs your current commute</p>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip unit="kg CO₂e" />} />
                <Area
                  type="monotone"
                  dataKey="cumSaved"
                  name="Cumulative Saved"
                  stroke="#059669"
                  strokeWidth={2}
                  fill="url(#gradSaved)"
                  dot={{ r: 2, stroke: "#059669", strokeWidth: 1, fill: "#fff" }}
                  activeDot={{ r: 3.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 5-year projection */}
          <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm">
            <div className="mb-2">
              <p className="text-xs font-bold text-slate-800">5-Year Projections</p>
              <p className="text-[10px] text-slate-400">CO₂ avoided and money saved cumulative projection</p>
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={fiveYearData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  {fiveYearData.map((_, i) => {
                    const hueStart = 152 + i * 8;
                    const hueEnd = 162 + i * 8;
                    return (
                      <linearGradient id={`barGrad-${i}`} key={i} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={`hsl(${hueStart}, 75%, 45%)`} />
                        <stop offset="100%" stopColor={`hsl(${hueEnd}, 75%, 35%)`} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip unit="kg" />} />
                <Bar dataKey="co2Saved" name="CO₂ saved" radius={[6, 6, 0, 0]}>
                  {fiveYearData.map((_, i) => (
                    <Cell key={i} fill={`url(#barGrad-${i})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[10px] text-slate-500">
              <span>
                5-yr CO₂: <strong className="text-slate-800">{Math.round((savings.savedAnnualKg * 5) / 1000).toFixed(1)}t</strong>
              </span>
              <span>
                Saved: <strong className="text-slate-800">₹{Math.round((savings.savedFuelCost * 5) / 1000).toFixed(1)}k</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Btn variant="secondary" onClick={onBack}>
          ← Edit details
        </Btn>
        <Btn variant="green" onClick={onViewProposal}>
          View my proposal →
        </Btn>
      </div>
    </div>
  );
}
