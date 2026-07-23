import { SCHEDULE_OVERRIDES } from '../config/scheduleOverrides'
import {
  UNIT_COUNT,
  WEEKLY_SCHEDULE,
  type CleaningSlotDefinition,
  type DayScheduleDefinition,
  type PrivateSlotDefinition,
  type PublicSlotDefinition,
  type ScheduleSlotDefinition,
} from './schedule'
import { applyScheduleOverrides } from './scheduleOverrides'
import {
  addCalendarDays,
  ANCHOR_SATURDAY,
  DAYS_PER_WEEK,
  getWeekOffsetFromAnchor,
} from './tehranTime'

export interface ResolvedPrivateSlotDefinition
  extends PrivateSlotDefinition {
  readonly unitNumber: number
}

export type ResolvedScheduleSlotDefinition =
  | PublicSlotDefinition
  | ResolvedPrivateSlotDefinition
  | CleaningSlotDefinition

export interface ResolvedDayScheduleDefinition
  extends Omit<DayScheduleDefinition, 'slots'> {
  readonly slots: readonly ResolvedScheduleSlotDefinition[]
}

export interface ResolvedWeeklySchedule {
  readonly weekOffset: number
  readonly days: readonly ResolvedDayScheduleDefinition[]
}

export function positiveModulo(value: number, divisor: number): number {
  if (!Number.isInteger(value)) {
    throw new Error(`Modulo value must be an integer: ${value}`)
  }

  if (!Number.isInteger(divisor) || divisor <= 0) {
    throw new Error(`Modulo divisor must be a positive integer: ${divisor}`)
  }

  return ((value % divisor) + divisor) % divisor
}

export function getUnitNumberForPrivateSlot(
  privateSlotIndex: number,
  weekOffset: number,
): number {
  if (
    !Number.isInteger(privateSlotIndex) ||
    privateSlotIndex < 0 ||
    privateSlotIndex >= UNIT_COUNT
  ) {
    throw new Error(
      `Private slot index must be between 0 and ${UNIT_COUNT - 1}: ${privateSlotIndex}`,
    )
  }

  if (!Number.isInteger(weekOffset)) {
    throw new Error(`Week offset must be an integer: ${weekOffset}`)
  }

  return positiveModulo(privateSlotIndex - weekOffset - 1, UNIT_COUNT) + 1
}

function resolveSlot(
  slot: ScheduleSlotDefinition,
  weekOffset: number,
): ResolvedScheduleSlotDefinition {
  if (slot.kind !== 'private') {
    return slot
  }

  return {
    ...slot,
    unitNumber: getUnitNumberForPrivateSlot(
      slot.privateSlotIndex,
      weekOffset,
    ),
  }
}

function generateWeeklySchedule(weekOffset: number): ResolvedWeeklySchedule {
  return {
    weekOffset,
    days: WEEKLY_SCHEDULE.map(
      (day): ResolvedDayScheduleDefinition => ({
        ...day,
        slots: day.slots.map((slot) => resolveSlot(slot, weekOffset)),
      }),
    ),
  }
}

export function resolveWeeklySchedule(
  weekOffset: number,
): ResolvedWeeklySchedule {
  if (!Number.isInteger(weekOffset)) {
    throw new Error(`Week offset must be an integer: ${weekOffset}`)
  }

  const generatedSchedule = generateWeeklySchedule(weekOffset)
  const weekStart = addCalendarDays(
    ANCHOR_SATURDAY,
    weekOffset * DAYS_PER_WEEK,
  )

  return applyScheduleOverrides(
    weekStart,
    generatedSchedule,
    SCHEDULE_OVERRIDES,
  )
}

export function resolveWeeklyScheduleForDate(
  date: Date,
): ResolvedWeeklySchedule {
  return resolveWeeklySchedule(getWeekOffsetFromAnchor(date))
}

export function getPrivateUnitSequence(
  schedule: ResolvedWeeklySchedule,
): readonly number[] {
  return schedule.days.flatMap((day) =>
    day.slots.flatMap((slot) =>
      slot.kind === 'private' ? [slot.unitNumber] : [],
    ),
  )
}
