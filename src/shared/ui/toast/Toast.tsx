import {JSX, useEffect, useState} from 'react'
import {AlertCircle, CheckCircle2, Info, Loader2, XCircle} from 'lucide-react'
import {cn} from '../../lib/utils'
import {createRoot} from 'react-dom/client'

type ToastProps = {
    title: string
    description?: string
    type?: 'success' | 'error' | 'warning' | 'info' | 'loading'
    duration?: number
}

type ToastConfig = Omit<ToastProps, 'type'>

const toastRoot = (() => {
    let rootElement = document.getElementById('toast-root')
    if (!rootElement) {
        rootElement = document.createElement('div')
        rootElement.id = 'toast-root'
        document.body.appendChild(rootElement)
    }
    return createRoot(rootElement)
})()

const toasts: { id: number; element: JSX.Element }[] = []
let toastCounter = 0

function Toast({title, description, type = 'info', duration = 5000}: ToastProps) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        if (duration === Infinity) return
        const timer = setTimeout(() => setIsVisible(false), duration)
        return () => clearTimeout(timer)
    }, [duration])

    const icons = {
        success: <CheckCircle2 className="w-5 h-5"/>,
        error: <XCircle className="w-5 h-5"/>,
        warning: <AlertCircle className="w-5 h-5"/>,
        info: <Info className="w-5 h-5"/>,
        loading: <Loader2 className="w-5 h-5 animate-spin"/>,
    }

    const variantStyles = {
        success: 'bg-success-50 border-success-200 text-success-800',
        error: 'bg-error-50 border-error-200 text-error-800',
        warning: 'bg-secondary-50 border-secondary-200 text-secondary-800',
        info: 'bg-info-50 border-info-200 text-info-800',
        loading: 'bg-gray-50 border-gray-200 text-gray-800',
    }

    const iconColors = {
        success: 'text-success-600',
        error: 'text-error-600',
        warning: 'text-secondary-600',
        info: 'text-info-600',
        loading: 'text-gray-600',
    }

    if (!isVisible) return null

    return (
        <div
            className={cn(
                'absolute z-60 max-w-sm p-4 rounded-lg border shadow-lg backdrop-blur-sm bg-white/95 pointer-events-auto transition-all duration-300 top-4 right-4',
                variantStyles[type],
                isVisible ? 'animate-scale-up opacity-100' : 'animate-scale-down opacity-0'
            )}
            style={{top: `${4 + toasts.length * 6}rem`}}
        >
            <div className="flex items-start gap-3">
                <div className={cn('flex-shrink-0 mt-0.5', iconColors[type])}>
                    {icons[type]}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{title}</h4>
                    {description && <p className="text-sm opacity-90 mt-1">{description}</p>}
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
                >
                    <XCircle className="w-4 h-4"/>
                </button>
            </div>
        </div>
    )
}

const showToast = ({title, description, type, duration}: ToastProps) => {
    const toastId = toastCounter++
    const toastElement = (
        <div key={toastId}>
            <Toast title={title} description={description} type={type} duration={duration}/>
        </div>
    )
    toasts.push({id: toastId, element: toastElement})
    toastRoot.render(<>{toasts.map((t) => t.element)}</>)
    setTimeout(() => {
        toasts.splice(toasts.findIndex((t) => t.id === toastId), 1)
        toastRoot.render(<>{toasts.map((t) => t.element)}</>)
    }, (duration || 5000) + 300)
}

Toast.success = (config: ToastConfig) => showToast({...config, type: 'success'})
Toast.error = (config: ToastConfig) => showToast({...config, type: 'error'})
Toast.warning = (config: ToastConfig) => showToast({...config, type: 'warning'})
Toast.info = (config: ToastConfig) => showToast({...config, type: 'info'})
Toast.loading = (config: ToastConfig) => showToast({...config, type: 'loading'})

export default Toast