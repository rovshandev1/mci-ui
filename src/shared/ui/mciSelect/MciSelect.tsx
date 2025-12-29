import { AltArrowDown } from '@solar-icons/react'
import CloseIcon from "../../../assets/icons/close.svg?react"
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { cn, useClickOutside, useEscapeKey } from '../../lib/utils'

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
    size?: 'sm' | 'md' | 'base'
    error?: string
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

const SIZES = {
    sm: {
        container: 'h-9 text-sm',
        padding: 'px-2',
        iconPaddingLeft: 'pl-7',
        iconPaddingRight: 'pr-7',
        iconSize: 'w-4 h-4',
        iconWrapper: 'left-2',
        rightIconWrapper: 'right-2',
        label: 'text-sm',
        dropdown: 'text-sm',
    },
    md: {
        container: 'h-10 text-sm',
        padding: 'px-4',
        iconPaddingLeft: 'pl-8',
        iconPaddingRight: 'pr-8',
        iconSize: 'w-5 h-5',
        iconWrapper: 'left-3',
        rightIconWrapper: 'right-3',
        label: 'text-sm',
        dropdown: 'text-sm',
    },
    base: {
        container: 'h-12 text-base',
        padding: 'px-4',
        iconPaddingLeft: 'pl-10',
        iconPaddingRight: 'pl-3',
        iconSize: 'w-5 h-5',
        iconWrapper: 'left-4',
        rightIconWrapper: 'right-16',
        label: 'text-base',
        dropdown: 'text-base',
    },
} as const

