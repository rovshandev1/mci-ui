import type { ReactNode } from 'react'

export interface DrawerProps {
    isOpen: boolean
    onClose: () => void
    position?: 'left' | 'right'
    children?: ReactNode
    footer?: ReactNode
    title?: string
    description?: string
    showCloseButton?: boolean
    drawerClassName?: string
    contentClassName?: string
    footerClassName?: string
    closeOnOverlayClick?: boolean
    closeOnEscape?: boolean
    width?: string | number
    darkMode?: boolean
    variant?: 'blue' | 'yellow' | 'orange' | 'amber'
}
