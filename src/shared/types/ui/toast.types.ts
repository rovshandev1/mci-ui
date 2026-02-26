import type { ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface ToastProps {
    title: string
    description?: string
    type?: ToastType
    duration?: number
    action?: ReactNode
    onClose?: () => void
}
