import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NegotiAte from './App';

// Mock Recharts to avoid ResizeObserver/layout errors
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

describe('App root integration flow tests', () => {
  it('renders Step1Commute by default', () => {
    render(<NegotiAte />);
    expect(screen.getByText('Your commute info')).toBeInTheDocument();
    expect(screen.getByLabelText(/one-way distance to office/i)).toBeInTheDocument();
  });

  it('navigates from Step 1 to Step 2 when distance is populated and next is clicked', async () => {
    render(<NegotiAte />);

    const distanceInput = screen.getByLabelText(/one-way distance to office/i);
    fireEvent.change(distanceInput, { target: { value: '25' } });

    const nextBtn = screen.getByRole('button', { name: /next, personalize/i });
    expect(nextBtn).not.toBeDisabled();

    fireEvent.click(nextBtn);

    // Should now display Step 2 elements
    expect(screen.getByText('Personalize your')).toBeInTheDocument();
    expect(screen.getByLabelText(/your full name/i)).toBeInTheDocument();
  });
});
