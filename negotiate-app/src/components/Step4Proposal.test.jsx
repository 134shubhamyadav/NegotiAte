import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Step4Proposal from './Step4Proposal';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(true)
  }
});

describe('Step4Proposal component tests', () => {
  const mockProposal = {
    subject: 'Optimized Hybrid Work Schedule Proposal',
    emailBody: 'Dear Manager, this is the body of the proposal.',
    talkingPoints: ['Lead with the carbon savings', 'Productivity blocks'],
    objections: ['Availability is guaranteed', '60-day trial review']
  };

  const mockSavings = {
    savedAnnualKg: 450,
    savedHoursPerYear: 120,
    pctReduction: 40,
    treesEquiv: 21,
    savedFuelCost: 20000,
    kmEquiv: 2300
  };

  const mockCommute = {
    wfhDaysRequested: '2'
  };

  const mockProfile = {
    name: 'John Doe',
    role: 'Software Engineer',
    company: 'Acme Corp'
  };

  beforeEach(() => {
    // Mock canvas implementation to avoid jsdom failures on node canvas
    window.HTMLCanvasElement.prototype.getContext = () => ({
      fillStyle: '',
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillText: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      strokeRect: vi.fn()
    });
    window.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,';
  });

  it('renders email draft, subject, and copy controls', () => {
    render(
      <Step4Proposal
        proposal={mockProposal}
        savings={mockSavings}
        commuteForm={mockCommute}
        profileForm={mockProfile}
        onBack={vi.fn()}
        onRestart={vi.fn()}
      />
    );

    expect(screen.getByText('Optimized Hybrid Work Schedule Proposal')).toBeInTheDocument();
    expect(screen.getByText('Dear Manager, this is the body of the proposal.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy full email/i })).toBeInTheDocument();
  });

  it('allows tab switching for key proposal resources', () => {
    render(
      <Step4Proposal
        proposal={mockProposal}
        savings={mockSavings}
        commuteForm={mockCommute}
        profileForm={mockProfile}
        onBack={vi.fn()}
        onRestart={vi.fn()}
      />
    );

    // Initial tab: talking points
    expect(screen.getByText('Key Talking Points (use in person)')).toBeInTheDocument();
    expect(screen.getByText('Lead with the carbon savings')).toBeInTheDocument();

    // Click objections tab
    const objTab = screen.getByRole('tab', { name: /objections/i });
    fireEvent.click(objTab);
    expect(screen.getByText('Objection Handling')).toBeInTheDocument();
    expect(screen.getByText('Availability is guaranteed')).toBeInTheDocument();

    // Click timeline tab
    const timelineTab = screen.getByRole('tab', { name: /trial timeline/i });
    fireEvent.click(timelineTab);
    expect(screen.getByText('Structured WFH Trial Timeline')).toBeInTheDocument();
    expect(screen.getByText('Day 1: Set Core Hours')).toBeInTheDocument();
  });

  it('triggers copy function when Copy is clicked', async () => {
    render(
      <Step4Proposal
        proposal={mockProposal}
        savings={mockSavings}
        commuteForm={mockCommute}
        profileForm={mockProfile}
        onBack={vi.fn()}
        onRestart={vi.fn()}
      />
    );

    const copyBtn = screen.getByRole('button', { name: /copy full email/i });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'Subject: Optimized Hybrid Work Schedule Proposal\n\nDear Manager, this is the body of the proposal.'
    );
  });
});
