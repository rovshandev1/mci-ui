export type ToggleProps = {
    checked?: boolean
    onChange?: (checked: boolean) => void
    disabled?: boolean
    variant?: 'blue' | 'yellow'
    darkMode?: boolean
    label?: string
    supportText?: string
    className?: string
}
