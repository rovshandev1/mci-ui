import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
    text?: string
    icon?: ReactNode
    iconPosition?: 'left' | 'right'
    size?: 'sm' | 'md' | 'base'
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'tertiary'
    color?: 'blue' | 'yellow'
    darkMode?: boolean
    loading?: boolean
}