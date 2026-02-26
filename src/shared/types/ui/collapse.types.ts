import type { ReactNode } from 'react'

export type CollapseProps = {
    title: ReactNode | string
    children: ReactNode
    defaultOpen?: boolean
    icon?: ReactNode
    className?: string
    contentClassName?: string
}
