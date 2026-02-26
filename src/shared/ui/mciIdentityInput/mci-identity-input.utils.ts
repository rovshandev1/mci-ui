import type { MciDocumentInputProps } from '../../types/ui/identity-input.types'

type IdentityMode = MciDocumentInputProps['mode']

export function formatPassport(rawValue: string) {
    const val = rawValue.replace(/\s/g, '').toUpperCase()
    let cleanData = ''

    for (let i = 0; i < val.length; i += 1) {
        const char = val[i]

        if (cleanData.length < 2) {
            if (/[A-Z]/.test(char)) cleanData += char
        } else if (/[0-9]/.test(char)) {
            cleanData += char
        }

        if (cleanData.length >= 9) break
    }

    if (cleanData.length > 2) {
        return `${cleanData.slice(0, 2)} ${cleanData.slice(2)}`
    }

    return cleanData
}

export function formatPinfl(rawValue: string) {
    return rawValue.replace(/\D/g, '').slice(0, 14)
}

export function formatMetirka(rawValue: string) {
    return rawValue
        .toUpperCase()
        .replace(/[^A-Z0-9\-\s]/g, '')
        .replace(/\s+/g, ' ')
        .slice(0, 15)
}

export function formatIdentityValue(mode: IdentityMode, rawValue: string) {
    if (mode === 'passport') return formatPassport(rawValue)
    if (mode === 'pinfl') return formatPinfl(rawValue)
    return formatMetirka(rawValue)
}

export function getIdentityPlaceholder(mode: IdentityMode, fallback?: string) {
    if (fallback) return fallback
    if (mode === 'passport') return 'AA 1234567'
    if (mode === 'pinfl') return '12345678901234'
    if (mode === 'metirka') return 'I-TN 1234567'
    return ''
}

export function getIdentityMaxLength(mode: IdentityMode, fallback?: number) {
    if (fallback) return fallback
    if (mode === 'passport') return 10
    if (mode === 'pinfl') return 14
    if (mode === 'metirka') return 15
    return 255
}
