import { X } from 'lucide-react'
import React from 'react'
import { cn } from '../../lib/utils.ts'

type TagProps = {
	children: React.ReactNode
	variant?: 'default' | 'secondary' | 'success' | 'error' | 'info' | 'accent'
	size?: 'sm' | 'md' | 'lg'
	icon?: React.ReactNode
	iconPosition?: 'left' | 'right'
	rounded?: boolean
	closable?: boolean
	onClose?: () => void
	className?: string
}

const sizes = {
	sm: 'text-xs px-2 py-0.5',
	md: 'text-sm px-3 py-1',
	lg: 'text-base px-4 py-1.5',
}

const iconSizes = {
	sm: 'w-3 h-3',
	md: 'w-4 h-4',
	lg: 'w-5 h-5',
}

const variants = {
	default:
		'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
	secondary:
		'bg-secondary-100 text-secondary-800 border border-secondary-200 dark:bg-secondary-800 dark:text-secondary-50 dark:border-secondary-700',
	success:
		'bg-success-100 text-success-800 border border-success-200 dark:bg-success-800 dark:text-success-50 dark:border-success-700',
	error:
		'bg-error-100 text-error-800 border border-error-200 dark:bg-error-800 dark:text-error-50 dark:border-error-700',
	info: 'bg-info-100 text-info-800 border border-info-200 dark:bg-info-800 dark:text-info-50 dark:border-info-700',
	accent:
		'bg-accent-100 text-accent-800 border border-accent-200 dark:bg-accent-800 dark:text-accent-50 dark:border-accent-700',
}

export default function Tag({
	children,
	variant = 'default',
	size = 'md',
	icon,
	iconPosition = 'left',
	closable = false,
	onClose,
	className,
}: TagProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center font-medium animate-[fadeIn_0.3s_ease-out] rounded-[7px]',
				sizes[size],
				variants[variant],
				icon && 'gap-1.5',
				className
			)}
		>
			{/* ICON LEFT */}
			{icon && iconPosition === 'left' && (
				<span className={`flex items-center ${cn(iconSizes[size])}`}>
					{icon}
				</span>
			)}

			{/* TEXT */}
			<span>{children}</span>

			{/* ICON RIGHT */}
			{icon && iconPosition === 'right' && (
				<span className={`flex items-center ${cn(iconSizes[size])}`}>
					{icon}
				</span>
			)}

			{/* CLOSE BUTTON */}
			{closable && (
				<button
					type='button'
					onClick={onClose}
					className='ml-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors'
				>
					<X className={cn(iconSizes[size])} />
				</button>
			)}
		</span>
	)
}
