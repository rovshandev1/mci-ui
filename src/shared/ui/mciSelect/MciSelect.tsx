import { ChevronDown, X } from 'lucide-react'
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/utils.ts'

type Option = {
	value: string | number
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
	value?: string | number
	onChange?: (value: string | number) => void
	onFocus?: () => void
	onBlur?: () => void
	className?: string
	clearable?: boolean
	searchable?: boolean
	onSearch?: (searchTerm: string) => void
	name?: string
}

const MciSelect = forwardRef<HTMLDivElement, SelectProps>(
	(
		{
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
			onSearch,
			name,
		},
		ref
	) => {
		const [isFocused, setIsFocused] = useState(false)
		const [isOpen, setIsOpen] = useState(false)
		const [internalValue, setInternalValue] = useState<string | number>('')
		const [searchTerm, setSearchTerm] = useState('')
		const containerRef = useRef<HTMLDivElement>(null)
		const searchInputRef = useRef<HTMLInputElement>(null)

		const currentValue = value ?? internalValue
		const hasValue = Boolean(currentValue)

		const selectedOption = options.find(opt => opt.value === currentValue)

		const handleSearchChange = (term: string) => {
			setSearchTerm(term)
			onSearch?.(term)
		}

		const filteredOptions = useMemo(() => {
			if (!searchable) return options
			if (onSearch) return options
			return options.filter(opt =>
				opt.label.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}, [options, searchTerm, searchable, onSearch])

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
			if (isOpen) document.addEventListener('mousedown', handleClickOutside)
			return () => document.removeEventListener('mousedown', handleClickOutside)
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
			if (!isOpen) handleFocus()
			else setSearchTerm('')
		}

		const handleSelect = (optionValue: string | number) => {
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
			if (error)
				return isOpen
					? 'border-error-600 ring-error-500/20'
					: 'border-error-500 hover:border-error-600'
			if (success)
				return isOpen
					? 'border-success-600 ring-success-500/20'
					: 'border-success-500 hover:border-success-600'
			return isOpen
				? 'border-secondary-500 ring-secondary-500/20'
				: 'border-gray-300 hover:border-gray-400'
		}, [error, success, isOpen])

		return (
			<div className={cn('w-full', className)} ref={ref}>
				{' '}
				<div className='relative' ref={containerRef}>
					{/* Select box */}
					<div
						onClick={handleToggle}
						className={cn(
							'w-full rounded-[7px] border bg-white font-medium outline-none transition-all duration-300 ease-in-out cursor-pointer flex items-center',
							isOpen && 'ring-4',
							disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
							sizes[size].input,
							sizes[size].padding,
							stateStyles
						)}
					>
						{searchable && isOpen ? (
							<input
								ref={searchInputRef}
								name={name}
								type='text'
								value={searchTerm}
								onChange={e => handleSearchChange(e.target.value)}
								placeholder={placeholder}
								className='w-full bg-transparent outline-none font-medium'
								onClick={e => e.stopPropagation()}
							/>
						) : (
							<span
								className={cn(
									'truncate transition-opacity duration-200',
									!hasValue && 'text-gray-500',
									label && !(isFocused || hasValue || isOpen) && 'opacity-0'
								)}
							>
								{selectedOption?.label || placeholder}
							</span>
						)}
					</div>

					{/* Floating label */}
					{label && (
						<label
							className={cn(
								'absolute left-4 pointer-events-none font-medium transition-all duration-300 ease-in-out bg-white px-1 select-none',
								isFocused || hasValue || isOpen
									? cn(
											'-top-2 scale-90 origin-[0_0]',
											sizes[size].labelFont,
											error
												? 'text-error-600'
												: success
												? 'text-success-500'
												: 'text-secondary-600'
									  )
									: cn(
											'top-1/2 -translate-y-1/2 text-gray-500',
											sizes[size].input.includes('38') && 'text-sm',
											sizes[size].input.includes('48') && 'text-base',
											sizes[size].input.includes('56') && 'text-lg'
									  )
							)}
							style={{
								transformOrigin: 'left top',
								transition: 'all 0.25s ease',
							}}
						>
							{label}
							{required && <span className='text-error-500 ml-1'>*</span>}
						</label>
					)}

					{/* Clear button */}
					{clearable && hasValue && !disabled && (
						<button
							type='button'
							onClick={handleClear}
							className='absolute top-1/2 -translate-y-1/2 right-10 text-gray-400 hover:text-gray-600 transition-all z-10'
						>
							<X className={cn(sizes[size].icon)} />
						</button>
					)}

					{/* Chevron */}
					<div
						className={cn(
							'absolute top-1/2 -translate-y-1/2 right-3 transition-all duration-300',
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

					{/* Dropdown with scroll */}
					{isOpen && (
						<div
							className={cn(
								'absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-[7px] shadow-xl overflow-y-auto max-h-56',
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
											'px-4 py-2 cursor-pointer transition-colors duration-200 font-medium',
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
				{/* Messages */}
				{error && (
					<p className='mt-1.5 text-sm text-error-600 animate-[slideDown_0.3s_ease-out]'>
						{error}
					</p>
				)}
				{success && !error && (
					<p className='mt-1.5 text-sm text-success-600 animate-[slideDown_0.3s_ease-out]'>
						{success}
					</p>
				)}
			</div>
		)
	}
)

MciSelect.displayName = 'MciSelect'

export default MciSelect
