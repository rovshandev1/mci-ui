import {Eye, EyeClosed} from '@solar-icons/react'
import React, {forwardRef, useMemo, useState} from 'react'
import CloseIcon from "../../../assets/icons/close.svg?react"
import {cn} from '../../lib/utils'
import type { InputProps } from '../../types/ui/input.types'
import {
    getInputIconColor,
    getInputSizes,
    getInputStateStyles,
} from './mci-input.utils'

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
            step,
            autoComplete = 'off'
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
            let val = e.target.value

            if (type === 'number' && maxLength && val.length > maxLength) {
                val = val.slice(0, maxLength)
                e.target.value = val
            }

            if (value === undefined) setInternalValue(val)
            onChange?.(e)
        }

        const togglePassword = () => setShowPassword((prev) => !prev)

        const handleClearClick = () => {
            if (value === undefined) setInternalValue('')
            onClear?.()
        }

        const sizes = useMemo(
            () => getInputSizes(Boolean(hasLeftIcon), Boolean(hasRightIcon)),
            [hasLeftIcon, hasRightIcon]
        )

        const stateStyles = useMemo(() => getInputStateStyles(error), [error])

        const iconColor = useMemo(
            () => getInputIconColor(disabled, error, isFocused),
            [error, isFocused, disabled]
        )

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
                        autoComplete={autoComplete}
                        placeholder={placeholder}
                        step={step}
                        className={cn(
                            'w-full border bg-white font-normal transition-all duration-300 ease-in-out outline-none',
                            size === 'base' ? 'rounded-xl' : 'rounded-lg',
                            'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
                            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
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
                    <p className="mt-2 animate-[slideDown_0.3s_ease-out] text-sm font-normal text-red-600">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

MciInput.displayName = 'MciInput'
export default MciInput
