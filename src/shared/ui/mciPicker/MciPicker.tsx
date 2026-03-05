import {
    Calendar,
    DoubleAltArrowLeft,
    DoubleAltArrowRight,
    AltArrowLeft,
    AltArrowRight
} from '@solar-icons/react'
import {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { cn, useClickOutside, useEscapeKey } from '../../lib/utils'
import { locales } from '../../lib/locales'
import {MciInput} from "../../../index.ts";
import type { DateValue, MciPickerProps, RangeValue } from '../../types/ui/picker.types'
import {
    formatDateByPattern,
    formatManualDateInput,
    getCalendarDays,
    isDateOutsideBounds,
    isSameCalendarDay,
    normalizeDate,
    parseDateFromInput,
    shiftMonth,
    shiftYear,
    toSafeDate,
} from './mci-picker.utils'

const MciPicker = forwardRef<HTMLDivElement, MciPickerProps>(
    (
        {
            type = 'date',
            value,
            onChange,
            placeholder,
            label,
            disabled = false,
            required = false,
            className,
            format = 'DD.MM.YYYY',
            minDate,
            maxDate,
            error,
            showClear = true,
            allowManualInput = true,
            locale = 'uz',
            startView = 'day',
            iconPosition = 'left',
            align = 'auto'
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false)
        const [internalValue, setInternalValue] = useState<DateValue | RangeValue>(
            type === 'range' ? [null, null] : null
        )
        const [tempRange, setTempRange] = useState<RangeValue>([null, null])

        const [currentMonth, setCurrentMonth] = useState(new Date())
        const [view, setView] = useState<'day' | 'month' | 'year'>(startView)
        const [yearPage, setYearPage] = useState(0)
        const [displayValue, setDisplayValue] = useState('')
        const [isInputFocused, setIsInputFocused] = useState(false)
        const [dropdownAlign, setDropdownAlign] = useState(align)

        const containerRef = useRef<HTMLDivElement>(null)

        const currentValue = useMemo(() => {
            const val = value !== undefined ? value : internalValue
            if (type === 'date') return toSafeDate(val as DateValue)
            const range = val as RangeValue
            return [toSafeDate(range[0]), toSafeDate(range[1])]
        }, [value, internalValue, type])

        const t = locales[locale]

        const formatDate = useCallback(
            (date: Date | null): string => {
                return formatDateByPattern(date, format)
            },
            [format]
        )

        const isDisabled = useCallback(
            (date: Date) => {
                return isDateOutsideBounds(date, minDate, maxDate)
            },
            [minDate, maxDate]
        )

        const displayText = useMemo(() => {
            if (type === 'date') return formatDate(currentValue as Date | null)
            const [start, end] = currentValue as [Date | null, Date | null]
            if (!start && !end) return ''
            if (start && end) return `${formatDate(start)} - ${formatDate(end)}`
            return start ? `${formatDate(start)} - ...` : `...`
        }, [type, currentValue, formatDate])

        useEffect(() => {
            if (!isOpen && !isInputFocused) {
                setDisplayValue(displayText)
            } else if (displayValue === '' && displayText !== '') {
                setDisplayValue(displayText)
            }
        }, [displayText, isOpen, displayValue, isInputFocused])

        useEffect(() => {
            if (isOpen) {
                if (type === 'range') {
                    const rangeVal = currentValue as [Date | null, Date | null]
                    setTempRange(rangeVal)
                    if (rangeVal[0]) setCurrentMonth(rangeVal[0])
                    else if (rangeVal[1]) setCurrentMonth(rangeVal[1])
                    else setCurrentMonth(new Date())
                } else {
                    const date = currentValue as Date | null
                    if (date) setCurrentMonth(date)
                    else setCurrentMonth(new Date())
                }
            }
        }, [isOpen, type, currentValue])

        useEffect(() => {
            if (isOpen && align === 'auto' && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                const spaceRight = window.innerWidth - rect.right
                const spaceLeft = rect.left
                if (spaceRight < 300 && spaceLeft > 300) setDropdownAlign('right')
                else setDropdownAlign('left')
            }
        }, [isOpen, align])

        const close = useCallback(() => {
            setIsOpen(false)
            setView(startView)
            setYearPage(0)
            setDisplayValue(displayText)
        }, [startView, displayText])

        const toggleOpen = useCallback((e: React.MouseEvent) => {
            if (disabled) return
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(prev => !prev)
        }, [disabled])

        const { handleClick: handleClickOutside } = useClickOutside(containerRef, close)
        const { handleEscape } = useEscapeKey(close)

        useEffect(() => {
            if (!isOpen) return
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleEscape)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
                document.removeEventListener('keydown', handleEscape)
            }
        }, [isOpen, handleClickOutside, handleEscape])

        const handleInputFocus = () => {
            setIsInputFocused(true)
            if (disabled || isOpen) return;
            if (type === 'range' || !allowManualInput) {
                setIsOpen(true);
                setView(startView);
            }
        };

        const handleInputBlur = () => {
            setIsInputFocused(false)
            if (type !== 'date') return

            const normalizedInput = displayValue.trim()
            if (!normalizedInput) {
                setInternalValue(null)
                onChange?.(null)
                return
            }

            const parsedDate = parseDateFromInput(normalizedInput)
            if (parsedDate && !isDisabled(parsedDate)) {
                const normalizedDate = normalizeDate(parsedDate)
                setInternalValue(normalizedDate)
                onChange?.(normalizedDate)
                setDisplayValue(formatDate(normalizedDate))
                setCurrentMonth(normalizedDate)
                return
            }

            setDisplayValue(displayText)
        }

        const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (type !== 'date') return
            const raw = e.target.value
            const formatted = formatManualDateInput(raw)
            const numbersOnly = formatted.replace(/\D/g, '')

            if (numbersOnly.length >= 1) {
                const dayFirst = Number.parseInt(numbersOnly[0] ?? '0', 10)
                if (dayFirst > 3) return
            }

            if (numbersOnly.length >= 2) {
                const day = Number.parseInt(numbersOnly.slice(0, 2), 10)
                if (day < 1 || day > 31) return
            }

            if (numbersOnly.length >= 3) {
                const monthFirst = Number.parseInt(numbersOnly[2] ?? '0', 10)
                if (monthFirst > 1) return
            }

            if (numbersOnly.length >= 4) {
                const month = Number.parseInt(numbersOnly.slice(2, 4), 10)
                if (month < 1 || month > 12) return
            }

            setDisplayValue(formatted)

            if (formatted.length === 10) {
                const date = parseDateFromInput(formatted)
                if (date && !isDisabled(date)) {
                    setInternalValue(date)
                    onChange?.(date)
                    setCurrentMonth(date)
                }
            } else if (formatted === '') {
                setInternalValue(null)
                onChange?.(null)
            }
        }

        const handleInputClear = useCallback(() => {
            const empty: DateValue | RangeValue = type === 'range' ? [null, null] : null
            setInternalValue(empty)
            setTempRange([null, null])
            onChange?.(empty)
            setDisplayValue('')
        }, [type, onChange])

        const handleSelect = useCallback(
            (date: Date) => {
                if (isDisabled(date)) return
                const normalized = normalizeDate(date)

                if (type === 'date') {
                    setInternalValue(normalized)
                    onChange?.(normalized)
                    setDisplayValue(formatDate(normalized))
                    close()
                } else {
                    const [start, end] = tempRange as [Date | null, Date | null]

                    if ((!start && !end) || (start && end)) {
                        setTempRange([normalized, null])
                        setDisplayValue(`${formatDate(normalized)} - ...`)
                    } else if (start && !end) {
                        const newRange: RangeValue = normalized < start ? [normalized, start] : [start, normalized]
                        setTempRange(newRange)
                        setInternalValue(newRange)
                        onChange?.(newRange)

                        const [s, e] = newRange as [Date, Date]
                        setDisplayValue(`${formatDate(s)} - ${formatDate(e)}`)
                        close()
                    }
                }
            },
            [type, tempRange, isDisabled, onChange, close, formatDate]
        )

        const handleSelectMonth = useCallback((monthIndex: number) => {
            const newDate = new Date(currentMonth.getFullYear(), monthIndex, 1);
            setCurrentMonth(newDate);

            if (startView === 'month' && type === 'date') {
                setInternalValue(newDate);
                onChange?.(newDate);
                setDisplayValue(formatDate(newDate))
                close();
            } else {
                setView('day');
            }
        }, [currentMonth, startView, onChange, close, type, formatDate]);

        const handleSelectYear = useCallback((year: number) => {
            const newDate = new Date(year, currentMonth.getMonth(), 1);
            setCurrentMonth(newDate);

            if (startView === 'year' && type === 'date') {
                setInternalValue(newDate);
                onChange?.(newDate);
                setDisplayValue(formatDate(newDate))
                close();
            } else {
                setView('month');
            }
        }, [currentMonth, startView, onChange, close, type, formatDate]);

        const changeMonth = (offset: number) => {
            setCurrentMonth((prev) => shiftMonth(prev, offset))
        }

        const changeYear = (offset: number) => {
            setCurrentMonth((prev) => shiftYear(prev, offset))
        }

        const isSameDay = useCallback((a: Date, b: Date) => isSameCalendarDay(a, b), [])

        const isSelectedStart = (date: Date) => {
            const d = normalizeDate(date)
            if (type === 'date') return currentValue && isSameDay(d, currentValue as Date)
            const [s] = tempRange[0] ? tempRange as [Date, DateValue] : (currentValue as [DateValue, DateValue])
            return toSafeDate(s) && isSameDay(d, toSafeDate(s)!)
        }

        const isSelectedEnd = (date: Date) => {
            if (type !== 'range') return false
            const d = normalizeDate(date)
            const [, e] = tempRange[1] ? tempRange as [DateValue, Date] : (currentValue as [DateValue, DateValue])
            return toSafeDate(e) && isSameDay(d, toSafeDate(e)!)
        }

        const isInRange = (date: Date) => {
            if (type !== 'range') return false
            const d = normalizeDate(date)
            const [s, e] = tempRange[0] ? tempRange as [DateValue, DateValue] : (currentValue as [DateValue, DateValue])
            const startNode = toSafeDate(s), endNode = toSafeDate(e);
            if (startNode && !endNode) return false;
            return startNode && endNode && d > normalizeDate(startNode) && d < normalizeDate(endNode)
        }

        const renderCalendarView = (baseDate: Date, showLeftArrow: boolean, showRightArrow: boolean) => {
            const days = getCalendarDays(baseDate)
            return (
                <div className="w-[300px] p-2 select-none">
                    <div className="flex items-center justify-between mb-4 py-1">
                        <div className="flex gap-2 w-16">
                            {showLeftArrow && (
                                <>
                                    <button onClick={() => changeYear(-1)} type="button" className="hover:bg-slate-100 p-1 rounded transition-colors text-slate-500"><DoubleAltArrowLeft size={18} /></button>
                                    <button onClick={() => changeMonth(-1)} type="button" className="hover:bg-slate-100 p-1 rounded transition-colors text-slate-500"><AltArrowLeft size={18} /></button>
                                </>
                            )}
                        </div>
                        <div className="flex gap-1 font-semibold text-slate-700 text-sm whitespace-nowrap">
                            <span className="cursor-pointer hover:text-blue-600 transition-colors p-1 rounded hover:bg-slate-50" onClick={() => setView('month')}>{t.months[baseDate.getMonth()]}</span>
                            <span className="cursor-pointer hover:text-blue-600 transition-colors p-1 rounded hover:bg-slate-50" onClick={() => setView('year')}>{baseDate.getFullYear()}</span>
                        </div>
                        <div className="flex gap-2 w-16 justify-end">
                            {showRightArrow && (
                                <>
                                    <button onClick={() => changeMonth(1)} type="button" className="hover:bg-slate-100 p-1 rounded transition-colors text-slate-500"><AltArrowRight size={18} /></button>
                                    <button onClick={() => changeYear(1)} type="button" className="hover:bg-slate-100 p-1 rounded transition-colors text-slate-500"><DoubleAltArrowRight size={18} /></button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-7 mb-1 text-center text-[11px] font-bold text-blue-600 uppercase">{t.weekdaysShort.map(day => <div key={day} className="py-1">{day}</div>)}</div>
                    <div className="grid grid-cols-7 gap-y-1 relative">
                        {days.map((item, idx) => {
                            const date = item.date, disabled = isDisabled(date), isStart = isSelectedStart(date), isEnd = isSelectedEnd(date), isBetween = isInRange(date)
                            return (
                                <div key={idx} className={cn("h-10 flex items-center justify-center relative", isBetween && "bg-blue-50", (isStart && type === 'range' && isEnd) ? "bg-blue-50 rounded-full" : (isStart && type === 'range') ? "bg-gradient-to-r from-transparent to-blue-50 rounded-l-full" : "", (isEnd && type === 'range') ? "bg-gradient-to-l from-transparent to-blue-50 rounded-r-full" : "")}>
                                    <button type="button" onClick={() => handleSelect(date)} disabled={disabled} className={cn("w-9 h-9 cursor-pointer rounded-full flex items-center justify-center text-sm font-medium transition-all z-10", !item.isCurrentMonth ? "text-slate-300" : "text-slate-700", disabled && "opacity-20 cursor-not-allowed", (isStart || isEnd) ? "bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700" : "hover:bg-blue-50", isSameDay(date, new Date()) && !isStart && !isEnd && "text-blue-600 border border-blue-600")}>{date.getDate()}</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }

        const renderMonthPicker = () => (
            <div className="w-[300px] p-3">
                <div className="flex justify-between items-center mb-4 px-2">
                    <button type="button" onClick={() => changeYear(-1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><AltArrowLeft size={20} /></button>
                    <span className="font-bold text-slate-800">{currentMonth.getFullYear()}</span>
                    <button type="button" onClick={() => changeYear(1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><AltArrowRight size={20} /></button>
                </div>
                <div className="grid grid-cols-3 gap-2">{t.monthsShort.map((m, i) => <button key={m} type="button" onClick={() => handleSelectMonth(i)} className={cn("hover:cursor-pointer py-3 rounded-lg text-sm font-semibold transition-colors", currentMonth.getMonth() === i ? "bg-blue-600 text-white" : "hover:bg-blue-50 text-slate-600")}>{m}</button>)}</div>
            </div>
        )

        const renderYearPicker = () => {
            const start = Math.floor(currentMonth.getFullYear() / 12) * 12 + (yearPage * 12)
            const years = Array.from({ length: 12 }, (_, i) => start + i)
            return (
                <div className="w-[300px] p-3">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <button type="button" onClick={() => setYearPage(p => p - 1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><AltArrowLeft size={20} /></button>
                        <span className="font-bold text-slate-800">{years[0]} - {years[11]}</span>
                        <button type="button" onClick={() => setYearPage(p => p + 1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><AltArrowRight size={20} /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">{years.map(y => <button key={y} type="button" onClick={() => handleSelectYear(y)} className={cn("hover:cursor-pointer py-3 rounded-lg text-sm font-semibold transition-colors", currentMonth.getFullYear() === y ? "bg-blue-600 text-white" : "hover:bg-blue-50 text-slate-600")}>{y}</button>)}</div>
                </div>
            )
        }

        const calendarIcon = (
            <div
                onClick={toggleOpen}
                className={cn(
                    "cursor-pointer flex items-center justify-center p-1 rounded-md transition-colors",
                    disabled ? "pointer-events-none opacity-50" : "hover:bg-slate-100 active:bg-slate-200"
                )}
            >
                <Calendar weight='Linear' size={20} className="text-slate-400" />
            </div>
        )

        return (
            <div ref={containerRef} className={cn('relative w-full group', className)}>
                <div ref={ref}>
                    <MciInput
                        label={label}
                        placeholder={Array.isArray(placeholder) ? placeholder[0] : placeholder}
                        value={displayValue}
                        onChange={handleManualInputChange}
                        icon={iconPosition === 'left' ? calendarIcon : undefined}
                        rightIcon={iconPosition === 'right' ? calendarIcon : undefined}
                        disabled={disabled}
                        required={required}
                        error={error}
                        maxLength={type === 'date' ? 10 : undefined}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        readOnly={!allowManualInput || type === 'range'}
                        showClearButton={showClear}
                        onClear={handleInputClear}
                    />
                </div>

                {isOpen && (
                    <div
                        className={cn(
                            "absolute top-[calc(100%+4px)] z-[100] bg-white rounded-xl shadow-xl border border-slate-200",
                            "flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200",
                            dropdownAlign === 'right' && "right-0 origin-top-right",
                            dropdownAlign === 'left' && "left-0 origin-top-left",
                            dropdownAlign === 'center' && "left-1/2 -translate-x-1/2 origin-top"
                        )}
                        style={{ width: 'max-content' }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {view === 'day' ? (
                            <>
                                {renderCalendarView(currentMonth, true, type !== 'range')}
                                {type === 'range' && (
                                    <div className="hidden md:block border-l border-slate-100">
                                        {renderCalendarView(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1), false, true)}
                                    </div>
                                )}
                            </>
                        ) : view === 'month' ? renderMonthPicker() : renderYearPicker()}
                    </div>
                )}
            </div>
        )
    }
)

MciPicker.displayName = 'MciPicker'
export default MciPicker
