# Handoff

## Current state

The Persian-first swimming-pool schedule for برج ارغوان is live on GitHub Pages at `https://shadow-of-arman.github.io/swimming-pool-time/`. The Tehran-aware fixed rotation, responsive mobile and desktop schedules, live period status, week navigation, persisted unit lookup, verified npm lockfile, repository checks, portable static artifact, Pages deployment, and delivery-maintenance guide are present on `main`. Manual schedule overrides remain explicitly out of scope.

## Confirmed decisions

- The public building identity is برج ارغوان; the main heading remains برنامه هفتگی استخر.
- The website is Persian-first and fully RTL.
- Weeks begin on Saturday and use `Asia/Tehran` rather than the visitor's timezone.
- The MVP remains a static React, TypeScript, and Vite application with no backend.
- The visual design remains simple, readable, responsive, and modest.
- Calendar arithmetic uses Gregorian date-only values represented at UTC midnight.
- Jalali conversion uses the built-in `Intl.DateTimeFormat` Persian calendar.
- Resolved schedules are generated solely from the fixed anchor rotation.
- Manual schedule overrides are explicitly out of scope.
- A selected unit is stored under `swimming-pool:selected-unit`; storage failure is non-fatal.
- Browsed weeks use an integer offset relative to the live Tehran week.
- Week navigation is placed immediately above the mobile cards or desktop schedule table.
- A verified `package-lock.json` is committed and automated workflows use `npm ci`.
- Static production assets use relative URLs and the production site is deployed with GitHub Pages.

## Current architecture

- `index.html`: Persian metadata, RTL direction, Arghavan Tower title and description, theme metadata, and font loading.
- `src/main.tsx`: guarded React root and global/navigation/unit-lookup style imports.
- `src/App.tsx`: Arghavan Tower header, live clock, selected-unit persistence, status summaries, schedule legend, calendar-adjacent week navigation, and responsive schedule rendering.
- `src/index.css`, `src/navigation.css`, `src/unitLookup.css`: modest responsive RTL presentation and state highlighting.
- `src/domain/schedule.ts`: fixed weekdays, time ranges, public/private/cleaning structure, and invariants.
- `src/domain/tehranTime.ts`: Tehran date/time extraction and UTC-safe date arithmetic.
- `src/domain/resolvedSchedule.ts`: authoritative anchor-based unit rotation and resolved weekly schedules.
- `src/domain/persianFormatting.ts`: Persian digits and Jalali labels.
- `src/domain/scheduleStatus.ts`: current day, active period, and next period.
- `src/domain/weekNavigation.ts`: displayed-week calculations and Persian relative labels.
- `src/domain/unitLookup.ts`: local-storage helpers and selected-unit schedule lookup.
- Matching `*.test.ts` files cover the domain modules, including both screenshot weeks.
- `vite.config.ts`: React plugin and portable `./` production base path.
- `package-lock.json`: verified dependency lockfile.
- `.github/workflows/ci.yml`: lint, type-check, Vitest, and production-build verification.
- `.github/workflows/static-site.yml`: portable `dist/` artifact generation.
- `.github/workflows/pages.yml`: GitHub Pages build and deployment.
- `docs/DELIVERY.md`: production URL, release checks, schedule maintenance, dependency updates, rollback, and final sign-off.

## Interface behavior

- The header identifies the building as برج ارغوان.
- The current Tehran week is calculated automatically and updates while the page remains open.
- Users can browse previous and later weeks; the three controls sit directly above the schedule.
- Today, active-period, and next-period states appear only for the live week.
- Users can select a unit, persist it locally, view its date/time summary, and see it highlighted in either responsive layout.
- Every displayed schedule comes directly from the same fixed rotation formula.

## Automated workflow behavior

- `Repository checks` runs on pushes to `main` and pull requests and executes linting, type checking, Vitest, and the production build.
- `Static site artifact` builds and uploads the portable `dist/` directory.
- `Deploy GitHub Pages` publishes the production build to the live GitHub Pages URL.
- All workflows install dependencies using the verified lockfile with `npm ci`.

## Documentation protocol

Each implementation run must read `README.md` and every file under `docs/`. After implementation, update README status, append to the run log without removing history, and replace this handoff with the latest state.

## Verification performed

- Read the current README and every file under `docs/` before implementation.
- Inspected the latest commits, verified lockfile, CI workflow, static-artifact workflow, and Pages deployment workflow.
- The repository owner confirmed the production URL was live before this customization.
- Fetched the committed `src/App.tsx` after modification and confirmed برج ارغوان appears in the header and the existing week-navigation block now sits after the schedule legend and immediately before the schedule views.
- Confirmed the existing navigation handlers, disabled current-week state, schedule engine, unit rotation, live status, and unit lookup logic were preserved.
- Confirmed `index.html` now uses Arghavan Tower metadata and the static artifact workflow uses `npm ci`.
- The latest pushes trigger repository checks, artifact generation, and Pages deployment; their results and the redeployed browser layout still require confirmation.
- The available connector cannot independently render the GitHub Pages site or expose push-triggered workflow logs.

## Known uncertainties and issues

- The rotation rule is inferred from two screenshots and is assumed to continue indefinitely, as requested.
- The latest workflows must be confirmed after the branding and navigation-layout commits.
- The redeployed page should be checked around 390-pixel and 1440-pixel widths.
- Week navigation remains intentionally unbounded.
- When local storage is blocked, unit selection cannot persist across page reloads.

## Exact next recommended task

After GitHub Pages redeploys, confirm `Repository checks`, `Static site artifact`, and `Deploy GitHub Pages` are green. Open the live site at representative mobile and desktop widths and verify the برج ارغوان header, the week-navigation controls immediately above the schedule, Persian RTL layout, Tehran week behavior, and unit lookup. Record the result and mark the MVP complete if all checks pass. Do not add a backend, admin dashboard, secrets, or manual schedule overrides.
