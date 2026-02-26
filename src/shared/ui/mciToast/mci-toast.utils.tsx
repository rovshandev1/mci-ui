import {
    CheckCircle,
    CloseCircle,
    DangerCircle,
    InfoCircle,
    Refresh,
} from '@solar-icons/react'
import type { ReactNode } from 'react'
import type { ToastType } from '../../types/ui/toast.types'

export const TOAST_ICONS: Record<ToastType, ReactNode> = {
    success: <CheckCircle weight="Bold" className="w-5 h-5" />,
    error: <CloseCircle weight="Bold" className="w-5 h-5" />,
    warning: <DangerCircle weight="Bold" className="w-5 h-5" />,
    info: <InfoCircle weight="Bold" className="w-5 h-5" />,
    loading: <Refresh weight="Bold" className="w-5 h-5 animate-spin" />,
}

export const TOAST_STYLES = {
    bg: {
        success: 'bg-green-50',
        error: 'bg-red-50',
        warning: 'bg-orange-50',
        info: 'bg-blue-50',
        loading: 'bg-slate-50',
    },
    line: {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-orange-600',
        info: 'bg-blue-600',
        loading: 'bg-slate-600',
    },
    text: {
        success: 'text-green-600',
        error: 'text-red-600',
        warning: 'text-orange-600',
        info: 'text-blue-600',
        loading: 'text-slate-600',
    },
    action: {
        success: 'text-green-600',
        error: 'text-red-600',
        warning: 'text-orange-600',
        info: 'text-blue-600',
        loading: 'text-slate-600',
    },
} as const

export function getOrCreateToastContainer() {
    let el = document.getElementById('mci-toast-container')
    if (!el) {
        el = document.createElement('div')
        el.id = 'mci-toast-container'
        el.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none'
        document.body.appendChild(el)
    }
    return el
}
