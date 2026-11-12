import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Col3Playbook from "./Col3Playbook.jsx";

describe("Col3Playbook Component", () => {
  const mockOffer = {
    company: "Swiggy",
    role: "Software Engineer",
    city: "Bengaluru",
    companyTier: "product",
    employmentType: "fulltime",
    fixedCtc: "1200000",
    variable: "100000",
    joiningBonus: "50000",
  };

  it("renders anchor, target, and floor calculation numbers", () => {
    render(<Col3Playbook offer={mockOffer} />);

    expect(screen.getByText(/Anchor \(Ask\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Target \(Settle\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Floor \(Walk\)/i)).toBeInTheDocument();
  });

  it("toggles the 'How this strategy was calculated' reasoning steps", () => {
    render(<Col3Playbook offer={mockOffer} />);

    const expanderBtn = screen.getByRole("button", { name: /how this strategy was calculated/i });
    fireEvent.click(expanderBtn);

    expect(screen.getByText(/Concession Sequence:/i)).toBeInTheDocument();
  });

  it("renders 3 top concrete asks", () => {
    render(<Col3Playbook offer={mockOffer} />);

    expect(screen.getByText(/Top 3 Concrete Asks/i)).toBeInTheDocument();
  });

  it("switches channel tabs between Email, WhatsApp, and Phone", () => {
    render(<Col3Playbook offer={mockOffer} />);

    const whatsappBtn = screen.getByRole("button", { name: /whatsapp/i });
    fireEvent.click(whatsappBtn);
    expect(screen.getByText(/thank you again for the/i)).toBeInTheDocument();

    const phoneBtn = screen.getByRole("button", { name: /phone/i });
    fireEvent.click(phoneBtn);
    expect(screen.getByText(/Live Talking Points:/i)).toBeInTheDocument();
    expect(screen.getByText(/Handling Common Pushbacks:/i)).toBeInTheDocument();
  });
});