import { ClockCircle } from '@solar-icons/react'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'
import { cn, useClickOutside, useEscapeKey } from '../../lib/utils'
import type {
    MciTimePickerLocale,
    MciTimePickerMode,
    MciTimePickerProps,
    MciTimePickerValue,
    MciTimePickerVariant,
} from '../../types/ui/time-picker.types'
import MciInput from '../mciInput/MciInput.tsx'

const padTimePart = (value: number) => value.toString().padStart(2, '0')
const MAX_DURATION_DAYS = 31

const TIME_PICKER_LOCALES = {
    en: {
        day: 'Day',
        hour: 'Hour',
        minute: 'Minute',
        ok: 'OK',
        timePlaceholder: 'Hour:minute',
        durationPlaceholder: 'Days, hours, minutes',
        units: { day: 'day', hour: 'hr', minute: 'min' },
    },
    uz: {
        day: 'Kun',
        hour: 'Soat',
        minute: 'Minut',
        ok: 'OK',
        timePlaceholder: 'Soat:minut',
        durationPlaceholder: 'Kun, soat, minut',
        units: { day: 'kunda', hour: 'soat', minute: 'min' },
    },
    ru: {
        day: 'День',
        hour: 'Час',
        minute: 'Минута',
        ok: 'OK',
        timePlaceholder: 'Часы:минуты',
        durationPlaceholder: 'Дни, часы, минуты',
        units: { day: 'дн', hour: 'ч', minute: 'мин' },
    },
} as const satisfies Record<MciTimePickerLocale, unknown>

const TIME_PICKER_VARIANTS = {
    blue: {
        button: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-[rgba(21,93,252,0.25)]',
        darkButton: 'bg-blue-500 text-black hover:bg-blue-400 focus:ring-blue-500/35',
        step: 'text-blue-600 hover:bg-blue-50',
        darkStep: 'text-blue-300 hover:bg-blue-500/10',
        input: 'focus:border-blue-500 focus:ring-blue-500/20',
    },
    yellow: {
        button: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-300',
        darkButton: 'bg-yellow-400 text-slate-950 hover:bg-yellow-300 focus:ring-yellow-300/40',
        step: 'text-yellow-600 hover:bg-yellow-50',
        darkStep: 'text-yellow-300 hover:bg-yellow-500/10',
        input: 'focus:border-yellow-500 focus:ring-yellow-500/20',
    },
    orange: {
        button:
            'bg-orange-600 text-white hover:bg-orange-700 focus:ring-[rgba(227,98,12,0.25)]',
        darkButton:
            'bg-orange-500 text-black hover:bg-orange-400 focus:ring-[rgba(227,98,12,0.25)]',
        step: 'text-orange-600 hover:bg-orange-50',
        darkStep: 'text-orange-300 hover:bg-orange-500/10',
        input: 'focus:border-orange-500 focus:ring-orange-500/20',
    },
} as const satisfies Record<MciTimePickerVariant, unknown>

const formatTime = (hours: number, minutes: number) => {
    return `${padTimePart(hours)}:${padTimePart(minutes)}`
}

const formatDuration = (
    days: number,
    hours: number,
    minutes: number,
    locale: MciTimePickerLocale,
    durationFormat: MciTimePickerProps['durationFormat'] = 'text'
) => {
    if (durationFormat === 'dot') {
        return `${padTimePart(days)}.${padTimePart(hours)}.${padTimePart(minutes)}`
    }

    const { units } = TIME_PICKER_LOCALES[locale]
    return `${padTimePart(days)} ${units.day} ${padTimePart(hours)} ${units.hour} ${padTimePart(minutes)} ${units.minute}`
}

const formatPickerValue = (
    mode: MciTimePickerMode,
    days: number,
    hours: number,
    minutes: number,
    locale: MciTimePickerLocale,
    durationFormat: MciTimePickerProps['durationFormat'] = 'text'
) => {
    if (mode === 'duration') return formatDuration(days, hours, minutes, locale, durationFormat)
    return formatTime(hours, minutes)
}

const getPickerValue = (
    mode: MciTimePickerMode,
    days: number,
    hours: number,
    minutes: number,
    locale: MciTimePickerLocale,
    durationFormat: MciTimePickerProps['durationFormat'] = 'text'
) => {
    if (mode === 'duration' && days === 0 && hours === 0 && minutes === 0) return null
    return formatPickerValue(mode, days, hours, minutes, locale, durationFormat)
}

