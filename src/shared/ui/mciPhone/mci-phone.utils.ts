export const PHONE_SIZES = {
    sm: {
        input: 'h-9 text-sm',
        iconPadding: 'pl-8 pr-2',
        defaultPadding: 'px-2',
        iconSize: 'w-4 h-4',
        iconLeft: 'left-2',
        labelFont: 'text-sm',
        iconWrapper: 'h-4',
    },
    md: {
        input: 'h-10 text-sm',
        iconPadding: 'pl-10 pr-4',
        defaultPadding: 'px-4',
        iconSize: 'w-4 h-4',
        iconLeft: 'left-3',
        labelFont: 'text-base',
        iconWrapper: 'h-4',
    },
    base: {
        input: 'h-12 text-base',
        iconPadding: 'pl-11 pr-4',
        defaultPadding: 'px-4',
        iconSize: 'w-5 h-5',
        iconLeft: 'left-3',
        labelFont: 'text-base',
        iconWrapper: 'h-5',
    },
} as const

export function formatPhoneValue(input: string) {
    let numbers = input.replace(/\D/g, '')
    if (!numbers.startsWith('998')) {
        numbers = `998${numbers}`
    }
    numbers = numbers.substring(0, 12)

    let result = '+998'
    if (numbers.length > 3) result += ` (${numbers.substring(3, 5)}`
    if (numbers.length > 5) result += `) ${numbers.substring(5, 8)}`
    if (numbers.length > 8) result += ` ${numbers.substring(8, 10)}`
    if (numbers.length > 10) result += ` ${numbers.substring(10, 12)}`

    return result
}

export function getPhoneStateStyles(hasError?: string) {
    if (hasError) return 'border-red-600 focus:border-red-600 shadow-red'
    return 'border-slate-200 hover:border-slate-400 focus:shadow-blue focus:border-blue-600'
}

export function getPhoneIconColor(disabled: boolean, error: string | undefined, isFocused: boolean) {
    if (disabled) return 'text-slate-400'
    if (error) return 'text-red-600'
    if (isFocused) return 'text-black'
    return 'text-slate-400'
}
