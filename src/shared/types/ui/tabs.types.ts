import type { ReactNode } from 'react'

export type Tab = {
    id: string
    label: string
    icon?: ReactNode
    content?: ReactNode
    disabled?: boolean
}

export type TabsProps = {
    tabs: Tab[]
    variant?: 'filled' | 'outlined'
    color?: 'blue' | 'yellow' | 'orange'
    defaultTab?: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    darkMode?: boolean
    className?: string
    tabListClassName?: string
    tabClassName?: string
    contentClassName?: string
    extra?: ReactNode
    onChange?: (tabId: string | number) => void
}
