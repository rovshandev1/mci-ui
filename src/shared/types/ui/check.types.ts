import type { InputHTMLAttributes } from 'react'

export type MciCheckProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> & {
    type?: 'checkbox' | 'radio'
    label?: string
    supportText?: string
    error?: string
    variant?: 'blue' | 'yellow' | 'orange'
    darkMode?: boolean
    className?: string
}
