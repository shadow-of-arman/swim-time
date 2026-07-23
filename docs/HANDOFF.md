# Handoff

## Current state

The project foundation, Tehran-aware schedule engine, 39-unit rotation, Persian formatting, responsive schedule interface, live period status, week navigation, persisted unit lookup, and typed manual schedule overrides are now present on `main`. Every resolved week is generated from the anchor rotation and then passed through validated configuration before status and unit lookup are calculated.

## Confirmed decisions

- The website is Persian-first and fully RTL.
- Weeks begin on Saturday and use `Asia/Tehran` rather than the visitor's timezone.
- The MVP remains a static React, TypeScript, and Vite application with no backend.
- The visual design remains simple, readable, responsive, and modest.
- Public-facing UI text is Persian; domain identifiers remain English.
- Calendar arithmetic uses Gregorian date-only values represented at UTC midnight.
- Jalali conversion uses the built-in `Intl.DateTimeFormat` Persian calendar.
- Resolved schedules are generated from the anchor rotation before overrides are applied.
- Manual overrides are keyed by canonical Gregorian Saturday strings such as `2026-07-18`.
- The final overridden week must still contain private units 1 through 39 exactly once.
- A selected unit is stored as a canonical integer string under `swimming-pool:selected-unit`; storage failure is non-fatal.
- Browsed weeks use an integer offset relative to the live Tehran week.

## Current architecture

- `index.html`: Persian metadata, RTL direction, title, theme metadata, and font loading.
- `src/main.tsx`: guarded React root and global/navigation/unit-lookup style imports.
- `src/App.tsx`: live clock, week navigation, selected-unit persistence, schedule rendering, status summaries, unit lookup, and responsive tables/cards.
- `src/index.css`, `src/navigation.css`, `src/unitLookup.css`: modest responsive RTL presentation and state highlighting.
- `src/config/scheduleOverrides.ts`: operator-maintained override configuration, empty by default.
- `src/domain/schedule.ts`: fixed weekdays, time ranges, public/private/cleaning structure, and invariants.
- `src/domain/tehranTime.ts`: Tehran date/time extraction and UTC-safe date arithmetic.
- `src/domain/resolvedSchedule.ts`: anchor rotation generation followed by configured override application.
- `src/domain/scheduleOverrides.ts`: canonical Saturday-key validation, per-slot replacements, duplicate-position checks, and final unit-invariant validation.
- `src/domain/persianFormatting.ts`: Persian digits and Jalali labels.
- `src/domain/scheduleStatus.ts`: current day, active period, and next period.
- `src/domain/weekNavigation.ts`: displayed-week calculations and Persian relative labels.
- `src/domain/unitLookup.ts`: local-storage helpers and selected-unit schedule lookup.
- Matching `*.test.ts` files cover each domain module, including both screenshot weeks and override scenarios.
- `package.json`, `tsconfig*.json`, `eslint.config.js`, and `vite.config.ts`: project tooling.

## Override behavior

- `resolveWeeklySchedule` first generates the normal rotation for a week offset.
- It derives that week's Gregorian Saturday from the anchor and applies `SCHEDULE_OVERRIDES`.
- Every configuration key is validated as a real canonical Gregorian Saturday.
- Override day and slot indexes, private unit ranges, and duplicate positions are validated.
- Public and cleaning slots may be replaced without changing the private-unit count.
- Unit changes must preserve exactly one occurrence of every unit from 1 through 39.
- Weeks without an override retain the generated schedule object unchanged.
- Because overrides are applied inside schedule resolution, live status, navigation, and unit lookup all consume the same final schedule.

## Documentation protocol

Each implementation run must read `README.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/HANDOFF.md`, and the complete `docs/RUN_LOG.md`. After implementation, update README status, append to the run log without removing history, and replace this handoff with the latest state.

## Verification performed

- The new override module and tests were statically reviewed against the existing schedule, date, and resolved-schedule types.
- Test coverage was added for empty configuration, two-unit swaps, public/cleaning replacements, invalid positions, duplicate units, unrelated weeks, canonical keys, and non-Saturday keys.
- The resolved-schedule path was reviewed to confirm override application occurs before all existing consumers receive the schedule.
- Empty production configuration preserves the two documented screenshot schedules.
- Full dependency installation, actual Vitest execution, linting, TypeScript project checking, Vite production build, and browser rendering remain pending because the connector does not provide a repository shell or preview.

## Known uncertainties and issues

- The inferred rotation is based on two screenshots; future management exceptions must be entered manually in `src/config/scheduleOverrides.ts`.
- No real override has been supplied yet, so production configuration remains empty.
- No lockfile exists yet.
- Full automated checks and browser verification have not yet run.
- Week navigation remains intentionally unbounded.
- When local storage is blocked, unit selection cannot persist across page reloads.

## Exact next recommended task

Add a GitHub Actions workflow that installs dependencies and runs `npm run lint`, `npm run typecheck`, `npm run test:run`, and `npm run build` on pushes and pull requests. Resolve any failures found by CI and generate a lockfile through a verified install if feasible. Keep deployment configuration for the following run.
