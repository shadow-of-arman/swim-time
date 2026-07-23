import { describe, expect, it } from 'vitest'
import { resolveWeeklySchedule } from './resolvedSchedule'
import {
  getDisplayedWeekStatus,
  isSchedulePosition,
} from './scheduleStatus'
import { ANCHOR_SATURDAY } from './tehranTime'

const anchorSchedule = resolveWeeklySchedule(0)

describe('displayed week status', () => {
  it('shows the first period as next before opening', () => {
    const status = getDisplayedWeekStatus(
      new Date('2026-07-11T03:30:00.000Z'),
      ANCHOR_SATURDAY,
      anchorSchedule,
    )

    expect(status.isCurrentWeek).toBe(true)
    expect(status.currentDayIndex).toBe(0)
    expect(status.activeSlot).toBeNull()
    expect(status.nextSlot?.dayIndex).toBe(0)
    expect(status.nextSlot?.slotIndex).toBe(0)
    expect(status.nextSlot?.slot).toEqual({
      kind: 'public',
      audience: 'women',
    })
  })

  it('identifies an active period and the following period', () => {
    const status = getDisplayedWeekStatus(
      new Date('2026-07-11T04:45:00.000Z'),
      ANCHOR_SATURDAY,
      anchorSchedule,
    )

    expect(isSchedulePosition(status.activeSlot, 0, 0)).toBe(true)
    expect(isSchedulePosition(status.nextSlot, 0, 1)).toBe(true)
    expect(status.activeSlot?.timeRange.id).toBe('08:00-09:30')
    expect(status.nextSlot?.timeRange.id).toBe('10:00-11:30')
  })

  it('returns no active period during a gap and keeps the next start time', () => {
    const status = getDisplayedWeekStatus(
      new Date('2026-07-11T06:15:00.000Z'),
      ANCHOR_SATURDAY,
      anchorSchedule,
    )

    expect(status.activeSlot).toBeNull()
    expect(isSchedulePosition(status.nextSlot, 0, 1)).toBe(true)
  })

  it('moves the next period to the following day after closing', () => {
    const status = getDisplayedWeekStatus(
      new Date('2026-07-11T20:15:00.000Z'),
      ANCHOR_SATURDAY,
      anchorSchedule,
    )

    expect(status.activeSlot).toBeNull()
    expect(isSchedulePosition(status.nextSlot, 1, 0)).toBe(true)
    expect(status.nextSlot?.slot).toEqual({
      kind: 'public',
      audience: 'men',
    })
  })

  it('treats the final Sunday period as an active cleaning period', () => {
    const status = getDisplayedWeekStatus(
      new Date('2026-07-12T18:45:00.000Z'),
      ANCHOR_SATURDAY,
      anchorSchedule,
    )

    expect(isSchedulePosition(status.activeSlot, 1, 7)).toBe(true)
    expect(status.activeSlot?.slot.kind).toBe('cleaning')
    expect(isSchedulePosition(status.nextSlot, 2, 0)).toBe(true)
  })

  it('returns no remaining period after the final Friday slot', () => {
    const status = getDisplayedWeekStatus(
      new Date('2026-07-17T20:15:00.000Z'),
      ANCHOR_SATURDAY,
      anchorSchedule,
    )

    expect(status.currentDayIndex).toBe(6)
    expect(status.activeSlot).toBeNull()
    expect(status.nextSlot).toBeNull()
  })

  it('does not highlight dates outside the displayed week', () => {
    const status = getDisplayedWeekStatus(
      new Date('2026-07-18T04:30:00.000Z'),
      ANCHOR_SATURDAY,
      anchorSchedule,
    )

    expect(status).toEqual({
      isCurrentWeek: false,
      currentDayIndex: null,
      activeSlot: null,
      nextSlot: null,
    })
  })

  it('rejects a displayed week that does not begin on Saturday', () => {
    expect(() =>
      getDisplayedWeekStatus(
        new Date('2026-07-11T04:45:00.000Z'),
        { year: 2026, month: 7, day: 12 },
        anchorSchedule,
      ),
    ).toThrow('must begin on Saturday')
  })
})
