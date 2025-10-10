import { Loader } from 'lucide-react'
import React from 'react'
import { cn } from '../../lib/utils.ts'

type ButtonProps = {
	text?: string
	icon?: React.ReactNode
	iconPosition?: 'left' | 'right'
	size?: 'sm' | 'md' | 'lg'
	variant?: 'primary' | 'secondary' | 'accent'
	loading?: boolean
	disabled?: boolean
	onClick?: () => void
	className?: string
}

export default function Button({
	text,
	icon,
	iconPosition = 'left',
	size = 'md',
	variant = 'accent',
	loading = false,
	disabled = false,
	onClick,
	className,
}: ButtonProps) {
	const sizes = {
		sm: 'h-[38px] px-3 text-sm gap-2',
		md: 'h-[48px] px-4 text-base gap-2.5',
		lg: 'h-[56px] px-5 text-lg gap-3',
	}

	const variants = {
		primary: `
			bg-secondary-500
			hover:bg-secondary-600
			active:bg-secondary-700
			hover:shadow-lg
			hover:shadow-secondary-500/30
			active:scale-[0.98]
			text-white
		`,
		secondary: `
			bg-secondary-50
			hover:bg-secondary-100
			active:bg-secondary-200
			hover:shadow-md
			hover:shadow-secondary-500/10
			active:scale-[0.98]
			text-secondary-700
			border border-secondary-200
			hover:border-secondary-300
		`,
		accent: `
			bg-accent-500
			hover:bg-accent-600
			active:bg-accent-700
			hover:shadow-lg
			hover:shadow-accent-500/30
			active:scale-[0.98]
			text-white
		`,
	}

	return (
		<button
			onClick={onClick}
			disabled={disabled || loading}
			className={cn(
				'inline-flex items-center justify-center rounded-[7px] font-medium',
				'transition-all duration-300 ease-in-out',
				'transform hover:-translate-y-0.5',
				'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
				'focus:outline-none focus:ring-2 focus:ring-offset-2',
				variant === 'primary' && 'focus:ring-secondary-500',
				variant === 'secondary' && 'focus:ring-secondary-400',
				variant === 'accent' && 'focus:ring-accent-500',
				variants[variant],
				sizes[size],
				className
			)}
		>
			{/* ICON LEFT */}
			{icon && iconPosition === 'left' && (
				<span className='flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-110'>
					{loading ? <Loader className='animate-spin' size={20} /> : icon}
				</span>
			)}

			{/* TEXT */}
			{text && <span className='transition-all duration-300'>{text}</span>}

			{/* ICON RIGHT */}
			{icon && iconPosition === 'right' && (
				<span className='flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-110'>
					{loading ? <Loader className='animate-spin' size={20} /> : icon}
				</span>
			)}

			{/* AGAR TEXT VA ICON YO'Q BO'LSA */}
			{loading && <Loader className='animate-spin' size={20} />}
		</button>
	)
}
