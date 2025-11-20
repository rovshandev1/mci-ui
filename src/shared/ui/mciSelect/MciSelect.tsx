import {ChevronDown, X} from 'lucide-react'
import React, {forwardRef, useEffect, useMemo, useRef, useState} from 'react'
import {cn} from '../../lib/utils.ts'

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
            size = 'lg',
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
                    input: 'h-8 text-xs',
                    padding: icon
                        ? iconPosition === 'left'
                            ? 'pl-10 pr-3'
                            : 'pl-3 pr-10'
                        : 'px-3',
                    icon: 'w-3 h-3',
                    iconWrapper: iconPosition === 'left' ? 'left-3' : 'right-3',
                    labelFont: 'text-xs',
                    dropdown: 'text-sm',
                },
                md: {
                    input: 'h-10 text-sm',
                    padding: icon
                        ? iconPosition === 'left'
                            ? 'pl-110 pr-4'
                            : 'pl-4 pr-10'
                        : 'px-4',
                    icon: 'w-4 h-4',
                    iconWrapper: iconPosition === 'left' ? 'left-3' : 'right-3',
                    labelFont: 'text-sm',
                    dropdown: 'text-base',
                },
                lg: {
                    input: 'h-12 text-base',
                    padding: icon
                        ? iconPosition === 'left'
                            ? 'pl-12 pr-5'
                            : 'pl-4 pr-12'
                        : 'px-4',
                    icon: 'w-5 h-5',
                    iconWrapper: iconPosition === 'left' ? 'left-4' : 'right-4',
                    labelFont: 'text-base',
                    dropdown: 'text-base',
                },
            }),
            [icon, iconPosition]
        )

        const stateStyles = useMemo(() => {
            if (error)
                return isOpen
                    ? 'border-red-600'
                    : 'border-red-500 hover:border-red-600'
            if (success)
                return isOpen
                    ? 'border-green-500'
                    : 'border-green-500 hover:border-green-600'
            return isOpen
                ? 'border-yellow-500'
                : 'border-slate-300 hover:border-slate-400'
        }, [error, success, isOpen])

        return (
            <div className={cn('w-full', className)} ref={ref}>
                {label && (
                    <label
                        htmlFor={name}
                        className={cn(
                            'block text-sm font-medium mb-2',
                            error
                                ? 'text-red-600'
                                : success
                                    ? 'text-green-600'
                                    : 'text-slate-700',
                            sizes[size].labelFont
                        )}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className='relative' ref={containerRef}>
                    {/* Select box */}
                    <div
                        onClick={handleToggle}
                        className={cn(
                            'w-full rounded-md border bg-white font-medium outline-none transition-all duration-300 ease-in-out cursor-pointer flex items-center',
                            disabled && 'bg-slate-50 cursor-not-allowed opacity-60',
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
                                    !hasValue && 'text-slate-500',
                                    label && !(isFocused || hasValue || isOpen) && 'opacity-0'
                                )}
                            >
								{selectedOption?.label || placeholder}
							</span>
                        )}
                    </div>

                    {/* Clear button */}
                    {clearable && hasValue && !disabled && (
                        <button
                            type='button'
                            onClick={handleClear}
                            className='absolute top-1/2 -translate-y-1/2 right-10 text-gray-400 hover:text-gray-600 transition-all z-10'
                        >
                            <X className={cn(sizes[size].icon)}/>
                        </button>
                    )}

                    {/* Chevron */}
                    <div
                        className={cn(
                            'absolute top-1/2 -translate-y-1/2 right-3 transition-all duration-300',
                            error
                                ? 'text-red-500'
                                : success
                                    ? 'text-green-500'
                                    : isFocused || isOpen
                                        ? 'text-yellow-500'
                                        : 'text-slate-400',
                            isOpen && 'rotate-180'
                        )}
                    >
                        <ChevronDown className={cn(sizes[size].icon)}/>
                    </div>

                    {/* Dropdown with scroll */}
                    {isOpen && (
                        <div
                            className={cn(
                                'absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-xl overflow-y-auto max-h-56',
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
                                                : 'hover:bg-gray-50 text-slate-700'
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
                    <p className='mt-2 text-xs  font-normaltext-red-600 animate-[slideDown_0.3s_ease-out]'>
                        {error}
                    </p>
                )}
                {success && !error && (
                    <p className='mt-2 text-xs font-normal text-green-600 animate-[slideDown_0.3s_ease-out]'>
                        {success}
                    </p>
                )}
            </div>
        )
    }
)

MciSelect.displayName = 'MciSelect'

export default MciSelect
