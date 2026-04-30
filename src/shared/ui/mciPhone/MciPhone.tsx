import React, {forwardRef, useMemo, useState} from 'react'
import {cn} from '../../lib/utils'
import {Phone} from '@solar-icons/react'
import type { PhoneInputProps } from '../../types/ui/phone.types'
import {
    formatPhoneValue,
    getPhoneIconColor,
    getPhoneStateStyles,
    PHONE_SIZES,
} from './mci-phone.utils'

const MciPhone = forwardRef<HTMLInputElement, PhoneInputProps>(
    (
        {
            label,
            placeholder = '+998 (__) ___ __ __',
            size = 'base',
            darkMode = false,
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

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value
            if (rawValue.length < 5) {
                onChange?.('+998')
                return
            }
            const formatted = formatPhoneValue(rawValue)
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

        const sizeConfig = PHONE_SIZES[size]
        const inputPadding = showIcon ? sizeConfig.iconPadding : sizeConfig.defaultPadding

        const stateStyles = useMemo(() => getPhoneStateStyles(error, darkMode), [error, darkMode])

        const iconColor = useMemo(
            () => getPhoneIconColor(disabled, error, isFocused, darkMode),
            [error, isFocused, disabled, darkMode]
        )

        return (
            <div className={cn('w-full', className)}>
                {label && (
                    <label className={cn(
                        'mb-2 block font-medium transition-colors duration-200',
                        error
                            ? darkMode
                                ? 'text-red-500'
                                : 'text-red-600'
                            : darkMode
                                ? 'text-neutral-50'
                                : isFocused
                                    ? 'text-blue-600'
                                    : 'text-slate-700',
                        sizeConfig.labelFont
                    )}>
                        {label}
                        {required && <span className="text-red-600 ml-1">*</span>}
                    </label>
                )}

                <div className="relative flex items-center">
                    {showIcon && (
                        <div className={cn(
                            'absolute top-1/2 flex -translate-y-1/2 items-center justify-center transition-all duration-300',
                            sizeConfig.iconLeft,
                            iconColor
                        )}>
                            <div className={cn('flex items-center justify-center', sizeConfig.iconWrapper)}>
                                <Phone className={cn(sizeConfig.iconSize)} weight="Linear"/>
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
                            'w-full border font-normal transition-all duration-300 outline-none',
                            size === 'base' ? 'rounded-xl' : 'rounded-lg',
                            darkMode
                                ? 'text-neutral-50 placeholder:text-neutral-100 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-300 disabled:text-neutral-100/50 disabled:placeholder:text-neutral-100/50'
                                : 'bg-white disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed',
                            darkMode && isFocused && !disabled && 'text-white',
                            sizeConfig.input,
                            inputPadding,
                            stateStyles
                        )}
                    />
                </div>

                {error && (
                    <p className={cn(
                        'mt-2 animate-slide-up text-sm font-normal',
                        darkMode ? 'text-red-500' : 'text-red-600'
                    )}>
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

MciPhone.displayName = 'MciPhone'
export default MciPhone
