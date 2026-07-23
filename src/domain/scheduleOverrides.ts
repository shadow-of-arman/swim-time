import { TIME_RANGES, UNIT_COUNT } from './schedule'
import {
  type ResolvedScheduleSlotDefinition,
  type ResolvedWeeklySchedule,
} from './resolvedSchedule'
import {
  calendarDateToUtcMilliseconds,
  type CalendarDate,
} from './tehranTime'

export interface ScheduleSlotOverride {
  readonly dayIndex: number
  readonly slotIndex: number
  readonly replacement: ResolvedScheduleSlotDefinition
}

export type ScheduleOverrideConfiguration = Readonly<
  Record<string, readonly ScheduleSlotOverride[]>
>

const GREGORIAN_DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export function formatGregorianDateKey(date: CalendarDate): string {
  calendarDateToUtcMilliseconds(date)
  return [date.year, date.month, date.day]
    .map((value, index) =>
      index === 0 ? String(value).padStart(4, '0') : String(value).padStart(2, '0'),
    )
    .join('-')
}

function parseWeekKey(key: string): CalendarDate {
  const match = GREGORIAN_DATE_KEY_PATTERN.exec(key)

  if (!match) {
    throw new Error(`Override week key must use YYYY-MM-DD: ${key}`)
  }

  const date: CalendarDate = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
  const timestamp = calendarDateToUtcMilliseconds(date)

  if (new Date(timestamp).getUTCDay() !== 6) {
    throw new Error(`Override week key must be a Saturday: ${key}`)
  }

  return date
}

function validateSlotOverride(
  override: ScheduleSlotOverride,
  schedule: ResolvedWeeklySchedule,
): void {
  if (
    !Number.isInteger(override.dayIndex) ||
    override.dayIndex < 0 ||
    override.dayIndex >= schedule.days.length
  ) {
    throw new Error(`Override day index is out of range: ${override.dayIndex}`)
  }

  const day = schedule.days[override.dayIndex]

  if (
    !Number.isInteger(override.slotIndex) ||
    override.slotIndex < 0 ||
    override.slotIndex >= TIME_RANGES.length ||
    override.slotIndex >= day.slots.length
  ) {
    throw new Error(`Override slot index is out of range: ${override.slotIndex}`)
  }

  const replacement = override.replacement

  if (
    replacement.kind === 'private' &&
    (!Number.isInteger(replacement.unitNumber) ||
      replacement.unitNumber < 1 ||
      replacement.unitNumber > UNIT_COUNT)
  ) {
    throw new Error(
      `Override unit number must be between 1 and ${UNIT_COUNT}: ${replacement.unitNumber}`,
    )
  }
}

function validatePrivateUnitInvariant(schedule: ResolvedWeeklySchedule): void {
  const unitNumbers = schedule.days.flatMap((day) =>
    day.slots.flatMap((slot) =>
      slot.kind === 'private' ? [slot.unitNumber] : [],
    ),
  )

  if (unitNumbers.length !== UNIT_COUNT) {
    throw new Error(
      `Overridden schedule must contain exactly ${UNIT_COUNT} private unit slots; received ${unitNumbers.length}.`,
    )
  }

  const sortedUnits = [...unitNumbers].sort((left, right) => left - right)

  for (let index = 0; index < UNIT_COUNT; index += 1) {
    const expectedUnit = index + 1

    if (sortedUnits[index] !== expectedUnit) {
      throw new Error(
        `Overridden schedule must contain every unit from 1 through ${UNIT_COUNT} exactly once.`,
      )
    }
  }
}

export function applyScheduleOverrides(
  weekStart: CalendarDate,
  schedule: ResolvedWeeklySchedule,
  configuration: ScheduleOverrideConfiguration,
): ResolvedWeeklySchedule {
  const requestedKey = formatGregorianDateKey(weekStart)

  for (const key of Object.keys(configuration)) {
    parseWeekKey(key)
  }

  const overrides = configuration[requestedKey]

  if (!overrides || overrides.length === 0) {
    return schedule
  }

  const seenPositions = new Set<string>()
  const mutableSlots = schedule.days.map((day) => [...day.slots])

  for (const override of overrides) {
    validateSlotOverride(override, schedule)

    const positionKey = `${override.dayIndex}:${override.slotIndex}`

    if (seenPositions.has(positionKey)) {
      throw new Error(`Duplicate override position: ${positionKey}`)
    }

    seenPositions.add(positionKey)
    mutableSlots[override.dayIndex][override.slotIndex] = override.replacement
  }

  const overriddenSchedule: ResolvedWeeklySchedule = {
    ...schedule,
    days: schedule.days.map((day, dayIndex) => ({
      ...day,
      slots: mutableSlots[dayIndex],
    })),
  }

  validatePrivateUnitInvariant(overriddenSchedule)
  return overriddenSchedule
}
