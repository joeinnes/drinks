# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Drinks is a personal alcohol consumption tracker that estimates Blood Alcohol Content (BAC) using the Widmark formula. It uses Jazz for local-first, peer-to-peer data synchronisation and React Router v7 for the UI.

## Commands

```bash
npm run dev          # Start React Router dev server with HMR
npm run build        # Production build (outputs to build/)
npm run start        # Serve the production build
npm run typecheck    # Generate React Router types then run tsc
npm run lint         # Lint with oxlint
npm run lint:fix     # Lint and auto-fix with oxlint
npm run fmt          # Format with oxfmt
npm run fmt:check    # Check formatting with oxfmt
```

The project uses bun as its package manager (bun.lock is present). Use `bun install` to install dependencies and `bun run <script>` to run scripts.

## Tech Stack

- React 19 with TypeScript (strict mode)
- React Router v7 (SSR enabled, file-based routing via `app/routes.ts`)
- Jazz (`jazz-tools`) for local-first data storage and peer-to-peer sync
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- shadcn/ui (new-york style, neutral base colour) with Radix UI primitives
- Vaul for drawer components
- dayjs for date/time manipulation
- Lucide React for icons
- Vite 7 as the build tool
- Deployed to Vercel (`@vercel/react-router` preset in `react-router.config.ts`)

## Architecture

### Data Model (Jazz)

Defined in `app/lib/schema.ts`:

- **Drink** -- a collaborative map with `name`, `volume` (ml), `percent` (decimal, e.g. 0.045), `bacAddition` (pre-computed at creation time), `date`, and `isDeleted` (soft delete).
- **ListOfDrinks** -- a collaborative list of `Drink`.
- **DrinksRoot** -- the account root holding `myDrinks`, `myWeight` (grams), `myGender`, `myTarget` (BAC threshold), `myWeeklyTarget` (units), and `hasAcceptedTerms`.
- **DrinksAccount** -- extends `co.account` with a `DrinksRoot` root and includes a migration that initialises defaults (85 kg male, 0.05 target BAC, 14 weekly units).

Authentication uses Jazz passkey auth. Anonymous users can use the app without signing up; signing up allows cross-device sync. Account migration logic is in `app/lib/utils/onAnonymousAccountDiscarded.ts`.

### BAC Calculation

- **getBacAddition** (`app/lib/utils/getBacAddition.ts`) -- Widmark formula: converts pure alcohol volume to BAC addition using gender-specific distribution ratios (male: 0.68, female: 0.55) and alcohol density (0.7893 g/ml).
- **getCurrentBac** (`app/lib/utils/getCurrentBac.ts`) -- iterates over sorted drinks, accumulating BAC and subtracting linear decay (0.016 per hour) between each drink and from the last drink to now.
- **getStateInWords** (`app/lib/utils/getStateInWords.ts`) -- maps BAC ranges to human-readable impairment labels ("Sober" through "Dangerous levels!").
- The BAC is recalculated every second via `setInterval` in the home route.

### Routing

Single-page app with one index route:

- `app/routes.ts` -- defines routes (only `routes/home.tsx`)
- `app/root.tsx` -- wraps the app in `JazzReactProvider`
- `app/routes/home.tsx` -- main page composing all feature components

### Key Components (`app/components/`)

- `header.tsx` -- logo and title
- `acceptTerms.tsx` -- disclaimer acceptance gate (shown until user agrees)
- `currentState.tsx` -- displays current BAC, time to zero, time to target
- `addDrink.tsx` -- preset drink buttons (small beer, large beer, red wine, white wine, shot) with projected BAC impact
- `addCustomDrink.tsx` -- drawer form for custom drink entry (name, volume, percent, time)
- `drinkList.tsx` -- paginated table of logged drinks (10 per page)
- `DrinkItem.tsx` -- individual drink row with detail dialog and soft-delete confirmation
- `averageStats.tsx` -- average daily/weekly units, excessive weeks/days counts
- `lastSevenDays.tsx` -- rolling 7-day summary (drink count, units, drinking days)
- `settings.tsx` -- drawer for weight, sex, BAC target, weekly unit target, plus sort drinks button
- `authModal.tsx` -- passkey sign-up/log-in dialog
- `disclaimer.tsx` -- footer disclaimer
- `helpfulLinks.tsx` -- links to taxi search and alcohol support resources
- `ui/` -- shadcn/ui primitives (button, card, dialog, drawer, input, label, select, table)

### Path Aliases

Configured in `tsconfig.json`:
- `~/` and `@/` both map to `./app/`

## Code Style

- Linting: oxlint (no config file; uses defaults)
- Formatting: oxfmt (no config file; uses defaults)
- No test framework is currently set up
- Components use named exports (not default exports), except the home route which uses a default export as required by React Router
- Drinks are soft-deleted (`isDeleted: true`) rather than removed from the list
- Weight is stored in grams (e.g. 85000 = 85 kg)
- Alcohol percentage is stored as a decimal (e.g. 0.045 = 4.5%)
- `bacAddition` is computed and stored at drink creation time so that later changes to user weight do not retrospectively alter historical BAC values
