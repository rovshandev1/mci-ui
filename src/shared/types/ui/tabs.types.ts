import type { ReactNode } from 'react'

export type Tab = {
    id: string
    label: string
    icon?: ReactNode
    content: ReactNode
    disabled?: boolean
}

export type TabsProps = {
    tabs: Tab[]
    defaultTab?: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    className?: string
    tabListClassName?: string
    contentClassName?: string
    extra?: ReactNode
    onChange?: (tabId: string | number) => void
}
