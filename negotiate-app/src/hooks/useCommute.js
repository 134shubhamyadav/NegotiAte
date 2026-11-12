/**
 * @fileoverview Custom React hook that encapsulates all commute form state,
 * savings calculations, and proposal-dirty detection for NegotiAte.
 */

import { useState, useMemo } from "react";
import { calcSavings } from "../utils/calculations.js";

/**
 * @typedef {Object} CommuteForm
 * @property {string} distanceKm
 * @property {string} mode
 * @property {string} officeDaysPerWeek
 * @property {string} wfhDaysRequested
 * @property {string} customFuelPrice
 * @property {string} customMileage
 * @property {string} customEvCost
 * @property {string} customTransitFare
 */

/** @returns {CommuteForm} */
const defaultCommuteForm = () => ({
  distanceKm: "",
  mode: "car_petrol",
  officeDaysPerWeek: "5",
  wfhDaysRequested: "2",
  customFuelPrice: "",
  customMileage: "",
  customEvCost: "",
  customTransitFare: "",
});

/**
 * Hook that manages commute form state and derives savings metrics via memoization.
 *
 * @param {object|null} proposalInputs - Snapshot of form values used when proposal was generated.
 * @param {string} proposalTone - Tone selected at the time of proposal generation.
 * @returns {{
 *   commuteForm: CommuteForm,
 *   setCommuteForm: Function,
 *   savings: import('../utils/calculations').SavingsResult|null,
 *   isProposalDirty: boolean,
 *   resetCommuteForm: Function,
 * }}
 */
export function useCommute(proposalInputs, proposalTone) {
  const [commuteForm, setCommuteForm] = useState(defaultCommuteForm);

  const hasCommuteData = commuteForm.distanceKm && Number(commuteForm.distanceKm) > 0;

  /** @type {import('../utils/calculations').SavingsResult|null} */
  const savings = useMemo(() => {
    if (!hasCommuteData) return null;
    return calcSavings({
      distanceKm: Number(commuteForm.distanceKm),
      mode: commuteForm.mode,
      officeDaysPerWeek: Number(commuteForm.officeDaysPerWeek),
      wfhDaysRequested: Number(commuteForm.wfhDaysRequested),
      customFuelPrice: commuteForm.customFuelPrice,
      customMileage: commuteForm.customMileage,
      customEvCost: commuteForm.customEvCost,
      customTransitFare: commuteForm.customTransitFare,
    });
  }, [
    hasCommuteData,
    commuteForm.distanceKm,
    commuteForm.mode,
    commuteForm.officeDaysPerWeek,
    commuteForm.wfhDaysRequested,
    commuteForm.customFuelPrice,
    commuteForm.customMileage,
    commuteForm.customEvCost,
    commuteForm.customTransitFare,
  ]);

  /** Whether the current form values differ from when the proposal was last generated. */
  const isProposalDirty = useMemo(() => {
    if (!proposalInputs) return false;
    return (
      Number(proposalInputs.distanceKm) !== Number(commuteForm.distanceKm) ||
      proposalInputs.mode !== commuteForm.mode ||
      Number(proposalInputs.officeDaysPerWeek) !== Number(commuteForm.officeDaysPerWeek) ||
      Number(proposalInputs.wfhDaysRequested) !== Number(commuteForm.wfhDaysRequested) ||
      proposalInputs.customFuelPrice !== commuteForm.customFuelPrice ||
      proposalInputs.customMileage !== commuteForm.customMileage ||
      proposalInputs.customEvCost !== commuteForm.customEvCost ||
      proposalInputs.customTransitFare !== commuteForm.customTransitFare ||
      proposalInputs.tone !== proposalTone
    );
  }, [proposalInputs, commuteForm, proposalTone]);

  /** Resets commute form to default empty values. */
  function resetCommuteForm() {
    setCommuteForm(defaultCommuteForm());
  }

  return { commuteForm, setCommuteForm, savings, isProposalDirty, resetCommuteForm };
}
