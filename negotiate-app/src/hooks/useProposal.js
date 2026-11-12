/**
 * @fileoverview Custom React hook that encapsulates all AI proposal generation
 * logic including Groq API calls, mock fallback, error handling, and state management.
 */

import { useState, useCallback } from "react";
import { callGroq, buildPrompt, parseProposal, getMockProposal } from "../utils/groq.js";

/**
 * @typedef {Object} ProfileForm
 * @property {string} name
 * @property {string} role
 * @property {string} industry
 * @property {string} company
 * @property {string} managerName
 * @property {string} extraContext
 * @property {string} tone
 */

/**
 * @typedef {Object} UseProposalReturn
 * @property {object|null} proposal - The parsed proposal object.
 * @property {object|null} proposalInputs - Snapshot of inputs used to generate the proposal.
 * @property {boolean} loading - Whether a proposal generation is in flight.
 * @property {string} error - Current error or notice message.
 * @property {Function} setError - Setter for the error message.
 * @property {Function} generateProposal - Trigger proposal generation.
 * @property {Function} resetProposal - Clear proposal and error state.
 */

const isMock = (apiKey) =>
  !apiKey?.trim() ||
  apiKey.toLowerCase() === "demo" ||
  apiKey.toLowerCase() === "placeholder";

/**
 * Builds the proposalInputs snapshot from the current form state.
 * @param {object} commuteForm
 * @param {string} tone
 * @returns {object}
 */
function snapshotInputs(commuteForm, tone) {
  return {
    distanceKm: commuteForm.distanceKm,
    mode: commuteForm.mode,
    officeDaysPerWeek: commuteForm.officeDaysPerWeek,
    wfhDaysRequested: commuteForm.wfhDaysRequested,
    customFuelPrice: commuteForm.customFuelPrice,
    customMileage: commuteForm.customMileage,
    customEvCost: commuteForm.customEvCost,
    customTransitFare: commuteForm.customTransitFare,
    tone,
  };
}

/**
 * Custom hook for managing WFH proposal AI generation, state, and error handling.
 *
 * @param {string} apiKey - The Groq API key from environment.
 * @returns {UseProposalReturn}
 */
export function useProposal(apiKey) {
  const [proposal, setProposal] = useState(null);
  const [proposalInputs, setProposalInputs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Generates a WFH proposal — using Groq API if key is available,
   * falling back to mock mode otherwise. Can be used for both initial
   * generation and re-generation after form changes.
   *
   * @param {ProfileForm} profileForm
   * @param {object} commuteForm
   * @param {import('../utils/calculations').SavingsResult} savings
   * @returns {Promise<boolean>} True if generation succeeded.
   */
  const generateProposal = useCallback(
    async (profileForm, commuteForm, savings) => {
      setError("");
      setLoading(true);

      const mockMode = isMock(apiKey);
      const commonArgs = {
        ...profileForm,
        distanceKm: Number(commuteForm.distanceKm),
        mode: commuteForm.mode,
        officeDaysPerWeek: Number(commuteForm.officeDaysPerWeek),
        wfhDaysRequested: Number(commuteForm.wfhDaysRequested),
        savings,
      };

      try {
        let rawText;
        if (mockMode) {
          await new Promise((r) => setTimeout(r, 800));
          rawText = getMockProposal(commonArgs);
          setError(
            "Notice: Running in Demo Mode (using simulated AI proposal). " +
              "To enable live AI, configure VITE_GROQ_API_KEY in your environment."
          );
        } else {
          try {
            const prompt = buildPrompt(commonArgs);
            rawText = await callGroq(apiKey, prompt);
          } catch (e) {
            console.warn("Groq API failed, falling back to mock mode:", e);
            rawText = getMockProposal(commonArgs);
            setError(`Groq API call failed (${e.message}). Fell back to Demo Mode.`);
          }
        }

        setProposal(parseProposal(rawText));
        setProposalInputs(snapshotInputs(commuteForm, profileForm.tone));
        return true;
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  /** Clears proposal and error state (used on app restart). */
  const resetProposal = useCallback(() => {
    setProposal(null);
    setProposalInputs(null);
    setError("");
  }, []);

  return { proposal, proposalInputs, loading, error, setError, generateProposal, resetProposal };
}
