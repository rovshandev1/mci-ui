import {Calendar, DoubleAltArrowLeft, DoubleAltArrowRight, AltArrowLeft, AltArrowRight} from '@solar-icons/react'
import CloseIcon from "../../../assets/icons/close.svg?react"
import React, {
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

type DateValue = Date | null
type RangeValue = [DateValue, DateValue]

export interface MciPickerProps {
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
    error?: string
    showClear?: boolean
    allowManualInput?: boolean
    locale?: Locale
    startView?: 'day' | 'month' | 'year'
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

        const containerRef = useRef<HTMLDivElement>(null)

        const currentValue = value !== undefined ? value : internalValue
        const t = locales[locale]

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
                else if (maxDate && d > normalize(maxDate)) return true
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
            if (type === 'date') {
                return formatDate(currentValue as Date)
            }
            const [start, end] = currentValue as RangeValue
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
            if (type === 'range') {
                setTempRange(currentValue as RangeValue)
            }
        }, [type, currentValue, startView])

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

        const handleClear = useCallback(
            (e: React.MouseEvent) => {
                e.stopPropagation()
                const empty: DateValue | RangeValue = type === 'range' ? [null, null] : null
                setInternalValue(empty)
                setTempRange([null, null])
                setDisplayValue('')
                onChange?.(empty)
            },
            [type, onChange]
        )

        const handleSelect = useCallback(
            (date: Date) => {
                if (isDisabled(date)) return
                const normalized = normalize(date)

                if (type === 'date') {
                    setInternalValue(normalized)
                    onChange?.(normalized)
                    close()
                } else {
                    const [start, end] = tempRange

                    if ((!start && !end) || (start && end)) {
                        setTempRange([normalized, null])
                    } else if (start && !end) {
                        let newRange: RangeValue
                        if (normalized < start) {
                            newRange = [normalized, start]
                        } else {
                            newRange = [start, normalized]
                        }
                        setTempRange(newRange)
                        setInternalValue(newRange)
                        onChange?.(newRange)
                        close()
                    }
                }
            },
            [type, tempRange, isDisabled, normalize, onChange, close]
        )

        const changeMonth = (offset: number) => {
            setCurrentMonth((prev) => {
                const next = new Date(prev)
                next.setMonth(next.getMonth() + offset)
                return next
            })
        }

        const changeYear = (offset: number) => {
            setCurrentMonth((prev) => {
                const next = new Date(prev)
                next.setFullYear(next.getFullYear() + offset)
                return next
            })
        }

        const getDays = useCallback(
            (monthDate: Date) => {
                const year = monthDate.getFullYear()
                const month = monthDate.getMonth()
                const firstDayOfMonth = new Date(year, month, 1)
                const lastDayOfMonth = new Date(year, month + 1, 0)

                const days = []
                const startDay = firstDayOfMonth.getDay()

                for (let i = startDay; i > 0; i--) {
                    const d = new Date(year, month, 1 - i)
                    days.push({date: d, isCurrentMonth: false})
                }

                for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
                    const d = new Date(year, month, i)
                    days.push({date: d, isCurrentMonth: true})
                }

                const remaining = 42 - days.length
                for (let i = 1; i <= remaining; i++) {
                    const d = new Date(year, month + 1, i)
                    days.push({date: d, isCurrentMonth: false})
                }

                return days
            },
            []
        )

        const isSelectedStart = (date: Date) => {
            const d = normalize(date)
            if (type === 'date') return currentValue && isSameDay(d, currentValue as Date)
            const [s] = tempRange[0] ? tempRange : (currentValue as RangeValue)
            return s && isSameDay(d, s)
        }

        const isSelectedEnd = (date: Date) => {
            if (type !== 'range') return false
            const d = normalize(date)
            const [, e] = tempRange[1] ? tempRange : (currentValue as RangeValue)
            return e && isSameDay(d, e)
        }

        const isInRange = (date: Date) => {
            if (type !== 'range') return false
            const d = normalize(date)
            const [s, e] = tempRange[0] ? tempRange : (currentValue as RangeValue)
            if (!s || !e) return false
            return d > normalize(s) && d < normalize(e)
        }

        const isToday = (date: Date) => isSameDay(date, new Date())

        const renderCalendarView = (baseDate: Date, showLeftArrow: boolean, showRightArrow: boolean) => {
            const days = getDays(baseDate)

            return (
                <div className="w-[300px] p-2">
                    <div className="flex items-center justify-between mb-4 py-1">
                        <div className="flex items-center gap-3">
                            {showLeftArrow ? (
                                <>
                                    <button onClick={() => changeYear(-1)} className="hover:cursor-pointer">
                                        <DoubleAltArrowLeft weight='Linear' size={20} className="text-slate-700"/>
                                    </button>

                                    <button onClick={() => changeMonth(-1)} className="hover:cursor-pointer">
                                        <AltArrowLeft weight='Linear' size={20} className="text-slate-700"/>
                                    </button>
                                </>
                            ) : (
                                <div className="w-[52px]"/>
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            <span
                                className="font-medium text-small text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => {
                                    setView('month');
                                    setCurrentMonth(baseDate);
                                }}
                            >
                                {t.months[baseDate.getMonth()]}
                            </span>
                            <span
                                className="font-medium text-small text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => {
                                    setView('year');
                                    setCurrentMonth(baseDate);
                                }}
                            >
                                {baseDate.getFullYear()}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            {showRightArrow ? (
                                <>
                                    <button onClick={() => changeMonth(1)} className="hover:cursor-pointer">
                                        <AltArrowRight weight='Linear' size={20} className="text-slate-700"/>
                                    </button>

                                    <button onClick={() => changeYear(1)} className="hover:cursor-pointer">
                                        <DoubleAltArrowRight weight='Linear' size={20} className="text-slate-700"/>
                                    </button>
                                </>
                            ) : (
                                <div className="w-[52px]"/>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-7 mb-1">
                        {t.weekdaysShort.map((day) => (
                            <div key={day}
                                 className="h-4 flex items-center justify-center text-extra-small font-medium text-blue-600">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-1 relative">
                        {days.map((item, idx) => {
                            const date = item.date
                            const disabled = isDisabled(date)
                            const isStart = isSelectedStart(date)
                            const isEnd = isSelectedEnd(date)
                            const isBetween = isInRange(date)
                            const isCurrent = item.isCurrentMonth
                            const today = isToday(date)

                            let bgClass = ''
                            if (isBetween) bgClass = 'bg-blue-50'
                            if (isStart && (tempRange[1] || (currentValue as RangeValue)?.[1])) {
                                bgClass = 'bg-gradient-to-r from-transparent via-blue-50 to-blue-50 from-50%'
                            }
                            if (isEnd && (tempRange[0] || (currentValue as RangeValue)?.[0])) {
                                bgClass = 'bg-gradient-to-l from-transparent via-blue-50 to-blue-50 from-50%'
                            }

                            return (
                                <div
                                    key={idx}
                                    className={cn(
                                        "relative h-10 w-full flex items-center justify-center",
                                        bgClass
                                    )}
                                >
                                    <button
                                        onClick={() => handleSelect(date)}
                                        disabled={disabled}
                                        className={cn(
                                            "relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-small font-medium transition-all hover:cursor-pointer",
                                            !isCurrent ? "text-slate-base" : "text-slate-700",
                                            disabled && "opacity-30 cursor-not-allowed",
                                            !disabled && !isStart && !isEnd && isCurrent && "hover:bg-blue-50 hover:text-blue-600",
                                            (isStart || isEnd) && "bg-blue-600 text-white hover:bg-blue-600",
                                            today && !isStart && !isEnd && "text-blue-600 bg-blue-50"
                                        )}
                                    >
                                        {date.getDate()}
                                        {today && !isStart && !isEnd && (
                                            <span
                                                className="absolute top-1.5 right-1.5 w-1 h-1 bg-blue-600 rounded-full"/>
                                        )}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }

        const renderMonthPicker = () => (
            <div className="w-[300px] p-2">
                <div className="flex items-center justify-between mb-4 py-1">
                    <button onClick={() => changeYear(-1)} className="hover:cursor-pointer">
                        <AltArrowLeft weight='Linear' size={20} className="text-slate-700"/>
                    </button>

                    <span className="font-medium text-small text-slate-700">{currentMonth.getFullYear()}</span>

                    <button onClick={() => changeYear(1)} className="hover:cursor-pointer">
                        <AltArrowRight weight='Linear' size={20} className="text-slate-700"/>
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-1">
                    {t.monthsShort.map((m, i) => (
                        <button
                            key={m}
                            onClick={() => {
                                const newDate = new Date(currentMonth)
                                newDate.setMonth(i)
                                setCurrentMonth(newDate)
                                setView('day')
                            }}
                            className={cn(
                                "p-1 rounded-sm text-small font-medium hover:bg-blue-50 transition-colors hover:cursor-pointer",
                                currentMonth.getMonth() === i && "bg-blue-600 text-white hover:bg-blue-600"
                            )}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>
        )

        const renderYearPicker = () => {
            const centerYear = currentMonth.getFullYear()
            const startYear = (Math.floor(centerYear / 12) * 12) + (yearPage * 12)
            const years = Array.from({length: 12}, (_, i) => startYear + i)

            return (
                <div className="w-[300px] p-2">
                    <div className="flex items-center justify-between mb-4 py-1">
                        <button onClick={() => setYearPage((p) => p - 1)}
                                className="hover:cursor-pointer">
                            <AltArrowLeft weight='Linear' size={20} className="text-slate-700"/>
                        </button>

                        <span className="font-medium text-small text-slate-700">
                            {years[0]} - {years[11]}
                        </span>

                        <button onClick={() => setYearPage((p) => p + 1)}
                                className="hover:cursor-pointer">
                            <AltArrowRight weight='Linear' size={20} className="text-slate-700"/>
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                        {years.map((y) => (
                            <button
                                key={y}
                                onClick={() => {
                                    const newDate = new Date(currentMonth)
                                    newDate.setFullYear(y)
                                    setCurrentMonth(newDate)
                                    setView('month')
                                }}
                                className={cn(
                                    "p-1 rounded-sm text-small font-medium hover:bg-blue-50 transition-colors hover:cursor-pointer",
                                    currentMonth.getFullYear() === y && "bg-blue-600 text-white hover:bg-blue-600"
                                )}
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                </div>
            )
        }

        const nextMonthDate = new Date(currentMonth)
        nextMonthDate.setMonth(currentMonth.getMonth() + 1)

        return (
            <div ref={containerRef} className={cn('relative w-full', className)}>
                <div ref={ref}>
                    <MciInput
                        label={label}
                        placeholder={Array.isArray(placeholder) ? placeholder[0] : placeholder}
                        value={displayValue}
                        onChange={() => {
                        }}
                        icon={<Calendar weight='Linear' size={20} className="text-slate-500"/>}
                        disabled={disabled}
                        required={required}
                        error={error}
                        onFocus={() => !disabled && setIsOpen(true)}
                        readOnly={!allowManualInput}
                    />
                </div>

                {showClear && displayValue && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 z-10 hover:cursor-pointer"
                    >
                        <CloseIcon className="w-5 h-5 text-slate-400"/>
                    </button>
                )}

                {isOpen && (
                    <div
                        className="absolute top-full left-0 mt-1 z-50 bg-white rounded-lg shadow-md border border-slate-200 flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {view === 'day' ? (
                            <>
                                {renderCalendarView(currentMonth, true, type !== 'range')}
                                {type === 'range' && (
                                    <div className="hidden md:block border-l border-slate-200">
                                        {renderCalendarView(nextMonthDate, false, true)}
                                    </div>
                                )}
                            </>
                        ) : view === 'month' ? (
                            renderMonthPicker()
                        ) : (
                            renderYearPicker()
                        )}
                    </div>
                )}
            </div>
        )
    }
)

MciPicker.displayName = 'MciPicker'

export default MciPicker