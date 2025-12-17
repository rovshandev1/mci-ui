import {Eye, EyeClosed} from '@solar-icons/react'
import React, {forwardRef, useMemo, useState} from 'react'
import CloseIcon from "../../../assets/icons/close.svg?react"
import {cn} from '../../lib/utils'

type InputProps = {
    label?: string
    placeholder?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'tel'
    icon?: React.ReactNode
    rightIcon?: React.ReactNode
    iconPosition?: 'left' | 'right'
    size?: 'sm' | 'md' | 'base'
    error?: string
    disabled?: boolean
    required?: boolean
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onFocus?: () => void
    onBlur?: () => void
    className?: string
    name?: string
    readOnly?: boolean
    maxLength?: number
    onClear?: () => void
    showClearButton?: boolean
}

const MciInput = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            placeholder,
            type = 'text',
            icon,
            rightIcon,
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
            name,
            maxLength = 250,
            onClear,
            showClearButton = false,
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false)
        const [internalValue, setInternalValue] = useState('')
        const [showPassword, setShowPassword] = useState(false)

        const currentValue = value ?? internalValue
        const isPassword = type === 'password'

        const showClear = showClearButton && !!currentValue && !disabled

        const hasLeftIcon = icon && iconPosition === 'left'
        const hasRightIcon = (icon && iconPosition === 'right') || rightIcon || isPassword

        const shouldRenderRightIconsWrapper = hasRightIcon || showClear;

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

        const togglePassword = () => setShowPassword((prev) => !prev)

        const handleClearClick = () => {
            if (value === undefined) setInternalValue('')
            onClear?.()
        }

        const sizes = useMemo(
            () => ({
                sm: {
                    input: 'h-9 text-small',
                    padding:
                        hasLeftIcon && hasRightIcon
                            ? 'pl-7 pr-7'
                            : hasLeftIcon
                                ? 'pl-7 pr-2'
                                : hasRightIcon
                                    ? 'pl-2 pr-7'
                                    : 'px-2',
                    icon: 'w-4 h-4',
                    leftIcon: 'left-2',
                    rightIcon: 'right-2',
                    labelFont: 'text-small',
                    iconWrapper: 'h-4',
                },
                md: {
                    input: 'h-10 text-small',
                    padding:
                        hasLeftIcon && hasRightIcon
                            ? 'pl-8 pr-8'
                            : hasLeftIcon
                                ? 'pl-8 pr-2'
                                : hasRightIcon
                                    ? 'pl-2 pr-8'
                                    : 'px-4',
                    icon: 'w-4 h-4',
                    leftIcon: 'left-2',
                    rightIcon: 'right-2',
                    labelFont: 'text-base',
                    iconWrapper: 'h-4',
                },
                base: {
                    input: 'h-12 text-base',
                    padding:
                        hasLeftIcon && hasRightIcon
                            ? 'pl-9 pr-9'
                            : hasLeftIcon
                                ? 'pl-9 pr-3'
                                : hasRightIcon
                                    ? 'pl-3 pr-9'
                                    : 'px-4',
                    icon: 'w-5 h-5',
                    leftIcon: 'left-3',
                    rightIcon: 'right-3',
                    labelFont: 'text-base',
                    iconWrapper: 'h-5',
                },
            }),
            [hasLeftIcon, hasRightIcon]
        )

        const stateStyles = useMemo(() => {
            if (error) return 'border-red-600 focus:border-red-600 shadow-red'
            return 'border-slate-200 hover:border-slate-400 focus:shadow-blue focus:border-blue-600'
        }, [error])

        const iconColor = useMemo(() => {
            if (disabled) return 'text-slate-400'
            if (error) return 'text-red-600'
            if (isFocused) return 'text-black'
            return 'text-slate-400'
        }, [error, isFocused, disabled])

        return (
            <div className={cn('w-full', className)}>
                {label && (
                    <label
                        htmlFor={name}
                        className={cn(
                            'mb-2 block text-base font-medium',
                            error ? 'text-red-600' : 'text-slate-700',
                            sizes[size].labelFont
                        )}
                    >
                        {label}
                        {required && <span className="text-extra-small text-red-600 ml-1">*</span>}
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
                            'w-full border bg-white font-normal transition-all duration-300 ease-in-out outline-none',
                            size === 'base' ? 'rounded-xl' : 'rounded-lg',
                            'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
                            sizes[size].input,
                            sizes[size].padding,
                            stateStyles
                        )}
                        maxLength={maxLength}
                    />

                    {hasLeftIcon && (
                        <div
                            className={cn(
                                'absolute top-1/2 flex -translate-y-1/2 items-center justify-center',
                                'transition-all duration-300',
                                sizes[size].leftIcon,
                                iconColor
                            )}
                        >
                            <div
                                className={cn('flex items-center justify-center', sizes[size].iconWrapper)}
                            >
                        <span className={cn('flex items-center justify-center', sizes[size].icon)}>
                           {icon}
                        </span>
                            </div>
                        </div>
                    )}

                    {shouldRenderRightIconsWrapper && (
                        <div
                            className={cn(
                                'absolute top-1/2 flex -translate-y-1/2 items-center justify-center gap-2',
                                'transition-all duration-300',
                                sizes[size].rightIcon
                            )}
                        >
                            {showClear && (
                                <button
                                    type="button"
                                    onClick={handleClearClick}
                                    className={cn(
                                        'flex items-center justify-center',
                                        sizes[size].iconWrapper,
                                        'text-slate-base hover:text-black'
                                    )}
                                    style={{cursor: 'pointer'}}
                                >
                                    <span className={cn('flex items-center justify-center', sizes[size].icon)}>
                                        <CloseIcon className={cn('h-full w-full')}/>
                                    </span>
                                </button>
                            )}

                            {rightIcon && !isPassword && (
                                <div
                                    className={cn('flex items-center justify-center', sizes[size].iconWrapper)}
                                >
                                    <span
                                        className={cn(
                                            'flex items-center justify-center',
                                            sizes[size].icon,
                                            iconColor
                                        )}
                                    >
                                        {rightIcon}
                                    </span>
                                </div>
                            )}

                            {isPassword && (
                                <>
                                    {rightIcon && (
                                        <div
                                            className={cn(
                                                'flex items-center justify-center',
                                                sizes[size].iconWrapper
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'flex items-center justify-center',
                                                    sizes[size].icon,
                                                    iconColor
                                                )}
                                            >
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
                                        <span
                                            className={cn('flex items-center justify-center cursor-pointer', sizes[size].icon)}
                                        >
                                            {showPassword ? (
                                                <EyeClosed weight='Linear' className={cn('h-full w-full')}/>
                                            ) : (
                                                <Eye weight='Linear' className={cn('h-full w-full')}/>
                                            )}
                                        </span>
                                    </button>
                                </>
                            )}

                            {icon && iconPosition === 'right' && !isPassword && (
                                <div
                                    className={cn('flex items-center justify-center', sizes[size].iconWrapper)}
                                >
                                    <span
                                        className={cn(
                                            'flex items-center justify-center',
                                            sizes[size].icon,
                                            iconColor
                                        )}
                                    >
                                        {icon}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-2 animate-[slideDown_0.3s_ease-out] text-small font-normal text-red-600">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

MciInput.displayName = 'MciInput'
export default MciInput