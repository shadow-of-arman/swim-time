import { WEEKLY_SCHEDULE, type WeekdayKey } from './schedule'
import {
  addCalendarDays,
  calendarDateToUtcMilliseconds,
  type CalendarDate,
} from './tehranTime'

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

const persianNumericDateFormatter = new Intl.DateTimeFormat(
  'fa-IR-u-ca-persian-nu-latn',
  {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  },
)

const persianMonthFormatter = new Intl.DateTimeFormat(
  'fa-IR-u-ca-persian-nu-latn',
  {
    timeZone: 'UTC',
    month: 'long',
  },
)

export interface PersianCalendarDateParts {
  readonly year: number
  readonly month: number
  readonly day: number
  readonly monthNameFa: string
  readonly weekday: WeekdayKey
  readonly weekdayLabelFa: string
}

function calendarDateToUtcDate(date: CalendarDate): Date {
  return new Date(calendarDateToUtcMilliseconds(date))
}

function readNumericPart(
  parts: readonly Intl.DateTimeFormatPart[],
  type: 'year' | 'month' | 'day',
): number {
  const value = parts.find((part) => part.type === type)?.value

  if (!value) {
    throw new Error(`Missing ${type} in Persian calendar formatting result.`)
  }

  const number = Number(value)

  if (!Number.isInteger(number)) {
    throw new Error(
      `Invalid ${type} in Persian calendar formatting result: ${value}`,
    )
  }

  return number
}

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9٠-٩]/g, (digit) => {
    const asciiIndex = digit.charCodeAt(0) - '0'.charCodeAt(0)

    if (asciiIndex >= 0 && asciiIndex <= 9) {
      return PERSIAN_DIGITS[asciiIndex]
    }

    const arabicIndicIndex = ARABIC_INDIC_DIGITS.indexOf(digit)
    return PERSIAN_DIGITS[arabicIndicIndex]
  })
}

export function getPersianCalendarDateParts(
  date: CalendarDate,
): PersianCalendarDateParts {
  const utcDate = calendarDateToUtcDate(date)
  const numericParts = persianNumericDateFormatter.formatToParts(utcDate)
  const javaScriptWeekday = utcDate.getUTCDay()
  const weekdayIndex = (javaScriptWeekday + 1) % WEEKLY_SCHEDULE.length
  const weekdayDefinition = WEEKLY_SCHEDULE[weekdayIndex]

  return {
    year: readNumericPart(numericParts, 'year'),
    month: readNumericPart(numericParts, 'month'),
    day: readNumericPart(numericParts, 'day'),
    monthNameFa: persianMonthFormatter.format(utcDate),
    weekday: weekdayDefinition.key,
    weekdayLabelFa: weekdayDefinition.labelFa,
  }
}

export function formatJalaliNumeric(date: CalendarDate): string {
  const parts = getPersianCalendarDateParts(date)
  const month = String(parts.month).padStart(2, '0')
  const day = String(parts.day).padStart(2, '0')

  return toPersianDigits(`${parts.year}/${month}/${day}`)
}

export function formatJalaliConcise(date: CalendarDate): string {
  const parts = getPersianCalendarDateParts(date)

  return `${toPersianDigits(parts.day)} ${parts.monthNameFa} ${toPersianDigits(parts.year)}`
}

export function formatJalaliFull(date: CalendarDate): string {
  const parts = getPersianCalendarDateParts(date)

  return `${parts.weekdayLabelFa} ${toPersianDigits(parts.day)} ${parts.monthNameFa} ${toPersianDigits(parts.year)}`
}

export function formatJalaliWeekRange(saturday: CalendarDate): string {
  const saturdayDate = calendarDateToUtcDate(saturday)

  if (saturdayDate.getUTCDay() !== 6) {
    throw new Error('A weekly schedule range must begin on Saturday.')
  }

  const friday = addCalendarDays(saturday, 6)
  const start = getPersianCalendarDateParts(saturday)
  const end = getPersianCalendarDateParts(friday)
  const startDay = toPersianDigits(start.day)
  const endDay = toPersianDigits(end.day)
  const startYear = toPersianDigits(start.year)
  const endYear = toPersianDigits(end.year)

  if (start.year === end.year && start.month === end.month) {
    return `${startDay} تا ${endDay} ${start.monthNameFa} ${startYear}`
  }

  if (start.year === end.year) {
    return `${startDay} ${start.monthNameFa} تا ${endDay} ${end.monthNameFa} ${startYear}`
  }

  return `${startDay} ${start.monthNameFa} ${startYear} تا ${endDay} ${end.monthNameFa} ${endYear}`
}
