import React, { forwardRef, useCallback, useState } from 'react'
import MciInput from '../mciInput/MciInput'
import type { MciDocumentInputProps } from '../../types/ui/identity-input.types'
import {
    formatIdentityValue,
    getIdentityMaxLength,
    getIdentityPlaceholder,
} from './mci-identity-input.utils'

const MciIdentityInput = forwardRef<HTMLInputElement, MciDocumentInputProps>(
    ({ mode, onChange, value, ...props }, ref) => {
        const [localValue, setLocalValue] = useState('')

        const inputValue = value !== undefined ? value : localValue

        const handleChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const rawValue = e.target.value
                const finalValue = formatIdentityValue(mode, rawValue)

                if (value === undefined) {
                    setLocalValue(finalValue)
                }

                e.target.value = finalValue
                onChange?.(finalValue, e)
            },
            [mode, onChange, value]
        )

        return (
            <MciInput
                ref={ref}
                {...props}
                value={inputValue}
                onChange={handleChange}
                maxLength={getIdentityMaxLength(mode, props.maxLength)}
                placeholder={getIdentityPlaceholder(mode, props.placeholder)}
            />
        )
    }
)

MciIdentityInput.displayName = 'MciIdentityInput'

export default MciIdentityInput
