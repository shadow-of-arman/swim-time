export const UNIT_COUNT = 39 as const
export const TIME_SLOT_COUNT = 8 as const

export const WEEKDAY_KEYS = [
  'saturday',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
] as const

export type WeekdayKey = (typeof WEEKDAY_KEYS)[number]
export type PublicAudience = 'women' | 'men'

export interface TimeRange {
  readonly id: string
  readonly startMinutes: number
  readonly endMinutes: number
  readonly labelFa: string
}

export interface PublicSlotDefinition {
  readonly kind: 'public'
  readonly audience: PublicAudience
}

export interface PrivateSlotDefinition {
  readonly kind: 'private'
  readonly privateSlotIndex: number
}

export interface CleaningSlotDefinition {
  readonly kind: 'cleaning'
}

export type ScheduleSlotDefinition =
  | PublicSlotDefinition
  | PrivateSlotDefinition
  | CleaningSlotDefinition

export interface DayScheduleDefinition {
  readonly key: WeekdayKey
  readonly labelFa: string
  readonly dayIndex: number
  readonly slots: readonly ScheduleSlotDefinition[]
}

export const PUBLIC_AUDIENCE_LABELS_FA: Readonly<
  Record<PublicAudience, string>
> = {
  women: 'بانوان',
  men: 'آقایان',
}

export const TIME_RANGES = [
  {
    id: '08:00-09:30',
    startMinutes: 8 * 60,
    endMinutes: 9 * 60 + 30,
    labelFa: '۸:۰۰ تا ۹:۳۰',
  },
  {
    id: '10:00-11:30',
    startMinutes: 10 * 60,
    endMinutes: 11 * 60 + 30,
    labelFa: '۱۰:۰۰ تا ۱۱:۳۰',
  },
  {
    id: '12:00-13:30',
    startMinutes: 12 * 60,
    endMinutes: 13 * 60 + 30,
    labelFa: '۱۲:۰۰ تا ۱۳:۳۰',
  },
  {
    id: '14:00-15:30',
    startMinutes: 14 * 60,
    endMinutes: 15 * 60 + 30,
    labelFa: '۱۴:۰۰ تا ۱۵:۳۰',
  },
  {
    id: '16:00-17:30',
    startMinutes: 16 * 60,
    endMinutes: 17 * 60 + 30,
    labelFa: '۱۶:۰۰ تا ۱۷:۳۰',
  },
  {
    id: '18:00-19:30',
    startMinutes: 18 * 60,
    endMinutes: 19 * 60 + 30,
    labelFa: '۱۸:۰۰ تا ۱۹:۳۰',
  },
  {
    id: '20:00-21:30',
    startMinutes: 20 * 60,
    endMinutes: 21 * 60 + 30,
    labelFa: '۲۰:۰۰ تا ۲۱:۳۰',
  },
  {
    id: '22:00-23:30',
    startMinutes: 22 * 60,
    endMinutes: 23 * 60 + 30,
    labelFa: '۲۲:۰۰ تا ۲۳:۳۰',
  },
] as const satisfies readonly TimeRange[]

interface PublicSlotBlueprint {
  readonly kind: 'public'
  readonly audience: PublicAudience
}

interface PrivateSlotBlueprint {
  readonly kind: 'private'
}

interface CleaningSlotBlueprint {
  readonly kind: 'cleaning'
}

type SlotBlueprint =
  | PublicSlotBlueprint
  | PrivateSlotBlueprint
  | CleaningSlotBlueprint

interface DayBlueprint {
  readonly key: WeekdayKey
  readonly labelFa: string
  readonly slots: readonly SlotBlueprint[]
}

const publicSlot = (audience: PublicAudience): PublicSlotBlueprint => ({
  kind: 'public',
  audience,
})

const privateSlot = (): PrivateSlotBlueprint => ({ kind: 'private' })
const cleaningSlot = (): CleaningSlotBlueprint => ({ kind: 'cleaning' })

const DAY_BLUEPRINTS = [
  {
    key: 'saturday',
    labelFa: 'شنبه',
    slots: [
      publicSlot('women'),
      publicSlot('men'),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
    ],
  },
  {
    key: 'sunday',
    labelFa: 'یکشنبه',
    slots: [
      publicSlot('men'),
      publicSlot('women'),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      cleaningSlot(),
    ],
  },
  {
    key: 'monday',
    labelFa: 'دوشنبه',
    slots: [
      publicSlot('women'),
      publicSlot('men'),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
    ],
  },
  {
    key: 'tuesday',
    labelFa: 'سه‌شنبه',
    slots: [
      publicSlot('men'),
      publicSlot('women'),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      cleaningSlot(),
    ],
  },
  {
    key: 'wednesday',
    labelFa: 'چهارشنبه',
    slots: [
      publicSlot('women'),
      publicSlot('men'),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
    ],
  },
  {
    key: 'thursday',
    labelFa: 'پنج‌شنبه',
    slots: [
      publicSlot('men'),
      publicSlot('women'),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      cleaningSlot(),
    ],
  },
  {
    key: 'friday',
    labelFa: 'جمعه',
    slots: [
      publicSlot('women'),
      publicSlot('men'),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
      privateSlot(),
    ],
  },
] as const satisfies readonly DayBlueprint[]

function buildWeeklySchedule(
  blueprints: readonly DayBlueprint[],
): readonly DayScheduleDefinition[] {
  let privateSlotIndex = 0

  const schedule = blueprints.map(
    (day, dayIndex): DayScheduleDefinition => ({
      key: day.key,
      labelFa: day.labelFa,
      dayIndex,
      slots: day.slots.map((slot): ScheduleSlotDefinition => {
        switch (slot.kind) {
          case 'public':
            return { kind: 'public', audience: slot.audience }
          case 'cleaning':
            return { kind: 'cleaning' }
          case 'private': {
            const indexedSlot: PrivateSlotDefinition = {
              kind: 'private',
              privateSlotIndex,
            }

            privateSlotIndex += 1
            return indexedSlot
          }
        }
      }),
    }),
  )

  if (privateSlotIndex !== UNIT_COUNT) {
    throw new Error(
      `Expected ${UNIT_COUNT} private slots, but received ${privateSlotIndex}.`,
    )
  }

  return schedule
}

export const WEEKLY_SCHEDULE = buildWeeklySchedule(DAY_BLUEPRINTS)

export function getDaySchedule(
  weekday: WeekdayKey,
): DayScheduleDefinition {
  const day = WEEKLY_SCHEDULE.find((item) => item.key === weekday)

  if (!day) {
    throw new Error(`Unknown weekday: ${weekday}`)
  }

  return day
}
