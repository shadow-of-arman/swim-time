import { describe, expect, it } from 'vitest'
import {
  TIME_RANGES,
  TIME_SLOT_COUNT,
  UNIT_COUNT,
  WEEKDAY_KEYS,
  WEEKLY_SCHEDULE,
} from './schedule'

describe('fixed weekly schedule model', () => {
  it('uses seven Saturday-first days and eight time ranges', () => {
    expect(WEEKLY_SCHEDULE.map((day) => day.key)).toEqual(WEEKDAY_KEYS)
    expect(TIME_RANGES).toHaveLength(TIME_SLOT_COUNT)

    for (const day of WEEKLY_SCHEDULE) {
      expect(day.slots).toHaveLength(TIME_SLOT_COUNT)
    }
  })

  it('contains exactly 39 ordered private slots', () => {
    const privateSlotIndexes = WEEKLY_SCHEDULE.flatMap((day) =>
      day.slots.flatMap((slot) =>
        slot.kind === 'private' ? [slot.privateSlotIndex] : [],
      ),
    )

    expect(privateSlotIndexes).toHaveLength(UNIT_COUNT)
    expect(privateSlotIndexes).toEqual(
      Array.from({ length: UNIT_COUNT }, (_, index) => index),
    )
    expect(new Set(privateSlotIndexes).size).toBe(UNIT_COUNT)
  })

  it('places cleaning only in the final slot on Sunday, Tuesday, and Thursday', () => {
    const cleaningSlots = WEEKLY_SCHEDULE.flatMap((day) =>
      day.slots.flatMap((slot, slotIndex) =>
        slot.kind === 'cleaning' ? [{ day: day.key, slotIndex }] : [],
      ),
    )

    expect(cleaningSlots).toEqual([
      { day: 'sunday', slotIndex: 7 },
      { day: 'tuesday', slotIndex: 7 },
      { day: 'thursday', slotIndex: 7 },
    ])
  })

  it('alternates the two public morning periods by day', () => {
    const morningAudiences = WEEKLY_SCHEDULE.map((day) =>
      day.slots.slice(0, 2).map((slot) =>
        slot.kind === 'public' ? slot.audience : slot.kind,
      ),
    )

    expect(morningAudiences).toEqual([
      ['women', 'men'],
      ['men', 'women'],
      ['women', 'men'],
      ['men', 'women'],
      ['women', 'men'],
      ['men', 'women'],
      ['women', 'men'],
    ])
  })

  it('keeps time ranges ordered and non-overlapping', () => {
    for (const [index, timeRange] of TIME_RANGES.entries()) {
      expect(timeRange.startMinutes).toBeLessThan(timeRange.endMinutes)

      const nextRange = TIME_RANGES[index + 1]
      if (nextRange) {
        expect(timeRange.endMinutes).toBeLessThan(nextRange.startMinutes)
      }
    }
  })
})
