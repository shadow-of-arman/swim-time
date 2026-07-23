# Handoff

## Current state

The repository has been initialized with planning and continuity documentation. Application code has not yet been created.

## Confirmed decisions

- The website is Persian-first and fully RTL.
- Weeks begin on Saturday.
- Schedule calculations use `Asia/Tehran` rather than the visitor's local timezone.
- The MVP is a static React and TypeScript application built with Vite.
- The weekly schedule is generated from an anchor week and a 39-unit rotation.
- The visual design should be simple, readable, responsive, and slightly polished.
- Public-facing UI text must be Persian.
- A backend and admin dashboard are out of scope for the MVP.

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

## Known uncertainties

Two screenshots establish the rotation pattern but cannot prove whether management occasionally changes the schedule manually. The implementation should therefore include configuration-based overrides.

## Exact next recommended task

Initialize a minimal Vite React TypeScript application on `main`, including package scripts, TypeScript configuration, `lang="fa"`, `dir="rtl"`, and a basic Persian placeholder page. Verify that the initial structure is internally consistent, then update all project documentation.
