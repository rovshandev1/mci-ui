import type { ButtonHTMLAttributes } from 'react'

export type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type' | 'className' | 'onChange'> & {
    checked?: boolean
    onChange?: (checked: boolean) => void
    variant?: 'blue' | 'yellow'
    darkMode?: boolean
    label?: string
    supportText?: string
    className?: string
}