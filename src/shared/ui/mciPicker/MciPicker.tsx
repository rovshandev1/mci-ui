import {Calendar, DoubleAltArrowLeft, DoubleAltArrowRight, AltArrowLeft, AltArrowRight} from '@solar-icons/react'
import {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import {cn, useClickOutside, useEscapeKey} from '../../lib/utils'
import MciInput from '../mciInput/MciInput'
import {Locale, locales} from '../../lib/locales'

type DateValue = Date | string | null
type RangeValue = [DateValue, DateValue]

export interface MciPickerProps {
    type?: 'date' | 'range'
    value?: DateValue | RangeValue
    onChange?: (value: any) => void
    placeholder?: string | [string, string]
    label?: string
    disabled?: boolean
    required?: boolean
    className?: string
    format?: string
    minDate?: Date
    maxDate?: Date
    error?: string
    showClear?: boolean
    allowManualInput?: boolean
    locale?: Locale
    startView?: 'day' | 'month' | 'year'
    iconPosition?: 'left' | 'right'
    align?: 'left' | 'right' | 'center' | 'auto'
}

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

        const safeDate = useCallback((d: DateValue | undefined): Date | null => {
            if (!d) return null
            const date = new Date(d)
            return isNaN(date.getTime()) ? null : date
        }, [])

        const [currentMonth, setCurrentMonth] = useState(new Date())
        const [view, setView] = useState<'day' | 'month' | 'year'>(startView)
        const [yearPage, setYearPage] = useState(0)
        const [displayValue, setDisplayValue] = useState('')
        const [dropdownAlign, setDropdownAlign] = useState(align)

        const containerRef = useRef<HTMLDivElement>(null)

        const currentValue = useMemo(() => {
            const val = value !== undefined ? value : internalValue
            if (type === 'date') return safeDate(val as DateValue)
            const range = val as RangeValue
            return [safeDate(range[0]), safeDate(range[1])]
        }, [value, internalValue, type, safeDate])

        const t = locales[locale]

        useEffect(() => {
            if (isOpen) {
                if (type === 'range') {
                    setTempRange(currentValue as RangeValue)
                }

                if (type === 'date') {
                    const date = currentValue as Date | null
                    if (date) setCurrentMonth(date)
                } else {
                    const [start, end] = currentValue as [Date | null, Date | null]
                    if (start) setCurrentMonth(start)
                    else if (end) setCurrentMonth(end)
                }
            }
        }, [isOpen])

        useEffect(() => {
            if (isOpen && align === 'auto' && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                const spaceRight = window.innerWidth - rect.right
                const spaceLeft = rect.left

                if (spaceRight < 300 && spaceLeft > 300) setDropdownAlign('right')
                else setDropdownAlign('left')
            }
        }, [isOpen, align])

        const normalize = useCallback((date: Date) => {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate())
        }, [])

        const isSameDay = useCallback(
            (a: Date, b: Date) => normalize(a).getTime() === normalize(b).getTime(),
            [normalize]
        )

        const isDisabled = useCallback(
            (date: Date) => {
                const d = normalize(date)
                if (minDate && d < normalize(minDate)) return true
                if (maxDate && d > normalize(maxDate)) return true
                return false
            },
            [minDate, maxDate, normalize]
        )

        const formatDate = useCallback(
            (date: Date | null): string => {
                if (!date) return ''
                const d = date.getDate().toString().padStart(2, '0')
                const m = (date.getMonth() + 1).toString().padStart(2, '0')
                const y = date.getFullYear()

                return format.replace('DD', d).replace('MM', m).replace('YYYY', y.toString())
            },
            [format]
        )

        const displayText = useMemo(() => {
            if (type === 'date') return formatDate(currentValue as Date | null)
            const [start, end] = currentValue as [Date | null, Date | null]
            if (!start && !end) return ''
            if (start && end) return `${formatDate(start)} - ${formatDate(end)}`
            return start ? `${formatDate(start)} - ...` : `...`
        }, [type, currentValue, formatDate])

        useEffect(() => {
            setDisplayValue(displayText)
        }, [displayText])

        const close = useCallback(() => {
            setIsOpen(false)
            setView(startView)
            setYearPage(0)
        }, [startView])

        const {handleClick: handleClickOutside} = useClickOutside(containerRef, close)
        const {handleEscape} = useEscapeKey(close)

        useEffect(() => {
            if (!isOpen) return
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleEscape)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
                document.removeEventListener('keydown', handleEscape)
            }
        }, [isOpen, handleClickOutside, handleEscape])

        const handleInputClear = useCallback(() => {
            const empty: DateValue | RangeValue = type === 'range' ? [null, null] : null
            setInternalValue(empty)
            setTempRange([null, null])
            onChange?.(empty)
        }, [type, onChange])

        const handleSelect = useCallback(
            (date: Date) => {
                if (isDisabled(date)) return
                const normalized = normalize(date)

                if (type === 'date') {
                    setInternalValue(normalized)
                    onChange?.(normalized)
                    close()
                } else {
                    const [start, end] = tempRange as [Date | null, Date | null]

                    if ((!start && !end) || (start && end)) {
                        setTempRange([normalized, null])
                    } else if (start && !end) {
                        const newRange: RangeValue = normalized < start ? [normalized, start] : [start, normalized]
                        setTempRange(newRange)
                        setInternalValue(newRange)
                        onChange?.(newRange)
                        close()
                    }
                }
            },
            [type, tempRange, isDisabled, normalize, onChange, close]
        )

        const handleSelectMonth = useCallback((monthIndex: number) => {
            const newDate = new Date(currentMonth.getFullYear(), monthIndex, 1);
            setCurrentMonth(newDate);

            if (startView === 'month') {
                setInternalValue(newDate);
                onChange?.(newDate);
                close();
            } else {
                setView('day');
            }
        }, [currentMonth, startView, onChange, close]);

        const handleSelectYear = useCallback((year: number) => {
            const newDate = new Date(year, currentMonth.getMonth(), 1);
            setCurrentMonth(newDate);

            if (startView === 'year') {
                setInternalValue(newDate);
                onChange?.(newDate);
                close();
            } else {
                setView('month');
            }
        }, [currentMonth, startView, onChange, close]);

        const changeMonth = (offset: number) => {
            setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1))
        }

        const changeYear = (offset: number) => {
            setCurrentMonth(prev => new Date(prev.getFullYear() + offset, prev.getMonth(), 1))
        }

        const getDays = useCallback((monthDate: Date) => {
            const year = monthDate.getFullYear()
            const month = monthDate.getMonth()
            const firstDay = new Date(year, month, 1).getDay()
            const daysInMonth = new Date(year, month + 1, 0).getDate()
            const days = []
            for (let i = firstDay; i > 0; i--) days.push({date: new Date(year, month, 1 - i), isCurrentMonth: false})
            for (let i = 1; i <= daysInMonth; i++) days.push({date: new Date(year, month, i), isCurrentMonth: true})
            const remaining = 42 - days.length
            for (let i = 1; i <= remaining; i++) days.push({date: new Date(year, month + 1, i), isCurrentMonth: false})
            return days
        }, [])

        const isSelectedStart = (date: Date) => {
            const d = normalize(date)
            if (type === 'date') return currentValue && isSameDay(d, currentValue as Date)

            const [s] = tempRange[0] ? tempRange as [Date, DateValue] : (currentValue as [DateValue, DateValue])
            const startNode = safeDate(s);
            return startNode && isSameDay(d, startNode)
        }

        const isSelectedEnd = (date: Date) => {
            if (type !== 'range') return false
            const d = normalize(date)
            const [, e] = tempRange[1] ? tempRange as [DateValue, Date] : (currentValue as [DateValue, DateValue])
            const endNode = safeDate(e);
            return endNode && isSameDay(d, endNode)
        }

        const isInRange = (date: Date) => {
            if (type !== 'range') return false
            const d = normalize(date)
            const [s, e] = tempRange[0] ? tempRange as [DateValue, DateValue] : (currentValue as [DateValue, DateValue])

            const startNode = safeDate(s);
            const endNode = safeDate(e);

            return startNode && endNode && d > normalize(startNode) && d < normalize(endNode)
        }

        const renderCalendarView = (baseDate: Date, showLeftArrow: boolean, showRightArrow: boolean) => {
            const days = getDays(baseDate)
            return (
                <div className="w-[300px] p-2 select-none">
                    <div className="flex items-center justify-between mb-4 py-1">
                        <div className="flex gap-2">
                            {showLeftArrow && (
                                <>
                                    <button onClick={() => changeYear(-1)} type="button"
                                            className="hover:bg-slate-100 p-1 rounded transition-colors">
                                        <DoubleAltArrowLeft size={18} className="text-slate-700"/></button>

                                    <button onClick={() => changeMonth(-1)} type="button"
                                            className="hover:bg-slate-100 p-1 rounded transition-colors"><AltArrowLeft
                                        size={18} className="text-slate-700"/></button>
                                </>
                            )}
                        </div>
                        <div className="flex gap-1 font-semibold text-slate-700 text-small">
                            <span className="cursor-pointer hover:text-blue-600 transition-colors"
                                  onClick={() => setView('month')}>{t.months[baseDate.getMonth()]}</span>

                            <span className="cursor-pointer hover:text-blue-600 transition-colors"
                                  onClick={() => setView('year')}>{baseDate.getFullYear()}</span>
                        </div>
                        <div className="flex gap-2">
                            {showRightArrow && (
                                <>
                                    <button onClick={() => changeMonth(1)} type="button"
                                            className="hover:bg-slate-100 p-1 rounded transition-colors"><AltArrowRight
                                        size={18} className="text-slate-700"/></button>

                                    <button onClick={() => changeYear(1)} type="button"
                                            className="hover:bg-slate-100 p-1 rounded transition-colors">
                                        <DoubleAltArrowRight size={18} className="text-slate-700"/></button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-7 mb-1 text-center text-[11px] font-bold text-blue-600 uppercase">
                        {t.weekdaysShort.map(day => <div key={day} className="py-1">{day}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-y-1 relative">
                        {days.map((item, idx) => {
                            const date = item.date, disabled = isDisabled(date), isStart = isSelectedStart(date),
                                isEnd = isSelectedEnd(date), isBetween = isInRange(date)
                            return (
                                <div key={idx}
                                     className={cn("h-10 flex items-center justify-center relative", isBetween && "bg-blue-50", isStart && type === 'range' && "bg-gradient-to-r from-transparent to-blue-50", isEnd && "bg-gradient-to-l from-transparent to-blue-50")}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(date)}
                                        disabled={disabled}
                                        className={cn("w-9 h-9 cursor-pointer rounded-full flex items-center justify-center text-small font-medium transition-all z-10", !item.isCurrentMonth ? "text-slate-300" : "text-slate-700", disabled && "opacity-20 cursor-not-allowed", (isStart || isEnd) ? "bg-blue-600 text-white" : "hover:bg-blue-50", isSameDay(date, new Date()) && !isStart && !isEnd && "text-blue-600 border border-blue-600")}
                                    >
                                        {date.getDate()}
                                    </button>
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
                    <button type="button" onClick={() => changeYear(-1)} className="p-1 hover:bg-slate-100 rounded">
                        <AltArrowLeft size={20}/>
                    </button>
                    <span className="font-bold text-slate-800">{currentMonth.getFullYear()}</span>
                    <button type="button" onClick={() => changeYear(1)} className="p-1 hover:bg-slate-100 rounded">
                        <AltArrowRight size={20}/>
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {t.monthsShort.map((m, i) => (
                        <button key={m}
                                type="button"
                                onClick={() => handleSelectMonth(i)}
                                className={cn("hover:cursor-pointer py-3 rounded-lg text-small font-semibold transition-colors", currentMonth.getMonth() === i ? "bg-blue-600 text-white" : "hover:bg-blue-50 text-slate-600")}>
                            {m}
                        </button>
                    ))}
                </div>
            </div>
        )

        const renderYearPicker = () => {
            const start = Math.floor(currentMonth.getFullYear() / 12) * 12 + (yearPage * 12)
            const years = Array.from({length: 12}, (_, i) => start + i)
            return (
                <div className="w-[300px] p-3">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <button type="button" onClick={() => setYearPage(p => p - 1)}
                                className="p-1 hover:bg-slate-100 rounded">
                            <AltArrowLeft size={20}/></button>
                        <span className="font-bold text-slate-800">{years[0]} - {years[11]}</span>
                        <button type="button" onClick={() => setYearPage(p => p + 1)}
                                className="p-1 hover:bg-slate-100 rounded">
                            <AltArrowRight size={20}/></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {years.map(y => (
                            <button key={y}
                                    type="button"
                                    onClick={() => handleSelectYear(y)}
                                    className={cn("hover:cursor-pointer py-3 rounded-lg text-small font-semibold transition-colors", currentMonth.getFullYear() === y ? "bg-blue-600 text-white" : "hover:bg-blue-50 text-slate-600")}>
                                {y}
                            </button>
                        ))}
                    </div>
                </div>
            )
        }

        const calendarIcon = <Calendar weight='Linear' size={20} className="text-slate-400"/>

        return (
            <div ref={containerRef} className={cn('relative w-full group', className)}>
                <div ref={ref}>
                    <MciInput
                        label={label}
                        placeholder={Array.isArray(placeholder) ? placeholder[0] : placeholder}
                        value={displayValue}
                        icon={iconPosition === 'left' ? calendarIcon : undefined}
                        rightIcon={iconPosition === 'right' ? calendarIcon : undefined}
                        disabled={disabled}
                        required={required}
                        error={error}
                        onFocus={() => {
                            if (!disabled) {
                                setIsOpen(true)
                                setView(startView)
                            }
                        }}
                        readOnly={!allowManualInput}
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
                        style={{width: 'max-content'}}
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