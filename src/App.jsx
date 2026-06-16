/**
 * @fileoverview Root application component for NegotiAte.
 *
 * Orchestrates the 4-step wizard flow:
 *   1. Commute inputs
 *   2. Profile personalisation
 *   3. Impact dashboard
 *   4. AI proposal viewer
 *
 * Uses custom hooks (useCommute, useProposal) for clean state separation
 * and React.lazy / Suspense for code-splitting the heavier step components.
 */

import { useState, useRef, lazy, Suspense } from "react";
import { LeafIcon } from "./components/Icons.jsx";
import { StepIndicator } from "./components/UI.jsx";
import Step1 from "./components/Step1Commute.jsx";
import Step2 from "./components/Step2Profile.jsx";
import { useCommute } from "./hooks/useCommute.js";
import { useProposal } from "./hooks/useProposal.js";

// Lazy-load heavy components to reduce initial JS payload (~41KB deferred).
const Step3Dashboard = lazy(() => import("./components/Step3Dashboard.jsx"));
const Step4Proposal = lazy(() => import("./components/Step4Proposal.jsx"));

/** Minimal loading placeholder shown while lazy chunks are fetching. */
function StepSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading step content"
      className="flex flex-col items-center justify-center py-24 gap-4"
    >
      <span className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-xs text-slate-400 font-medium">Loading…</p>
    </div>
  );
}

/**
 * Root NegotiAte application component.
 * @returns {JSX.Element}
 */
export default function NegotiAte() {
  const [step, setStep] = useState(1);
  const [profileForm, setProfileForm] = useState({
    name: "",
    role: "",
    industry: "Technology / IT",
    company: "",
    managerName: "",
    extraContext: "",
    tone: "corporate",
  });

  const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";
  const topRef = useRef(null);

  // --- Custom hooks ---
  const { proposal, proposalInputs, loading, error, setError, generateProposal, resetProposal } =
    useProposal(apiKey);

  const { commuteForm, setCommuteForm, savings, isProposalDirty } = useCommute(
    proposalInputs,
    profileForm.tone
  );

  // Width class depends on current step (dashboard and proposal need more space).
  const maxWidthClass = step === 3 || step === 4 ? "max-w-6xl" : "max-w-5xl";

  /** Smoothly scrolls back to the top of the page after a step transition. */
  function scrollTop() {
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }

  function goStep1to2() {
    scrollTop();
    setStep(2);
  }

  async function goStep2to3() {
    setError("");
    const ok = await generateProposal(profileForm, commuteForm, savings);
    if (ok) {
      setStep(3);
      scrollTop();
    }
  }

  async function handleRegenerate() {
    await generateProposal(profileForm, commuteForm, savings);
  }

  function restart() {
    setStep(1);
    resetProposal();
    scrollTop();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-100/80 sticky top-0 z-50 shadow-sm shadow-slate-100/50">
        <div
          className={`mx-auto px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-500 ${maxWidthClass}`}
        >
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="NegotiAte Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg"
              width={36}
              height={36}
            />
            <div className="flex items-center gap-2.5">
              <span className="text-slate-900 font-extrabold text-lg sm:text-xl tracking-tight leading-none">
                NegotiAte
              </span>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide hidden md:inline border-l border-slate-200 pl-2.5 py-0.5 leading-none">
                Turn your commute into leverage
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <main
        id="main-content"
        className={`mx-auto px-4 sm:px-6 py-5 md:py-8 transition-all duration-500 flex-1 w-full ${maxWidthClass}`}
        ref={topRef}
      >
        {/* Error / Notice banner */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className={`mb-5 border rounded-2xl px-4 py-3 text-sm flex gap-3 items-start animate-slide-down ${
              error.includes("Notice:")
                ? "bg-blue-50/80 border-blue-200 text-blue-800"
                : error.includes("failed") || error.includes("error")
                ? "bg-amber-50/80 border-amber-200 text-amber-800"
                : "bg-red-50/80 border-red-200 text-red-800"
            }`}
          >
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-semibold text-xs leading-none">
                {error.includes("Notice:") ? "Running in Demo Mode" : "Notice"}
              </p>
              <p className="text-xs mt-1 opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Step indicator */}
        <div className="flex justify-center mb-6 md:mb-8">
          <StepIndicator current={step} />
        </div>

        {/* Step content — heavy steps are code-split via Suspense */}
        <div key={step} className="animate-slide-up">
          {step === 1 && <Step1 form={commuteForm} setForm={setCommuteForm} onNext={goStep1to2} />}

          {step === 2 && savings && (
            <Step2
              form={profileForm}
              setForm={setProfileForm}
              savings={savings}
              onBack={() => setStep(1)}
              onNext={goStep2to3}
              loading={loading}
              error={error}
            />
          )}

          {step === 3 && savings && (
            <Suspense fallback={<StepSkeleton />}>
              <Step3Dashboard
                savings={savings}
                commuteForm={commuteForm}
                setCommuteForm={setCommuteForm}
                onViewProposal={() => {
                  setStep(4);
                  scrollTop();
                }}
                onBack={() => setStep(2)}
                onRegenerate={handleRegenerate}
                isProposalDirty={isProposalDirty}
                loading={loading}
              />
            </Suspense>
          )}

          {step === 4 && proposal && savings && (
            <Suspense fallback={<StepSkeleton />}>
              <Step4Proposal
                proposal={proposal}
                savings={savings}
                commuteForm={commuteForm}
                profileForm={profileForm}
                onBack={() => {
                  setStep(3);
                  scrollTop();
                }}
                onRestart={restart}
              />
            </Suspense>
          )}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-white/60 backdrop-blur-sm mt-auto">
        <div className={`mx-auto px-4 sm:px-6 py-5 ${maxWidthClass}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="NegotiAte"
                className="w-5 h-5 object-contain rounded opacity-60"
                width={20}
                height={20}
              />
              <span className="text-xs text-slate-400 font-medium">
                NegotiAte · Turn your commute into leverage
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <LeafIcon className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                Built for a greener planet
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Carbon-smart workplace negotiation</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
