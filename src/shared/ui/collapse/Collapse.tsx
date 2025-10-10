import { ChevronDownIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils.ts'

type CollapseProps = {
	title: string
	children: React.ReactNode
	defaultOpen?: boolean
	icon?: React.ReactNode
	variant?: 'primary' | 'secondary' | 'accent'
	className?: string
	titleClassName?: string
	contentClassName?: string
}

export default function Collapse({
	title,
	children,
	defaultOpen = false,
	icon,
	variant = 'primary',
	className,
	titleClassName,
	contentClassName,
}: CollapseProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen)
	const [contentHeight, setContentHeight] = useState(0)
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (contentRef.current) {
			setContentHeight(isOpen ? contentRef.current.scrollHeight : 0)
		}
	}, [isOpen])

	const variantClasses = {
		primary: {
			title:
				'bg-secondary-50 hover:bg-secondary-100 border-secondary-200 text-secondary-800',
			content: 'bg-secondary-25 border-secondary-100',
		},
		secondary: {
			title:
				'bg-accent-50 hover:bg-accent-100 border-accent-200 text-accent-800',
			content: 'bg-accent-25 border-accent-100',
		},
		accent: {
			title: 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800',
			content: 'bg-gray-25 border-gray-100',
		},
	}

	const variantConfig = variantClasses[variant]

	return (
		<div className={cn('border rounded-lg overflow-hidden', className)}>
			{/* Header */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					'w-full flex items-center justify-between p-4 transition-all duration-300',
					'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500',
					'border-b',
					variantConfig.title
				)}
			>
				<div className='flex items-center gap-3'>
					{icon && <span className='flex-shrink-0'>{icon}</span>}
					<span className={cn('font-medium text-left', titleClassName)}>
						{title}
					</span>
				</div>

				<ChevronDownIcon
					className={cn(
						'w-5 h-5 transition-transform duration-300 flex-shrink-0',
						isOpen && 'rotate-180'
					)}
				/>
			</button>

			{/* Content */}
			<div
				className={cn(
					'transition-all duration-300 ease-out overflow-hidden',
					variantConfig.content
				)}
				style={{
					height: `${contentHeight}px`,
				}}
			>
				<div ref={contentRef} className={cn('p-4', contentClassName)}>
					{children}
				</div>
			</div>
		</div>
	)
}
