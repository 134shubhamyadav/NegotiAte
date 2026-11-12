import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Btn, StatCard, ProgressBar, StepIndicator } from './UI';

describe('UI component tests', () => {
  describe('Btn component', () => {
    it('renders text content correctly', () => {
      render(<Btn>Click Me</Btn>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('triggers onClick handler when clicked', () => {
      const clickSpy = vi.fn();
      render(<Btn onClick={clickSpy}>Click Me</Btn>);
      fireEvent.click(screen.getByRole('button'));
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('renders disabled state and prevents click execution', () => {
      const clickSpy = vi.fn();
      render(<Btn onClick={clickSpy} disabled>Click Me</Btn>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('displays spin loader when loading is active', () => {
      render(<Btn loading>Submit</Btn>);
      expect(screen.getByRole('button').querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  describe('StatCard component', () => {
    it('renders labels, values, and sub-labels correctly', () => {
      render(
        <StatCard
          label="CO2 Saved"
          value="450 kg"
          sub="30% decrease"
          icon={<span data-testid="icon">🌱</span>}
        />
      );

      expect(screen.getByText('CO2 Saved')).toBeInTheDocument();
      expect(screen.getByText('450 kg')).toBeInTheDocument();
      expect(screen.getByText('30% decrease')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('applies accent gradient styles when accent is enabled', () => {
      const { container } = render(
        <StatCard label="Accent Stat" value="100" accent />
      );
      expect(container.firstChild).toHaveClass('from-emerald-500');
    });
  });

  describe('ProgressBar component', () => {
    it('applies percentage width to progress inner bar container', () => {
      const { container } = render(<ProgressBar pct={75} />);
      const innerBar = container.querySelector('.transition-all');
      expect(innerBar).toBeInTheDocument();
      expect(innerBar).toHaveStyle('width: 75%');
    });

    it('limits width to 100% when percentage exceeds threshold', () => {
      const { container } = render(<ProgressBar pct={150} />);
      const innerBar = container.querySelector('.transition-all');
      expect(innerBar).toHaveStyle('width: 100%');
    });
  });

  describe('StepIndicator component', () => {
    it('renders all step names and active states', () => {
      render(<StepIndicator current={2} />);
      expect(screen.getByText('Commute')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Impact')).toBeInTheDocument();
      expect(screen.getByText('Proposal')).toBeInTheDocument();
      
      // Step 1 should show checkmark because current is step 2
      expect(screen.getByText('✓')).toBeInTheDocument();
    });
  });
});
