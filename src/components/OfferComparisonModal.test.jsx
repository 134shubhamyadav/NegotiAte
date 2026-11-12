import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OfferComparisonModal from "./OfferComparisonModal.jsx";

describe("OfferComparisonModal Component", () => {
  const currentOffer = {
    company: "Company A",
    fixedCtc: "1200000",
    variable: "100000",
  };

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <OfferComparisonModal isOpen={false} onClose={vi.fn()} currentOffer={currentOffer} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders side-by-side comparison and sensitivity line when open", () => {
    render(
      <OfferComparisonModal isOpen={true} onClose={vi.fn()} currentOffer={currentOffer} />
    );

    expect(screen.getByText(/Multi-Attribute Offer Comparison & Sensitivity/i)).toBeInTheDocument();
    expect(screen.getByText(/Offer A \(Current\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Offer B \(Challenger\)/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Decision Sensitivity:/i)).toBeInTheDocument();
  });

  it("updates weights when range slider is moved", () => {
    render(
      <OfferComparisonModal isOpen={true} onClose={vi.fn()} currentOffer={currentOffer} />
    );

    const growthSlider = screen.getAllByRole("slider")[1];
    fireEvent.change(growthSlider, { target: { value: "50" } });

    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });
});