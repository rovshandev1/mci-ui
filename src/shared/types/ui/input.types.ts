import type { InputHTMLAttributes, ReactNode } from 'react'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'className'> & {
    label?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'tel'
    icon?: ReactNode
    rightIcon?: ReactNode
    iconPosition?: 'left' | 'right'
    size?: 'sm' | 'md' | 'base'
    darkMode?: boolean
    error?: string
    onClear?: () => void
    showClearButton?: boolean
    className?: string
}
