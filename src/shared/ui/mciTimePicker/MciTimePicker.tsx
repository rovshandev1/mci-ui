import { ClockCircle } from '@solar-icons/react'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'
import { cn, useClickOutside, useEscapeKey } from '../../lib/utils'
import type {
    MciTimePickerMode,
    MciTimePickerProps,
    MciTimePickerValue,
} from '../../types/ui/time-picker.types'
import MciInput from '../mciInput/MciInput.tsx'

const padTimePart = (value: number) => value.toString().padStart(2, '0')

const formatTime = (hours: number, minutes: number) => {
    return `${padTimePart(hours)}:${padTimePart(minutes)}`
}

const formatPickerValue = (mode: MciTimePickerMode, hours: number, minutes: number) => {
    if (mode === 'minute') return padTimePart(minutes)
    return formatTime(hours, minutes)
}

const parseTime = (value: MciTimePickerValue | undefined, mode: MciTimePickerMode) => {
    if (!value) return null

    const digits = value.replace(/\D/g, '')
    if (mode === 'minute') {
        if (digits.length < 1 || digits.length > 2) return null

        const minutes = Number.parseInt(digits, 10)
        if (minutes < 0 || minutes > 59) return null

        return { hours: 0, minutes }
    }

    if (digits.length !== 4) return null

    const hours = Number.parseInt(digits.slice(0, 2), 10)
    const minutes = Number.parseInt(digits.slice(2, 4), 10)
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null

    return { hours, minutes }
}

const formatManualTimeInput = (value: string, mode: MciTimePickerMode) => {
    const numbers = value.replace(/\D/g, '').slice(0, mode === 'minute' ? 2 : 4)
    if (mode === 'minute') return numbers
    if (numbers.length > 2) return `${numbers.slice(0, 2)}:${numbers.slice(2)}`
    return numbers
}

