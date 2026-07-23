import { describe, expect, it } from 'vitest'
import {
  formatRelativeWeekLabelFa,
  getDisplayedWeekSelection,
} from './weekNavigation'

const liveWeekStart = { year: 2026, month: 7, day: 18 }

describe('week navigation', () => {
  it('keeps the live week unchanged at relative offset zero', () => {
    expect(getDisplayedWeekSelection(liveWeekStart, 1, 0)).toEqual({
      relativeWeekOffset: 0,
      weekOffsetFromAnchor: 1,
      weekStart: liveWeekStart,
      labelFa: 'هفته جاری',
      isCurrentWeek: true,
    })
  })

  it('moves to previous and next Saturdays with matching rotation offsets', () => {
    expect(getDisplayedWeekSelection(liveWeekStart, 1, -1)).toEqual({
      relativeWeekOffset: -1,
      weekOffsetFromAnchor: 0,
      weekStart: { year: 2026, month: 7, day: 11 },
      labelFa: 'هفته قبل',
      isCurrentWeek: false,
    })

    expect(getDisplayedWeekSelection(liveWeekStart, 1, 1)).toEqual({
      relativeWeekOffset: 1,
      weekOffsetFromAnchor: 2,
      weekStart: { year: 2026, month: 7, day: 25 },
      labelFa: 'هفته بعد',
      isCurrentWeek: false,
    })
  })

  it('supports navigation across Gregorian month and year boundaries', () => {
    expect(
      getDisplayedWeekSelection({ year: 2026, month: 1, day: 3 }, -26, -1)
        .weekStart,
    ).toEqual({ year: 2025, month: 12, day: 27 })

    expect(
      getDisplayedWeekSelection({ year: 2026, month: 12, day: 26 }, 24, 1)
        .weekStart,
    ).toEqual({ year: 2027, month: 1, day: 2 })
  })

  it('formats larger relative offsets with Persian digits', () => {
    expect(formatRelativeWeekLabelFa(-3)).toBe('۳ هفته قبل')
    expect(formatRelativeWeekLabelFa(4)).toBe('۴ هفته بعد')
  })

  it('rejects fractional offsets', () => {
    expect(() => formatRelativeWeekLabelFa(0.5)).toThrow('must be an integer')
    expect(() =>
      getDisplayedWeekSelection(liveWeekStart, 1, -1.25),
    ).toThrow('must be an integer')
  })
})
