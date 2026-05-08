import type { ReactNode } from 'react'

export type Tab = {
    id: string
    label: string
    icon?: ReactNode
    content?: ReactNode
    disabled?: boolean
}

export type TabsVariant = 'filled' | 'outlined'

export type TabsColor = 'blue' | 'yellow' | 'orange'

export type TabsPosition = 'top' | 'bottom' | 'left' | 'right'

export type TabsProps = {
    tabs: Tab[]
    variant?: TabsVariant
    color?: TabsColor
    defaultTab?: string
    position?: TabsPosition
    darkMode?: boolean
    className?: string
    tabListClassName?: string
    tabClassName?: string
    contentClassName?: string
    extra?: ReactNode
    onChange?: (tabId: string | number) => void
}
