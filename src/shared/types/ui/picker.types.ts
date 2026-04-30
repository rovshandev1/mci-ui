import type { Locale } from '../../lib/locales'

export type DateValue = Date | string | null
export type RangeValue = [DateValue, DateValue]
export type MciPickerValue = DateValue | RangeValue

export interface MciPickerProps {
    type?: 'date' | 'range'
    value?: MciPickerValue
    onChange?: (value: MciPickerValue) => void
    placeholder?: string | [string, string]
    label?: string
    darkMode?: boolean
    disabled?: boolean
    required?: boolean
    className?: string
    format?: string
    minDate?: Date
    maxDate?: Date
    error?: string
    showClear?: boolean
    allowManualInput?: boolean
    locale?: Locale
    startView?: 'day' | 'month' | 'year'
    iconPosition?: 'left' | 'right'
    align?: 'left' | 'right' | 'center' | 'auto'
}
