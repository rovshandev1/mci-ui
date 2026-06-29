export type MciTimePickerValue = string | null
export type MciTimePickerMode = 'time' | 'duration'
export type MciTimePickerVariant = 'blue' | 'yellow' | 'orange'
export type MciTimePickerLocale = 'uz' | 'ru' | 'en'

export interface MciTimePickerProps {
    value?: MciTimePickerValue
    onChange?: (value: MciTimePickerValue) => void
    mode?: MciTimePickerMode
    variant?: MciTimePickerVariant
    locale?: MciTimePickerLocale
    placeholder?: string
    label?: string
    darkMode?: boolean
    disabled?: boolean
    required?: boolean
    className?: string
    error?: string
    showClear?: boolean
    allowManualInput?: boolean
    iconPosition?: 'left' | 'right'
    size?: 'sm' | 'md' | 'base'
    minuteStep?: number
    align?: 'left' | 'right' | 'center' | 'auto'
}
