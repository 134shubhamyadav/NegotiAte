import { useState } from "react";
import PropTypes from "prop-types";
import { X, Trophy, Scale, Info } from "lucide-react";
import { compareOffers, DEFAULT_WEIGHTS } from "../engine/compareOffers.js";

export default function OfferComparisonModal({ isOpen, onClose, currentOffer }) {
  const [offerB, setOfferB] = useState({
    name: "Offer B (Challenger)",
    fixedCtc: "1400000",
    growth: 4,
    flexibility: 4,
    stability: 3,
  });

  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);

  if (!isOpen) return null;

  const offerA = {
    name: currentOffer.company || "Current Offer",
    fixedCtc: currentOffer.fixedCtc || "1200000",
    variable: currentOffer.variable || 0,
    growth: 3,
    flexibility: 3,
    stability: 4,
  };

  const comparison = compareOffers([offerA, offerB], weights);
  const winner = comparison.winner;
  const runnerUp = comparison.runnerUp;
  const sensitivity = comparison.sensitivity;

  const updateWeight = (attr, val) => {
    setWeights((prev) => ({
      ...prev,
      [attr]: Number(val),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-[#0F766E]" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Multi-Attribute Offer Comparison & Sensitivity
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 text-xs">
          {/* Winner Banner */}
          {winner && (
            <div className="mb-4 flex items-center justify-between rounded-md border border-teal-200 bg-teal-50/70 p-3 dark:border-teal-900/60 dark:bg-teal-950/30">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F766E] text-white">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-teal-800 dark:text-teal-300">
                    Highest Overall Utility Score
                  </p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {winner.name} (Score: {winner.compositeScore} / 100)
                  </p>
                </div>
              </div>
              {runnerUp && (
                <div className="text-right text-[11px] text-zinc-500">
                  <span>Challenger: {runnerUp.name} ({runnerUp.compositeScore})</span>
                </div>
              )}
            </div>
          )}

          {/* Sensitivity Verdict Line */}
          {sensitivity && (
            <div className="mb-4 rounded border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300">
              <div className="flex items-start gap-1.5">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
                <div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Decision Sensitivity:{" "}
                  </span>
                  <span>{sensitivity.explanation || sensitivity.reason}</span>
                </div>
              </div>
            </div>
          )}

          {/* Side-by-side Offer Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Offer A */}
            <div className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                Offer A (Current)
              </span>
              <p className="font-bold text-zinc-900 text-sm dark:text-zinc-100">{offerA.name}</p>
              <p className="font-mono text-xs text-[#0F766E] font-semibold mt-1">
                Fixed: ₹{Number(offerA.fixedCtc).toLocaleString("en-IN")}
              </p>

              <div className="mt-3 flex flex-col gap-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Growth:</span>
                  <span className="font-semibold">{offerA.growth} / 5</span>
                </div>
                <div className="flex justify-between">
                  <span>Flexibility:</span>
                  <span className="font-semibold">{offerA.flexibility} / 5</span>
                </div>
                <div className="flex justify-between">
                  <span>Stability:</span>
                  <span className="font-semibold">{offerA.stability} / 5</span>
                </div>
              </div>
            </div>

            {/* Offer B */}
            <div className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                Offer B (Challenger)
              </span>
              <input
                type="text"
                value={offerB.name}
                onChange={(e) => setOfferB({ ...offerB, name: e.target.value })}
                className="mt-0.5 w-full rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-bold text-zinc-900 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <div className="mt-1 flex items-center gap-1 font-mono text-xs">
                <span>Fixed: ₹</span>
                <input
                  type="text"
                  value={offerB.fixedCtc}
                  onChange={(e) => setOfferB({ ...offerB, fixedCtc: e.target.value })}
                  className="tabular-nums w-24 rounded border border-zinc-200 bg-zinc-50 px-1 py-0.5 text-xs text-[#0F766E] font-semibold dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div className="mt-2.5 flex flex-col gap-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Growth:</span>
                  <select
                    value={offerB.growth}
                    onChange={(e) => setOfferB({ ...offerB, growth: Number(e.target.value) })}
                    className="rounded border border-zinc-200 px-1.5 py-0.5 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    <option value={5}>5 (High growth / Modern stack)</option>
                    <option value={4}>4 (Strong learning)</option>
                    <option value={3}>3 (Average)</option>
                    <option value={2}>2 (Legacy stack / Slow)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Flexibility:</span>
                  <select
                    value={offerB.flexibility}
                    onChange={(e) => setOfferB({ ...offerB, flexibility: Number(e.target.value) })}
                    className="rounded border border-zinc-200 px-1.5 py-0.5 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    <option value={5}>5 (Fully Remote)</option>
                    <option value={4}>4 (Hybrid 2d)</option>
                    <option value={3}>3 (Hybrid 3d)</option>
                    <option value={1}>1 (Strict 5d Office + Commute)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Stability:</span>
                  <select
                    value={offerB.stability}
                    onChange={(e) => setOfferB({ ...offerB, stability: Number(e.target.value) })}
                    className="rounded border border-zinc-200 px-1.5 py-0.5 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    <option value={5}>5 (Profitable giant / FAANG)</option>
                    <option value={4}>4 (Series C+ funded)</option>
                    <option value={3}>3 (Seed / Early startup)</option>
                    <option value={2}>2 (Service bond mandatory)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Sliders */}
          <div className="mt-5 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Customize Your Personal Priorities (Weights)
            </span>
            <div className="mt-2.5 grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-400">
                  <span>Financial (In-Hand Cash)</span>
                  <span className="tabular-nums font-semibold">{weights.financial}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.financial}
                  onChange={(e) => updateWeight("financial", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-400">
                  <span>Career Growth & Mentorship</span>
                  <span className="tabular-nums font-semibold">{weights.growth}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.growth}
                  onChange={(e) => updateWeight("growth", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-400">
                  <span>Flexibility & Commute</span>
                  <span className="tabular-nums font-semibold">{weights.flexibility}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.flexibility}
                  onChange={(e) => updateWeight("flexibility", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-400">
                  <span>Job Stability & No-Bond Safety</span>
                  <span className="tabular-nums font-semibold">{weights.stability}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.stability}
                  onChange={(e) => updateWeight("stability", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-zinc-200 px-5 py-3 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

OfferComparisonModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentOffer: PropTypes.object.isRequired,
};