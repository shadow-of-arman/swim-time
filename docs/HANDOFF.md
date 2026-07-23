# Handoff

## Current state

The project foundation and fixed weekly schedule model are now present on `main`. The application still shows a temporary Persian placeholder page, but the domain layer now defines every fixed day and time slot needed for the schedule engine.

## Confirmed decisions

- The website is Persian-first and fully RTL.
- Weeks begin on Saturday.
- Schedule calculations use `Asia/Tehran` rather than the visitor's local timezone.
- The MVP is a static React and TypeScript application built with Vite.
- The weekly schedule is generated from an anchor week and a 39-unit rotation.
- The visual design should be simple, readable, responsive, and slightly polished.
- Public-facing UI text must be Persian.
- A backend and admin dashboard are out of scope for the MVP.
- Package management and local commands currently use npm.
- Vazirmatn is loaded from Google Fonts with Tahoma and Arial fallbacks.
- Domain identifiers remain English, while exported user-facing labels are Persian.

## Current architecture

- `index.html`: Persian metadata, RTL document direction, page title, theme metadata, and font loading.
- `src/main.tsx`: guarded React root setup and strict-mode rendering.
- `src/App.tsx`: temporary Persian placeholder screen.
- `src/index.css`: global RTL layout, responsive placeholder styling, and numeric direction-isolation utility.
- `src/domain/schedule.ts`: strongly typed fixed schedule model, Persian weekday/time labels, Saturday-first ordering, sequential private-slot indexes, and runtime validation that exactly 39 private periods exist.
- `src/domain/schedule.test.ts`: structural tests for day ordering, period counts, private-slot indexes, cleaning placement, public-period alternation, and time-range ordering.
- `package.json`: Vite, React, TypeScript, ESLint, and Vitest scripts and dependencies.
- `tsconfig*.json`: strict application and tooling TypeScript configurations.
- `eslint.config.js`: flat ESLint configuration for TypeScript and React hooks.
- `vite.config.ts`: minimal React-enabled Vite configuration.

## Fixed schedule model

- Each day contains eight periods: 08:00-09:30 through 22:00-23:30.
- The first two periods are public periods.
- Saturday starts with بانوان then آقایان; the order alternates each day.
- Saturday, Monday, Wednesday, and Friday contain six private periods.
- Sunday, Tuesday, and Thursday contain five private periods followed by cleaning.
- Private periods receive stable indexes from 0 through 38 across the Saturday-first week.

## Anchor data inferred from screenshots

- Week starting 1405/04/20: private slots begin with unit 39, then units 1 through 38.
- Week starting 1405/04/27: private slots begin with unit 38, then unit 39, then units 1 through 37.
- This indicates a one-slot weekly rotation.

## Documentation protocol

Each implementation run must read:

- `README.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/HANDOFF.md`
- `docs/RUN_LOG.md`

After implementation, each run must update the README status, append to the run log, and replace this handoff with the latest state.

## Verification performed

- The extracted `src/domain/schedule.ts` module compiled successfully with TypeScript 5.8.3 using strict checks.
- A local runtime verification confirmed seven days, eight time ranges, 39 private periods, and cleaning only at Sunday, Tuesday, and Thursday period index 7.
- The Vitest test file was statically reviewed but has not yet been executed inside the actual repository environment.

## Known uncertainties and issues

- Two screenshots establish the rotation pattern but cannot prove whether management occasionally changes the schedule manually. The implementation must include configuration-based overrides.
- Full repository dependency installation, linting, Vitest execution, and Vite production build have not yet been run because the GitHub connector does not provide a repository shell.
- No lockfile exists yet. A future CI or shell-enabled run should generate and commit it if appropriate.

## Exact next recommended task

Implement a small `src/domain/tehranTime.ts` module using built-in `Intl.DateTimeFormat` and UTC-safe date arithmetic. It should obtain Tehran calendar-date parts from any `Date`, map JavaScript weekdays into the Saturday-first domain order, calculate the latest Saturday in Tehran, and calculate whole-week offsets from the Gregorian anchor Saturday `2026-07-11`. Add tests around Friday-to-Saturday rollover and dates before and after the anchor. Do not implement unit rotation until these date primitives are verified.
