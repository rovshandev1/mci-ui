import React, { forwardRef, useCallback, useState } from 'react'
import MciInput from '../mciInput/MciInput'
import { ComponentProps } from 'react'

type MciInputProps = ComponentProps<typeof MciInput>

interface MciDocumentInputProps extends Omit<MciInputProps, 'onChange'> {
    mode: 'passport' | 'pinfl' | 'metirka'
    onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
}

const MciIdentityInput = forwardRef<HTMLInputElement, MciDocumentInputProps>(
    ({ mode, onChange, value, ...props }, ref) => {
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

        const formatMetirka = (rawValue: string) => {
            return rawValue
                .toUpperCase()
                .replace(/[^A-Z0-9\-\s]/g, '')
                .replace(/\s+/g, ' ')
                .slice(0, 15)
        }

        const handleChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const rawValue = e.target.value
                let finalValue = ''

                if (mode === 'passport') {
                    finalValue = formatPassport(rawValue)
                } else if (mode === 'pinfl') {
                    finalValue = formatPinfl(rawValue)
                } else if (mode === 'metirka') {
                    finalValue = formatMetirka(rawValue)
                }

                if (value === undefined) {
                    setLocalValue(finalValue)
                }

                e.target.value = finalValue
                onChange?.(finalValue, e)
            },
            [mode, onChange, value]
        )

        const getPlaceholder = () => {
            if (props.placeholder) return props.placeholder
            switch (mode) {
                case 'passport':
                    return 'AA 1234567'
                case 'pinfl':
                    return '12345678901234'
                case 'metirka':
                    return 'I-TN 1234567'
                default:
                    return ''
            }
        }

        const getMaxLength = () => {
            if (props.maxLength) return props.maxLength
            switch (mode) {
                case 'passport':
                    return 10
                case 'pinfl':
                    return 14
                case 'metirka':
                    return 15
                default:
                    return 255
            }
        }

        return (
            <MciInput
                ref={ref}
                {...props}
                value={inputValue}
                onChange={handleChange}
                maxLength={getMaxLength()}
                placeholder={getPlaceholder()}
            />
        )
    }
)

MciIdentityInput.displayName = 'MciIdentityInput'

export default MciIdentityInput