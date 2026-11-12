import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Step1 from './Step1Commute';

describe('Step1Commute component tests', () => {
  const defaultForm = {
    distanceKm: '',
    mode: 'car_petrol',
    officeDaysPerWeek: '5',
    wfhDaysRequested: '2',
    customFuelPrice: '',
    customMileage: '',
    customEvCost: '',
    customTransitFare: ''
  };

  it('renders initial form inputs correctly', () => {
    const setFormSpy = vi.fn();
    const nextSpy = vi.fn();
    render(<Step1 form={defaultForm} setForm={setFormSpy} onNext={nextSpy} />);

    expect(screen.getByLabelText(/one-way distance to office/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/primary transport mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/office days \/ week/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/wfh days you want/i)).toBeInTheDocument();
  });

  it('renders live preview stats when distance is entered', () => {
    const formWithDistance = {
      ...defaultForm,
      distanceKm: '20'
    };
    render(<Step1 form={formWithDistance} setForm={vi.fn()} onNext={vi.fn()} />);

    expect(screen.getByText('Live estimate')).toBeInTheDocument();
    expect(screen.getByText(/kg CO₂e saved per year/i)).toBeInTheDocument();
  });

  it('toggles advanced settings expansion when clicked', () => {
    render(<Step1 form={defaultForm} setForm={vi.fn()} onNext={vi.fn()} />);
    
    // Expand accordion
    const toggleButton = screen.getByRole('button', { name: /advanced commute settings/i });
    fireEvent.click(toggleButton);

    expect(screen.getByLabelText(/fuel price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vehicle mileage/i)).toBeInTheDocument();

    // Collapse accordion
    fireEvent.click(toggleButton);
    expect(screen.queryByLabelText(/fuel price/i)).not.toBeInTheDocument();
  });

  it('disables next button unless a valid distance is entered', () => {
    const nextSpy = vi.fn();
    const { rerender } = render(<Step1 form={defaultForm} setForm={vi.fn()} onNext={nextSpy} />);
    const nextBtn = screen.getByRole('button', { name: /next, personalize/i });
    expect(nextBtn).toBeDisabled();

    // Rerender with valid distance
    rerender(<Step1 form={{ ...defaultForm, distanceKm: '10' }} setForm={vi.fn()} onNext={nextSpy} />);
    expect(nextBtn).not.toBeDisabled();
    
    fireEvent.click(nextBtn);
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });
});
