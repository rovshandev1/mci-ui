import type { ReactNode } from 'react'

export type BreadcrumbItem = {
    label: string
    href?: string
    onClick?: () => void
    icon?: ReactNode
}

export type Variant = 'blue' | 'yellow' | 'orange'

export type MciBreadcrumbProps = {
    items: BreadcrumbItem[]
    variant?: Variant
    darkMode?: boolean
    className?: string
}
