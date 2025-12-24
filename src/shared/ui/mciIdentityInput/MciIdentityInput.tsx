import React, {forwardRef, useCallback, useState} from 'react'
import MciInput from '../mciInput/MciInput'
import {ComponentProps} from 'react'

type MciInputProps = ComponentProps<typeof MciInput>

interface MciDocumentInputProps extends Omit<MciInputProps, 'onChange'> {
    mode: 'passport' | 'pinfl'
    onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
}

const MciIdentityInput = forwardRef<HTMLInputElement, MciDocumentInputProps>(
    ({mode, onChange, value, ...props}, ref) => {
        const [localValue, setLocalValue] = useState('')

        const inputValue = value !== undefined ? value : localValue

        const formatPassport = (rawValue: string) => {
            const val = rawValue.replace(/\s/g, '').toUpperCase()
            let cleanData = ''

            for (let i = 0; i < val.length; i++) {
                const char = val[i]

                if (cleanData.length < 2) {
                    if (/[A-Z]/.test(char)) cleanData += char
                } else {
                    if (/[0-9]/.test(char)) cleanData += char
                }

                if (cleanData.length >= 9) break
            }

            if (cleanData.length > 2) {
                return cleanData.slice(0, 2) + ' ' + cleanData.slice(2)
            }

            return cleanData
        }

        const formatPinfl = (rawValue: string) => {
            return rawValue.replace(/\D/g, '').slice(0, 14)
        }

        const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value
            let finalValue = ''

            if (mode === 'passport') {
                finalValue = formatPassport(rawValue)
            } else {
                finalValue = formatPinfl(rawValue)
            }

            if (value === undefined) {
                setLocalValue(finalValue)
            }

            e.target.value = finalValue
            onChange?.(finalValue, e)
        }, [mode, onChange, value])

        return (
            <MciInput
                ref={ref}
                {...props}
                value={inputValue}
                onChange={handleChange}
                maxLength={mode === 'passport' ? 10 : 14}
                placeholder={
                    props.placeholder
                        ? props.placeholder
                        : mode === 'passport' ? 'AA 1234567' : '12345678901234'
                }
            />
        )
    }
)

MciIdentityInput.displayName = 'MciIdentityInput'

export default MciIdentityInput