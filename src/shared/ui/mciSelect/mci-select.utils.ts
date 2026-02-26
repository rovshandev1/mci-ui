import type { Option } from '../../types/ui/select.types'

export const SELECT_SIZES = {
    sm: {
        container: 'h-9 text-sm',
        padding: 'px-2',
        iconPaddingLeft: 'pl-7',
        iconPaddingRight: 'pr-7',
        iconSize: 'w-4 h-4',
        iconWrapper: 'left-2',
        rightIconWrapper: 'right-2',
        label: 'text-sm',
        dropdown: 'text-sm',
    },
    md: {
        container: 'h-10 text-sm',
        padding: 'px-4',
        iconPaddingLeft: 'pl-8',
        iconPaddingRight: 'pr-8',
        iconSize: 'w-5 h-5',
        iconWrapper: 'left-3',
        rightIconWrapper: 'right-3',
        label: 'text-sm',
        dropdown: 'text-sm',
    },
    base: {
        container: 'h-12 text-base',
        padding: 'px-4',
        iconPaddingLeft: 'pl-10',
        iconPaddingRight: 'pl-3',
        iconSize: 'w-5 h-5',
        iconWrapper: 'left-4',
        rightIconWrapper: 'right-16',
        label: 'text-base',
        dropdown: 'text-base',
    },
} as const

export function getFilteredOptions(
    options: Option[],
    searchTerm: string,
    searchable: boolean,
    hasExternalSearch: boolean
) {
    if (!searchable) return options
    if (hasExternalSearch) return options

    const lower = searchTerm.toLowerCase()
    return options.filter((opt) => opt.label.toLowerCase().includes(lower))
}

export function getSelectStateStyles(disabled: boolean, error?: string) {
    if (disabled) return 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
    if (error) return 'border-red-600 focus:border-red-600 shadow-red bg-white'
    return 'border-slate-200 hover:border-slate-400 focus:shadow-blue focus:border-blue-600 bg-white'
}

export function getSelectIconColor(
    disabled: boolean,
    error: string | undefined,
    isOpen: boolean,
    isFocused: boolean
) {
    if (disabled) return 'text-slate-400'
    if (error) return 'text-red-600'
    if (isOpen || isFocused) return 'text-black'
    return 'text-slate-400'
}
