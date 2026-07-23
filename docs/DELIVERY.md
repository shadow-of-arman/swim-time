# Static Delivery and Maintenance

## Scope

This application is a static React, TypeScript, and Vite website. It does not require a backend, database, authentication service, scheduled server task, or manual schedule overrides.

The production output is the complete `dist/` directory created by `npm run build`.

## Automated build artifact

The GitHub Actions workflow named `Static site artifact` runs on pushes to `main` and can also be started manually.

After a successful run:

1. Open the workflow run in GitHub Actions.
2. Download the artifact named `swimming-pool-time-static`.
3. Extract the archive.
4. Upload the contents of the extracted `dist/` directory to the document root of the chosen static host.

The artifact is retained for 14 days. It contains only production files and does not contain source code, credentials, or environment secrets.

## Supported hosting shape

Vite is configured with `base: './'`, so generated JavaScript and CSS references are relative. The same artifact can therefore be hosted:

- at a root domain, such as `https://pool.example.com/`
- under a nested path, such as `https://example.com/pool/`
- on an internal static file server

The application has no client-side routes, so the host does not need SPA fallback rewriting.

## Manual local build

Use Node.js 22 or a later compatible release.

```bash
npm install
npm run lint
npm run typecheck
npm run test:run
npm run build
```

Upload the generated `dist/` directory only after all commands succeed.

Until a verified `package-lock.json` is committed, use `npm install`. After a lockfile is generated and verified, CI and local release instructions should switch to `npm ci`.

## Release checklist

Before replacing the hosted version:

1. Confirm `Repository checks` passes.
2. Confirm `Static site artifact` passes and contains `index.html` plus generated assets.
3. Open the build at a phone-sized viewport around 390 pixels wide.
4. Open the build at a desktop viewport around 1440 pixels wide.
5. Confirm the page direction is RTL and all visible UI text is Persian.
6. Confirm dates and time ranges remain visually ordered.
7. Confirm the displayed week begins on Saturday and matches Tehran time.
8. Select at least one unit and confirm its highlighted period changes while browsing previous and next weeks.
9. Confirm the current-day and active-period states only appear for the live Tehran week.
10. Confirm refreshing the page preserves a valid selected unit when browser storage is available.

## Schedule maintenance

The schedule is generated from the fixed anchor rotation and contains no operator-editable weekly exceptions.

The anchor behavior is covered by automated tests:

- week beginning 2026-07-11 corresponds to 1405/04/20 and begins with unit 39
- week beginning 2026-07-18 corresponds to 1405/04/27 and begins with unit 38

Do not change the anchor date, private-slot order, or rotation formula unless management confirms that the underlying permanent schedule rule has changed. Any such change should include updated tests for both supplied reference weeks and at least one future week.

## Updating dependencies

Dependency updates should be small and reviewed individually.

1. Update dependency versions in `package.json`.
2. Generate or refresh the lockfile in an environment with npm registry access.
3. Run linting, type checking, tests, and the production build.
4. Commit `package.json` and the lockfile together.
5. Confirm both GitHub Actions workflows pass.

Avoid adding runtime dependencies for Jalali dates, timezone handling, or state storage unless the existing platform APIs become insufficient.

## Rollback

Every production release is a static directory. To roll back:

1. Download a previously successful `swimming-pool-time-static` artifact while it is still retained, or rebuild a known-good commit.
2. Replace the host's current files with the known-good `dist/` contents.
3. Clear any host-level cache if the provider uses one.
4. Reload the site and repeat the responsive release checks.

The selected-unit preference is stored only in each visitor's browser and does not require migration during deployment or rollback.

## Final MVP sign-off

The MVP should be marked complete only after:

- both GitHub Actions workflows pass
- a production artifact is hosted or downloaded and inspected
- mobile and desktop RTL rendering is verified in a browser
- the Tehran week, navigation, current-period state, and unit lookup are exercised successfully
- the final hosting location is recorded in this document or the README
