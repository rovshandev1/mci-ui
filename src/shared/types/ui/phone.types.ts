export type PhoneInputProps = {
    label?: string
    placeholder?: string
    size?: 'sm' | 'md' | 'base'
    darkMode?: boolean
    error?: string
    disabled?: boolean
    required?: boolean
    value?: string
    onChange?: (value: string) => void
    onFocus?: () => void
    onBlur?: () => void
    className?: string
    name?: string
    showIcon?: boolean
}
