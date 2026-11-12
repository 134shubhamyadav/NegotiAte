import { useState } from "react";
import PropTypes from "prop-types";
import { Sparkles, FileText, Sliders, AlertCircle } from "lucide-react";
import { SAMPLE_OFFERS } from "../constants/offerConstants.js";

export default function Col1OfferInput({
  offer,
  onOfferChange,
  onParseText,
  isParsing,
  parseStatus,
}) {
  const [inputMode, setInputMode] = useState("paste"); // 'paste' | 'manual'
  const [rawText, setRawText] = useState("");

  const handleApplySample = (type) => {
    const text = SAMPLE_OFFERS[type];
    setRawText(text);
    setInputMode("paste");
  };

  const handleParseSubmit = (e) => {
    if (e) e.preventDefault();
    if (!rawText.trim() || isParsing) return;
    onParseText(rawText);
  };

  const updateField = (field, value) => {
    onOfferChange({
      ...offer,
      [field]: value,
    });
  };

  const isIntern = offer.employmentType === "intern";

  return (
    <div className="flex flex-col gap-4">
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 tracking-tight dark:text-zinc-100">
            1. Offer Parameters
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Paste offer text or adjust compensation numbers manually.
          </p>
        </div>

        {/* Input Mode Tabs */}
        <div className="flex rounded-md bg-zinc-100 p-0.5 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setInputMode("paste")}
            className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-colors ${inputMode === "paste"
                ? "bg-white text-zinc-900 shadow-2xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
          >
            <FileText className="h-3 w-3" />
            <span>Paste</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode("manual")}
            className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-colors ${inputMode === "manual"
                ? "bg-white text-zinc-900 shadow-2xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
          >
            <Sliders className="h-3 w-3" />
            <span>Manual</span>
          </button>
        </div>
      </div>

      {/* Paste Mode View */}
      {inputMode === "paste" && (
        <div className="flex flex-col gap-2.5">
          <div className="relative">
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste email snippet, campus placement message, or compensation breakdown..."
              rows={6}
              className="w-full rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-[#0F766E] focus:outline-hidden focus:ring-1 focus:ring-[#0F766E] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
            {rawText && (
              <button
                type="button"
                onClick={() => setRawText("")}
                className="absolute right-2.5 top-2.5 text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sample Offer Starters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-zinc-500">Quick test:</span>
            <button
              type="button"
              onClick={() => handleApplySample("fulltime")}
              className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              12 LPA SDE Offer
            </button>
            <button
              type="button"
              onClick={() => handleApplySample("intern")}
              className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              ₹45k Intern Offer
            </button>
          </div>

          {/* Parse Button */}
          <button
            type="button"
            disabled={!rawText.trim() || isParsing}
            onClick={handleParseSubmit}
            className="mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#0F766E] px-3 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isParsing ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Extracting compensation figures...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Parse Offer with AI</span>
                <kbd className="ml-1 hidden rounded bg-teal-800/60 px-1 text-[10px] sm:inline">⌘↵</kbd>
              </>
            )}
          </button>
        </div>
      )}

      {/* Parse Feedback Banner */}
      {parseStatus && parseStatus.status === "RATE_LIMITED_FALLBACK" && (
        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-medium">AI Rate Limit Reached</p>
            <p className="text-[11px] opacity-90">
              Figures were extracted locally via pattern matching. Please review and adjust the fields below.
            </p>
          </div>
        </div>
      )}

      {parseStatus && parseStatus.isLowConfidence && (
        <div className="flex items-start gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
          <div>
            <p className="font-medium">Verify Key Figures</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Could not determine: {parseStatus.missingFields?.join(", ") || "fixed compensation"}. Please enter manually.
            </p>
          </div>
        </div>
      )}

      {/* Structured Editable Fields */}
      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            Verified Offer Details
          </span>
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-zinc-500 dark:text-zinc-400">Type:</label>
            <select
              value={offer.employmentType || "fulltime"}
              onChange={(e) => updateField("employmentType", e.target.value)}
              className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <option value="fulltime">Full-time Fresh</option>
              <option value="intern">Internship</option>
            </select>
          </div>
        </div>

        {/* Company & Role */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
              Company Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={offer.company || ""}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="e.g. Swiggy, TCS, Razorpay"
                className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900 focus:border-[#0F766E] focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
              Job Title / Role
            </label>
            <div className="relative">
              <input
                type="text"
                value={offer.role || ""}
                onChange={(e) => updateField("role", e.target.value)}
                placeholder="e.g. SDE-1, Associate SE"
                className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900 focus:border-[#0F766E] focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>
        </div>

        {/* City & Tier */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
              Job Location
            </label>
            <select
              value={offer.city || "Bengaluru"}
              onChange={(e) => updateField("city", e.target.value)}
              className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900 focus:border-[#0F766E] focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Delhi_NCR">Delhi NCR / Gurgaon / Noida</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Chennai">Chennai</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
              Company Category
            </label>
            <select
              value={offer.companyTier || "product"}
              onChange={(e) => updateField("companyTier", e.target.value)}
              className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900 focus:border-[#0F766E] focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="product">Funded Product / Unicorn</option>
              <option value="service">IT Services (TCS, Infosys, Wipro)</option>
              <option value="startup_early">Early Stage Startup (Seed / Pre-A)</option>
              <option value="mnc">Global Enterprise / MNC</option>
              <option value="faang_like">Tier-1 FAANG / High Frequency</option>
            </select>
          </div>
        </div>

        {/* Primary Compensation Number */}
        <div>
          <label className="mb-1 flex items-center justify-between text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
            <span>{isIntern ? "Monthly Stipend (₹/month)" : "Fixed Base CTC (Annual INR or LPA)"}</span>
            <span className="text-[10px] font-normal text-zinc-500">
              {isIntern ? "Cash in bank each month" : "Guaranteed base"}
            </span>
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1.5 font-mono text-xs text-zinc-400">₹</span>
            <input
              type="text"
              value={offer.fixedCtc ?? ""}
              onChange={(e) => updateField("fixedCtc", e.target.value)}
              placeholder={isIntern ? "e.g. 45000" : "e.g. 1200000 or 12 LPA"}
              className="tabular-nums w-full rounded border border-zinc-300 bg-white pl-6 pr-2.5 py-1.5 text-xs font-semibold text-zinc-900 focus:border-[#0F766E] focus:outline-hidden dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>

        {!isIntern && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                Variable / Bonus (₹/yr)
              </label>
              <input
                type="text"
                value={offer.variable ?? 0}
                onChange={(e) => updateField("variable", e.target.value)}
                placeholder="0"
                className="tabular-nums w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900 focus:border-[#0F766E] focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                Joining Bonus (1-time)
              </label>
              <input
                type="text"
                value={offer.joiningBonus ?? 0}
                onChange={(e) => updateField("joiningBonus", e.target.value)}
                placeholder="0"
                className="tabular-nums w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900 focus:border-[#0F766E] focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>
        )}

        {!isIntern && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                ESOPs Grant (4-Yr Total)
              </label>
              <input
                type="text"
                value={offer.esop ?? 0}
                onChange={(e) => updateField("esop", e.target.value)}
                placeholder="0"
                className="tabular-nums w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900 focus:border-[#0F766E] focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                Service Bond (Months)
              </label>
              <input
                type="number"
                min="0"
                value={offer.bondsMonths ?? 0}
                onChange={(e) => updateField("bondsMonths", parseInt(e.target.value, 10) || 0)}
                placeholder="0 (if none)"
                className="tabular-nums w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900 focus:border-[#0F766E] focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>
        )}

        {/* Competing Alternative (BATNA) */}
        <div className="mt-1 border-t border-zinc-100 pt-2.5 dark:border-zinc-800">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={offer.hasOutsideOffer || false}
              onChange={(e) => updateField("hasOutsideOffer", e.target.checked)}
              className="rounded border-zinc-300 text-[#0F766E] focus:ring-[#0F766E]"
            />
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              I hold a competing outside offer (BATNA)
            </span>
          </label>

          {offer.hasOutsideOffer && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[10px] text-zinc-500">Other Company</label>
                <input
                  type="text"
                  value={offer.outsideOfferCompany || ""}
                  onChange={(e) => updateField("outsideOfferCompany", e.target.value)}
                  placeholder="e.g. Swiggy"
                  className="w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 focus:border-[#0F766E] focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-zinc-500">Fixed Payoff (₹)</label>
                <input
                  type="text"
                  value={offer.outsideOfferValue || ""}
                  onChange={(e) => updateField("outsideOfferValue", e.target.value)}
                  placeholder="e.g. 1100000"
                  className="tabular-nums w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 focus:border-[#0F766E] focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Col1OfferInput.propTypes = {
  offer: PropTypes.shape({
    company: PropTypes.string,
    role: PropTypes.string,
    city: PropTypes.string,
    companyTier: PropTypes.string,
    employmentType: PropTypes.string,
    fixedCtc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    variable: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    joiningBonus: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    esop: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bondsMonths: PropTypes.number,
    hasOutsideOffer: PropTypes.bool,
    outsideOfferCompany: PropTypes.string,
    outsideOfferValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  onOfferChange: PropTypes.func.isRequired,
  onParseText: PropTypes.func.isRequired,
  isParsing: PropTypes.bool,
  parseStatus: PropTypes.object,
};