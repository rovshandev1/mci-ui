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
        warning: 'bg-yellow-50',
        info: 'bg-blue-50',
        loading: 'bg-slate-50',
    },
    bgDark: {
        success: 'bg-green-950',
        error: 'bg-red-950',
        warning: 'bg-yellow-900',
        info: 'bg-blue-900',
        loading: 'bg-slate-900',
    },
    line: {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600',
        info: 'bg-blue-600',
        loading: 'bg-slate-600',
    },
    lineDark: {
        success: 'bg-green-400',
        error: 'bg-red-400',
        warning: 'bg-yellow-400',
        info: 'bg-blue-400',
        loading: 'bg-slate-400',
    },
    text: {
        success: 'text-green-600',
        error: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600',
        loading: 'text-slate-600',
    },
    textDark: {
        success: 'text-green-400',
        error: 'text-red-400',
        warning: 'text-yellow-400',
        info: 'text-blue-400',
        loading: 'text-slate-400',
    },
    action: {
        success: 'text-green-600',
        error: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600',
        loading: 'text-slate-600',
    },
    actionDark: {
        success: 'text-green-400',
        error: 'text-red-400',
        warning: 'text-yellow-400',
        info: 'text-blue-400',
        loading: 'text-slate-400',
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
