import { X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { cn, useClickOutside, useEscapeKey } from '../../lib/utils'

interface DrawerProps {
	isOpen: boolean
	onClose: () => void
	position?: 'left' | 'right' | 'top' | 'bottom'
	children: React.ReactNode
	title?: string
	showCloseButton?: boolean
	overlayClassName?: string
	drawerClassName?: string
	closeOnOverlayClick?: boolean
	closeOnEscape?: boolean
	variant?: 'default' | 'secondary' | 'dark'
}

export default function Drawer({
	isOpen,
	onClose,
	position = 'left',
	children,
	title,
	showCloseButton = true,
	overlayClassName,
	drawerClassName,
	closeOnOverlayClick = true,
	closeOnEscape = true,
	variant = 'default',
}: DrawerProps) {
	const drawerRef = useRef<HTMLDivElement>(null)
	const previousActiveElement = useRef<HTMLElement | null>(null)

	const { handleEscape } = useEscapeKey(() => {
		if (closeOnEscape && isOpen) {
			onClose()
		}
	})

	const { handleClick } = useClickOutside(drawerRef, () => {
		if (closeOnOverlayClick && isOpen) {
			onClose()
		}
	})

	useEffect(() => {
		if (isOpen) {
			previousActiveElement.current = document.activeElement as HTMLElement
			drawerRef.current?.focus()
		} else {
			previousActiveElement.current?.focus()
		}
	}, [isOpen])

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
			document.addEventListener('mousedown', handleClick)
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.removeEventListener('keydown', handleEscape)
			document.removeEventListener('mousedown', handleClick)
			document.body.style.overflow = 'unset'
		}
	}, [isOpen, handleEscape, handleClick])

	const variantClasses = {
		default: {
			bg: 'bg-white dark:bg-gray-900',
			text: 'text-gray-900 dark:text-white',
			border: 'border-gray-200 dark:border-gray-700',
			hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
			closeIcon: 'text-gray-600 dark:text-gray-400',
		},
		secondary: {
			bg: 'bg-secondary-50 dark:bg-secondary-900',
			text: 'text-secondary-900 dark:text-secondary-100',
			border: 'border-secondary-200 dark:border-secondary-700',
			hover: 'hover:bg-secondary-100 dark:hover:bg-secondary-800',
			closeIcon: 'text-secondary-600 dark:text-secondary-400',
		},
		dark: {
			bg: 'bg-gray-900 dark:bg-gray-800',
			text: 'text-white dark:text-gray-100',
			border: 'border-gray-700 dark:border-gray-600',
			hover: 'hover:bg-gray-800 dark:hover:bg-gray-700',
			closeIcon: 'text-gray-400 dark:text-gray-300',
		},
	}

	const currentVariant = variantClasses[variant]

	// Position classes
	const positionClasses = {
		left: 'top-0 left-0 h-full max-w-sm w-full',
		right: 'top-0 right-0 h-full max-w-sm w-full',
		top: 'top-0 left-0 w-full max-h-80 h-full',
		bottom: 'bottom-0 left-0 w-full max-h-80 h-full',
	}

	// Transform classes
	const transformClasses = {
		left: isOpen ? 'translate-x-0' : '-translate-x-full',
		right: isOpen ? 'translate-x-0' : 'translate-x-full',
		top: isOpen ? 'translate-y-0' : '-translate-y-full',
		bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
	}

	return (
		<>
			{/* Overlay */}
			<div
				className={cn(
					'fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300',
					isOpen
						? 'opacity-100 pointer-events-auto'
						: 'opacity-0 pointer-events-none',
					overlayClassName
				)}
				onClick={closeOnOverlayClick ? onClose : undefined}
			/>

			{/* Drawer */}
			<div
				ref={drawerRef}
				tabIndex={-1}
				className={cn(
					'fixed z-50 shadow-2xl transition-transform duration-300 ease-in-out',
					currentVariant.bg,
					currentVariant.text,
					positionClasses[position],
					transformClasses[position],
					drawerClassName
				)}
				role='dialog'
				aria-modal='true'
				aria-labelledby={title ? 'drawer-title' : undefined}
			>
				{/* Header */}
				{(title || showCloseButton) && (
					<div
						className={cn(
							'flex items-center justify-between p-6 border-b',
							currentVariant.border
						)}
					>
						{title && (
							<h2
								id='drawer-title'
								className={cn('text-H4', currentVariant.text)}
							>
								{title}
							</h2>
						)}
						{showCloseButton && (
							<button
								onClick={onClose}
								className={cn(
									'p-2 rounded-lg transition-all duration-200 hover:scale-110',
									currentVariant.hover
								)}
								aria-label='Close drawer'
							>
								<X size={24} className={currentVariant.closeIcon} />
							</button>
						)}
					</div>
				)}

				{/* Content */}
				<div className='h-full overflow-y-auto'>{children}</div>
			</div>
		</>
	)
}
