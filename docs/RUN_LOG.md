# Scheduled Implementation Run Log

Do not rewrite or delete previous entries. Append one entry after every implementation run.

## 2026-07-23 - Initial setup

### Steps taken

- Confirmed repository access and that `main` was empty.
- Added `README.md` with product requirements, schedule assumptions, progress checklist, and the scheduled-run protocol.
- Added `docs/IMPLEMENTATION_PLAN.md` with an ordered, incremental implementation plan.
- Added `docs/HANDOFF.md` with current decisions, uncertainties, and the exact next task.
- Added this chronological run log.

### Verification

- All documentation files were committed directly to `main`.
- The inferred rotation was documented against both supplied screenshot weeks.

### Decisions

- Use a static React, TypeScript, and Vite implementation.
- Use Tehran time and Saturday as the start of the week.
- Keep the design functional, responsive, RTL-correct, and only lightly styled.
- Avoid a backend for the MVP.

### Steps left

- Initialize the application.
- Implement the schedule engine and date utilities.
- Build the Persian responsive interface.
- Add unit lookup, week navigation, overrides, and tests.
- Add CI, deployment configuration, and final maintenance documentation.

### Next recommended task

Initialize the Vite React TypeScript project with Persian document metadata and a minimal RTL placeholder screen.

## 2026-07-23 - Run 1: Project foundation

### Steps taken

- Read the README and all existing files under `docs/` before implementation.
- Inspected the latest documentation commit and confirmed the expected next task.
- Added `package.json` with React, TypeScript, Vite, ESLint, and Vitest dependencies and scripts.
- Added strict application and tooling TypeScript configurations.
- Added Vite and flat ESLint configuration files.
- Added `.gitignore` for dependencies, build output, local environment files, logs, and editor artifacts.
- Added a Persian `index.html` using `lang="fa"`, `dir="rtl"`, Persian metadata, and Vazirmatn font loading.
- Added the React entry point with a guarded root lookup.
- Added a simple Persian placeholder page and responsive global RTL styling.
- Added a numeric direction-isolation CSS utility for future dates and time ranges.
- Updated the README status and handoff documentation.

### Verification

- Confirmed all required foundation files were created on `main`.
- Statically reviewed imports, scripts, TypeScript references, Persian document metadata, RTL direction, and responsive CSS structure.
- Confirmed all visible placeholder text is Persian.
- Could not execute `npm install`, linting, type checking, tests, or a production build because the available GitHub connector does not provide a repository shell. This limitation is recorded in the handoff.

### Decisions

- Use npm scripts for local development and future CI.
- Keep the initial screen intentionally modest and temporary.
- Load Vazirmatn from Google Fonts with common Persian-capable fallbacks.
- Keep schedule logic out of UI components and implement it as typed domain/configuration modules next.

### Steps left

- Define the fixed Saturday-first schedule model and structural invariants.
- Implement Tehran-time Saturday and week-offset calculations.
- Implement the 39-unit weekly rotation.
- Add Jalali and Persian-number formatting.
- Replace the placeholder with the complete responsive schedule UI.
- Add navigation, unit lookup, overrides, tests, CI, and deployment.

### Next recommended task

Define the seven weekdays, eight daily time ranges, fixed بانوان/آقایان periods, private unit-slot positions, and cleaning periods as strongly typed configuration. Verify that the model contains exactly 39 private slots per week before adding date calculations.

## 2026-07-23 - Run 2: Fixed schedule model

### Steps taken

- Read the current README, implementation plan, handoff, and complete run log before making changes.
- Inspected the latest repository commit and confirmed the fixed schedule model as the next task.
- Added `src/domain/schedule.ts` with typed weekday, audience, time-range, day, and slot definitions.
- Defined the seven weekdays in Saturday-first order with Persian display labels.
- Defined all eight daily time ranges with minute values and Persian display labels.
- Encoded alternating بانوان and آقایان morning periods.
- Encoded six private periods on Saturday, Monday, Wednesday, and Friday.
- Encoded five private periods followed by cleaning on Sunday, Tuesday, and Thursday.
- Assigned stable private-slot indexes from 0 through 38 and added a runtime guard requiring exactly 39 private periods.
- Added `src/domain/schedule.test.ts` with structural invariant tests.
- Updated the README and handoff documentation.

### Verification

