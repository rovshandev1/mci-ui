import React, {forwardRef, useState, useMemo, useCallback} from 'react'
import {cn} from '../../lib/utils'
import {Phone} from '@solar-icons/react'

type PhoneInputProps = {
    label?: string
    placeholder?: string
    size?: 'sm' | 'md' | 'base'
    error?: string
    disabled?: boolean
    required?: boolean
    value?: string
    onChange?: (value: string) => void
    onFocus?: () => void
    onBlur?: () => void
    className?: string
    name?: string
    showIcon?: boolean
}

const MciPhone = forwardRef<HTMLInputElement, PhoneInputProps>(
    (
        {
            label,
            placeholder = '+998 (__) ___ __ __',
            size = 'base',
            error,
            disabled = false,
            required = false,
            value = '',
            onChange,
            onFocus,
            onBlur,
            className,
            name,
            showIcon = false,
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false)

        const formatPhone = useCallback((input: string) => {
            let numbers = input.replace(/\D/g, '')
            if (!numbers.startsWith('998')) {
                numbers = '998' + numbers
            }
            numbers = numbers.substring(0, 12)

            let result = '+998'
            if (numbers.length > 3) result += ' (' + numbers.substring(3, 5)
            if (numbers.length > 5) result += ') ' + numbers.substring(5, 8)
            if (numbers.length > 8) result += ' ' + numbers.substring(8, 10)
            if (numbers.length > 10) result += ' ' + numbers.substring(10, 12)

            return result
        }, [])

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value
            if (rawValue.length < 5) {
                onChange?.('+998')
                return
            }
            const formatted = formatPhone(rawValue)
            onChange?.(formatted)
        }

        const handleFocus = () => {
            setIsFocused(true)
            if (!value || value === '') {
                onChange?.('+998')
            }
            onFocus?.()
        }

        const handleBlur = () => {
            setIsFocused(false)
            onBlur?.()
        }

        const sizes = useMemo(() => ({
            sm: {
                input: 'h-9 text-small',
                padding: showIcon ? 'pl-8 pr-2' : 'px-2',
                iconSize: 'w-4 h-4',
                iconLeft: 'left-2',
                labelFont: 'text-small',
                iconWrapper: 'h-4',
            },
            md: {
                input: 'h-10 text-small',
                padding: showIcon ? 'pl-10 pr-4' : 'px-4',
                iconSize: 'w-4 h-4',
                iconLeft: 'left-3',
                labelFont: 'text-base',
                iconWrapper: 'h-4',
            },
            base: {
                input: 'h-12 text-base',
                padding: showIcon ? 'pl-11 pr-4' : 'px-4',
                iconSize: 'w-5 h-5',
                iconLeft: 'left-3',
                labelFont: 'text-base',
                iconWrapper: 'h-5',
            }
        }), [showIcon])

        const stateStyles = useMemo(() => {
            if (error) return 'border-red-600 focus:border-red-600 shadow-red'
            return 'border-slate-200 hover:border-slate-400 focus:shadow-blue focus:border-blue-600'
        }, [error,])

        const iconColor = useMemo(() => {
            if (disabled) return 'text-slate-400'
            if (error) return 'text-red-600'
            if (isFocused) return 'text-black'
            return 'text-slate-400'
        }, [error, isFocused, disabled])

        return (
            <div className={cn('w-full', className)}>
                {label && (
                    <label className={cn(
                        'mb-2 block font-medium transition-colors duration-200',
                        error ? 'text-red-600' : isFocused ? 'text-blue-600' : 'text-slate-700',
                        sizes[size].labelFont
                    )}>
                        {label}
                        {required && <span className="text-red-600 ml-1">*</span>}
                    </label>
                )}

                <div className="relative flex items-center">
                    {showIcon && (
                        <div className={cn(
                            'absolute top-1/2 flex -translate-y-1/2 items-center justify-center transition-all duration-300',
                            sizes[size].iconLeft,
                            iconColor
                        )}>
                            <div className={cn('flex items-center justify-center', sizes[size].iconWrapper)}>
                                <Phone className={cn(sizes[size].iconSize)} weight="Linear"/>
                            </div>
                        </div>
                    )}

                    <input
                        ref={ref}
                        name={name}
                        type="tel"
                        value={value}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        placeholder={placeholder}
                        className={cn(
                            'w-full border bg-white font-normal transition-all duration-300 outline-none',
                            size === 'base' ? 'rounded-xl' : 'rounded-lg',
                            'disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed',
                            sizes[size].input,
                            sizes[size].padding,
                            stateStyles
                        )}
                    />
                </div>

                {error && (
                    <p className="mt-2 animate-slide-up text-small font-normal text-red-600">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

MciPhone.displayName = 'MciPhone'
export default MciPhone