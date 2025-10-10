import {
	AlertCircle,
	CheckCircle2,
	Info,
	Loader2,
	X,
	XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils.ts'

// --- TYPES ---
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export type ToastProps = {
	id?: string
	title: string
	description?: string
	type?: ToastType
	duration?: number
	position?:
		| 'top-right'
		| 'top-left'
		| 'bottom-right'
		| 'bottom-left'
		| 'top-center'
		| 'bottom-center'
	onClose?: (id: string) => void
	action?: {
		label: string
		onClick: () => void
	}
}

// --- MAIN TOAST COMPONENT ---
export function Toast({
	id = Math.random().toString(36),
	title,
	description,
	type = 'info',
	duration = 5000,
	position = 'top-right',
	onClose,
	action,
}: ToastProps) {
	const [isVisible, setIsVisible] = useState(false)
	const [isLeaving, setIsLeaving] = useState(false)

	useEffect(() => {
		const showTimer = setTimeout(() => setIsVisible(true), 100)
		if (duration !== Infinity) {
			const closeTimer = setTimeout(() => handleClose(), duration)
			return () => {
				clearTimeout(showTimer)
				clearTimeout(closeTimer)
			}
		}
		return () => clearTimeout(showTimer)
	}, [duration])

	const handleClose = () => {
		setIsLeaving(true)
		setTimeout(() => {
			setIsVisible(false)
			onClose?.(id)
		}, 300)
	}

	const handleAction = () => {
		action?.onClick()
		handleClose()
	}

	const icons = {
		success: <CheckCircle2 className='w-5 h-5' />,
		error: <XCircle className='w-5 h-5' />,
		warning: <AlertCircle className='w-5 h-5' />,
		info: <Info className='w-5 h-5' />,
		loading: <Loader2 className='w-5 h-5 animate-spin' />,
	}

	const variantClasses = {
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

	const positionClasses = {
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4',
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-center': 'top-4 left-1/2 -translate-x-1/2',
		'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
	}

	if (!isVisible) return null

	return (
		<div
			className={cn(
				'fixed z-50 transform transition-all duration-300',
				positionClasses[position],
				isLeaving ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
				position.includes('top') && !isLeaving && 'animate-slide-down',
				position.includes('bottom') && !isLeaving && 'animate-slide-up'
			)}
		>
			<div
				className={cn(
					'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm',
					'backdrop-blur-sm bg-white/95',
					variantClasses[type]
				)}
			>
				<div className={cn('flex-shrink-0 mt-0.5', iconColors[type])}>
					{icons[type]}
				</div>
				<div className='flex-1 min-w-0'>
					<h4 className='font-semibold text-sm mb-1'>{title}</h4>
					{description && <p className='text-sm opacity-90'>{description}</p>}
					{action && (
						<button
							onClick={handleAction}
							className='mt-2 text-sm font-medium underline underline-offset-2 hover:no-underline'
						>
							{action.label}
						</button>
					)}
				</div>
				<button
					onClick={handleClose}
					className='flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors'
				>
					<X className='w-4 h-4' />
				</button>
			</div>
		</div>
	)
}
