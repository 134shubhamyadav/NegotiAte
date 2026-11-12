import { useState } from "react";
import PropTypes from "prop-types";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  BarChart3,
} from "lucide-react";
import { ctcBreakdown, TAX_REGIMES } from "../engine/ctcBreakdown.js";
import { benchmark } from "../engine/benchmark.js";

export default function Col2RealityCheck({ offer }) {
  const [taxRegime, setTaxRegime] = useState(TAX_REGIMES.NEW_REGIME);
  const [pfCapping, setPfCapping] = useState(false);
  const [showLedger, setShowLedger] = useState(false);

  const isIntern = offer.employmentType === "intern";

  // Deterministic CTC calculation
  const ctcResult = ctcBreakdown({
    fixed: isIntern ? (Number(offer.fixedCtc) || 0) * 12 : offer.fixedCtc,
    variable: offer.variable || 0,
    joiningBonus: offer.joiningBonus || 0,
    esop: offer.esop || 0,
    options: {
      taxRegime,
      pfCapping,
    },
  });

  // Deterministic benchmark calculation
  const benchmarkResult = benchmark({
    role: offer.role || "Software Engineer",
    city: offer.city || "Bengaluru",
    companyTier: offer.companyTier || "product",
    employmentType: offer.employmentType || "fulltime",
  });

  const monthlyInHand = isIntern
    ? Math.round(Number(offer.fixedCtc) || 0)
    : ctcResult.monthlyInHand || 0;

  const annualInHand = isIntern
    ? monthlyInHand * 12
    : ctcResult.annualInHand || 0;

  const quotedCtc = isIntern
    ? monthlyInHand * 6
    : ctcResult.annualCtcQuoted;

  const takeHomeShare = quotedCtc > 0
    ? Math.round((annualInHand / quotedCtc) * 100)
    : 0;

  // Identify red flags
  const redFlags = [];

  if (offer.bondsMonths && Number(offer.bondsMonths) > 0) {
    redFlags.push({
      type: "bond",
      title: `${offer.bondsMonths}-Month Service Agreement (Bond)`,
      detail:
        "Company mandates financial penalty or original document retention if leaving early. Enforceability in Indian courts is limited (Sec 27 Contract Act), but can block PF transfer or experience letters.",
    });
  }

  if (ctcResult.flags && ctcResult.flags.length > 0) {
    ctcResult.flags.forEach((f) => {
      redFlags.push({
        type: f.type,
        title: f.type === "HIGH_VARIABLE_SHARE" ? "High Variable Pay Risk" : "Notice",
        detail: f.message,
      });
    });
  }

  if (Number(offer.joiningBonus) > 0) {
    redFlags.push({
      type: "clawback",
      title: "Joining Bonus 12-Month Clawback",
      detail:
        "One-time bonus of ₹" +
        Number(offer.joiningBonus).toLocaleString("en-IN") +
        " typically must be returned in full if you depart before completing 1 full year.",
    });
  }

  if (Number(offer.esop) > 0) {
    redFlags.push({
      type: "esop",
      title: "Paper Wealth (ESOPs)",
      detail:
        "₹" +
        Number(offer.esop).toLocaleString("en-IN") +
        " stock options vest over 4 years with a 1-year cliff. Excluded from immediate monthly bank cash flow.",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Column Header */}
      <div className="border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 tracking-tight dark:text-zinc-100">
          2. Reality Check
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Your true take-home pay, statutory deductions, and market percentile.
        </p>
      </div>

      {/* Hero Metric Card: Real Monthly Take-Home */}
      <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Actual Monthly Bank Deposit</span>
          <span className="rounded bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-[#0F766E] border border-teal-200 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-300">
            {isIntern ? "Stipend" : "Net In-Hand"}
          </span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            ₹{monthlyInHand.toLocaleString("en-IN")}
          </span>
          <span className="text-xs font-medium text-zinc-500">/month</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between border-t border-zinc-100 pt-2 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <span>Annual In-Hand: <strong className="tabular-nums font-semibold text-zinc-800 dark:text-zinc-200">₹{annualInHand.toLocaleString("en-IN")}</strong></span>
          {!isIntern && quotedCtc > 0 && (
            <span className="text-[11px] text-zinc-500">
              {takeHomeShare}% of paper CTC (₹{quotedCtc.toLocaleString("en-IN")})
            </span>
          )}
        </div>
      </div>

      {/* "How this was calculated" Ledger Expander */}
      {!isIntern && ctcResult.status === "OK" && (
        <div className="rounded-md border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setShowLedger(!showLedger)}
            className="flex w-full items-center justify-between text-left text-xs font-medium text-zinc-800 hover:text-[#0F766E] dark:text-zinc-200"
          >
            <span className="flex items-center gap-1.5 font-semibold">
              <HelpCircle className="h-3.5 w-3.5 text-[#0F766E]" />
              How this in-hand was calculated
            </span>
            {showLedger ? (
              <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            )}
          </button>

          {showLedger && (
            <div className="mt-3 flex flex-col gap-2.5 border-t border-zinc-100 pt-3 text-xs dark:border-zinc-800">
              {/* Regime & PF Options */}
              <div className="flex flex-col gap-2 rounded bg-zinc-50 p-2 dark:bg-zinc-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400">Tax Regime:</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setTaxRegime(TAX_REGIMES.NEW_REGIME)}
                      className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${taxRegime === TAX_REGIMES.NEW_REGIME
                          ? "bg-[#0F766E] text-white"
                          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                        }`}
                    >
                      New (Sec 115BAC)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaxRegime(TAX_REGIMES.OLD_REGIME)}
                      className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${taxRegime === TAX_REGIMES.OLD_REGIME
                          ? "bg-[#0F766E] text-white"
                          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                        }`}
                    >
                      Old Regime
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-200/60 pt-1.5 dark:border-zinc-700/60">
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400">Statutory PF Capping:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-zinc-700 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={pfCapping}
                      onChange={(e) => setPfCapping(e.target.checked)}
                      className="rounded border-zinc-300 text-[#0F766E] focus:ring-[#0F766E]"
                    />
                    <span>Cap at ₹1,800/mo (₹15k basic ceiling)</span>
                  </label>
                </div>
              </div>

              {/* Statutory Itemized Deductions Table */}
              <div className="flex flex-col divide-y divide-zinc-100 font-mono text-[11px] dark:divide-zinc-800">
                <div className="flex justify-between py-1 text-zinc-700 dark:text-zinc-300">
                  <span className="font-sans">Fixed Base CTC</span>
                  <span className="tabular-nums font-semibold">₹{ctcResult.fixedCtc.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 text-zinc-500">
                  <span className="font-sans pl-2">↳ Basic Pay (50%)</span>
                  <span className="tabular-nums">₹{ctcResult.breakdown.basicSalary.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 text-zinc-500">
                  <span className="font-sans pl-2">↳ Employer EPF (12%)</span>
                  <span className="tabular-nums">-₹{ctcResult.breakdown.employerPf.toLocaleString("en-IN")}</span>
                </div>
                {ctcResult.breakdown.gratuity > 0 && (
                  <div className="flex justify-between py-1 text-zinc-500">
                    <span className="font-sans pl-2">↳ Gratuity Reserve (4.81%)</span>
                    <span className="tabular-nums">-₹{ctcResult.breakdown.gratuity.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 font-semibold text-zinc-800 dark:text-zinc-200">
                  <span className="font-sans">Gross Payslip Salary</span>
                  <span className="tabular-nums">₹{ctcResult.breakdown.grossSalary.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 text-red-600 dark:text-red-400">
                  <span className="font-sans pl-2">↳ Employee EPF (12%)</span>
                  <span className="tabular-nums">-₹{ctcResult.breakdown.employeePf.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 text-red-600 dark:text-red-400">
                  <span className="font-sans pl-2">↳ Professional Tax (PT)</span>
                  <span className="tabular-nums">-₹{ctcResult.breakdown.professionalTax.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 text-red-600 dark:text-red-400">
                  <span className="font-sans pl-2">↳ Income Tax TDS</span>
                  <span className="tabular-nums">-₹{ctcResult.breakdown.incomeTaxTds.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-zinc-900 border-t border-zinc-200 dark:text-zinc-100 dark:border-zinc-700">
                  <span className="font-sans">Annual In-Hand Cash</span>
                  <span className="tabular-nums text-[#0F766E] dark:text-teal-400">
                    ₹{ctcResult.annualInHand.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Assumptions note */}
              <div className="rounded bg-zinc-50 p-2 text-[10px] text-zinc-500 dark:bg-zinc-800/40 dark:text-zinc-400">
                <p>
                  * Computed with ₹75,000 standard deduction. Section 87A rebate provides full tax waiver for taxable income up to ₹7,00,000.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Market Benchmark Card */}
      <div className="rounded-md border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
            <BarChart3 className="h-3.5 w-3.5 text-[#0F766E]" />
            Market Benchmark
          </span>
          <span className="text-[11px] text-zinc-500">
            {offer.role || "SDE"} • {offer.city || "Bengaluru"}
          </span>
        </div>

        {benchmarkResult.status === "OK" ? (
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex justify-between text-[11px] text-zinc-500">
              <span>P25 (Entry): ₹{benchmarkResult.p25Formatted}</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                P50 (Median): ₹{benchmarkResult.p50Formatted}
              </span>
              <span>P75 (Top): ₹{benchmarkResult.p75Formatted}</span>
            </div>

            {/* Percentile Visual Bar */}
            <div className="relative h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="absolute left-[25%] right-[25%] top-0 h-2 rounded-full bg-teal-100 dark:bg-teal-950/60"
                title="IQR (Middle 50%)"
              />
              <div
                className="absolute top-[-3px] h-3.5 w-1 rounded-full bg-[#0F766E]"
                style={{
                  left: `${Math.min(
                    95,
                    Math.max(
                      5,
                      benchmarkResult.p50 > 0
                        ? ((Number(offer.fixedCtc) || 0) / (benchmarkResult.p75 * 1.2)) * 100
                        : 50
                    )
                  )}%`,
                }}
                title="Your Current Offer"
              />
            </div>

            <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
              {benchmarkResult.evaluateVerdict(offer.fixedCtc)}
            </p>
          </div>
        ) : (
          <div className="mt-2.5 rounded bg-zinc-50 p-2 text-[11px] text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
            <p className="font-medium text-zinc-700 dark:text-zinc-300">
              Collecting Verified Benchmark Datapoints
            </p>
            <p className="mt-0.5 text-[10px]">
              Requires 5+ verified submissions for {offer.city || "this city"} to show statistically sound percentiles.
              Strategy is calculated relative to your baseline offer.
            </p>
          </div>
        )}
      </div>

      {/* Red Flags & Pitfalls List */}
      {redFlags.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50/60 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-300">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Hidden Clauses & Fine Print ({redFlags.length})</span>
          </div>

          <div className="mt-2.5 flex flex-col gap-2">
            {redFlags.map((flag, idx) => (
              <div
                key={idx}
                className="rounded border border-amber-200/80 bg-white/80 p-2 text-xs dark:border-amber-900/60 dark:bg-zinc-900/80"
              >
                <p className="font-medium text-amber-900 dark:text-amber-300">{flag.title}</p>
                <p className="mt-0.5 text-[11px] text-zinc-600 dark:text-zinc-400">{flag.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

Col2RealityCheck.propTypes = {
  offer: PropTypes.shape({
    role: PropTypes.string,
    city: PropTypes.string,
    companyTier: PropTypes.string,
    employmentType: PropTypes.string,
    fixedCtc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    variable: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    joiningBonus: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    esop: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bondsMonths: PropTypes.number,
  }).isRequired,
};