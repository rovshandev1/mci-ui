import { ChevronRight } from 'lucide-react'
import React from 'react'
import { cn } from '../../lib/utils.ts'

type BreadcrumbItem = {
	label: string
	href?: string
	onClick?: () => void
}

type BreadcrumbProps = {
	items: BreadcrumbItem[]
	className?: string
	separatorIcon?: React.ReactNode
}

export default function Breadcrumb({
	items,
	className,
	separatorIcon = (
		<ChevronRight className='w-4 h-4 text-gray-400 dark:text-gray-500' />
	),
}: BreadcrumbProps) {
	return (
		<nav
			className={cn(
				'flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-300',
				className
			)}
			aria-label='Breadcrumb'
		>
			{items?.map((item, index) => {
				const isLast = index === items?.length - 1

				return (
					<div key={index} className='flex items-center'>
						{item?.href ? (
							<a
								href={item?.href}
								onClick={item?.onClick}
								className={cn(
									'hover:text-primary-600 dark:hover:text-primary-400 transition-colors',
									isLast && 'text-primary-600 dark:text-primary-400'
								)}
							>
								{item?.label}
							</a>
						) : (
							<span
								className={cn(
									isLast
										? 'text-primary-600 dark:text-primary-400'
										: 'text-gray-500 dark:text-gray-400'
								)}
							>
								{item?.label}
							</span>
						)}

						{!isLast && (
							<span className='mx-2 flex items-center'>{separatorIcon}</span>
						)}
					</div>
				)
			})}
		</nav>
	)
}
