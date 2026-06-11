import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Step2 from './Step2Profile';

describe('Step2Profile component tests', () => {
  const defaultForm = {
    name: '',
    role: '',
    company: '',
    managerName: '',
    industry: 'Technology / IT',
    extraContext: '',
    tone: 'corporate'
  };

  const mockSavings = {
    savedAnnualKg: 500
  };

  it('renders standard layout fields correctly', () => {
    render(
      <Step2
        form={defaultForm}
        setForm={vi.fn()}
        savings={mockSavings}
        onBack={vi.fn()}
        onNext={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/your full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/job title \/ role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/industry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/extra context/i)).toBeInTheDocument();
    expect(screen.getByText('500 kg')).toBeInTheDocument();
  });

  it('changes tone selection when clicked', () => {
    const setFormSpy = vi.fn();
    render(
      <Step2
        form={defaultForm}
        setForm={setFormSpy}
        savings={mockSavings}
        onBack={vi.fn()}
        onNext={vi.fn()}
      />
    );

    const collabRadio = screen.getByRole('radio', { name: /collaborative/i });
    fireEvent.click(collabRadio);

    expect(setFormSpy).toHaveBeenCalled();
  });

  it('enables form generation buttons only when required inputs are filled', () => {
    const nextSpy = vi.fn();
    const { rerender } = render(
      <Step2
        form={defaultForm}
        setForm={vi.fn()}
        savings={mockSavings}
        onBack={vi.fn()}
        onNext={nextSpy}
      />
    );

    const generateBtn = screen.getByRole('button', { name: /generate proposal/i });
    expect(generateBtn).toBeDisabled();

    // Rerender with valid filled profile form
    const filledForm = {
      ...defaultForm,
      name: 'Priya',
      role: 'Senior Engineer',
      company: 'Acme Inc'
    };
    rerender(
      <Step2
        form={filledForm}
        setForm={vi.fn()}
        savings={mockSavings}
        onBack={vi.fn()}
        onNext={nextSpy}
      />
    );

    expect(generateBtn).not.toBeDisabled();
    fireEvent.click(generateBtn);
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });
});
