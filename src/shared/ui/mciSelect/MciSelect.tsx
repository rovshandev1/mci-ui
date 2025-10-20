import { ChevronDown, X } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/utils.ts'

type Option = {
	value: string
	label: string
}

type SelectProps = {
	label?: string
	placeholder?: string
	options: Option[]
	icon?: React.ReactNode
	iconPosition?: 'left' | 'right'
	size?: 'sm' | 'md' | 'lg'
	error?: string
	success?: string
	disabled?: boolean
	required?: boolean
	value?: string
	onChange?: (value: string) => void
	onFocus?: () => void
	onBlur?: () => void
	className?: string
	clearable?: boolean
	searchable?: boolean
}

export default function MciSelect({
	label,
	placeholder = 'Tanlang...',
	options = [],
	icon,
	iconPosition = 'left',
	size = 'md',
	error,
	success,
	disabled = false,
	required = false,
	value,
	onChange,
	onFocus,
	onBlur,
	className,
	clearable = false,
	searchable = false,
}: SelectProps) {
	const [isFocused, setIsFocused] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [internalValue, setInternalValue] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const containerRef = useRef<HTMLDivElement>(null)
	const searchInputRef = useRef<HTMLInputElement>(null)

	const currentValue = value ?? internalValue
	const hasValue = Boolean(currentValue)

	const selectedOption = options.find(opt => opt.value === currentValue)

	const filteredOptions = useMemo(() => {
		if (!searchable || !searchTerm) return options
		return options.filter(opt =>
			opt.label.toLowerCase().includes(searchTerm.toLowerCase())
		)
	}, [options, searchTerm, searchable])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
				setIsFocused(false)
				setSearchTerm('')
				onBlur?.()
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen, onBlur])

	useEffect(() => {
		if (isOpen && searchable && searchInputRef.current) {
			searchInputRef.current.focus()
		}
	}, [isOpen, searchable])

	const handleFocus = () => {
		if (disabled) return
		setIsFocused(true)
		onFocus?.()
	}

	const handleToggle = () => {
		if (disabled) return
		setIsOpen(prev => !prev)
		if (!isOpen) {
			handleFocus()
		}
	}

	const handleSelect = (optionValue: string) => {
		if (value === undefined) setInternalValue(optionValue)
		onChange?.(optionValue)
		setIsOpen(false)
		setIsFocused(false)
		setSearchTerm('')
		onBlur?.()
	}

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (value === undefined) setInternalValue('')
		onChange?.('')
		setSearchTerm('')
	}

	const sizes = useMemo(
		() => ({
			sm: {
				input: 'h-[38px] text-sm',
				padding: icon
					? iconPosition === 'left'
						? 'pl-10 pr-3'
						: 'pl-3 pr-10'
					: 'px-3',
				icon: 'w-4 h-4',
				iconWrapper: iconPosition === 'left' ? 'left-3' : 'right-3',
				labelFont: 'text-xs',
				dropdown: 'text-sm',
			},
			md: {
				input: 'h-[48px] text-base',
				padding: icon
					? iconPosition === 'left'
						? 'pl-12 pr-4'
						: 'pl-4 pr-12'
					: 'px-4',
				icon: 'w-5 h-5',
				iconWrapper: iconPosition === 'left' ? 'left-3.5' : 'right-3.5',
				labelFont: 'text-sm',
				dropdown: 'text-base',
			},
			lg: {
				input: 'h-[56px] text-lg',
				padding: icon
					? iconPosition === 'left'
						? 'pl-14 pr-5'
						: 'pl-5 pr-14'
					: 'px-5',
				icon: 'w-6 h-6',
				iconWrapper: iconPosition === 'left' ? 'left-4' : 'right-4',
				labelFont: 'text-base',
				dropdown: 'text-lg',
			},
		}),
		[icon, iconPosition]
	)

	const stateStyles = useMemo(() => {
		if (error) {
			return isOpen
				? 'border-error-600 ring-error-500/20'
				: 'border-error-500 hover:border-error-600'
		}
		if (success) {
			return isOpen
				? 'border-success-600 ring-success-500/20'
				: 'border-success-500 hover:border-success-600'
		}
		return isOpen
			? 'border-secondary-500 ring-secondary-500/20'
			: 'border-gray-300 hover:border-gray-400'
	}, [error, success, isOpen])

	return (
		<div className={cn('w-full', className)} ref={containerRef}>
			<div className='relative'>
				<div
					onClick={handleToggle}
					className={cn(
						'w-full rounded-[7px] border-2 bg-white font-medium outline-none transition-all duration-300 ease-in-out cursor-pointer flex items-center',
						isOpen && 'ring-4',
						disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
						sizes[size].input,
						sizes[size].padding,
						stateStyles
					)}
					style={{ outline: 'none', boxShadow: isOpen ? undefined : 'none' }}
				>
					{searchable && isOpen ? (
						<input
							ref={searchInputRef}
							type='text'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							placeholder={placeholder}
							className='w-full bg-transparent outline-none font-medium'
						/>
					) : (
						<span className={cn('truncate', !hasValue && 'text-gray-500')}>
							{selectedOption?.label || placeholder}
						</span>
					)}
				</div>

				{/* FLOATING LABEL */}
				{label && (
					<label
						className={cn(
							'absolute pointer-events-none transition-all duration-300 ease-in-out font-medium bg-white',
							icon && iconPosition === 'left' && !hasValue && !isFocused
								? sizes[size].padding
								: 'left-4',
							isFocused || hasValue || isOpen
								? cn(
										'top-0 -translate-y-1/2 px-1',
										sizes[size].labelFont,
										error
											? 'text-error-600'
											: success
											? 'text-success-500'
											: 'text-secondary-500'
								  )
								: cn(
										'top-[55%] -translate-y-1/2 text-gray-500',
										sizes[size].input.includes('38') && 'text-sm',
										sizes[size].input.includes('48') && 'text-base',
										sizes[size].input.includes('56') && 'text-lg'
								  )
						)}
					>
						{label}
						{required && <span className='text-error-500 ml-1'>*</span>}
					</label>
				)}

				{/* ICON */}
				{icon && (
					<div
						className={cn(
							'absolute top-1/2 -translate-y-1/2 flex items-center transition-all duration-300 pointer-events-none',
							sizes[size].iconWrapper,
							error
								? 'text-error-500'
								: success
								? 'text-success-500'
								: isFocused || isOpen
								? 'text-secondary-500'
								: 'text-gray-400'
						)}
					>
						<span className={cn(sizes[size].icon)}>{icon}</span>
					</div>
				)}

				{/* CLEAR BUTTON */}
				{clearable && hasValue && !disabled && (
					<button
						type='button'
						onClick={handleClear}
						className={cn(
							'absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all z-10',
							'right-10'
						)}
					>
						<X className={cn(sizes[size].icon)} />
					</button>
				)}

				{/* CHEVRON */}
				<div
					className={cn(
						'absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 pointer-events-none',
						'right-3',
						error
							? 'text-error-500'
							: success
							? 'text-success-500'
							: isFocused || isOpen
							? 'text-secondary-500'
							: 'text-gray-400',
						isOpen && 'rotate-180'
					)}
				>
					<ChevronDown className={cn(sizes[size].icon)} />
				</div>

				{/* DROPDOWN */}
				{isOpen && (
					<div
						className={cn(
							'absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-[7px] shadow-lg max-h-60 overflow-y-auto',
							sizes[size].dropdown
						)}
					>
						{filteredOptions.length === 0 ? (
							<div className='px-4 py-3 text-gray-500 text-center'>
								Hech narsa topilmadi
							</div>
						) : (
							filteredOptions.map(option => (
								<div
									key={option.value}
									onClick={() => handleSelect(option.value)}
									className={cn(
										'px-4 py-3 cursor-pointer transition-colors duration-200 font-medium',
										currentValue === option.value
											? 'bg-secondary-50 text-secondary-600'
											: 'hover:bg-gray-50 text-gray-700'
									)}
								>
									{option.label}
								</div>
							))
						)}
					</div>
				)}
			</div>

			{/* ERROR MESSAGE */}
			{error && (
				<p className='mt-1.5 text-sm text-error-600 flex items-center gap-1 animate-[slideDown_0.3s_ease-out]'>
					{error}
				</p>
			)}

			{/* SUCCESS MESSAGE */}
			{success && !error && (
				<p className='mt-1.5 text-sm text-success-600 flex items-center gap-1 animate-[slideDown_0.3s_ease-out]'>
					{success}
				</p>
			)}
		</div>
	)
}
