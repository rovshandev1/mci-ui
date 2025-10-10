import React, { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils.ts'

type Tab = {
	id: string
	label: string
	icon?: React.ReactNode
	content: React.ReactNode
	disabled?: boolean
}

type TabsProps = {
	tabs: Tab[]
	defaultTab?: string
	position?: 'top' | 'bottom' | 'left' | 'right'
	variant?: 'primary' | 'secondary' | 'accent'
	className?: string
	onChange?: (tabId: string | number) => void
}

export default function Tabs({
	tabs,
	defaultTab,
	position = 'top',
	variant = 'primary',
	className,
	onChange,
}: TabsProps) {
	const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
	const [indicatorStyle, setIndicatorStyle] = useState({})
	const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

	useEffect(() => {
		const activeIndex = tabs.findIndex(tab => tab.id === activeTab)
		const activeTabElement = tabsRef.current[activeIndex]

		if (activeTabElement) {
			const { offsetLeft, offsetTop, offsetWidth, offsetHeight } =
				activeTabElement

			setIndicatorStyle({
				left: offsetLeft,
				top: offsetTop,
				width: offsetWidth,
				height: offsetHeight,
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
			})
		}
	}, [activeTab, position, tabs])

	const containerClasses = {
		top: 'flex-col',
		bottom: 'flex-col-reverse',
		left: 'flex-row',
		right: 'flex-row-reverse',
	}

	const tabsContainerClasses = {
		top: 'flex-row',
		bottom: 'flex-row',
		left: 'flex-col',
		right: 'flex-col',
	}

	const contentClasses = {
		top: 'mt-6',
		bottom: 'mb-6',
		left: 'ml-6',
		right: 'mr-6',
	}

	const variantClasses = {
		primary: {
			active: 'text-secondary-600',
			inactive:
				'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
			disabled: 'text-gray-300 dark:text-gray-600 cursor-not-allowed',
			bg: 'bg-secondary-100 dark:bg-secondary-900',
		},
		secondary: {
			active: 'text-accent-600',
			inactive:
				'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
			disabled: 'text-gray-300 dark:text-gray-600 cursor-not-allowed',
			bg: 'bg-accent-100 dark:bg-accent-900',
		},
		accent: {
			active: 'text-gray-800 dark:text-gray-200',
			inactive:
				'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
			disabled: 'text-gray-300 dark:text-gray-600 cursor-not-allowed',
			bg: 'bg-gray-100 dark:bg-gray-800',
		},
	}

	const isVertical = position === 'left' || position === 'right'

	return (
		<div className={cn('flex w-full', containerClasses[position], className)}>
			{/* Tabs Container */}
			<div
				className={cn(
					'flex relative bg-gray-50 dark:bg-gray-900 rounded-lg p-1',
					tabsContainerClasses[position],
					isVertical ? 'min-w-48' : 'w-full'
				)}
			>
				{/* Animated Background Indicator */}
				<div
					className={cn(
						'absolute rounded-md transition-all duration-300 ease-out',
						variantClasses[variant].bg,
						isVertical ? 'w-full' : 'h-full'
					)}
					style={indicatorStyle}
				/>

				{tabs.map((tab, index) => {
					const isActive = activeTab === tab.id
					const variantConfig = variantClasses[variant]

					return (
						<button
							key={tab.id}
                            ref={(el) => {
                                tabsRef.current[index] = el
                            }}
							onClick={() => {
								if (!tab.disabled) {
									setActiveTab(tab.id)
									onChange?.(tab.id)
								}
							}}
							disabled={tab.disabled}
							className={cn(
								'relative flex items-center justify-center gap-2 px-4 py-3 font-medium',
								'text-sm whitespace-nowrap transition-all duration-200 z-10',
								'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
								'rounded-md',
								isActive
									? [variantConfig.active, 'font-semibold']
									: [
											variantConfig.inactive,
											'hover:bg-white/50 dark:hover:bg-gray-800/50',
									  ],
								tab.disabled && variantConfig.disabled,
								isVertical ? 'w-full justify-start' : 'flex-1'
							)}
						>
							{tab.icon && (
								<span
									className={cn(
										'flex-shrink-0 transition-transform duration-200',
										isActive && 'scale-110'
									)}
								>
									{tab.icon}
								</span>
							)}
							<span className='relative z-10'>{tab.label}</span>
						</button>
					)
				})}
			</div>

			{/* Tab Content with Smooth Transition */}
			<div className={cn('flex-1 overflow-hidden', contentClasses[position])}>
				<div key={activeTab} className='animate-fade-in'>
					{tabs.find(tab => tab.id === activeTab)?.content}
				</div>
			</div>
		</div>
	)
}

type TabPanelProps = {
	children: React.ReactNode
	className?: string
}

export function TabPanel({ children, className }: TabPanelProps) {
	return (
		<div
			className={cn(
				'p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700',
				className
			)}
		>
			{children}
		</div>
	)
}