const getPickerDisplayValue = (
    mode: MciTimePickerMode,
    days: number,
    hours: number,
    minutes: number,
    locale: MciTimePickerLocale,
    durationFormat: MciTimePickerProps['durationFormat'] = 'text'
) => {
    return getPickerValue(mode, days, hours, minutes, locale, durationFormat) ?? ''
}

const parseTime = (value: MciTimePickerValue | undefined, mode: MciTimePickerMode) => {
    if (!value) return null

    const digits = value.replace(/\D/g, '')
    if (mode === 'duration') {
        if (digits.length !== 6) return null

        const days = Number.parseInt(digits.slice(0, 2), 10)
        const hours = Number.parseInt(digits.slice(2, 4), 10)
        const minutes = Number.parseInt(digits.slice(4, 6), 10)
        if (
            days < 0 ||
            days > MAX_DURATION_DAYS ||
            hours < 0 ||
            hours > 23 ||
            minutes < 0 ||
            minutes > 59
        )
            return null

        return { days, hours, minutes }
    }

    if (digits.length !== 4) return null

    const hours = Number.parseInt(digits.slice(0, 2), 10)
    const minutes = Number.parseInt(digits.slice(2, 4), 10)
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null

    return { days: 0, hours, minutes }
}

const formatManualTimeInput = (
    value: string,
    mode: MciTimePickerMode,
    locale: MciTimePickerLocale,
    durationFormat: MciTimePickerProps['durationFormat'] = 'text'
) => {
    const numbers = value.replace(/\D/g, '').slice(0, mode === 'duration' ? 6 : 4)
    if (mode === 'duration') {
        if (durationFormat === 'dot') {
            if (numbers.length > 4) {
                return `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(4)}`
            }
            if (numbers.length > 2) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
            return numbers
        }

        const { units } = TIME_PICKER_LOCALES[locale]
        if (numbers.length > 4) {
            return `${numbers.slice(0, 2)} ${units.day} ${numbers.slice(2, 4)} ${units.hour} ${numbers.slice(4)}`
        }
        if (numbers.length > 2) return `${numbers.slice(0, 2)} ${units.day} ${numbers.slice(2)}`
        return numbers
    }
    if (numbers.length > 2) return `${numbers.slice(0, 2)}:${numbers.slice(2)}`
    return numbers
}

