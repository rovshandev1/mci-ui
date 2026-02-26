import type { ReactNode } from 'react'

export interface ModalProps {
    show: boolean
    setShow: (show: boolean) => void
    title?: string
    description?: string
    Header?: ReactNode
    Body?: ReactNode
    footer?: ReactNode
    handleClickOutside?: boolean
    showCloseIcon?: boolean
    showHeader?: boolean
    overlayClassName?: string
    containerClassName?: string
    bodyClassName?: string
    footerClassName?: string
}
