# Drinks

Track your alcohol consumption and estimate your Blood Alcohol Content (BAC).

## What It Does

Drinks is a privacy-focused web app that helps you understand your drinking habits. Log what you drink and get real-time BAC estimates based on the Widmark formula, personalised to your weight and sex.

### Features

- **Quick drink logging** with preset buttons (beer, wine, shots) or fully custom entries
- **Real-time BAC estimation** that updates every second, showing current level, time to zero, and time to a personal target
- **Impairment indicators** describing your estimated state in plain language
- **Rolling statistics** including average daily and weekly units, excessive weeks/days, and a 7-day summary
- **Cross-device sync** via Jazz peer-to-peer data synchronisation (optional sign-up with passkeys)
- **Works without an account** for immediate, anonymous use
- **Helpful links** to taxi services and alcohol support resources

### Disclaimer

This app provides rough BAC estimates for personal curiosity only. It must not be used to judge fitness to drive, operate machinery, or make any safety-critical decisions. BAC depends on many factors the app cannot account for. Always drink responsibly.

## Tech Stack

- React 19, TypeScript, React Router v7 (SSR)
- Jazz for local-first, peer-to-peer data storage
- Tailwind CSS v4 with shadcn/ui components
- Vite 7, deployed to Vercel

## Getting Started

### Prerequisites

- Node.js 20 or later
- Bun (the project uses `bun.lock`)

### Install

```bash
bun install
```

### Development

```bash
bun run dev
```

The app will be available at the URL printed in the terminal (typically `http://localhost:5173`).

### Build and Serve

```bash
bun run build
bun run start
```

### Lint and Format

```bash
bun run lint        # Check with oxlint
bun run lint:fix    # Auto-fix with oxlint
bun run fmt         # Format with oxfmt
bun run fmt:check   # Check formatting with oxfmt
```

## Project Structure

```
app/
  root.tsx                  # App shell with JazzReactProvider
  routes.ts                 # Route definitions (single index route)
  routes/home.tsx           # Main page composing all feature components
  app.css                   # Tailwind imports and theme variables
  components/
    header.tsx              # Logo and title
    acceptTerms.tsx         # Disclaimer acceptance gate
    currentState.tsx        # Current BAC, time to zero, time to target
    addDrink.tsx            # Preset drink buttons with projected BAC
    addCustomDrink.tsx      # Custom drink entry drawer
    drinkList.tsx           # Paginated drink history table
    DrinkItem.tsx           # Individual drink row with detail/delete dialogs
    averageStats.tsx        # Average units and excessive period counts
    lastSevenDays.tsx       # Rolling 7-day consumption summary
    settings.tsx            # User settings drawer
    authModal.tsx           # Passkey sign-up and log-in
    disclaimer.tsx          # Footer disclaimer
    helpfulLinks.tsx        # Taxi and support links
    ui/                     # shadcn/ui primitives
  lib/
    schema.ts               # Jazz data model (Drink, DrinksRoot, DrinksAccount)
    utils.ts                # Shared constants and cn() helper
    utils/
      getBacAddition.ts     # Widmark formula BAC calculation
      getCurrentBac.ts      # Aggregate BAC from drink history with linear decay
      getStateInWords.ts    # BAC to impairment label mapping
      onAnonymousAccountDiscarded.ts  # Migrate anonymous data on sign-up
```
