import { describe, it, expect, vi, beforeEach } from 'vitest';
import { callGroq, buildPrompt, parseProposal, getMockProposal } from './groq';

describe('groq.js utility tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('callGroq', () => {
    it('sends post request to groq completions endpoint and returns text', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Mocked Groq Response content'
            }
          }
        ]
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });
      globalThis.fetch = mockFetch;

      const result = await callGroq('test-api-key', 'Test Prompt');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.groq.com/openai/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-api-key'
          },
          body: expect.stringContaining('Test Prompt')
        })
      );
      expect(result).toBe('Mocked Groq Response content');
    });

    it('throws error when groq completions endpoint fails', async () => {
      const mockErrorResponse = {
        error: {
          message: 'Rate limit reached'
        }
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => mockErrorResponse
      });
      globalThis.fetch = mockFetch;

      await expect(callGroq('test-api-key', 'Test Prompt')).rejects.toThrow(
        'Rate limit reached'
      );
    });
  });

  describe('buildPrompt', () => {
    it('builds prompt containing user details and stats', () => {
      const prompt = buildPrompt({
        name: 'John Doe',
        role: 'Developer',
        industry: 'Tech',
        company: 'ACME',
        managerName: 'Jane Manager',
        extraContext: 'Work from home is common',
        distanceKm: 15,
        mode: 'car_petrol',
        officeDaysPerWeek: 5,
        wfhDaysRequested: 2,
        savings: {
          currentAnnualKg: 1000,
          savedAnnualKg: 400,
          futureAnnualKg: 600,
          savedFuelCost: 20000,
          savedHoursPerYear: 150,
          treesEquiv: 19,
          pctReduction: 40,
          flightsEquiv: '1.5',
          kmEquiv: 2083
        },
        tone: 'analytical'
      });

      expect(prompt).toContain('John Doe');
      expect(prompt).toContain('Developer');
      expect(prompt).toContain('Jane Manager');
      expect(prompt).toContain('40%');
      expect(prompt).toContain('analytical tone');
    });
  });

  describe('parseProposal', () => {
    it('parses subject, email body, talking points and objections correctly', () => {
      const rawText = `Subject: Proposal for Hybrid Schedule
Dear Manager,

This is paragraph 1.
This is paragraph 2.

Sincerely,
John

TALKING_POINTS:
- Point 1: Carbon offset
- Point 2: Productivity

OBJECTIONS:
- Objection 1: How will we sync?
- Objection 2: Team presence?`;

      const parsed = parseProposal(rawText);

      expect(parsed.subject).toBe('Proposal for Hybrid Schedule');
      expect(parsed.emailBody).toContain('This is paragraph 1.');
      expect(parsed.emailBody).not.toContain('TALKING_POINTS:');
      expect(parsed.talkingPoints).toEqual([
        'Point 1: Carbon offset',
        'Point 2: Productivity'
      ]);
      expect(parsed.objections).toEqual([
        'Objection 1: How will we sync?',
        'Objection 2: Team presence?'
      ]);
    });
  });

  describe('getMockProposal', () => {
    it('returns a standard template with populated employee details', () => {
      const result = getMockProposal({
        name: 'Alice',
        role: 'Designer',
        company: 'Globex',
        managerName: 'Bob',
        wfhDaysRequested: '3',
        savings: {
          savedAnnualKg: 300,
          savedHoursPerYear: 100,
          pctReduction: 60,
          treesEquiv: 14
        }
      });

      expect(result).toContain('Alice');
      expect(result).toContain('Designer');
      expect(result).toContain('Globex');
      expect(result).toContain('Bob');
      expect(result).toContain('3 work-from-home day(s)');
      expect(result).toContain('300 kg');
    });
  });
});
