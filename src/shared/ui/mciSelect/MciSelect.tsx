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
import type { SelectProps } from '../../types/ui/select.types'
import {
    getFilteredOptions,
    getSelectIconColor,
    getSelectStateStyles,
    SELECT_SIZES,
} from './mci-select.utils'

const MciSelect = forwardRef<HTMLDivElement, SelectProps>(
    (
        {
            label,
            placeholder = 'Выберите...',
            options = [],
            icon,
            iconPosition = 'left',
            size = 'base',
            darkMode = false,
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
        const showClearButton = clearable && hasValue && !disabled
        const hasRightIcon = Boolean(icon && iconPosition === 'right')
        const currentSize = SELECT_SIZES[size]

        const rightPaddingClass = useMemo(() => {
            if (hasRightIcon && showClearButton) {
                if (size === 'sm') return 'pr-16'
                if (size === 'md') return 'pr-16'
                return 'pr-20'
            }

            if (hasRightIcon || showClearButton) {
                if (size === 'sm') return 'pr-11'
                if (size === 'md') return 'pr-12'
                return 'pr-14'
            }

            if (size === 'sm') return 'pr-8'
            if (size === 'md') return 'pr-9'
            return 'pr-10'
        }, [hasRightIcon, showClearButton, size])

        const filteredOptions = useMemo(() => {
            return getFilteredOptions(options, searchTerm, searchable, Boolean(onSearch))
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
            [isOpen, filteredOptions, highlightedIndex, disabled, handleSelect]
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
                onSearch?.(term)
                setHighlightedIndex(0)
            },
            [onSearch]
        )

        const stateStyles = useMemo(
            () => getSelectStateStyles(disabled, error, darkMode),
            [error, disabled, darkMode]
        )

        const iconColor = useMemo(
            () => getSelectIconColor(disabled, error, isOpen, isFocused, darkMode),
            [disabled, error, isOpen, isFocused, darkMode]
        )

        return (
            <div className={cn('w-full', className)} ref={ref}>
                {label && (
                    <label
                        htmlFor={name}
                        className={cn(
                            'mb-2 block text-base font-medium',
                            error
                                ? darkMode
                                    ? 'text-red-500'
                                    : 'text-red-600'
                                : darkMode
                                    ? 'text-neutral-50'
                                    : 'text-slate-700',
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
                            icon && iconPosition === 'left' ? currentSize.iconPaddingLeft : currentSize.padding,
                            rightPaddingClass,
                            stateStyles,
                            darkMode && !disabled && (isFocused || isOpen) && !error && 'border-blue-500 shadow-[0_0_0_2px_var(--opacity-25,rgba(21,93,252,0.25))] text-white',
                            darkMode && !disabled && (isFocused || isOpen) && error && 'border-red-500 shadow-[0_0_0_2px_rgba(231,0,11,0.25)]',
                            !darkMode && !disabled && isFocused && 'shadow-blue border-blue-600'
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
                                className={cn(
                                    'w-full min-w-0 flex-1 bg-transparent outline-none',
                                    darkMode
                                        ? 'text-white placeholder:text-neutral-100'
                                        : 'text-black'
                                )}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span
                                title={selectedOption?.label || placeholder}
                                className={cn(
                                    'block min-w-0 flex-1 truncate select-none',
                                    !hasValue && !disabled && (darkMode ? 'text-neutral-100' : 'text-slate-400'),
                                    darkMode && hasValue && (isFocused || isOpen) && 'text-white',
                                    darkMode && hasValue && !isFocused && !isOpen && 'text-neutral-50'
                                )}
                            >
                                {selectedOption?.label || placeholder}
                            </span>
                        )}

                        {showClearButton && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className={cn(
                                    'absolute top-1/2 -translate-y-1/2 transition-colors cursor-pointer',
                                    darkMode
                                        ? 'text-neutral-100 hover:text-white'
                                        : 'text-slate-400 hover:text-black',
                                    hasRightIcon
                                        ? size === 'sm'
                                            ? 'right-8'
                                            : size === 'md'
                                                ? 'right-9'
                                                : 'right-10'
                                        : size === 'sm'
                                            ? 'right-7'
                                            : size === 'md'
                                                ? 'right-8'
                                                : 'right-9'
                                )}
                                aria-label="Очистить"
                            >
                                <CloseIcon className={currentSize.iconSize} />
                            </button>
                        )}

                        <div
                            className={cn(
                                'absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300',
                                size === 'sm' ? 'right-2' : 'right-3',
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
                                'absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border p-1 shadow-md',
                                darkMode
                                    ? 'border-neutral-200 bg-[#1F2025] text-neutral-50'
                                    : 'border-slate-200 bg-white text-black',
                                currentSize.dropdown
                            )}
                        >
                            {filteredOptions.length === 0 ? (
                                <div className={cn(
                                    'px-3 py-2 text-center text-base font-normal',
                                    darkMode ? 'text-neutral-100' : 'text-slate-500'
                                )}>
                                    Ничего не найдено
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        role="option"
                                        aria-selected={currentValue === option.value}
                                        onClick={() => handleSelect(option.value)}
                                        title={option.label}
                                        className={cn(
                                            'cursor-pointer truncate rounded-sm px-3 py-2 font-normal transition-colors',
                                            currentValue === option.value
                                                ? darkMode
                                                    ? 'bg-neutral-300 text-white'
                                                    : 'bg-slate-100'
                                                : darkMode
                                                    ? 'hover:bg-neutral-300 hover:text-white'
                                                    : 'hover:bg-slate-100',
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
                    <p className={cn(
                        'mt-2 animate-[slideDown_0.3s_ease-out] text-sm font-normal',
                        darkMode ? 'text-red-500' : 'text-red-600'
                    )}>{error}</p>
                )}
            </div>
        )
    }
)

MciSelect.displayName = 'MciSelect'

export default MciSelect
