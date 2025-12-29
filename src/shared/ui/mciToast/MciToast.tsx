import React, {useEffect, useState, ReactNode} from 'react'
import {cn} from '../../lib/utils'
import {
    CheckCircle,
    CloseCircle,
    DangerCircle,
    InfoCircle,
    Refresh,
} from '@solar-icons/react'
import CloseIcon from '../../../assets/icons/close.svg?react'
import {createRoot, Root} from 'react-dom/client'

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface ToastProps {
    title: string
    description?: string
    type?: ToastType
    duration?: number
    action?: ReactNode
    onClose?: () => void
}

const toastContainer = (() => {
    let el = document.getElementById('mci-toast-container')
    if (!el) {
        el = document.createElement('div')
        el.id = 'mci-toast-container'
        el.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none'
        document.body.appendChild(el)
    }
    return el
})()

let root: Root | null = null
let toastCounter = 0
const activeToasts: { id: number; element: React.ReactElement }[] = []

const renderToasts = () => {
    if (!root) {
        root = createRoot(toastContainer)!
    }

    root.render(
        <div className="flex flex-col gap-3">
            {activeToasts.map(({id, element}) => (
                <div key={id} className="pointer-events-auto">
                    {element}
                </div>
            ))}
        </div>
    )
}

function ToastItem({
                       title,
                       description,
                       type = 'info',
                       duration = 3000,
                       action,
                       onClose,
                   }: ToastProps) {
    const [progress, setProgress] = useState(100)

    useEffect(() => {
        if (duration === Infinity) {
            setProgress(100)
            return
        }

        let start: number | null = null
        const animate = (timestamp: number) => {
            if (!start) start = timestamp
            const elapsed = timestamp - start
            const remaining = Math.max(0, ((duration - elapsed) / duration) * 100)

            setProgress(remaining)

            if (remaining > 0) {
                requestAnimationFrame(animate)
            } else {
                onClose?.()
            }
        }

        const rafId = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(rafId)
    }, [duration, onClose])

    const icons = {
        success: <CheckCircle weight='Bold' className="w-5 h-5"/>,
        error: <CloseCircle weight='Bold' className="w-5 h-5"/>,
        warning: <DangerCircle weight='Bold' className="w-5 h-5"/>,
        info: <InfoCircle weight='Bold' className="w-5 h-5"/>,
        loading: <Refresh weight='Bold' className="w-5 h-5 animate-spin"/>,
    }

    const styles = {
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
    }

    return (
        <div
            className={cn(
                'relative w-[300px] max-w-full overflow-hidden shadow-md rounded-lg',
                'animate-in fade-in slide-in-from-top-2 duration-300',
                styles.bg[type]
            )}
        >
            <div
                className={cn('absolute bottom-0 left-0 h-1', styles.line[type])}
                style={{
                    width: `${progress}%`,
                    transition: 'none',
                }}
            />

            <div className="p-4">
                <div className="flex items-start gap-2">
                    <div className={cn('flex-shrink-0', styles.text[type])}>
                        {icons[type]}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-base font-medium mb-1">{title}</h4>

                        {description && <p className="text-sm text-[#82828C]">{description}</p>}

                        {action && (
                            <div className="mt-3">
                                <div className={cn('underline font-medium text-sm', styles.action[type])}>
                                    {action}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="flex-shrink-0 rounded-full transition  cursor-pointer active:animate-spin"
                    >
                        <CloseIcon className="w-6 h-6 text-slate-base"/>
                    </button>
                </div>
            </div>
        </div>
    )
}

// Global
const showToast = (props: Omit<ToastProps, 'onClose'>) => {
    const id = toastCounter++

    const handleClose = () => {
        const idx = activeToasts.findIndex(t => t?.id === id)
        if (idx !== -1) {
            activeToasts.splice(idx, 1)
            renderToasts()
        }
    }

    const element = <ToastItem {...props} onClose={handleClose}/>
    activeToasts.push({id, element})
    renderToasts()

    if (props.duration !== Infinity) {
        setTimeout(handleClose, (props.duration || 3000) + 300)
    }

    return {close: handleClose}
}

const MciToast = {
    success: (title: string | Omit<ToastProps, 'type'>, desc?: string, action?: ReactNode) =>
        showToast(typeof title === 'string' ? {title, description: desc, type: 'success', action} : {
            ...title,
            type: 'success'
        }),

    error: (title: string | Omit<ToastProps, 'type'>, desc?: string, action?: ReactNode) =>
        showToast(typeof title === 'string' ? {title, description: desc, type: 'error', action} : {
            ...title,
            type: 'error'
        }),

    warning: (title: string | Omit<ToastProps, 'type'>, desc?: string, action?: ReactNode) =>
        showToast(typeof title === 'string' ? {title, description: desc, type: 'warning', action} : {
            ...title,
            type: 'warning'
        }),

    info: (title: string | Omit<ToastProps, 'type'>, desc?: string, action?: ReactNode) =>
        showToast(typeof title === 'string' ? {title, description: desc, type: 'info', action} : {
            ...title,
            type: 'info'
        }),

    loading: (title: string | Omit<ToastProps, 'type'>, desc?: string) =>
        showToast(typeof title === 'string' ? {
            title,
            description: desc,
            type: 'loading',
            duration: Infinity
        } : {...title, type: 'loading', duration: Infinity}),
}

export default MciToast