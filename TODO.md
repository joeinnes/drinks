# Drinks App — Improvement Plan

## 1. Update Jazz (`jazz-tools`)
- Current version: `0.20.6` (pinned), latest: `0.20.9`
- Check if the `@ts-expect-error` workaround in `onAnonymousAccountDiscarded.ts` is resolved
- Review changelog for any breaking changes or new features

## 2. Fix `useEffect` in `home.tsx`
- The BAC update interval has no dependency array, so it recreates the interval on every render
- Add `[me?.root?.myDrinks]` as a dependency

## 3. Move `dayjs` to `dependencies`
- Currently listed under `devDependencies` but used at runtime in multiple components
- Should be a production dependency to avoid potential issues in deployed builds

## 4. Accessibility improvements
- Add `aria-live="polite"` to the BAC display so screen readers can announce updates
- Add `aria-label` attributes to interactive elements (delete buttons, settings controls)
- Improve form labels in the Settings drawer with explicit `htmlFor` connections
- Add screen reader-friendly descriptions for time formats (e.g. "2h30m")

## 5. Extract magic numbers / repeated patterns
- Extract the unit conversion formula (`volume * percent / 10`) into a shared helper
- Derive `me?.root?.myDrinks || null` once at the top of the home component instead of repeating it

## 6. Soft-delete cleanup
- Soft-deleted drinks (`isDeleted: true`) accumulate forever with no cleanup
- Options: periodic purge after N days, or hard-delete after confirmation

## 7. UX enhancements
- Add an "undo" toast when a drink is deleted
- Add data export (CSV/JSON)
- Add search/filter to the drink history
