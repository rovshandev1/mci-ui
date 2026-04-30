import type { ReactNode } from 'react'

export type TagProps = {
    children: ReactNode
    variant?: 'success' | 'warning' | 'error' | 'gray' | 'blue'
    size?: 'sm' | 'md' | 'lg'
    darkMode?: boolean
    icon?: ReactNode
    iconPosition?: 'left' | 'right'
    rounded?: boolean
    className?: string
}
