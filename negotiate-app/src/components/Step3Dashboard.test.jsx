import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Step3Dashboard from './Step3Dashboard';

// Mock Recharts to avoid ResizeObserver and layout calculation errors in JSDOM
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div />,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div />,
  Cell: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  CartesianGrid: () => <div />
}));

describe('Step3Dashboard component tests', () => {
  const mockSavings = {
    currentAnnualKg: 1000,
    savedAnnualKg: 400,
    futureAnnualKg: 600,
    savedFuelCost: 24000,
    savedHoursPerYear: 120,
    treesEquiv: 19,
    flightsEquiv: '1.6',
    kmEquiv: 2083,
    pctReduction: 40
  };

  const mockForm = {
    distanceKm: '25',
    mode: 'car_petrol',
    officeDaysPerWeek: '5',
    wfhDaysRequested: '2'
  };

  it('renders all metrics cards', () => {
    render(
      <Step3Dashboard
        savings={mockSavings}
        commuteForm={mockForm}
        setCommuteForm={vi.fn()}
        onViewProposal={vi.fn()}
        onBack={vi.fn()}
        onRegenerate={vi.fn()}
        isProposalDirty={false}
        loading={false}
      />
    );

    expect(screen.getByText('400 kg')).toBeInTheDocument();
    expect(screen.getByText('₹24.0k')).toBeInTheDocument();
    expect(screen.getByText('120h')).toBeInTheDocument();
    expect(screen.getAllByText('19')[0]).toBeInTheDocument();
  });

  it('renders control panel options and sliders', () => {
    render(
      <Step3Dashboard
        savings={mockSavings}
        commuteForm={mockForm}
        setCommuteForm={vi.fn()}
        onViewProposal={vi.fn()}
        onBack={vi.fn()}
        onRegenerate={vi.fn()}
        isProposalDirty={false}
        loading={false}
      />
    );

    expect(screen.getByLabelText(/wfh days requested/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/commute distance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/transport mode/i)).toBeInTheDocument();
  });

  it('renders mocked Recharts charts correctly', () => {
    render(
      <Step3Dashboard
        savings={mockSavings}
        commuteForm={mockForm}
        setCommuteForm={vi.fn()}
        onViewProposal={vi.fn()}
        onBack={vi.fn()}
        onRegenerate={vi.fn()}
        isProposalDirty={false}
        loading={false}
      />
    );

    expect(screen.getAllByTestId('responsive-container')).toHaveLength(2);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
