import type { ChangeEvent } from 'react'

export type MciCheckProps = {
    type?: 'checkbox' | 'radio'
    label?: string
    supportText?: string
    checked?: boolean
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    error?: string
    disabled?: boolean
    required?: boolean
    className?: string
    variant?: 'blue' | 'yellow'
    darkMode?: boolean
    name?: string
    value?: string
}
