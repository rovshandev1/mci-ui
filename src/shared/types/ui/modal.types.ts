import type { ReactNode } from 'react'

export interface ModalProps {
    show: boolean
    setShow: (show: boolean) => void
    variant?: 'default' | 'empty'
    title?: string
    description?: string
    Header?: ReactNode
    Body?: ReactNode
    footer?: ReactNode
    handleClickOutside?: boolean
    showCloseIcon?: boolean
    showHeader?: boolean
    darkMode?: boolean
    overlayClassName?: string
    containerClassName?: string
    headerClassName?: string
    closeButtonClassName?: string
    bodyClassName?: string
    footerClassName?: string
}
