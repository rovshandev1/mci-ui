import type { TextareaHTMLAttributes } from 'react'

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'className'> & {
    label?: string
    darkMode?: boolean
    onChange?: (value: string) => void
    error?: string
    className?: string
}
