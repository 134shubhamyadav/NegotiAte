# NegotiAte 🌱

**AI-powered sustainability platform that helps employees quantify commute emissions, generate data-backed hybrid work proposals, and reduce carbon footprints through measurable workplace behavior change.**

[![Vite](https://img.shields.io/badge/Vite-v8.0-646CFF?logo=vite)](https://vite.dev)
[![React](https://img.shields.io/badge/React-v19.0-61DAFB?logo=react)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4?logo=tailwind-css)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-v3.8-22C55E?logo=recharts)](https://recharts.org)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel)](https://vercel.com)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-Llama%203.3-orange?logo=groq)](https://console.groq.com)

---

## 🏆 Chosen Vertical
**Workplace Sustainability & AI-Driven Corporate ESG Enablement (Future of Work × Climate Tech)**

NegotiAte bridges the gap between individual carbon reduction efforts and corporate remote-work policies. By empowering employees to translate their daily commute burden into structured corporate ESG (Scope 3 carbon offsets) metrics, it provides concrete data-backed negotiation leverage for hybrid work schedules.

---

## 🔗 Live Deployments

- **Live URL**: [https://negotiate-webapp.vercel.app](https://negotiate-webapp.vercel.app)
- **GitHub Repository**: [https://github.com/134shubhamyadav/NegotiAte](https://github.com/134shubhamyadav/NegotiAte)

---

## 📂 Project Structure

To help developers and hackathon judges navigate the codebase, here is the organized layout of the refactored workspace:

```text
negotiate/
├── public/
│   └── logo.png              # Public asset (logo served at /logo.png)
├── src/
│   ├── components/           # Modular JSX Components
│   │   ├── Icons.jsx         # Standalone SVG vector icons
│   │   ├── UI.jsx            # Shared primitives (Buttons, Inputs, Tooltips, ProgressBars)
│   │   ├── Step1Commute.jsx  # Step 1: Distance & transport inputs, live carbon estimation card
│   │   ├── Step2Profile.jsx  # Step 2: Employee personalization details and Tone selection
│   │   ├── Step3Dashboard.jsx# Step 3: Interactive simulations, Recharts graphs, & regional comparisons
│   │   └── Step4Proposal.jsx # Step 4: AI Proposal output, trial timeline, checklists, & Canvas exporter
│   ├── utils/                # Logic & Utilities
│   │   ├── calculations.js   # Carbon math variables and annual projection logic
│   │   └── groq.js           # Groq API prompts, parser, and offline simulation fallback
│   ├── App.jsx               # Root App manager coordinating states, routes, and alert banners
│   ├── index.css             # Styling rules, Outfit font imports, and keyframe animations
│   └── main.jsx              # React mounting root entrypoint
├── .env.example              # Environment variables template
├── .gitignore                # Git exclusions
├── eslint.config.js          # ESLint settings
├── index.html                # App entrypoint (points to /src/main.jsx)
├── package.json              # Script configurations & dependencies
├── README.md                 # Professional Hackathon guide
└── vite.config.js            # Vite configs
```

---

## 💡 Approach and Logic

### The Core Premise
Employee commutes are a major source of Scope 3 (indirect) greenhouse gas emissions for companies. However, this impact is rarely quantified or utilized in remote/hybrid work discussions. NegotiAte converts commute metrics (distance, transport mode, fuel consumption) into tangible carbon savings, hours reclaimed, and financial offsets. It then constructs a professional, high-impact proposal that frames hybrid work not as a personal convenience, but as a strategic operational and sustainability win for the company.

### Calculations & Logic Model

1. **Carbon Footprint Calculation**
   - **Emissions Formula**: 
     $$\text{Annual } CO_2 \text{ Saved (kg)} = \text{Distance (one-way, km)} \times 2 \times \text{Emission Factor (kg } CO_2e/\text{km)} \times \text{WFH Days Requested} \times 48 \text{ weeks/year}$$
   - **Emission Factors** (based on DEFRA / EPA standards):
     - *Car (Petrol)*: $0.192\text{ kg } CO_2e/\text{km}$
     - *Car (Diesel)*: $0.171\text{ kg } CO_2e/\text{km}$
     - *Car (Electric)*: $0.053\text{ kg } CO_2e/\text{km}$
     - *Motorcycle*: $0.114\text{ kg } CO_2e/\text{km}$
     - *Bus*: $0.089\text{ kg } CO_2e/\text{km}$
     - *Metro / Subway*: $0.041\text{ kg } CO_2e/\text{km}$
     - *Train*: $0.037\text{ kg } CO_2e/\text{km}$
     - *Auto-rickshaw*: $0.105\text{ kg } CO_2e/\text{km}$
     - *Walk / Cycle*: $0.000\text{ kg } CO_2e/\text{km}$

2. **Financial Savings**
   - **Fuel Consumption / Transit Fare Override**:
     - *Private Vehicles*: Fuel prices and mileage are dynamically configured. Default fuel costs are based on:
       - Petrol: $₹8.5/\text{km}$
       - Diesel: $₹7.2/\text{km}$
       - Electric: $₹1.8/\text{km}$
       - Motorcycle: $₹4.0/\text{km}$
     - *Public Transit / Public Auto*: Custom roundtrip transit fares are supported, dividing the total roundtrip fare by roundtrip distance to compute the cost per kilometer.
   - **Savings Formula**:
     $$\text{Annual Financial Savings} = \text{Distance (one-way)} \times 2 \times \text{Cost per km} \times \text{WFH Days Requested} \times 48 \text{ weeks/year}$$

3. **Time Reclaimed**
   - Estimates average commute speed at $25\text{ km/h}$.
   - **Savings Formula**:
     $$\text{Annual Hours Reclaimed} = \left(\frac{\text{Distance (one-way, km)}}{25\text{ km/h}}\right) \times 2 \times \text{WFH Days Requested} \times 48 \text{ weeks/year}$$

4. **Carbon Equivalencies (Relatability Metrics)**
   - **Trees Offset**: A mature tree absorbs roughly $21\text{ kg } CO_2$ per year.
     $$\text{Trees Equivalency} = \text{Annual } CO_2 \text{ Saved} \,/\, 21$$
   - **Flights Avoided**: A short-haul domestic flight emits roughly $255\text{ kg } CO_2e$ per passenger.
     $$\text{Flights Equivalency} = \text{Annual } CO_2 \text{ Saved} \,/\, 255$$

---

## 🚀 How the Solution Works

NegotiAte operates as an interactive, highly visual 4-step wizard:

### Step 1: Commute Profiler
- The user input is collected: one-way distance to office (km), transport mode, current office attendance, and desired WFH days.
- **Advanced Commute Settings**: Expands to support custom fuel prices (₹/liter), vehicle mileage (km/l), EV charging rates (₹/km), or custom daily round-trip transit fares.
- **Live Estimate**: Displays a real-time, high-contrast dark mode preview card showcasing annual CO₂e savings, percentage transit footprint cuts, and equivalency metrics.

### Step 2: Personalization & Tone Configuration
- Collects name, role, company name, industry, and optional manager details.
- **Proposal Tone Selector**: Provides three distinct AI proposal styles:
  - 💼 **Corporate** (Default): Emphasizes corporate ESG Scope 3 compliance, structured productivity trial blocks, and executive formatting.
  - 🤝 **Collaborative**: Focuses on trust, collaborative overlap alignment, sprint schedules, and team velocity.
  - 📊 **Analytical**: Lead with efficiency indicators, Empirical metrics, hours reclaimed, and objective ROI outcomes.

### Step 3: Interactive Commute Impact Dashboard
- Renders key stats in a modern 2x2 grid.
- **Live Commute Simulator**: Allows instant tuning of WFH days, distance, or transport mode, observing live recalculations on the metrics.
- **Footprint Comparison**: Displays user commute emissions compared to benchmark regional averages (Mumbai, Delhi, Bangalore, Pune, and Global).
- **Interactive Recharts**:
  - *Monthly Savings Growth*: Area chart showing cumulative CO₂ saved over the year.
  - *5-Year Projection*: Bar chart detailing long-term carbon avoidance and financial recovery.

### Step 4: AI Proposal & Sharing Suite
- **Email Draft**: Produces a fully copyable, structured, and customized hybrid proposal draft.
- **Tabbed Tools**:
  - *Talking Points*: Bulleted, high-impact highlights to guide the user in face-to-face meetings.
  - *Objections Handler*: Preempts common management concerns (availability, security, performance) with immediate, professional answers.
  - *Trial Timeline*: A graphical Day 1 / Day 30 / Day 60 checklist outlining structured milestones to assure managers of zero velocity drop.
  - *Carbon Card*: Renders a high-res, visually stunning, custom badge on `<canvas>` featuring user statistics. Users can instantly download this card as a PNG for social sharing.
- **Social Sharing**: Direct messaging widgets supporting WhatsApp, X (formerly Twitter), LinkedIn, and Email to showcase commute reductions.

---

## 🧐 Assumptions Made
1. **Working Calendar**: Assumed $48$ active working weeks per year (accounting for holidays, sick leave, and vacation).
2. **Commute Speed**: Assumed an average urban commute speed of $25\text{ km/h}$ to estimate transit time.
3. **Vehicle Carbon Rates**: Assumed single-passenger occupancy for private vehicle travel.
4. **Tree Carbon Absorption**: Mature tree absorbs $21\text{ kg } CO_2/\text{year}$ on average.
5. **Short-Haul Flight Carbon**: Passenger emission factor calculated at $255\text{ kg } CO_2$ for one-way flight metrics.

---

## 🛠️ Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Local Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/134shubhamyadav/NegotiAte.git
   cd NegotiAte
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Duplicate `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Obtain a free API key from the [Groq Console](https://console.groq.com/keys) and paste it:
     ```env
     VITE_GROQ_API_KEY=gsk_your_actual_api_key
     ```
   
   > [!NOTE]
   > If no `VITE_GROQ_API_KEY` is provided or if the key is empty, the application will run in **Demo Mode**, utilizing high-quality mock templates for proposal simulation so judges can still review all functionalities.

4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Vercel Deployment Instructions

NegotiAte is fully optimized for Vercel deployment:

1. Push your code repository to GitHub (ensuring `.env` is omitted and ignored).
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. Under **Build & Development Settings**, Vercel will automatically configure settings for Vite:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build` (outputs to `dist`)
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - Key: `VITE_GROQ_API_KEY`
   - Value: `gsk_your_actual_api_key`
5. Click **Deploy**.

> [!IMPORTANT]
> Make sure the environment variable is named exactly `VITE_GROQ_API_KEY` so that Vite can read it at build time.
