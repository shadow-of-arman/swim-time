# Swimming Pool Time

A small Persian-first website for showing the apartment swimming-pool schedule. The website must be fully usable in Persian, follow RTL layout conventions, use Tehran time, and calculate the correct weekly rotation automatically every Saturday.

## Product requirements

- All visible UI text must be Persian.
- The document root must use `lang="fa"` and `dir="rtl"`.
- Numeric dates and time ranges must remain visually ordered inside RTL layouts.
- The week starts on Saturday.
- The current schedule must be calculated using `Asia/Tehran`, regardless of the visitor's device timezone.
- The website should be simple, reliable, responsive, and slightly polished, not portfolio-oriented.
- The 39 apartment units rotate by one available unit slot each week.
- Sunday, Tuesday, and Thursday end with a cleaning slot.
- Manual schedule overrides must be possible through configuration.

## Current status

**Phase:** Repository initialized for scheduled implementation.

### Completed

- [x] Confirmed the repository is empty and writable.
- [x] Documented the inferred weekly schedule rotation.
- [x] Defined the implementation phases and handoff process.

### Remaining

- [ ] Initialize the React, TypeScript, and Vite project.
- [ ] Implement Tehran-time and Saturday-week calculations.
- [ ] Implement the 39-unit rotation engine.
- [ ] Add Jalali date formatting and Persian digit formatting.
- [ ] Build the Persian RTL responsive interface.
- [ ] Add current-period and next-period highlighting.
- [ ] Add unit lookup with local persistence.
- [ ] Add previous/current/next week navigation.
- [ ] Add manual override configuration.
- [ ] Add tests matching the two supplied schedule screenshots.
- [ ] Add GitHub Actions for build and tests.
- [ ] Add deployment configuration and final documentation.

## Scheduled-run protocol

Every scheduled implementation run must:

1. Read `README.md` and every file in `docs/` before making changes.
2. Inspect the latest repository state and recent commits.
3. Select the next small, coherent unfinished task from `docs/IMPLEMENTATION_PLAN.md`.
4. Implement and verify that task directly in this repository.
5. Avoid large rewrites or unnecessary visual complexity.
6. Update this README's **Completed** and **Remaining** lists.
7. Append a dated entry to `docs/RUN_LOG.md` describing changes, verification, decisions, and remaining work.
8. Update `docs/HANDOFF.md` with the current architecture, known issues, and exact next recommended task.
9. Commit all related changes with a clear commit message.
10. Stop when the MVP is complete and verified; future runs should only fix documented defects or improve reliability.

## Schedule reference

The supplied screenshots establish these anchor weeks:

- Saturday 1405/04/20: first unit slot is unit 39, followed by units 1 through 38.
- Saturday 1405/04/27: first unit slot is unit 38, followed by unit 39, then units 1 through 37.

This implies that each Saturday all units move forward by one available unit slot, with wrapping across units 1 through 39.

See `docs/` for the full implementation plan, schedule model, and chronological run log.
