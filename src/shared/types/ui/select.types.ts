import type { ReactNode } from 'react'

export type Option = {
    value: string | number
    label: string
}

export type SelectProps = {
    label?: string
    dropdownPosition?: 'top' | 'bottom'
    placeholder?: string
    options: Option[]
    icon?: ReactNode
    iconPosition?: 'left' | 'right'
    size?: 'sm' | 'md' | 'base'
    darkMode?: boolean
    error?: string
    disabled?: boolean
    required?: boolean
    value?: string | number
    onChange?: (value: string | number) => void
    onFocus?: () => void
    onBlur?: () => void
    className?: string
    clearable?: boolean
    searchable?: boolean
    onSearch?: (searchTerm: string) => void
    name?: string
}
