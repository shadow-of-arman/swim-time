import { toPersianDigits } from './persianFormatting'
import {
  addCalendarDays,
  DAYS_PER_WEEK,
  type CalendarDate,
} from './tehranTime'

export interface DisplayedWeekSelection {
  readonly relativeWeekOffset: number
  readonly weekOffsetFromAnchor: number
  readonly weekStart: CalendarDate
  readonly labelFa: string
  readonly isCurrentWeek: boolean
}

function assertInteger(value: number, name: string): void {
  if (!Number.isInteger(value)) {
    throw new Error(`${name} must be an integer: ${value}`)
  }
}

export function formatRelativeWeekLabelFa(relativeWeekOffset: number): string {
  assertInteger(relativeWeekOffset, 'Relative week offset')

  if (relativeWeekOffset === 0) {
    return 'هفته جاری'
  }

  if (relativeWeekOffset === -1) {
    return 'هفته قبل'
  }

  if (relativeWeekOffset === 1) {
    return 'هفته بعد'
  }

  const distance = toPersianDigits(Math.abs(relativeWeekOffset))
  return relativeWeekOffset < 0
    ? `${distance} هفته قبل`
    : `${distance} هفته بعد`
}

export function getDisplayedWeekSelection(
  liveWeekStart: CalendarDate,
  liveWeekOffsetFromAnchor: number,
  relativeWeekOffset: number,
): DisplayedWeekSelection {
  assertInteger(liveWeekOffsetFromAnchor, 'Live week offset')
  assertInteger(relativeWeekOffset, 'Relative week offset')

  return {
    relativeWeekOffset,
    weekOffsetFromAnchor: liveWeekOffsetFromAnchor + relativeWeekOffset,
    weekStart: addCalendarDays(
      liveWeekStart,
      relativeWeekOffset * DAYS_PER_WEEK,
    ),
    labelFa: formatRelativeWeekLabelFa(relativeWeekOffset),
    isCurrentWeek: relativeWeekOffset === 0,
  }
}
