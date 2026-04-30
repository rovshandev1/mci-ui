import type { ChangeEvent, ReactNode } from 'react'

export type InputProps = {
    label?: string
    placeholder?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'tel'
    icon?: ReactNode
    rightIcon?: ReactNode
    iconPosition?: 'left' | 'right'
    size?: 'sm' | 'md' | 'base'
    darkMode?: boolean
    error?: string
    disabled?: boolean
    required?: boolean
    value?: string
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    onFocus?: () => void
    onBlur?: () => void
    className?: string
    name?: string
    readOnly?: boolean
    maxLength?: number
    onClear?: () => void
    showClearButton?: boolean
    step?: string | number
    autoComplete?: string
}
