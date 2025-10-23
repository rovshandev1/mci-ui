import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react'
import { locales, type DateLocale, type Locale } from '../../lib/locales'
import { cn } from '../../lib/utils'
import InputMain from '../inputMain/InputMain'

type DateValue = Date | null
type RangeValue = [DateValue, DateValue]

interface MciPickerProps {
	type?: 'date' | 'range'
	value?: DateValue | RangeValue
	onChange?: (value: DateValue | RangeValue) => void
	placeholder?: string | [string, string]
	label?: string
	disabled?: boolean
	required?: boolean
	className?: string
	format?: string
	minDate?: Date
	maxDate?: Date
	size?: 'sm' | 'md' | 'lg'
	error?: string
	success?: string
	showClear?: boolean
	allowManualInput?: boolean
	locale?: Locale
	showToday?: boolean
}

interface CalendarDay {
	date: Date
	isCurrentMonth: boolean
	isDisabled: boolean
}

const MciPicker: React.FC<MciPickerProps> = ({
	type = 'date',
	value,
	onChange,
	placeholder = 'Select date',
	label,
	disabled = false,
	required = false,
	className,
	format = 'YYYY.MM.DD',
	minDate,
	maxDate,
	size = 'md',
	error,
	success,
	showClear = true,
	allowManualInput = true,
	locale = 'en',
	showToday = true,
}) => {
	// State management
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [internalValue, setInternalValue] = useState<DateValue | RangeValue>(
		type === 'range' ? [null, null] : null
	)
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
	const [currentMonth2, setCurrentMonth2] = useState<Date>(() => {
		const nextMonth = new Date()
		nextMonth.setMonth(nextMonth.getMonth() + 1)
		return nextMonth
	})
	const [tempRange, setTempRange] = useState<RangeValue>([null, null])
	const [inputValues, setInputValues] = useState<[string, string]>(['', ''])

	// Refs
	const containerRef = useRef<HTMLDivElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const input1Ref = useRef<HTMLInputElement>(null)

	// Current value
	const currentValue = value !== undefined ? value : internalValue
	const currentLocale: DateLocale = locales[locale]

	// Date utilities
	const normalizeDate = useCallback((date: Date): Date => {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate())
	}, [])

	const isSameDay = useCallback(
		(date1: Date, date2: Date): boolean => {
			return normalizeDate(date1).getTime() === normalizeDate(date2).getTime()
		},
		[normalizeDate]
	)

	// Date validation
	const isDateDisabled = useCallback(
		(date: Date): boolean => {
			const normalizedDate = normalizeDate(date)

			if (minDate) {
				const normalizedMinDate = normalizeDate(minDate)
				if (normalizedDate < normalizedMinDate) return true
			}

			if (maxDate) {
				const normalizedMaxDate = normalizeDate(maxDate)
				if (normalizedDate > normalizedMaxDate) return true
			}

			return false
		},
		[minDate, maxDate, normalizeDate]
	)

	// Format date
	const formatDate = useCallback(
		(date: Date | null): string => {
			if (!date) return ''

			const day = date.getDate().toString().padStart(2, '0')
			const month = (date.getMonth() + 1).toString().padStart(2, '0')
			const year = date.getFullYear()

			return format
				.replace(/DD/g, day)
				.replace(/MM/g, month)
				.replace(/YYYY/g, year.toString())
				.replace(/YY/g, year.toString().slice(-2))
		},
		[format]
	)

	// Parse date from string
	const parseDate = useCallback(
		(dateString: string): Date | null => {
			if (!dateString.trim()) return null

			try {
				const cleanString = dateString.replace(/[^\d]/g, '')
				let year: number, month: number, day: number

				if (cleanString.length === 8) {
					if (format.includes('YYYY')) {
						year = parseInt(cleanString.slice(0, 4))
						month = parseInt(cleanString.slice(4, 6)) - 1
						day = parseInt(cleanString.slice(6, 8))
					} else {
						day = parseInt(cleanString.slice(0, 2))
						month = parseInt(cleanString.slice(2, 4)) - 1
						year = parseInt(cleanString.slice(4, 8))
					}
				} else if (cleanString.length === 6) {
					year = 2000 + parseInt(cleanString.slice(0, 2))
					month = parseInt(cleanString.slice(2, 4)) - 1
					day = parseInt(cleanString.slice(4, 6))
				} else {
					return null
				}

				const parsed = new Date(year, month, day)
				return parsed.getFullYear() === year &&
					parsed.getMonth() === month &&
					parsed.getDate() === day
					? parsed
					: null
			} catch {
				return null
			}
		},
		[format]
	)

	// Format range value for display
	const formatRangeValue = useCallback((): string => {
		if (type !== 'range') return ''

		const [start, end] = currentValue as RangeValue
		if (!start && !end) return ''
		if (start && !end) return `${formatDate(start)} - ...`
		if (!start && end) return `... - ${formatDate(end)}`
		return `${formatDate(start)} - ${formatDate(end)}`
	}, [type, currentValue, formatDate])

	// Handle manual input change for range
	const handleRangeInputChange = useCallback(
		(value: string): void => {
			setInputValues([value, ''])

			const rangeParts = value.split(' - ')
			if (rangeParts.length === 2) {
				const start = parseDate(rangeParts[0])
				const end = parseDate(rangeParts[1])

				if (start && end && !isDateDisabled(start) && !isDateDisabled(end)) {
					const sortedRange: RangeValue =
						start <= end ? [start, end] : [end, start]
					setInternalValue(sortedRange)
					setTempRange(sortedRange)
					onChange?.(sortedRange)
				}
			}
		},
		[parseDate, isDateDisabled, onChange]
	)

	// Handle close function
	const handleClose = useCallback((): void => {
		setIsOpen(false)
		if (type === 'range') {
			setTempRange(currentValue as RangeValue)
		}
	}, [type, currentValue])

	// Handle escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				handleClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
			return () => document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, handleClose])

	// Handle click outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				handleClose()
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
			return () => document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen, handleClose])

	// Update input values when value changes
	useEffect(() => {
		if (type === 'date') {
			setInputValues([formatDate(currentValue as DateValue), ''])
		} else {
			setInputValues([formatRangeValue(), ''])
		}
	}, [currentValue, type, formatDate, formatRangeValue])

	// Handle manual input change
	const handleInputChange = useCallback(
		(value: string): void => {
			if (type === 'date') {
				setInputValues([value, ''])
				const parsed = parseDate(value)
				if (parsed && !isDateDisabled(parsed)) {
					setInternalValue(parsed)
					onChange?.(parsed)
				}
			} else {
				handleRangeInputChange(value)
			}
		},
		[type, parseDate, isDateDisabled, onChange, handleRangeInputChange]
	)

	// Calendar generation
	const getDaysInMonth = useCallback(
		(date: Date): CalendarDay[] => {
			const year = date.getFullYear()
			const month = date.getMonth()
			const firstDay = new Date(year, month, 1)
			const lastDay = new Date(year, month + 1, 0)
			const daysInMonth = lastDay.getDate()

			const days: CalendarDay[] = []
			const firstDayOfWeek = firstDay.getDay()

			// Previous month days
			const prevMonthLastDay = new Date(year, month, 0).getDate()
			for (let i = firstDayOfWeek - 1; i >= 0; i--) {
				const day = new Date(year, month - 1, prevMonthLastDay - i)
				days.push({
					date: day,
					isCurrentMonth: false,
					isDisabled: isDateDisabled(day),
				})
			}

			// Current month days
			for (let i = 1; i <= daysInMonth; i++) {
				const day = new Date(year, month, i)
				days.push({
					date: day,
					isCurrentMonth: true,
					isDisabled: isDateDisabled(day),
				})
			}

			// Next month days
			const totalCells = 42
			const nextDays = totalCells - days.length
			for (let i = 1; i <= nextDays; i++) {
				const day = new Date(year, month + 1, i)
				days.push({
					date: day,
					isCurrentMonth: false,
					isDisabled: isDateDisabled(day),
				})
			}

			return days
		},
		[isDateDisabled]
	)

	// Date selection
	const handleDateSelect = useCallback(
		(date: Date): void => {
			const normalizedDate = normalizeDate(date)

			if (isDateDisabled(normalizedDate)) return

			if (type === 'date') {
				setInternalValue(normalizedDate)
				onChange?.(normalizedDate)
				setInputValues([formatDate(normalizedDate), ''])
				handleClose()
			} else {
				if (!tempRange[0] || (tempRange[0] && tempRange[1])) {
					// Start new range
					const newRange: [Date, DateValue] = [normalizedDate, null]
					setTempRange(newRange)
				} else if (tempRange[0] && !tempRange[1]) {
					// Complete range
					const sortedRange: [Date, Date] =
						normalizedDate < tempRange[0]
							? [normalizedDate, tempRange[0] as Date]
							: [tempRange[0] as Date, normalizedDate]

					setTempRange(sortedRange)
					setInternalValue(sortedRange)
					onChange?.(sortedRange)
					handleClose()
				}
			}
		},
		[
			type,
			tempRange,
			onChange,
			handleClose,
			normalizeDate,
			isDateDisabled,
			formatDate,
		]
	)

	// Date states - FIXED VERSION
	const isSelected = useCallback(
		(date: Date): boolean => {
			const normalizedDate = normalizeDate(date)

			if (type === 'date') {
				const selectedDate = currentValue as DateValue
				return selectedDate ? isSameDay(normalizedDate, selectedDate) : false
			} else {
				const [start, end] = currentValue as RangeValue
				const isStart = start && isSameDay(normalizedDate, start)
				const isEnd = end && isSameDay(normalizedDate, end)
				return !!(isStart || isEnd)
			}
		},
		[type, currentValue, isSameDay, normalizeDate]
	)

	const isInRange = useCallback(
		(date: Date): boolean => {
			if (type !== 'range') return false

			const [start, end] =
				tempRange[0] && tempRange[1] ? tempRange : (currentValue as RangeValue)

			if (!start || !end) return false

			const normalizedDate = normalizeDate(date)
			const normalizedStart = normalizeDate(start)
			const normalizedEnd = normalizeDate(end)

			return normalizedDate > normalizedStart && normalizedDate < normalizedEnd
		},
		[type, tempRange, currentValue, normalizeDate]
	)

	const isTempRangeEdge = useCallback(
		(date: Date): boolean => {
			if (type !== 'range') return false

			const normalizedDate = normalizeDate(date)
			const isStart = tempRange[0] && isSameDay(normalizedDate, tempRange[0])
			const isEnd = tempRange[1] && isSameDay(normalizedDate, tempRange[1])
			return !!(isStart || isEnd)
		},
		[type, tempRange, isSameDay, normalizeDate]
	)

	// Navigation
	const handlePrevMonth = useCallback(
		(calendarIndex: 0 | 1): void => {
			if (calendarIndex === 0) {
				setCurrentMonth(
					new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
				)
			} else {
				setCurrentMonth2(
					new Date(currentMonth2.getFullYear(), currentMonth2.getMonth() - 1, 1)
				)
			}
		},
		[currentMonth, currentMonth2]
	)

	const handleNextMonth = useCallback(
		(calendarIndex: 0 | 1): void => {
			if (calendarIndex === 0) {
				setCurrentMonth(
					new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
				)
			} else {
				setCurrentMonth2(
					new Date(currentMonth2.getFullYear(), currentMonth2.getMonth() + 1, 1)
				)
			}
		},
		[currentMonth, currentMonth2]
	)

	// Clear value
	const handleClear = useCallback((): void => {
		const newValue = type === 'range' ? [null, null] : null
		setInternalValue(newValue as DateValue | RangeValue)
		setTempRange([null, null])
		setInputValues(['', ''])
		onChange?.(newValue as DateValue | RangeValue)
	}, [type, onChange])

	// Today action
	const handleToday = useCallback((): void => {
		const today = normalizeDate(new Date())

		if (!isDateDisabled(today)) {
			if (type === 'date') {
				setInternalValue(today)
				onChange?.(today)
				setInputValues([formatDate(today), ''])
				handleClose()
			} else {
				handleDateSelect(today)
			}
		}
	}, [
		type,
		onChange,
		handleClose,
		normalizeDate,
		isDateDisabled,
		formatDate,
		handleDateSelect,
	])

	// Sync months for range picker
	useEffect(() => {
		if (
			type === 'range' &&
			currentMonth.getMonth() === currentMonth2.getMonth()
		) {
			const nextMonth = new Date(
				currentMonth.getFullYear(),
				currentMonth.getMonth() + 1,
				1
			)
			setCurrentMonth2(nextMonth)
		}
	}, [type, currentMonth, currentMonth2])

	// Get placeholders
	const getPlaceholders = useCallback((): string => {
		if (typeof placeholder === 'string') {
			return placeholder
		}
		return placeholder[0]
	}, [placeholder])

	// Render single date input
	const renderDateInput = (): JSX.Element => (
		<div className='relative flex-1'>
			<InputMain
				ref={input1Ref}
				label={label}
				placeholder={getPlaceholders()}
				value={inputValues[0]}
				onChange={e => allowManualInput && handleInputChange(e.target.value)}
				icon={<Calendar className='w-4 h-4' />}
				size={size}
				disabled={disabled}
				required={required}
				error={error}
				success={success}
				onFocus={() => !disabled && setIsOpen(true)}
				className='cursor-pointer'
			/>
			{showClear && inputValues[0] && (
				<button
					onClick={handleClear}
					className='absolute right-8 top-1/2 transform -translate-y-1/2 p-1 hover:bg-secondary-100 rounded-full transition-all duration-200 group'
				>
					<X className='w-3 h-3 text-secondary-400 group-hover:text-secondary-600 group-hover:scale-110 transition-all' />
				</button>
			)}
		</div>
	)

	// Render range input (bitta inputda)
	const renderRangeInput = (): JSX.Element => (
		<div className='relative flex-1'>
			<InputMain
				ref={input1Ref}
				label={label}
				placeholder={getPlaceholders()}
				value={inputValues[0]}
				onChange={e => allowManualInput && handleInputChange(e.target.value)}
				icon={<Calendar className='w-4 h-4' />}
				size={size}
				disabled={disabled}
				required={required}
				error={error}
				success={success}
				onFocus={() => !disabled && setIsOpen(true)}
				className='cursor-pointer'
			/>
			{showClear && inputValues[0] && (
				<button
					onClick={handleClear}
					className='absolute right-8 top-1/2 transform -translate-y-1/2 p-1 hover:bg-secondary-100 rounded-full transition-all duration-200 group'
				>
					<X className='w-3 h-3 text-secondary-400 group-hover:text-secondary-600 group-hover:scale-110 transition-all' />
				</button>
			)}
		</div>
	)

	// Render calendar header
	const renderCalendarHeader = (
		date: Date,
		calendarIndex: 0 | 1
	): JSX.Element => (
		<div className='flex items-center justify-between mb-3 px-1'>
			<button
				onClick={() => handlePrevMonth(calendarIndex)}
				className='p-1 rounded hover:bg-secondary-100 transition-colors duration-200'
			>
				<ChevronLeft className='w-4 h-4 text-secondary-600' />
			</button>

			<div className='font-medium text-secondary-800 text-sm'>
				{currentLocale.months[date.getMonth()]} {date.getFullYear()}
			</div>

			<button
				onClick={() => handleNextMonth(calendarIndex)}
				className='p-1 rounded hover:bg-secondary-100 transition-colors duration-200'
			>
				<ChevronRight className='w-4 h-4 text-secondary-600' />
			</button>
		</div>
	)

	// Render calendar
	const renderCalendar = (date: Date, calendarIndex: 0 | 1): JSX.Element => {
		const days = getDaysInMonth(date)

		return (
			<div className='min-w-[248px] p-3 bg-white rounded-lg border border-secondary-200 shadow-sm'>
				{renderCalendarHeader(date, calendarIndex)}

				{/* Week Days */}
				<div className='grid grid-cols-7 gap-0.5 mb-2'>
					{currentLocale.weekdaysShort.map(day => (
						<div
							key={day}
							className='h-6 flex items-center justify-center text-xs text-secondary-500 font-medium'
						>
							{day}
						</div>
					))}
				</div>

				{/* Calendar Days */}
				<div className='grid grid-cols-7 gap-0.5'>
					{days.map(({ date: dayDate, isCurrentMonth, isDisabled }, index) => {
						const isToday = isSameDay(dayDate, new Date())
						const selected = isSelected(dayDate)
						const inRange = isInRange(dayDate)
						const isTempEdge = isTempRangeEdge(dayDate)

						return (
							<button
								key={index}
								onClick={() => !isDisabled && handleDateSelect(dayDate)}
								disabled={isDisabled}
								className={cn(
									'h-7 rounded text-sm transition-all duration-150 relative',
									'hover:scale-105 active:scale-95',
									isDisabled && 'opacity-30 cursor-not-allowed',
									!isCurrentMonth && 'text-secondary-400',
									isCurrentMonth &&
										!isDisabled &&
										!selected &&
										!isTempEdge &&
										'text-secondary-700 hover:bg-secondary-100',
									isToday &&
										!selected &&
										!isTempEdge &&
										'bg-secondary-100 text-secondary-800 font-medium',
									(selected || isTempEdge) &&
										'bg-secondary-500 text-white hover:bg-secondary-600',
									inRange &&
										!selected &&
										!isTempEdge &&
										'bg-secondary-50 text-secondary-700'
								)}
							>
								{dayDate.getDate()}
							</button>
						)
					})}
				</div>
			</div>
		)
	}

	return (
		<div ref={containerRef} className={cn('relative', className)}>
			{/* Input Field */}
			{type === 'date' ? renderDateInput() : renderRangeInput()}

			{/* Calendar Dropdown */}
			{isOpen && (
				<div
					ref={dropdownRef}
					className={cn(
						'absolute top-full mt-1 bg-white rounded-lg shadow-lg z-50 border border-secondary-200',
						'animate-in fade-in-0 zoom-in-95 duration-200',
						type === 'range' ? 'left-0 min-w-[512px]' : 'left-0 min-w-[248px]'
					)}
				>
					<div className={cn(type === 'range' ? 'flex gap-3 p-3' : 'p-3')}>
						{/* Single Calendar */}
						{type === 'date' && renderCalendar(currentMonth, 0)}

						{/* Dual Calendars for Range */}
						{type === 'range' && (
							<>
								{renderCalendar(currentMonth, 0)}
								{renderCalendar(currentMonth2, 1)}
							</>
						)}
					</div>

					{/* Today Button - Minimal footer */}
					{showToday && (
						<div className='px-3 py-2 border-t border-secondary-100'>
							<button
								onClick={handleToday}
								className='w-full py-1.5 text-sm text-secondary-600 hover:text-secondary-700 hover:bg-secondary-50 rounded transition-colors duration-200'
							>
								{currentLocale.today}
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default MciPicker
