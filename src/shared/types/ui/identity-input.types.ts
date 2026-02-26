import type { ChangeEvent } from 'react'
import type { InputProps } from './input.types'

export interface MciDocumentInputProps extends Omit<InputProps, 'onChange'> {
    mode: 'passport' | 'pinfl' | 'metirka'
    onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void
}