const MciTimePicker = forwardRef<HTMLDivElement, MciTimePickerProps>(
    (
        {
            value,
            onChange,
            mode = 'time',
            placeholder,
            label,
            darkMode = false,
            disabled = false,
            required = false,
            className,
            error,
            showClear = true,
            allowManualInput = true,
            iconPosition = 'left',
            size = 'base',
            minuteStep = 1,
            align = 'auto',
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false)
        const [internalValue, setInternalValue] = useState<MciTimePickerValue>(null)
        const [displayValue, setDisplayValue] = useState('')
        const [isInputFocused, setIsInputFocused] = useState(false)
        const [dropdownAlign, setDropdownAlign] = useState(align)
        const [draftHours, setDraftHours] = useState('00')
        const [draftMinutes, setDraftMinutes] = useState('00')

        const containerRef = useRef<HTMLDivElement>(null)

        const currentValue = value !== undefined ? value : internalValue
        const currentTime = useMemo(() => parseTime(currentValue, mode), [currentValue, mode])
        const safeMinuteStep = Math.min(Math.max(Math.floor(minuteStep) || 1, 1), 59)
        const inputPlaceholder = placeholder ?? (mode === 'minute' ? 'mm' : 'HH:mm')

        const commitValue = useCallback(
            (nextValue: MciTimePickerValue) => {
                if (value === undefined) setInternalValue(nextValue)
                onChange?.(nextValue)
            },
            [onChange, value]
        )

        const syncDraft = useCallback(() => {
            const time = parseTime(currentValue, mode)
            setDraftHours(padTimePart(time?.hours ?? 0))
            setDraftMinutes(padTimePart(time?.minutes ?? 0))
        }, [currentValue, mode])

        const open = useCallback(() => {
            if (disabled) return
            syncDraft()
            setIsOpen(true)
        }, [disabled, syncDraft])

        const close = useCallback(() => {
            setIsOpen(false)
            setDisplayValue(
                currentTime ? formatPickerValue(mode, currentTime.hours, currentTime.minutes) : ''
            )
        }, [currentTime, mode])

        const toggleOpen = useCallback(
            (e: MouseEvent) => {
                e.preventDefault()
                e.stopPropagation()
                if (isOpen) close()
                else open()
            },
            [close, isOpen, open]
        )

        const { handleClick: handleClickOutside } = useClickOutside(containerRef, close)
        const { handleEscape } = useEscapeKey(close)

        useEffect(() => {
            if (!isOpen && !isInputFocused) {
                setDisplayValue(
                    currentTime
                        ? formatPickerValue(mode, currentTime.hours, currentTime.minutes)
                        : ''
                )
            }
        }, [currentTime, isInputFocused, isOpen, mode])

        useEffect(() => {
            if (isOpen && align === 'auto' && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                const spaceRight = window.innerWidth - rect.right
                const spaceLeft = rect.left
                if (spaceRight < 260 && spaceLeft > 260) setDropdownAlign('right')
                else setDropdownAlign('left')
            }
        }, [align, isOpen])

        useEffect(() => {
            if (!isOpen) return
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleEscape)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
                document.removeEventListener('keydown', handleEscape)
            }
        }, [handleClickOutside, handleEscape, isOpen])

        const handleInputFocus = () => {
            setIsInputFocused(true)
            if (!allowManualInput) open()
        }

        const handleInputBlur = () => {
            setIsInputFocused(false)
            if (!allowManualInput) return

            const normalizedInput = displayValue.trim()
            if (!normalizedInput) {
                commitValue(null)
                return
            }

            const parsedTime = parseTime(normalizedInput, mode)
            if (parsedTime) {
                const formatted = formatPickerValue(mode, parsedTime.hours, parsedTime.minutes)
                commitValue(formatted)
                setDisplayValue(formatted)
                return
            }

            setDisplayValue(
                currentTime ? formatPickerValue(mode, currentTime.hours, currentTime.minutes) : ''
            )
        }

        const handleManualInputChange = (e: ChangeEvent<HTMLInputElement>) => {
            if (!allowManualInput) return

            const formatted = formatManualTimeInput(e.target.value, mode)
            const numbersOnly = formatted.replace(/\D/g, '')

            if (mode === 'minute') {
                if (numbersOnly.length >= 2 && Number.parseInt(numbersOnly, 10) > 59) return
            } else {
                if (numbersOnly.length >= 1 && Number.parseInt(numbersOnly[0] ?? '0', 10) > 2) return
                if (numbersOnly.length >= 2 && Number.parseInt(numbersOnly.slice(0, 2), 10) > 23) return
                if (numbersOnly.length >= 3 && Number.parseInt(numbersOnly[2] ?? '0', 10) > 5) return
                if (numbersOnly.length >= 4 && Number.parseInt(numbersOnly.slice(2, 4), 10) > 59) return
            }

            setDisplayValue(formatted)

            if ((mode === 'minute' && formatted.length === 2) || formatted.length === 5) {
                const parsedTime = parseTime(formatted, mode)
                if (parsedTime) {
                    commitValue(formatPickerValue(mode, parsedTime.hours, parsedTime.minutes))
                }
            } else if (formatted === '') {
                commitValue(null)
            }
        }

        const handleInputClear = useCallback(() => {
            commitValue(null)
            setDisplayValue('')
            setDraftHours('00')
            setDraftMinutes('00')
        }, [commitValue])

        const handleDraftChange = (part: 'hours' | 'minutes', nextValue: string) => {
            const numbers = nextValue.replace(/\D/g, '').slice(0, 2)
            if (part === 'hours' && numbers.length === 2 && Number.parseInt(numbers, 10) > 23) return
            if (part === 'minutes' && numbers.length === 2 && Number.parseInt(numbers, 10) > 59) return

            if (part === 'hours') setDraftHours(numbers)
            else setDraftMinutes(numbers)
        }

        const shiftDraft = (part: 'hours' | 'minutes', offset: number) => {
            if (part === 'hours') {
                const current = Number.parseInt(draftHours || '0', 10)
                const next = (current + offset + 24) % 24
                setDraftHours(padTimePart(next))
                return
            }

            const current = Number.parseInt(draftMinutes || '0', 10)
            const next = (current + offset + 60) % 60
            setDraftMinutes(padTimePart(next))
        }

        const commitDraft = () => {
            const hours = Number.parseInt(draftHours || '0', 10)
            const minutes = Number.parseInt(draftMinutes || '0', 10)
            const normalizedHours = Math.min(Math.max(hours, 0), 23)
            const normalizedMinutes = Math.min(Math.max(minutes, 0), 59)
            const formatted = formatPickerValue(mode, normalizedHours, normalizedMinutes)

            commitValue(formatted)
            setDisplayValue(formatted)
            setDraftHours(padTimePart(normalizedHours))
            setDraftMinutes(padTimePart(normalizedMinutes))
            setIsOpen(false)
        }

        const clockIcon = (
            <div
                onClick={toggleOpen}
                className={cn(
                    'flex cursor-pointer items-center justify-center rounded-md p-1 transition-colors',
                    disabled
                        ? 'pointer-events-none opacity-50'
                        : darkMode
                            ? 'hover:bg-neutral-300 active:bg-neutral-200'
                            : 'hover:bg-slate-100 active:bg-slate-200'
                )}
            >
                <ClockCircle
                    weight="Linear"
                    size={20}
                    className={cn(
                        darkMode
                            ? isOpen || isInputFocused
                                ? 'text-white'
                                : 'text-neutral-100'
                            : 'text-slate-400'
                    )}
                />
            </div>
        )

        return (
            <div ref={containerRef} className={cn('relative w-full group', className)}>
                <div ref={ref}>
                    <MciInput
                        label={label}
                        placeholder={inputPlaceholder}
                        value={displayValue}
                        onChange={handleManualInputChange}
                        icon={iconPosition === 'left' ? clockIcon : undefined}
                        rightIcon={iconPosition === 'right' ? clockIcon : undefined}
                        disabled={disabled}
                        required={required}
                        error={error}
                        darkMode={darkMode}
                        size={size}
                        maxLength={mode === 'minute' ? 2 : 5}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        readOnly={!allowManualInput}
                        showClearButton={showClear}
                        onClear={handleInputClear}
                    />
                </div>

                {isOpen && (
                    <div
                        className={cn(
                            'absolute top-[calc(100%+4px)] z-100 rounded-xl border p-3 shadow-xl',
                            'animate-in fade-in zoom-in-95 duration-200',
                            mode === 'minute' ? 'w-[168px]' : 'w-60',
                            darkMode
                                ? 'border-neutral-200 bg-[#1F2025] text-neutral-50'
                                : 'border-slate-200 bg-white text-slate-700',
                            dropdownAlign === 'right' && 'right-0 origin-top-right',
                            dropdownAlign === 'left' && 'left-0 origin-top-left',
                            dropdownAlign === 'center' && 'left-1/2 -translate-x-1/2 origin-top'
                        )}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className={cn('grid gap-3', mode === 'minute' ? 'grid-cols-1' : 'grid-cols-2')}>
                            {mode === 'time' && (
                                <div>
                                    <span className={cn('mb-2 block text-center text-xs font-semibold', darkMode ? 'text-neutral-100' : 'text-slate-500')}>
                                        Hour
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => shiftDraft('hours', 1)}
                                        className={cn(
                                            'mb-1 h-8 w-full rounded-md text-lg leading-none transition-colors hover:cursor-pointer',
                                            darkMode ? 'hover:bg-neutral-300' : 'hover:bg-slate-100'
                                        )}
                                    >
                                        +
                                    </button>
                                    <input
                                        value={draftHours}
                                        onChange={(e) => handleDraftChange('hours', e.target.value)}
                                        className={cn(
                                            'h-10 w-full rounded-md border px-2 text-center text-base font-semibold outline-none',
                                            darkMode ? 'border-neutral-300 bg-[#1F2025]' : 'border-slate-200 bg-white'
                                        )}
                                        inputMode="numeric"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => shiftDraft('hours', -1)}
                                        className={cn(
                                            'mt-1 h-8 w-full rounded-md text-lg leading-none transition-colors hover:cursor-pointer',
                                            darkMode ? 'hover:bg-neutral-300' : 'hover:bg-slate-100'
                                        )}
                                    >
                                        -
                                    </button>
                                </div>
                            )}

                            <div>
                                <span className={cn('mb-2 block text-center text-xs font-semibold', darkMode ? 'text-neutral-100' : 'text-slate-500')}>
                                    Minute
                                </span>
                                <button
                                    type="button"
                                    onClick={() => shiftDraft('minutes', safeMinuteStep)}
                                    className={cn(
                                        'mb-1 h-8 w-full rounded-md text-lg leading-none transition-colors hover:cursor-pointer',
                                        darkMode ? 'hover:bg-neutral-300' : 'hover:bg-slate-100'
                                    )}
                                >
                                    +
                                </button>
                                <input
                                    value={draftMinutes}
                                    onChange={(e) => handleDraftChange('minutes', e.target.value)}
                                    className={cn(
                                        'h-10 w-full rounded-md border px-2 text-center text-base font-semibold outline-none',
                                        darkMode ? 'border-neutral-300 bg-[#1F2025]' : 'border-slate-200 bg-white'
                                    )}
                                    inputMode="numeric"
                                />
                                <button
                                    type="button"
                                    onClick={() => shiftDraft('minutes', -safeMinuteStep)}
                                    className={cn(
                                        'mt-1 h-8 w-full rounded-md text-lg leading-none transition-colors hover:cursor-pointer',
                                        darkMode ? 'hover:bg-neutral-300' : 'hover:bg-slate-100'
                                    )}
                                >
                                    -
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={commitDraft}
                            className="mt-3 h-9 w-full rounded-md bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 hover:cursor-pointer"
                        >
                            OK
                        </button>
                    </div>
                )}
            </div>
        )
    }
)

MciTimePicker.displayName = 'MciTimePicker'
export default MciTimePicker