- Fetched and reviewed both new domain files from `main` after committing them.
- Compiled the extracted schedule module successfully with TypeScript 5.8.3 under strict settings.
- Ran a local runtime invariant check that confirmed seven days, eight time ranges, 39 private periods, and cleaning only at Sunday, Tuesday, and Thursday period index 7.
- Statically reviewed the Vitest tests. Full repository dependency installation and Vitest execution remain unavailable through the GitHub connector.

### Decisions

- Keep fixed schedule data and schedule-generation logic in the domain layer rather than React components.
- Give every private period a stable zero-based index so the weekly unit rotation can be implemented with simple modulo arithmetic later.
- Keep Persian text only in exported display labels while maintaining English code identifiers.
- Use minute values for time comparisons and Persian strings only for display.

### Steps left

- Implement Tehran date extraction and Saturday-first date calculations.
- Calculate whole-week offsets from the anchor Saturday.
- Implement the 39-unit rotation and full weekly schedule generation.
- Add Jalali and Persian-number formatting.
- Build the responsive schedule UI, navigation, unit lookup, and current-period behavior.
- Add overrides, screenshot-anchor tests, CI, deployment, and final documentation.

### Next recommended task

Implement Tehran-time primitives using `Intl.DateTimeFormat` and UTC-safe date arithmetic: obtain Tehran date parts, determine the latest Saturday, and calculate week offsets from Gregorian anchor Saturday `2026-07-11`. Add rollover tests before implementing unit rotation.

## 2026-07-23 - Run 3: Tehran week calculations

### Steps taken

- Read the current README, implementation plan, handoff, and complete run log before making changes.
- Inspected the latest run commit and confirmed Tehran date primitives as the next coherent task.
- Added `src/domain/tehranTime.ts` with the `Asia/Tehran` timezone constant and Gregorian date-only types.
- Added Tehran Gregorian year, month, and day extraction using `Intl.DateTimeFormat.formatToParts` with Latin digits.
- Added Saturday-first weekday mapping where Saturday is index 0 and Friday is index 6.
- Added validated UTC-midnight conversion helpers and integer day arithmetic to avoid visitor-local timezone effects.
- Added latest-Saturday calculation for the active Tehran week.
- Added whole-week offset calculation from the documented anchor Saturday `2026-07-11`.
- Added `src/domain/tehranTime.test.ts` covering Tehran midnight rollover, latest-Saturday selection, anchor offsets, month-boundary arithmetic, and anchor weekday validation.
- Updated the README and handoff documentation.

### Verification

- Compiled the Tehran-time module successfully with TypeScript 5.8.3 under strict settings.
- Compiled the test source under strict settings using a temporary minimal Vitest declaration.
- Ran Node.js 22 runtime checks at `2026-07-17T20:29:59Z` and `2026-07-17T20:30:00Z`, confirming the Tehran date changes from Friday 2026-07-17 to Saturday 2026-07-18 exactly at Tehran midnight.
- Confirmed latest-Saturday results of 2026-07-11 before rollover and 2026-07-18 at rollover.
- Confirmed week offsets `-1`, `0`, and `1` before, at, and after the anchor week.
- Confirmed UTC-safe day arithmetic across month and year boundaries.
- The actual repository Vitest suite, dependency installation, linting, and Vite production build remain pending because the GitHub connector does not provide a repository shell.

### Decisions

- Keep timezone conversion limited to obtaining Tehran's current Gregorian calendar date; perform all later day and week arithmetic on date-only UTC values.
- Derive the weekday from the extracted Gregorian date instead of parsing localized weekday text.
- Keep the anchor as a typed Gregorian date-only value rather than a timestamp with an implied timezone.
- Reject invalid dates and non-integer day offsets instead of allowing JavaScript date normalization to hide configuration errors.

### Steps left

- Implement positive-modulo unit rotation and map all 39 private periods to units.
- Generate a resolved weekly schedule while preserving public and cleaning periods.
- Verify complete unit sequences against both supplied screenshot weeks.
- Add Jalali and Persian-number formatting.
- Build the responsive schedule UI, navigation, unit lookup, and current-period behavior.
- Add overrides, CI, deployment, and final documentation.

### Next recommended task

Implement a resolved schedule domain module. Private slot index 0 must map to unit 39 at week offset 0 and unit 38 at week offset 1, with all other assignments wrapping through units 1 to 39 by positive modulo. Add tests proving every unit appears exactly once and the anchor-week sequences match both screenshots before beginning the UI.