const MciSelect = forwardRef<HTMLDivElement, SelectProps>(
    (
        {
            label,
            placeholder = 'Выберите...',
            options = [],
            icon,
            iconPosition = 'left',
            size = 'base',
            error,
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
        const [isOpen, setIsOpen] = useState(false)
        const [isFocused, setIsFocused] = useState(false)
        const [internalValue, setInternalValue] = useState<string | number>('')
        const [searchTerm, setSearchTerm] = useState('')
        const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

        const containerRef = useRef<HTMLDivElement>(null)
        const searchInputRef = useRef<HTMLInputElement>(null)

        const currentValue = value !== undefined ? value : internalValue
        const selectedOption = options.find((opt) => opt.value === currentValue)
        const hasValue = currentValue !== '' && currentValue !== undefined
        const currentSize = SIZES[size]

        // --- Search Logic Update ---
        const filteredOptions = useMemo(() => {
            // If search is disabled, return all options
            if (!searchable) return options

            // If onSearch (backend search) is provided, return options as-is.
            // We assume the parent updates 'options' based on the search term.
            if (onSearch) return options

            // Fallback: Local client-side filtering
            const lower = searchTerm.toLowerCase()
            return options.filter((opt) =>
                opt.label.toLowerCase().includes(lower)
            )
        }, [options, searchTerm, searchable, onSearch])

        const closeDropdown = useCallback(() => {
            setIsOpen(false)
            setIsFocused(false)
            setSearchTerm('')
            setHighlightedIndex(-1)
            onBlur?.()
        }, [onBlur])

        const { handleClick: handleClickOutside } = useClickOutside(containerRef, closeDropdown)
        const { handleEscape } = useEscapeKey(closeDropdown)

        useEffect(() => {
            if (!isOpen) return

            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleEscape)

            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
                document.removeEventListener('keydown', handleEscape)
            }
        }, [isOpen, handleClickOutside, handleEscape])

        useEffect(() => {
            if (isOpen && searchable && searchInputRef.current) {
                searchInputRef.current.focus()
            }
        }, [isOpen, searchable])

        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent) => {
                if (disabled) return

                if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
                    e.preventDefault()
                    setIsOpen(true)
                    return
                }

                if (!isOpen) return

                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault()
                        setHighlightedIndex((prev) =>
                            prev < filteredOptions.length - 1 ? prev + 1 : 0
                        )
                        break
                    case 'ArrowUp':
                        e.preventDefault()
                        setHighlightedIndex((prev) =>
                            prev > 0 ? prev - 1 : filteredOptions.length - 1
                        )
                        break
                    case 'Enter':
                        e.preventDefault()
                        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                            handleSelect(filteredOptions[highlightedIndex].value)
                        }
                        break
                }
            },
            [isOpen, filteredOptions, highlightedIndex, disabled]
        )

        const handleToggle = useCallback(() => {
            if (disabled) return
            setIsOpen((prev) => !prev)
            if (!isOpen) {
                setIsFocused(true)
                onFocus?.()
            } else {
                setSearchTerm('')
                setHighlightedIndex(-1)
            }
        }, [disabled, isOpen, onFocus])

        const handleSelect = useCallback(
            (optionValue: string | number) => {
                if (value === undefined) setInternalValue(optionValue)
                onChange?.(optionValue)
                setIsOpen(false)
                setIsFocused(false)
                setSearchTerm('')
                setHighlightedIndex(-1)
                onBlur?.()
            },
            [value, onChange, onBlur]
        )

        const handleClear = useCallback(
            (e: React.MouseEvent) => {
                e.stopPropagation()
                if (disabled) return
                if (value === undefined) setInternalValue('')
                onChange?.('')
                setSearchTerm('')
                setHighlightedIndex(-1)
            },
            [value, onChange, disabled]
        )

        const handleSearchChange = useCallback(
            (term: string) => {
                setSearchTerm(term)
                onSearch?.(term) // Trigger backend search callback if exists
                setHighlightedIndex(0)
            },
            [onSearch]
        )

        // --- Styles Logic Update ---
        const stateStyles = useMemo(() => {
            if (disabled) return 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
            if (error) return 'border-red-600 focus:border-red-600 shadow-red bg-white'
            return 'border-slate-200 hover:border-slate-400 focus:shadow-blue focus:border-blue-600 bg-white'
        }, [error, disabled])

        const iconColor = useMemo(() => {
            if (disabled) return 'text-slate-400'
            if (error) return 'text-red-600'
            if (isOpen || isFocused) return 'text-black'
            return 'text-slate-400'
        }, [disabled, error, isOpen, isFocused])

        return (
            <div className={cn('w-full', className)} ref={ref}>
                {label && (
                    <label
                        htmlFor={name}
                        className={cn(
                            'mb-2 block text-base font-medium',
                            error ? 'text-red-600' : 'text-slate-700',
                            currentSize.label
                        )}
                    >
                        {label}
                        {required && <span className="ml-1 text-red-600">*</span>}
                    </label>
                )}

                <div
                    ref={containerRef}
                    className="relative"
                    onKeyDown={handleKeyDown}
                >
                    <div
                        role="combobox"
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                        aria-controls={`${name}-listbox`}
                        aria-disabled={disabled}
                        tabIndex={disabled ? -1 : 0}
                        onClick={handleToggle}
                        className={cn(
                            'flex w-full items-center border font-normal transition-all duration-300 ease-in-out',
                            size === 'base' ? 'rounded-xl' : 'rounded-lg',
                            currentSize.container,
                            icon
                                ? iconPosition === 'left'
                                    ? currentSize.iconPaddingLeft
                                    : currentSize.iconPaddingRight
                                : currentSize.padding,
                            stateStyles,
                            !disabled && isFocused && 'shadow-blue border-blue-600'
                        )}
                    >
                        {icon && (
                            <div
                                className={cn(
                                    'absolute top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300',
                                    iconPosition === 'left'
                                        ? currentSize.iconWrapper
                                        : currentSize.rightIconWrapper,
                                    iconColor
                                )}
                            >
                                {icon}
                            </div>
                        )}

                        {searchable && isOpen ? (
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder={placeholder}
                                className="w-full bg-transparent outline-none"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span
                                className={cn(
                                    'block truncate select-none',
                                    !hasValue && !disabled && 'text-slate-400'
                                )}
                            >
                                {selectedOption?.label || placeholder}
                            </span>
                        )}

                        {clearable && hasValue && !disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className={cn(
                                    'absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors cursor-pointer',
                                    icon ? (iconPosition === 'left' ? 'right-8' : 'right-10') : 'right-10'
                                )}
                                aria-label="Очистить"
                            >
                                <CloseIcon className={currentSize.iconSize} />
                            </button>
                        )}

                        <div
                            className={cn(
                                'absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none transition-all duration-300',
                                isOpen && 'rotate-180',
                                iconColor
                            )}
                        >
                            <AltArrowDown className={currentSize.iconSize} />
                        </div>
                    </div>

                    {isOpen && !disabled && (
                        <div
                            id={`${name}-listbox`}
                            role="listbox"
                            className={cn(
                                'absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-md p-1 text-black',
                                currentSize.dropdown
                            )}
                        >
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-2 text-center text-base font-normal text-slate-500">
                                    Ничего не найдено
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        role="option"
                                        aria-selected={currentValue === option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={cn(
                                            'cursor-pointer px-3 py-2 font-normal transition-colors hover:bg-slate-100 rounded-sm',
                                            currentValue === option.value
                                                ? 'bg-slate-100'
                                                : '',
                                        )}
                                    >
                                        {option.label}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-2 animate-[slideDown_0.3s_ease-out] text-sm font-normal text-red-600">{error}</p>
                )}
            </div>
        )
    }
)

MciSelect.displayName = 'MciSelect'

export default MciSelect