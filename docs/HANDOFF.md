# Handoff

## Current state

The project foundation, fixed weekly schedule model, Tehran date primitives, 39-unit rotation engine, Persian formatting utilities, responsive schedule interface, live current/next period behavior, week navigation, and persisted unit lookup are now present on `main`. The application calculates the live Tehran week at runtime, refreshes every 30 seconds, lets the user browse earlier or later weeks, and shows the selected apartment unit's correct private period for every displayed week.

## Confirmed decisions

- The website is Persian-first and fully RTL.
- Weeks begin on Saturday.
- Schedule calculations use `Asia/Tehran` rather than the visitor's local timezone.
- The MVP is a static React and TypeScript application built with Vite.
- The weekly schedule is generated from an anchor week and a 39-unit rotation.
- The visual design is simple, readable, responsive, and modestly styled.
- Public-facing UI text is Persian.
- A backend and admin dashboard are out of scope for the MVP.
- Package management and local commands currently use npm.
- Vazirmatn is loaded from Google Fonts with Tahoma and Arial fallbacks.
- Domain identifiers remain English, while user-facing labels remain Persian.
- Calendar arithmetic uses Gregorian date-only values represented at UTC midnight.
- Fixed schedule definitions remain immutable; resolved schedules add unit numbers without mutating public or cleaning periods.
- Jalali conversion uses the built-in `Intl.DateTimeFormat` Persian calendar.
- Live schedule status is calculated through pure domain helpers rather than inside React markup.
- Browsed weeks are stored as an integer offset relative to the live Tehran week.
- Today, active-period, and next-period states appear only when the displayed week is the live week.
- A selected unit is stored as a canonical integer string in local storage under `swimming-pool:selected-unit`.
- Missing, malformed, blocked, or unavailable local storage never prevents the schedule from loading.
- Unit lookup is performed against the currently displayed week's resolved rotation, not only the live week.

## Current architecture

- `index.html`: Persian metadata, RTL document direction, page title, theme metadata, and font loading.
- `src/main.tsx`: guarded React root setup and imports for global, navigation, and unit-lookup styles.
- `src/App.tsx`: live clock refresh, relative displayed-week state, persisted unit state, week navigation controls, schedule resolution, unit lookup summary, Persian headers, live status summaries, selected-unit highlighting, mobile day cards, and desktop schedule table.
- `src/index.css`: responsive RTL styling, status cards, schedule cards, desktop table, today/active/next states, semantic period treatments, and accessibility helpers.
- `src/navigation.css`: previous/current/next week controls and the non-live-week information panel.
- `src/unitLookup.css`: unit selector, selected-unit summary, responsive layout, legend marker, and selected mobile/desktop schedule outlines.
- `src/domain/schedule.ts`: strongly typed fixed schedule model and runtime validation for exactly 39 private periods.
- `src/domain/schedule.test.ts`: structural schedule tests.
- `src/domain/tehranTime.ts`: Tehran Gregorian date extraction, Tehran hour/minute/second extraction, Saturday-first mapping, latest-Saturday calculation, and anchor week offsets.
- `src/domain/tehranTime.test.ts`: Tehran rollover, time-of-day extraction, and date arithmetic tests.
- `src/domain/resolvedSchedule.ts`: positive-modulo unit rotation and resolved weekly schedules.
- `src/domain/resolvedSchedule.test.ts`: screenshot sequence, uniqueness, wrapping, and date-resolution tests.
- `src/domain/persianFormatting.ts`: Persian digits, Jalali labels, and Saturday-to-Friday range formatting.
- `src/domain/persianFormatting.test.ts`: formatting and boundary tests.
- `src/domain/scheduleStatus.ts`: displayed-week validation, current-day detection, active-period detection, next-period search, and reusable position matching.
- `src/domain/scheduleStatus.test.ts`: before-opening, active, gap, after-closing, cleaning, end-of-week, outside-week, and invalid-start tests.
- `src/domain/weekNavigation.ts`: displayed-week Saturday calculation, anchor rotation offset calculation, current-week detection, and Persian relative-week labels.
- `src/domain/weekNavigation.test.ts`: current/previous/next selection, Gregorian boundary, Persian label, and invalid-offset tests.
- `src/domain/unitLookup.ts`: unit validation, safe local-storage read/write helpers, malformed-value cleanup, and lookup of a unit's private schedule position.
- `src/domain/unitLookup.test.ts`: unit range, stored-value parsing, blocked-storage recovery, anchor lookup, later-day lookup, browsed-week rotation, and invalid-unit tests.
- `package.json`: Vite, React, TypeScript, ESLint, and Vitest scripts and dependencies.
- `tsconfig*.json`: strict application and tooling TypeScript configurations.
- `eslint.config.js`: flat ESLint configuration for TypeScript and React hooks.
- `vite.config.ts`: minimal React-enabled Vite configuration.

