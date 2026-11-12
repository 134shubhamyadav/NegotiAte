import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NegotiAte from './App';
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App.jsx";

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
describe("App Root Component: Single-Wedge Fresher Copilot", () => {
  it("renders the 3-column layout on desktop", () => {
    render(<App />);

    describe('App root integration flow tests', () => {
      it('renders Universal Workspace as the primary entry point by default', () => {
        render(<NegotiAte />);
        expect(screen.getByText(/what would you like to accomplish today\?/i)).toBeInTheDocument();
        expect(screen.getByText(/negotiate a deal or terms/i)).toBeInTheDocument();
        expect(screen.getByText(/compare multiple offers/i)).toBeInTheDocument();
        expect(screen.getByText(/1\. Offer Parameters/i)).toBeInTheDocument();
        expect(screen.getByText(/2\. Reality Check/i)).toBeInTheDocument();
        expect(screen.getByText(/3\. The Playbook/i)).toBeInTheDocument();
        expect(screen.getByText(/Actual Monthly Bank Deposit/i)).toBeInTheDocument();
      });

      it('renders legacy Step1Commute when initialMode is workplace or tab is switched', () => {
        render(<NegotiAte initialMode="workplace" />);
        expect(screen.getByText('Your commute info')).toBeInTheDocument();
        expect(screen.getByLabelText(/one-way distance to office/i)).toBeInTheDocument();
        it("displays real monthly in-hand cash for the default 12 LPA offer", () => {
          render(<App />);

          // Default is Razorpay 12 LPA
          // Annual in-hand for 12 LPA is ~₹9.9L, monthly is ~₹82,900
          expect(screen.getByText(/Razorpay/i)).toBeInTheDocument();
          expect(screen.getByText(/Net In-Hand/i)).toBeInTheDocument();
          expect(screen.getByText(/Annual In-Hand:/i)).toBeInTheDocument();
        });

        it('navigates from Step 1 to Step 2 in workplace flow when distance is entered', async () => {
          render(<NegotiAte initialMode="workplace" />);
          it("opens Offer Comparison modal when clicking 'Compare Offers'", () => {
            render(<App />);

            const distanceInput = screen.getByLabelText(/one-way distance to office/i);
            fireEvent.change(distanceInput, { target: { value: '25' } });
            const compareBtn = screen.getByRole("button", { name: /compare offers/i });
            fireEvent.click(compareBtn);

            const nextBtn = screen.getByRole('button', { name: /next, personalize/i });
            expect(nextBtn).not.toBeDisabled();
            expect(
              screen.getByText(/Multi-Attribute Offer Comparison & Sensitivity/i)
            ).toBeInTheDocument();
            expect(screen.getAllByText(/Offer B \(Challenger\)/i).length).toBeGreaterThan(0);
          });

          fireEvent.click(nextBtn);
          it("switches tabs in The Playbook and copies script to clipboard", async () => {
            // Mock navigator.clipboard
            const writeTextMock = vi.fn().mockResolvedValue(undefined);
            Object.assign(navigator, {
              clipboard: {
                writeText: writeTextMock,
              },
            });

            // Should now display Step 2 elements
            expect(screen.getByText('Personalize your')).toBeInTheDocument();
            expect(screen.getByLabelText(/your full name/i)).toBeInTheDocument();
            render(<App />);

            // Switch to WhatsApp tab
            const whatsappTab = screen.getByRole("button", { name: /whatsapp/i });
            fireEvent.click(whatsappTab);

            // Click Copy button
            const copyBtn = screen.getByRole("button", { name: /copy/i });
            fireEvent.click(copyBtn);

            expect(writeTextMock).toHaveBeenCalled();
            await waitFor(() => {
              expect(screen.getByText(/Copied!/i)).toBeInTheDocument();
            });
          });

          it("allows switching to intern mode and updates stipend calculation", () => {
            render(<App />);

            const typeSelect = screen.getByDisplayValue(/Full-time Fresh/i);
            fireEvent.change(typeSelect, { target: { value: "intern" } });

            expect(screen.getByText(/Monthly Stipend \(₹\/month\)/i)).toBeInTheDocument();
          });
        });
