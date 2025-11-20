import {Eye, EyeOff} from 'lucide-react'
import React, {forwardRef, useMemo, useState} from 'react'
import {cn} from '../../lib/utils'

type InputProps = {
    label?: string
    placeholder?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'tel'
    icon?: React.ReactNode
    rightIcon?: React.ReactNode
    iconPosition?: 'left' | 'right'
    size?: 'sm' | 'md' | 'lg'
    error?: string
    success?: string
    disabled?: boolean
    required?: boolean
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onFocus?: () => void
    onBlur?: () => void
    className?: string
    name?: string
    readOnly?: boolean
}

const InputMain = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            placeholder,
            type = 'text',
            icon,
            rightIcon,
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
            name,
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false)
        const [internalValue, setInternalValue] = useState('')
        const [showPassword, setShowPassword] = useState(false)

        const currentValue = value ?? internalValue
        const isPassword = type === 'password'

        const hasLeftIcon = icon && iconPosition === 'left'
        const hasRightIcon = (icon && iconPosition === 'right') || rightIcon || isPassword

        const handleFocus = () => {
            setIsFocused(true)
            onFocus?.()
        }

        const handleBlur = () => {
            setIsFocused(false)
            onBlur?.()
        }

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (value === undefined) setInternalValue(e.target.value)
            onChange?.(e)
        }

        const togglePassword = () => setShowPassword(prev => !prev)

        const sizes = useMemo(
            () => ({
                sm: {
                    input: 'h-8 text-xs',
                    padding: hasLeftIcon && hasRightIcon
                        ? 'pl-8 pr-8'
                        : hasLeftIcon
                            ? 'pl-8 pr-3'
                            : hasRightIcon
                                ? 'pl-3 pr-8'
                                : 'px-3',
                    icon: 'w-3 h-3',
                    leftIcon: 'left-2',
                    rightIcon: 'right-2',
                    labelFont: 'text-xs',
                    iconWrapper: 'h-3'
                },
                md: {
                    input: 'h-10 text-sm',
                    padding: hasLeftIcon && hasRightIcon
                        ? 'pl-10 pr-10'
                        : hasLeftIcon
                            ? 'pl-10 pr-4'
                            : hasRightIcon
                                ? 'pl-4 pr-10'
                                : 'px-4',
                    icon: 'w-4 h-4',
                    leftIcon: 'left-3',
                    rightIcon: 'right-3',
                    labelFont: 'text-sm',
                    iconWrapper: 'h-4'
                },
                lg: {
                    input: 'h-12 text-base',
                    padding: hasLeftIcon && hasRightIcon
                        ? 'pl-12 pr-12'
                        : hasLeftIcon
                            ? 'pl-12 pr-4'
                            : hasRightIcon
                                ? 'pl-4 pr-12'
                                : 'px-4',
                    icon: 'w-5 h-5',
                    leftIcon: 'left-3',
                    rightIcon: 'right-3',
                    labelFont: 'text-base',
                    iconWrapper: 'h-5'
                },
            }),
            [hasLeftIcon, hasRightIcon]
        )

        const stateStyles = useMemo(() => {
            if (error)
                return 'border-red-600 focus:border-red-600'
            if (success)
                return 'border-green-500 focus:border-green-600'
            return 'border-slate-300 hover:border-slate-400 focus:border-yellow-500'
        }, [error, success])

        const iconColor = useMemo(() => {
            if (disabled) return 'text-slate-300'
            if (error) return 'text-red-500'
            if (success) return 'text-green-500'
            if (isFocused) return 'text-yellow-500'
            return 'text-slate-400'
        }, [error, success, isFocused, disabled])


        return (
            <div className={cn('w-full', className)}>
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

                <div className="relative flex items-center">
                    <input
                        ref={ref}
                        name={name}
                        type={isPassword && showPassword ? 'text' : type}
                        value={currentValue}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        required={required}
                        autoComplete="on"
                        placeholder={placeholder}
                        className={cn(
                            'w-full rounded-md border bg-white font-normal text-xs outline-none transition-all duration-300 ease-in-out',
                            'disabled:bg-slate-50 disabled:border-slate-200 disabled:text-slate-300 disabled:cursor-not-allowed',
                            sizes[size].input,
                            sizes[size].padding,
                            stateStyles
                        )}
                    />

                    {hasLeftIcon && (
                        <div
                            className={cn(
                                'absolute top-1/2 -translate-y-1/2 flex items-center justify-center',
                                'transition-all duration-300',
                                sizes[size].leftIcon,
                                iconColor
                            )}
                        >
                            <div className={cn(
                                'flex items-center justify-center',
                                sizes[size].iconWrapper
                            )}>
                                <span className={cn('flex items-center justify-center', sizes[size].icon)}>
                                    {icon}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className={cn(
                        'absolute top-1/2 -translate-y-1/2 flex items-center justify-center gap-2',
                        'transition-all duration-300',
                        sizes[size].rightIcon
                    )}>
                        {rightIcon && !isPassword && (
                            <div className={cn(
                                'flex items-center justify-center',
                                sizes[size].iconWrapper
                            )}>
                                <span className={cn(
                                    'flex items-center justify-center',
                                    sizes[size].icon,
                                    iconColor
                                )}>
                                    {rightIcon}
                                </span>
                            </div>
                        )}

                        {/* PASSWORD TOGGLE */}
                        {isPassword && (
                            <>
                                {rightIcon && (
                                    <div className={cn(
                                        'flex items-center justify-center',
                                        sizes[size].iconWrapper
                                    )}>
                                        <span className={cn(
                                            'flex items-center justify-center',
                                            sizes[size].icon,
                                            iconColor
                                        )}>
                                            {rightIcon}
                                        </span>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={togglePassword}
                                    className={cn(
                                        'flex items-center justify-center',
                                        sizes[size].iconWrapper,
                                        iconColor
                                    )}
                                >
                                    <span className={cn(
                                        'flex items-center justify-center',
                                        sizes[size].icon
                                    )}>
                                        {showPassword ? (
                                            <EyeOff className={cn('w-full h-full')}/>
                                        ) : (
                                            <Eye className={cn('w-full h-full')}/>
                                        )}
                                    </span>
                                </button>
                            </>
                        )}

                        {/* RIGHT ICON */}
                        {icon && iconPosition === 'right' && !isPassword && (
                            <div className={cn(
                                'flex items-center justify-center',
                                sizes[size].iconWrapper
                            )}>
                                <span className={cn(
                                    'flex items-center justify-center',
                                    sizes[size].icon,
                                    iconColor
                                )}>
                                    {icon}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <p className="mt-2 text-xs text-red-500 font-normal animate-[slideDown_0.3s_ease-out]">
                        {error}
                    </p>
                )}

                {/* SUCCESS MESSAGE */}
                {success && !error && (
                    <p className="mt-2 text-xs text-green-600 font-normal animate-[slideDown_0.3s_ease-out]">
                        {success}
                    </p>
                )}
            </div>
        )
    }
)

InputMain.displayName = 'InputMain'
export default InputMain