## Interface behavior

- The header shows the Persian Saturday-to-Friday range for the displayed week and identifies it as the current, previous, next, or a more distant week.
- Persian buttons move backward one week, return to the live week, or move forward one week.
- The correct 39-unit rotation is recalculated for every browsed week.
- A selector lists apartment units 1 through 39 with Persian display digits.
- A valid selected unit is restored on later visits when local storage is available.
- The selected unit summary shows its Persian weekday, Jalali date, and RTL-safe time range for the displayed week.
- The selected unit receives a restrained outline in both mobile cards and the desktop table.
- A non-live-week notice explains that live status is only available for the current week.
- The current-period and next-period cards, today marker, and active/next highlights are hidden outside the live week.
- The page refreshes its current time every 30 seconds so period states and Saturday rollover update while it remains open.
- Mobile widths render one card per day with all eight periods in a vertical list.
- Desktop widths render one row per day and one column per time range.
- Every unit number and all date/time labels are displayed with Persian digits.

## Anchor data inferred from screenshots

- Week starting 1405/04/20: private slots begin with unit 39, then units 1 through 38.
- Week starting 1405/04/27: private slots begin with unit 38, then unit 39, then units 1 through 37.
- Both complete private-unit sequences are covered by tests.

## Documentation protocol

Each implementation run must read:

- `README.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/HANDOFF.md`
- `docs/RUN_LOG.md`

After implementation, each run must update the README status, append to the run log, and replace this handoff with the latest state.

## Verification performed

- `src/domain/unitLookup.ts` compiled with TypeScript 5.8.3 under strict settings against compatible schedule, resolved-schedule, and Tehran-date declarations.
- Node.js 22 runtime checks confirmed canonical stored-value parsing, persistence and clearing, anchor-week unit 39 lookup, and Sunday unit 6 date lookup.
- The new Vitest source covers valid and invalid units, malformed stored values, blocked storage, persistence, anchor positions, later days, and browsed-week rotation.
- The committed application, unit lookup stylesheet, domain helper, test source, and main style import were fetched and reviewed after implementation.
- All newly added user-facing text is Persian, unit options use Persian display digits, and date/time output remains RTL-safe.
- Full repository dependency installation, actual Vitest execution, linting, Vite production build, and browser rendering remain pending because the GitHub connector does not provide a repository shell or deployed preview.

## Known uncertainties and issues

- Two screenshots establish the rotation pattern but cannot prove whether management occasionally changes the schedule manually. The implementation must include configuration-based overrides.
- Full repository dependency installation, linting, Vitest execution, and Vite production build remain pending.
- No lockfile exists yet. A future CI or shell-enabled run should generate and commit it if appropriate.
- Visual browser rendering has not yet been inspected through a deployed preview.
- Week navigation is intentionally unbounded. Very distant weeks depend on the inferred rotation remaining valid unless an override replaces that week's generated schedule.
- When local storage is blocked, unit selection still works during the current page session but cannot persist across visits.

## Exact next recommended task

Add manual schedule overrides as a focused configuration-plus-domain task. Define a small typed configuration keyed by Gregorian Saturday strings such as `2026-07-18`, support explicit per-day and per-slot replacements after the generated rotation is resolved, and validate week keys, day/slot indexes, unit ranges, and the final one-through-39 unit invariant. Integrate override application into the displayed schedule before status and unit lookup are calculated. Add tests for an empty configuration, a two-unit swap, a public or cleaning replacement, invalid indexes, duplicate units, and a browsed week with no override. Do not add CI or deployment in the same run.
