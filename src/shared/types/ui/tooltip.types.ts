import type { ReactNode } from 'react'

export type TooltipProps = {
    content: ReactNode
    children: ReactNode
    position?: 'top' | 'bottom' | 'left' | 'right'
    delay?: number
    className?: string
}
