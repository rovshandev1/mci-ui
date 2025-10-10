import React from 'react'
import { cn } from '../../lib/utils.ts'

type TooltipProps = {
	content: React.ReactNode
	children: React.ReactNode
	position?: 'top' | 'bottom' | 'left' | 'right'
	delay?: number
	className?: string
}

export default function Tooltip({
	content,
	children,
	position = 'top',
	delay = 200,
	className,
}: TooltipProps) {
	const positionClasses = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2',
	}

	const arrowClasses = {
		top: 'left-1/2 -translate-x-1/2 top-full',
		bottom: 'left-1/2 -translate-x-1/2 bottom-full',
		left: 'top-1/2 -translate-y-1/2 left-full',
		right: 'top-1/2 -translate-y-1/2 right-full',
	}

	return (
		<div className='relative inline-block group'>
			{children}

			<div
				className={cn(
					'absolute z-50 whitespace-nowrap rounded-md bg-gray-800 text-white text-xs px-2 py-1 shadow-md dark:bg-gray-900',
					'transition-all opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100',
					'group-hover:delay-200 duration-200 ease-out',
					positionClasses[position],
					className
				)}
				style={{ transitionDelay: `${delay}ms` }}
			>
				{content}

				<span
					className={cn(
						'absolute w-2 h-2 bg-gray-800 dark:bg-gray-900 rotate-45',
						arrowClasses[position]
					)}
				/>
			</div>
		</div>
	)
}
