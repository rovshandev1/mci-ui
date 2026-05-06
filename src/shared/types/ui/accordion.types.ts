import type { ReactNode } from 'react'

export type AccordionProps = {
    children: ReactNode
    defaultValue?: boolean
    icon?: ReactNode
    darkMode?: boolean
    className?: string
}