const MciTimePicker = forwardRef<HTMLDivElement, MciTimePickerProps>(
    (
        {
            value,
            onChange,
            mode = 'time',
            durationFormat = 'text',
            variant = 'orange',
            locale = 'en',
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
        const [draftDays, setDraftDays] = useState('00')
        const [draftHours, setDraftHours] = useState('00')
        const [draftMinutes, setDraftMinutes] = useState('00')

        const containerRef = useRef<HTMLDivElement>(null)

        const currentValue = value !== undefined ? value : internalValue
        const currentTime = useMemo(() => parseTime(currentValue, mode), [currentValue, mode])
        const safeMinuteStep = Math.min(Math.max(Math.floor(minuteStep) || 1, 1), 59)
        const localeText = TIME_PICKER_LOCALES[locale]
        const variantClasses = TIME_PICKER_VARIANTS[variant]
        const inputPlaceholder =
            placeholder ??
            (mode === 'duration' ? localeText.durationPlaceholder : localeText.timePlaceholder)

        const commitValue = useCallback(
            (nextValue: MciTimePickerValue) => {
                if (value === undefined) setInternalValue(nextValue)
                onChange?.(nextValue)
            },
            [onChange, value]
        )

        const syncDraft = useCallback(() => {
            const time = parseTime(currentValue, mode)
            setDraftDays(padTimePart(time?.days ?? 0))
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
                currentTime
                    ? getPickerDisplayValue(
                          mode,
                          currentTime.days,
                          currentTime.hours,
                          currentTime.minutes,
                          locale,
                          durationFormat
                      )
                    : ''
            )
        }, [currentTime, durationFormat, locale, mode])

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
                        ? getPickerDisplayValue(
                              mode,
                              currentTime.days,
                              currentTime.hours,
                              currentTime.minutes,
                              locale,
                              durationFormat
                          )
                        : ''
                )
            }
        }, [currentTime, durationFormat, isInputFocused, isOpen, locale, mode])

        useEffect(() => {
            if (isOpen && align === 'auto' && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                const spaceRight = window.innerWidth - rect.right
                const spaceLeft = rect.left
                const dropdownWidth = mode === 'duration' ? 316 : 220
                if (spaceRight < dropdownWidth && spaceLeft > dropdownWidth) setDropdownAlign('right')
                else setDropdownAlign('left')
            }
        }, [align, isOpen, mode])

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
                const formatted = getPickerValue(
                    mode,
                    parsedTime.days,
                    parsedTime.hours,
                    parsedTime.minutes,
                    locale,
                    durationFormat
                )
                commitValue(formatted)
                setDisplayValue(formatted ?? '')
                return
            }

            setDisplayValue(
                currentTime
                    ? getPickerDisplayValue(
                          mode,
                          currentTime.days,
                          currentTime.hours,
                          currentTime.minutes,
                          locale,
                          durationFormat
                      )
                    : ''
            )
        }

        const handleManualInputChange = (e: ChangeEvent<HTMLInputElement>) => {
            if (!allowManualInput) return

            const formatted = formatManualTimeInput(e.target.value, mode, locale, durationFormat)
            const numbersOnly = formatted.replace(/\D/g, '')

            if (mode === 'duration') {
                if (numbersOnly.length >= 1 && Number.parseInt(numbersOnly[0] ?? '0', 10) > 3)
                    return
                if (
                    numbersOnly.length >= 2 &&
                    Number.parseInt(numbersOnly.slice(0, 2), 10) > MAX_DURATION_DAYS
                )
                    return
                if (numbersOnly.length >= 3 && Number.parseInt(numbersOnly[2] ?? '0', 10) > 2)
                    return
                if (numbersOnly.length >= 4 && Number.parseInt(numbersOnly.slice(2, 4), 10) > 23)
                    return
                if (numbersOnly.length >= 5 && Number.parseInt(numbersOnly[4] ?? '0', 10) > 5)
                    return
                if (numbersOnly.length >= 6 && Number.parseInt(numbersOnly.slice(4, 6), 10) > 59)
                    return
            } else {
                if (numbersOnly.length >= 1 && Number.parseInt(numbersOnly[0] ?? '0', 10) > 2) return
                if (numbersOnly.length >= 2 && Number.parseInt(numbersOnly.slice(0, 2), 10) > 23) return
                if (numbersOnly.length >= 3 && Number.parseInt(numbersOnly[2] ?? '0', 10) > 5) return
                if (numbersOnly.length >= 4 && Number.parseInt(numbersOnly.slice(2, 4), 10) > 59) return
            }

            setDisplayValue(formatted)

            const completeLength = mode === 'duration' ? 6 : 4
            if (numbersOnly.length === completeLength) {
                const parsedTime = parseTime(formatted, mode)
                if (parsedTime) {
                    const normalized = getPickerValue(
                        mode,
                        parsedTime.days,
                        parsedTime.hours,
                        parsedTime.minutes,
                        locale,
                        durationFormat
                    )
                    commitValue(normalized)
                    setDisplayValue(normalized ?? '')
                }
            } else if (formatted === '') {
                commitValue(null)
            }
        }

        const handleInputClear = useCallback(() => {
            commitValue(null)
            setDisplayValue('')
            setDraftDays('00')
            setDraftHours('00')
            setDraftMinutes('00')
        }, [commitValue])

        const handleDraftChange = (part: 'days' | 'hours' | 'minutes', nextValue: string) => {
            const numbers = nextValue.replace(/\D/g, '').slice(0, 2)
            if (
                part === 'days' &&
                numbers.length === 2 &&
                Number.parseInt(numbers, 10) > MAX_DURATION_DAYS
            )
                return
            if (part === 'hours' && numbers.length === 2 && Number.parseInt(numbers, 10) > 23) return
            if (part === 'minutes' && numbers.length === 2 && Number.parseInt(numbers, 10) > 59) return

            if (part === 'days') setDraftDays(numbers)
            else if (part === 'hours') setDraftHours(numbers)
            else setDraftMinutes(numbers)
        }

        const shiftDraft = (part: 'days' | 'hours' | 'minutes', offset: number) => {
            if (part === 'days') {
                const current = Number.parseInt(draftDays || '0', 10)
                const next = Math.min(Math.max(current + offset, 0), MAX_DURATION_DAYS)
                setDraftDays(padTimePart(next))
                return
            }

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
            const days = Number.parseInt(draftDays || '0', 10)
            const hours = Number.parseInt(draftHours || '0', 10)
            const minutes = Number.parseInt(draftMinutes || '0', 10)
            const normalizedDays = Math.min(Math.max(days, 0), MAX_DURATION_DAYS)
            const normalizedHours = Math.min(Math.max(hours, 0), 23)
            const normalizedMinutes = Math.min(Math.max(minutes, 0), 59)
            const formatted = getPickerValue(
                mode,
                normalizedDays,
                normalizedHours,
                normalizedMinutes,
                locale,
                durationFormat
            )

            commitValue(formatted)
            setDisplayValue(formatted ?? '')
            setDraftDays(padTimePart(normalizedDays))
            setDraftHours(padTimePart(normalizedHours))
            setDraftMinutes(padTimePart(normalizedMinutes))
            setIsOpen(false)
        }

        const pickerColumnLabelClass = cn(
            'mb-1 block text-center text-[11px] font-semibold leading-4',
            darkMode ? 'text-neutral-100' : 'text-slate-500'
        )
        const pickerStepButtonClass = cn(
            'h-6 w-full cursor-pointer rounded-md text-base font-semibold leading-none transition-colors',
            darkMode ? variantClasses.darkStep : variantClasses.step
        )
        const pickerInputClass = cn(
            'h-8 w-full rounded-md border px-1 text-center text-sm font-semibold outline-none transition-colors focus:ring-2',
            darkMode ? 'border-neutral-300 bg-[#1F2025]' : 'border-slate-200 bg-white',
            variantClasses.input
        )
        const okButtonClass = cn(
            'mt-2 h-8 w-full cursor-pointer rounded-md text-sm font-semibold transition-colors focus:ring-2',
            darkMode ? variantClasses.darkButton : variantClasses.button
        )

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
                        maxLength={mode === 'duration' ? 24 : 5}
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
                            'absolute top-[calc(100%+4px)] z-100 rounded-lg border p-2.5 shadow-xl',
                            'animate-in fade-in zoom-in-95 duration-200',
                            mode === 'duration' ? 'w-[300px]' : 'w-52',
                            darkMode
                                ? 'border-neutral-200 bg-[#1F2025] text-neutral-50'
                                : 'border-slate-200 bg-white text-slate-700',
                            dropdownAlign === 'right' && 'right-0 origin-top-right',
                            dropdownAlign === 'left' && 'left-0 origin-top-left',
                            dropdownAlign === 'center' && 'left-1/2 -translate-x-1/2 origin-top'
                        )}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div
                            className={cn(
                                'grid gap-2',
                                mode === 'duration' ? 'grid-cols-3' : 'grid-cols-2'
                            )}
                        >
                            {mode === 'duration' && (
                                <div className="space-y-1">
                                    <span className={pickerColumnLabelClass}>{localeText.day}</span>
                                    <button
                                        type="button"
                                        onClick={() => shiftDraft('days', 1)}
                                        className={pickerStepButtonClass}
                                    >
                                        +
                                    </button>
                                    <input
                                        value={draftDays}
                                        onChange={(e) => handleDraftChange('days', e.target.value)}
                                        className={pickerInputClass}
                                        inputMode="numeric"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => shiftDraft('days', -1)}
                                        className={pickerStepButtonClass}
                                    >
                                        -
                                    </button>
                                </div>
                            )}

                            <div className="space-y-1">
                                <span className={pickerColumnLabelClass}>{localeText.hour}</span>
                                <button
                                    type="button"
                                    onClick={() => shiftDraft('hours', 1)}
                                    className={pickerStepButtonClass}
                                >
                                    +
                                </button>
                                <input
                                    value={draftHours}
                                    onChange={(e) => handleDraftChange('hours', e.target.value)}
                                    className={pickerInputClass}
                                    inputMode="numeric"
                                />
                                <button
                                    type="button"
                                    onClick={() => shiftDraft('hours', -1)}
                                    className={pickerStepButtonClass}
                                >
                                    -
                                </button>
                            </div>

                            <div className="space-y-1">
                                <span className={pickerColumnLabelClass}>{localeText.minute}</span>
                                <button
                                    type="button"
                                    onClick={() => shiftDraft('minutes', safeMinuteStep)}
                                    className={pickerStepButtonClass}
                                >
                                    +
                                </button>
                                <input
                                    value={draftMinutes}
                                    onChange={(e) => handleDraftChange('minutes', e.target.value)}
                                    className={pickerInputClass}
                                    inputMode="numeric"
                                />
                                <button
                                    type="button"
                                    onClick={() => shiftDraft('minutes', -safeMinuteStep)}
                                    className={pickerStepButtonClass}
                                >
                                    -
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={commitDraft}
                            className={okButtonClass}
                        >
                            {localeText.ok}
                        </button>
                    </div>
                )}
            </div>
        )
    }
)

MciTimePicker.displayName = 'MciTimePicker'
export default MciTimePicker
