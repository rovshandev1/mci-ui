import type { ReactNode } from 'react'

export type CollapseProps = {
    title: ReactNode | string
    children: ReactNode
    defaultOpen?: boolean
    icon?: ReactNode
    darkMode?: boolean
    className?: string
    contentClassName?: string
}
