# Handoff

## Current state

The project foundation, Tehran-aware schedule engine, 39-unit rotation, Persian formatting, responsive schedule interface, live period status, week navigation, persisted unit lookup, repository CI workflow, portable static-build artifact workflow, and delivery-maintenance guide are present on `main`. Every displayed week is generated directly from the anchor rotation. Manual schedule overrides remain explicitly out of scope.

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
- Release and maintenance procedures are documented independently of a specific hosting provider.

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
- `docs/DELIVERY.md`: host-neutral artifact deployment, manual release checks, schedule maintenance, dependency updates, rollback, and final MVP sign-off.
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

## Delivery and maintenance behavior

- The production unit is the complete generated `dist/` directory.
- The downloadable artifact may be extracted into a root domain or nested static path without rebuilding.
- The application has no client-side routes, so static hosts do not need SPA fallback rewriting.
- `docs/DELIVERY.md` provides representative 390-pixel mobile and 1440-pixel desktop verification widths.
- The guide includes checks for Persian RTL direction, isolated dates and times, Tehran-week behavior, week navigation, current-period states, and persisted unit selection.
- The guide documents how to update dependencies, protect the fixed rotation rule, and roll back to a known-good static artifact.

## Documentation protocol

Each implementation run must read `README.md` and every file under `docs/`. After implementation, update README status, append to the run log without removing history, and replace this handoff with the latest state.

## Verification performed

- Read the current README, implementation plan, handoff, and complete run log before this change.
- Inspected the latest repository commits and confirmed delivery documentation as the next achievable unfinished task while push-triggered workflow results remain unavailable through the connector.
- Reviewed the new delivery guide against the existing workflow names, artifact name, retention period, Vite base path, package scripts, static application behavior, and fixed-rotation constraints.
- Confirmed the guide does not require secrets, backend infrastructure, an admin dashboard, authentication, or manual schedule overrides.
- The GitHub combined-status endpoint returned no status contexts for the latest commit, and the available workflow-run connector remains limited to pull-request-triggered runs; therefore actual push workflow results are still unconfirmed.
- The container could not reach GitHub or the npm registry, so a lockfile, production bundle, hosted preview, and browser screenshots could not be produced in this run.

## Known uncertainties and issues

- The rotation rule is inferred from two screenshots and is assumed to continue indefinitely, as requested.
- No lockfile exists yet, so workflows use `npm install` rather than `npm ci`.
- The GitHub Actions verification and static-artifact results still need confirmation in the Actions interface or through a later connector capability.
- The static artifact workflow is configured, but a public or private hosted preview has not yet been confirmed.
- Browser rendering has not yet been inspected through a deployed preview.
- Week navigation remains intentionally unbounded.
- When local storage is blocked, unit selection cannot persist across page reloads.

## Exact next recommended task

Perform only the remaining external verification work. Inspect the latest `Repository checks` and `Static site artifact` runs in GitHub Actions, fix any lint, type-check, test, build, or artifact failure, and obtain the generated `swimming-pool-time-static` artifact. Deploy it to the confirmed static host or open it through an approved preview environment, then execute the checklist in `docs/DELIVERY.md` at representative mobile and desktop widths. Record the final hosting location and verified results, generate a lockfile through a real npm installation if feasible, and mark the MVP complete only after those checks pass. Do not add a backend, admin dashboard, secrets, or manual schedule overrides.
