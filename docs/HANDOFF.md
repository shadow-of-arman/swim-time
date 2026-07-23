# Handoff

## Current state

The project foundation, Tehran-aware schedule engine, 39-unit rotation, Persian formatting, responsive schedule interface, live period status, week navigation, persisted unit lookup, repository CI workflow, and portable static-build artifact workflow are present on `main`. Every displayed week is generated directly from the anchor rotation. Manual schedule overrides remain explicitly out of scope.

## Confirmed decisions

- The website is Persian-first and fully RTL.
- Weeks begin on Saturday and use `Asia/Tehran` rather than the visitor's timezone.
- The MVP remains a static React, TypeScript, and Vite application with no backend.
- The visual design remains simple, readable, responsive, and modest.
- Public-facing UI text is Persian; domain identifiers remain English.
- Calendar arithmetic uses Gregorian date-only values represented at UTC midnight.
- Jalali conversion uses the built-in `Intl.DateTimeFormat` Persian calendar.
- Resolved schedules are generated solely from the fixed anchor rotation.
- Manual schedule overrides are explicitly out of scope.
- A selected unit is stored as a canonical integer string under `swimming-pool:selected-unit`; storage failure is non-fatal.
- Browsed weeks use an integer offset relative to the live Tehran week.
- CI currently uses `npm install` because the repository does not yet contain a lockfile.
- Static production assets use relative URLs so one build remains portable across root domains and nested paths.
- A host-specific deployment workflow is deferred until the available hosting option for this private repository is confirmed.

## Current architecture

- `index.html`: Persian metadata, RTL direction, title, theme metadata, and font loading.
- `src/main.tsx`: guarded React root and global/navigation/unit-lookup style imports.
- `src/App.tsx`: live clock, week navigation, selected-unit persistence, schedule rendering, status summaries, unit lookup, and responsive tables/cards.
- `src/index.css`, `src/navigation.css`, `src/unitLookup.css`: modest responsive RTL presentation and state highlighting.
- `src/domain/schedule.ts`: fixed weekdays, time ranges, public/private/cleaning structure, and invariants.
- `src/domain/tehranTime.ts`: Tehran date/time extraction and UTC-safe date arithmetic.
- `src/domain/resolvedSchedule.ts`: authoritative anchor-based unit rotation and resolved weekly schedules.
- `src/domain/persianFormatting.ts`: Persian digits and Jalali labels.
- `src/domain/scheduleStatus.ts`: current day, active period, and next period.
- `src/domain/weekNavigation.ts`: displayed-week calculations and Persian relative labels.
- `src/domain/unitLookup.ts`: local-storage helpers and selected-unit schedule lookup.
- Matching `*.test.ts` files cover the domain modules, including both screenshot weeks.
- `vite.config.ts`: React plugin and portable `./` base path for static production output.
- `.github/workflows/ci.yml`: push and pull-request verification using Node.js 22.16.0, dependency installation, linting, type checking, Vitest, and the Vite production build.
- `.github/workflows/static-site.yml`: builds `dist/` on pushes to `main` or manual dispatch and uploads `swimming-pool-time-static` for 14 days.
- `package.json`, `tsconfig*.json`, and `eslint.config.js`: project tooling.

## Interface behavior

- The current Tehran week is calculated automatically and updates while the page remains open.
- Users can browse previous and later weeks, with dates and all 39 unit assignments recalculated.
- Today, active-period, and next-period states appear only for the live week.
- Users can select a unit from 1 through 39, persist it locally, view its date/time summary, and see it highlighted in either responsive layout.
- Every displayed schedule comes directly from the same fixed rotation formula; no exception or override configuration is applied.

## Automated workflow behavior

- `Repository checks` runs on pushes to `main` and pull requests.
- It runs `npm install --no-audit --no-fund`, linting, type checking, Vitest, and the production build.
- `Static site artifact` runs on pushes to `main` and manual dispatch.
- It builds the same production bundle and uploads the complete `dist/` directory as a host-neutral artifact.
- Both workflows use Node.js `22.16.0`, read-only repository permissions, ten-minute timeouts, and concurrency cancellation.
- The static artifact fails explicitly when `dist/` is missing and is retained for 14 days.

## Documentation protocol

Each implementation run must read `README.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/HANDOFF.md`, and the complete `docs/RUN_LOG.md`. After implementation, update README status, append to the run log without removing history, and replace this handoff with the latest state.

## Verification performed

- Fetched and reviewed the committed Vite and static-artifact workflow files from `main`.
- Confirmed `base: './'` keeps generated asset references relative and does not change runtime schedule logic.
- Confirmed the workflow installs dependencies, builds with the existing `npm run build` script, requires `dist/`, and uploads only the production output.
- Confirmed the workflow has no write permissions, secrets, backend, admin functionality, or manual schedule override path.
- The available connector still does not expose push-triggered workflow runs, so actual CI and artifact results have not been confirmed here.
- A lockfile could not be generated because the available environment does not have repository shell access with npm registry connectivity.

## Known uncertainties and issues

- The rotation rule is inferred from two screenshots and is assumed to continue indefinitely, as requested.
- No lockfile exists yet, so workflows use `npm install` rather than `npm ci`.
- The GitHub Actions verification and static-artifact results still need confirmation in the Actions interface or through a later connector capability.
- The static artifact is ready for hosting, but a public or private hosted preview has not yet been configured.
- Browser rendering has not yet been inspected through a deployed preview.
- Week navigation remains intentionally unbounded.
- When local storage is blocked, unit selection cannot persist across page reloads.

## Exact next recommended task

Perform final delivery verification. Inspect the latest `Repository checks` and `Static site artifact` workflow results, fix any lint, type-check, test, build, or artifact failure, and download or deploy the generated artifact to the confirmed static host. Then inspect the Persian RTL interface at representative mobile and desktop widths, document the chosen hosting procedure and maintenance steps, and mark the MVP complete only when those checks pass. Do not add a backend, admin dashboard, secrets, or manual schedule overrides.
