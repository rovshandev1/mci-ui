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

        const stateStyles = useMemo(() => getPhoneStateStyles(error), [error])

        const iconColor = useMemo(
            () => getPhoneIconColor(disabled, error, isFocused),
            [error, isFocused, disabled]
        )

        return (
            <div className={cn('w-full', className)}>
                {label && (
                    <label className={cn(
                        'mb-2 block font-medium transition-colors duration-200',
                        error ? 'text-red-600' : isFocused ? 'text-blue-600' : 'text-slate-700',
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
                            'w-full border bg-white font-normal transition-all duration-300 outline-none',
                            size === 'base' ? 'rounded-xl' : 'rounded-lg',
                            'disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed',
                            sizeConfig.input,
                            inputPadding,
                            stateStyles
                        )}
                    />
                </div>

                {error && (
                    <p className="mt-2 animate-slide-up text-sm font-normal text-red-600">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

MciPhone.displayName = 'MciPhone'
export default MciPhone
