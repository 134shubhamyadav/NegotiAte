# Contributing to NegotiAte

Thank you for your interest in contributing! NegotiAte is an open-source tool that helps employees negotiate hybrid work arrangements using commute carbon data and AI-generated proposals.

## Getting Started

### Prerequisites
- Node.js ≥ 18
- A [Groq API key](https://console.groq.com/) (free tier available)

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/134shubhamyadav/NegotiAte.git
cd NegotiAte

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env
# Edit .env and add your VITE_GROQ_API_KEY

# 4. Start development server
npm run dev
```

## Project Structure

```
src/
├── components/          # React UI components
│   ├── ErrorBoundary.jsx   # Top-level error handling
│   ├── Icons.jsx           # SVG icon components
│   ├── Step1Commute.jsx    # Step 1: Commute input form
│   ├── Step2Profile.jsx    # Step 2: Profile & tone selection
│   ├── Step3Dashboard.jsx  # Step 3: Impact dashboard with charts
│   ├── Step4Proposal.jsx   # Step 4: AI proposal viewer
│   └── UI.jsx              # Reusable primitive components
├── hooks/               # Custom React hooks
│   ├── useCommute.js       # Commute form state + memoized savings
│   └── useProposal.js      # AI proposal generation & state management
└── utils/               # Pure utility functions
    ├── calculations.js     # Carbon, cost, and time calculations
    ├── constants.js        # Emission factors, transport modes, etc.
    └── groq.js             # Groq API integration & prompt builder
```

## Coding Standards

- **React**: Functional components with hooks. Use `React.memo` for pure presentational components.
- **PropTypes**: All component props must be validated with `prop-types`.
- **JSDoc**: All exported functions and types must have JSDoc comments.
- **Custom Hooks**: Business logic must live in `src/hooks/`, not inside components.
- **Constants**: All static data must live in `src/utils/constants.js`.

## Running Tests

```bash
npm run test        # Run all tests once
npm run test:watch  # Watch mode (add "vitest" to scripts if needed)
```

Tests use **Vitest** and **React Testing Library**. New features must include unit tests.

## Linting

```bash
npm run lint
```

Zero lint warnings are required before submitting a PR.

## Submitting a Pull Request

1. Fork the repository and create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes following the coding standards above.
3. Ensure all tests pass and there are no lint errors.
4. Open a PR with a clear description of the change and the problem it solves.

## Reporting Issues

Please open a GitHub Issue with:
- A clear title and description
- Steps to reproduce (if it's a bug)
- Expected vs actual behaviour

## License

NegotiAte is open source under the MIT License. By contributing, you agree to license your changes under the same terms.
