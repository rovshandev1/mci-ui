import type { DateValue } from '../../types/ui/picker.types'

export function toSafeDate(value: DateValue | undefined): Date | null {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

export function normalizeDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function formatDateByPattern(date: Date | null, pattern: string) {
    if (!date) return ''
    const d = date.getDate().toString().padStart(2, '0')
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const y = date.getFullYear().toString()
    return pattern.replace('DD', d).replace('MM', m).replace('YYYY', y)
}

export function parseDateFromInput(value: string) {
    if (!value || value.length !== 10) return null
    const digits = value.replace(/\D/g, '')
    if (digits.length !== 8) return null

    const d = parseInt(digits.slice(0, 2), 10)
    const m = parseInt(digits.slice(2, 4), 10)
    const y = parseInt(digits.slice(4, 8), 10)

    if (y < 1000 || m < 1 || m > 12 || d < 1 || d > 31) return null

    const date = new Date(y, m - 1, d)
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null

    return date
}

export function formatManualDateInput(value: string) {
    let numbers = value.replace(/\D/g, '')
    if (numbers.length > 8) numbers = numbers.slice(0, 8)

    if (numbers.length > 4) {
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(4)}`
    }
    if (numbers.length > 2) {
        return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
    }
    return numbers
}

export function isDateOutsideBounds(date: Date, minDate?: Date, maxDate?: Date) {
    const normalized = normalizeDate(date)
    if (minDate && normalized < normalizeDate(minDate)) return true
    if (maxDate && normalized > normalizeDate(maxDate)) return true
    return false
}

export function shiftMonth(date: Date, offset: number) {
    return new Date(date.getFullYear(), date.getMonth() + offset, 1)
}

export function shiftYear(date: Date, offset: number) {
    return new Date(date.getFullYear() + offset, date.getMonth(), 1)
}

export function getCalendarDays(monthDate: Date) {
    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: Array<{ date: Date; isCurrentMonth: boolean }> = []

    for (let i = firstDay; i > 0; i -= 1) {
        days.push({ date: new Date(year, month, 1 - i), isCurrentMonth: false })
    }
    for (let i = 1; i <= daysInMonth; i += 1) {
        days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i += 1) {
        days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }

    return days
}

export function isSameCalendarDay(a: Date, b: Date) {
    return normalizeDate(a).getTime() === normalizeDate(b).getTime()
}
