import {forwardRef, useMemo} from 'react'
import {cn} from '../../lib/utils.ts'

type TextareaProps = {
    label?: string
    placeholder?: string
    value?: string
    onChange?: (value: string) => void
    required?: boolean
    disabled?: boolean
    error?: string
    success?: string
    className?: string
    rows?: number
    name?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            placeholder,
            value = '',
            onChange,
            required = false,
            disabled = false,
            error,
            success,
            className,
            rows = 4,
            name,
        },
        ref
    ) => {
        const stateStyles = useMemo(() => {
            if (error)
                return 'border-error-600 focus:border-error-600'
            if (success)
                return 'border-success-500 focus:border-success-600'
            return 'border-slate-300 hover:border-slate-400 focus:border-yellow-500'
        }, [error, success])

        return (
            <div className={cn('relative w-full', className)}>
                {label && (
                    <label
                        className={cn(
                            'block text-sm font-medium mb-2',
                            error
                                ? 'text-red-600'
                                : success
                                    ? 'text-green-600'
                                    : 'text-slate-700',
                        )}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                {/* Textarea */}
                <textarea
                    ref={ref}
                    name={name}
                    rows={rows}
                    value={value}
                    onChange={e => onChange?.(e.target.value)}
                    disabled={disabled}
                    placeholder={label ? undefined : placeholder}
                    className={cn(
                        'w-full rounded-md border bg-white text-xs font-medium outline-none transition-all duration-300 ease-in-out resize-none',
                        'disabled:bg-slate-50 disabled:border-slate-200 disabled:text-slate-300 disabled:cursor-not-allowed px-4 py-3',
                        stateStyles,
                        label && 'pt-5'
                    )}
                />

                {/* ERROR MESSAGE */}
                {error && (
                    <p className="mt-2 text-xs text-red-500 font-normal animate-[slideDown_0.3s_ease-out]">
                        {error}
                    </p>
                )}

                {/* SUCCESS MESSAGE */}
                {success && !error && (
                    <p className="mt-2 text-xs text-green-600 font-normal animate-[slideDown_0.3s_ease-out]">
                        {success}
                    </p>
                )}
            </div>
        )
    }
)

Textarea.displayName = 'Textarea'

export default Textarea
