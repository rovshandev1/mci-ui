export type TextareaProps = {
    label?: string
    placeholder?: string
    value?: string
    onChange?: (value: string) => void
    required?: boolean
    disabled?: boolean
    error?: string
    className?: string
    rows?: number
    name?: string
}
