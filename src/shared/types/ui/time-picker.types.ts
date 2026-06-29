export type MciTimePickerValue = string | null
export type MciTimePickerMode = 'time' | 'minute'

export interface MciTimePickerProps {
    value?: MciTimePickerValue
    onChange?: (value: MciTimePickerValue) => void
    mode?: MciTimePickerMode
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
