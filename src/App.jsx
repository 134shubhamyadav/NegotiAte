import { useState, useRef } from "react";
import { LeafIcon } from "./components/Icons.jsx";
import { StepIndicator } from "./components/UI.jsx";
import Step1 from "./components/Step1Commute.jsx";
import Step2 from "./components/Step2Profile.jsx";
import Step3Dashboard from "./components/Step3Dashboard.jsx";
import Step4Proposal from "./components/Step4Proposal.jsx";
import { calcSavings } from "./utils/calculations.js";
import { callGroq, buildPrompt, parseProposal, getMockProposal } from "./utils/groq.js";

export default function NegotiAte() {
  const [step, setStep] = useState(1);
  const [apiKey] = useState(import.meta.env.VITE_GROQ_API_KEY || "");
  const [commuteForm, setCommuteForm] = useState({
    distanceKm: "",
    mode: "car_petrol",
    officeDaysPerWeek: "5",
    wfhDaysRequested: "2",
    customFuelPrice: "",
    customMileage: "",
    customEvCost: "",
    customTransitFare: "",
  });
  const [profileForm, setProfileForm] = useState({
    name: "",
    role: "",
    industry: "Technology / IT",
    company: "",
    managerName: "",
    extraContext: "",
    tone: "corporate",
  });
  const [proposal, setProposal] = useState(null);
  const [proposalInputs, setProposalInputs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const topRef = useRef(null);

  const maxWidthClass = step === 3 || step === 4 ? "max-w-6xl" : "max-w-5xl";

  function scrollTop() {
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }

  const hasCommuteData = commuteForm.distanceKm && Number(commuteForm.distanceKm) > 0;
  const savings = hasCommuteData
    ? calcSavings({
        distanceKm: Number(commuteForm.distanceKm),
        mode: commuteForm.mode,
        officeDaysPerWeek: Number(commuteForm.officeDaysPerWeek),
        wfhDaysRequested: Number(commuteForm.wfhDaysRequested),
        customFuelPrice: commuteForm.customFuelPrice,
        customMileage: commuteForm.customMileage,
        customEvCost: commuteForm.customEvCost,
        customTransitFare: commuteForm.customTransitFare,
      })
    : null;

  const isProposalDirty =
    proposal &&
    proposalInputs &&
    (Number(proposalInputs.distanceKm) !== Number(commuteForm.distanceKm) ||
      proposalInputs.mode !== commuteForm.mode ||
      Number(proposalInputs.officeDaysPerWeek) !== Number(commuteForm.officeDaysPerWeek) ||
      Number(proposalInputs.wfhDaysRequested) !== Number(commuteForm.wfhDaysRequested) ||
      proposalInputs.customFuelPrice !== commuteForm.customFuelPrice ||
      proposalInputs.customMileage !== commuteForm.customMileage ||
      proposalInputs.customEvCost !== commuteForm.customEvCost ||
      proposalInputs.customTransitFare !== commuteForm.customTransitFare ||
      proposalInputs.tone !== profileForm.tone);

  function goStep1to2() {
    scrollTop();
    setStep(2);
  }

  async function goStep2to3() {
    setError("");
    setLoading(true);
    const isMockMode = !apiKey.trim() || apiKey.toLowerCase() === "demo" || apiKey.toLowerCase() === "placeholder";

    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockRaw = getMockProposal({
        ...profileForm,
        distanceKm: Number(commuteForm.distanceKm),
        mode: commuteForm.mode,
        officeDaysPerWeek: Number(commuteForm.officeDaysPerWeek),
        wfhDaysRequested: Number(commuteForm.wfhDaysRequested),
        savings,
      });
      setProposal(parseProposal(mockRaw));
      setProposalInputs({
        distanceKm: commuteForm.distanceKm,
        mode: commuteForm.mode,
        officeDaysPerWeek: commuteForm.officeDaysPerWeek,
        wfhDaysRequested: commuteForm.wfhDaysRequested,
        customFuelPrice: commuteForm.customFuelPrice,
        customMileage: commuteForm.customMileage,
        customEvCost: commuteForm.customEvCost,
        customTransitFare: commuteForm.customTransitFare,
        tone: profileForm.tone,
      });
      setError("Notice: Running in Demo Mode (using simulated AI proposal). To enable live AI, configure VITE_GROQ_API_KEY in your environment.");
      setStep(3);
      setLoading(false);
      scrollTop();
      return;
    }

    try {
      const prompt = buildPrompt({
        ...profileForm,
        distanceKm: Number(commuteForm.distanceKm),
        mode: commuteForm.mode,
        officeDaysPerWeek: Number(commuteForm.officeDaysPerWeek),
        wfhDaysRequested: Number(commuteForm.wfhDaysRequested),
        savings,
      });
      const raw = await callGroq(apiKey, prompt);
      setProposal(parseProposal(raw));
      setProposalInputs({
        distanceKm: commuteForm.distanceKm,
        mode: commuteForm.mode,
        officeDaysPerWeek: commuteForm.officeDaysPerWeek,
        wfhDaysRequested: commuteForm.wfhDaysRequested,
        customFuelPrice: commuteForm.customFuelPrice,
        customMileage: commuteForm.customMileage,
        customEvCost: commuteForm.customEvCost,
        customTransitFare: commuteForm.customTransitFare,
        tone: profileForm.tone,
      });
      setStep(3);
      scrollTop();
    } catch (e) {
      console.warn("Groq API failed, falling back to mock mode:", e);
      const mockRaw = getMockProposal({
        ...profileForm,
        distanceKm: Number(commuteForm.distanceKm),
        mode: commuteForm.mode,
        officeDaysPerWeek: Number(commuteForm.officeDaysPerWeek),
        wfhDaysRequested: Number(commuteForm.wfhDaysRequested),
        savings,
      });
      setProposal(parseProposal(mockRaw));
      setProposalInputs({
        distanceKm: commuteForm.distanceKm,
        mode: commuteForm.mode,
        officeDaysPerWeek: commuteForm.officeDaysPerWeek,
        wfhDaysRequested: commuteForm.wfhDaysRequested,
        customFuelPrice: commuteForm.customFuelPrice,
        customMileage: commuteForm.customMileage,
        customEvCost: commuteForm.customEvCost,
        customTransitFare: commuteForm.customTransitFare,
        tone: profileForm.tone,
      });
      setError(`Groq API call failed (${e.message}). Fell back to Demo Mode.`);
      setStep(3);
      scrollTop();
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate() {
    setError("");
    setLoading(true);
    const isMockMode = !apiKey.trim() || apiKey.toLowerCase() === "demo" || apiKey.toLowerCase() === "placeholder";

    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const mockRaw = getMockProposal({
        ...profileForm,
        distanceKm: Number(commuteForm.distanceKm),
        mode: commuteForm.mode,
        officeDaysPerWeek: Number(commuteForm.officeDaysPerWeek),
        wfhDaysRequested: Number(commuteForm.wfhDaysRequested),
        savings,
      });
      setProposal(parseProposal(mockRaw));
      setProposalInputs({
        distanceKm: commuteForm.distanceKm,
        mode: commuteForm.mode,
        officeDaysPerWeek: commuteForm.officeDaysPerWeek,
        wfhDaysRequested: commuteForm.wfhDaysRequested,
        customFuelPrice: commuteForm.customFuelPrice,
        customMileage: commuteForm.customMileage,
        customEvCost: commuteForm.customEvCost,
        customTransitFare: commuteForm.customTransitFare,
        tone: profileForm.tone,
      });
      setError("Notice: Running in Demo Mode (using simulated AI proposal). To enable live AI, configure VITE_GROQ_API_KEY in your environment.");
      setLoading(false);
      return;
    }

    try {
      const prompt = buildPrompt({
        ...profileForm,
        distanceKm: Number(commuteForm.distanceKm),
        mode: commuteForm.mode,
        officeDaysPerWeek: Number(commuteForm.officeDaysPerWeek),
        wfhDaysRequested: Number(commuteForm.wfhDaysRequested),
        savings,
      });
      const raw = await callGroq(apiKey, prompt);
      setProposal(parseProposal(raw));
      setProposalInputs({
        distanceKm: commuteForm.distanceKm,
        mode: commuteForm.mode,
        officeDaysPerWeek: commuteForm.officeDaysPerWeek,
        wfhDaysRequested: commuteForm.wfhDaysRequested,
        customFuelPrice: commuteForm.customFuelPrice,
        customMileage: commuteForm.customMileage,
        customEvCost: commuteForm.customEvCost,
        customTransitFare: commuteForm.customTransitFare,
        tone: profileForm.tone,
      });
    } catch (e) {
      console.warn("Groq API failed, falling back to mock mode:", e);
      const mockRaw = getMockProposal({
        ...profileForm,
        distanceKm: Number(commuteForm.distanceKm),
        mode: commuteForm.mode,
        officeDaysPerWeek: Number(commuteForm.officeDaysPerWeek),
        wfhDaysRequested: Number(commuteForm.wfhDaysRequested),
        savings,
      });
      setProposal(parseProposal(mockRaw));
      setProposalInputs({
        distanceKm: commuteForm.distanceKm,
        mode: commuteForm.mode,
        officeDaysPerWeek: commuteForm.officeDaysPerWeek,
        wfhDaysRequested: commuteForm.wfhDaysRequested,
        customFuelPrice: commuteForm.customFuelPrice,
        customMileage: commuteForm.customMileage,
        customEvCost: commuteForm.customEvCost,
        customTransitFare: commuteForm.customTransitFare,
        tone: profileForm.tone,
      });
      setError(`Groq API call failed (${e.message}). Fell back to Demo Mode.`);
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setStep(1);
    setProposal(null);
    setProposalInputs(null);
    setError("");
    scrollTop();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-100/80 sticky top-0 z-50 shadow-sm shadow-slate-100/50">
        <div className={`mx-auto px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-500 ${maxWidthClass}`}>
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="NegotiAte Logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg" />
            <div className="flex items-center gap-2.5">
              <span className="text-slate-900 font-extrabold text-lg sm:text-xl tracking-tight leading-none">NegotiAte</span>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide hidden md:inline border-l border-slate-200 pl-2.5 py-0.5 leading-none">
                Turn your commute into leverage
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className={`mx-auto px-4 sm:px-6 py-5 md:py-8 transition-all duration-500 flex-1 w-full ${maxWidthClass}`} ref={topRef}>
        {/* Error / Notice banner */}
        {error && (
          <div
            className={`mb-5 border rounded-2xl px-4 py-3 text-sm flex gap-3 items-start animate-slide-down ${
              error.includes("Notice:")
                ? "bg-blue-50/80 border-blue-200 text-blue-800"
                : error.includes("failed") || error.includes("error")
                ? "bg-amber-50/80 border-amber-200 text-amber-800"
                : "bg-red-50/80 border-red-200 text-red-800"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-xs leading-none">{error.includes("Notice:") ? "Running in Demo Mode" : "Notice"}</p>
              <p className="text-xs mt-1 opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Step indicator */}
        <div className="flex justify-center mb-6 md:mb-8">
          <StepIndicator current={step} />
        </div>

        {/* Step content */}
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
          )}
          {step === 4 && proposal && savings && (
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
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white/60 backdrop-blur-sm mt-auto">
        <div className={`mx-auto px-4 sm:px-6 py-5 ${maxWidthClass}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="NegotiAte" className="w-5 h-5 object-contain rounded opacity-60" />
              <span className="text-xs text-slate-400 font-medium">NegotiAte · Turn your commute into leverage</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <LeafIcon className="w-3 h-3 text-emerald-400" />
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
