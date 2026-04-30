import type { ReactNode } from 'react'

export type ButtonProps = {
    children?: ReactNode
    text?: string
    icon?: ReactNode
    iconPosition?: 'left' | 'right'
    size?: 'sm' | 'md' | 'base'
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'tertiary'
    color?: 'blue' | 'yellow'
    darkMode?: boolean
    loading?: boolean
    disabled?: boolean
    onClick?: () => void
    className?: string
    type?: 'button' | 'submit' | 'reset'
}
