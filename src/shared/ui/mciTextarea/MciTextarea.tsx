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
    className?: string
    rows?: number
    name?: string
}

const MciTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            placeholder,
            value = '',
            onChange,
            required = false,
            disabled = false,
            error,
            className,
            rows = 4,
            name,
        },
        ref
    ) => {
        const stateStyles = useMemo(() => {
            if (error) return 'border-red-600 focus:border-red-600 shadow-red'
            return 'border-slate-200 hover:border-slate-400 focus:shadow-blue focus:border-blue-600'
        }, [error])

        return (
            <div className={cn('relative w-full', className)}>
                {label && (
                    <label
                        className={cn(
                            'mb-2 block text-base font-medium',
                            error ? 'text-red-600' : 'text-slate-700'
                        )}
                    >
                        {label}
                        {required && <span className="ml-1 text-red-600">*</span>}
                    </label>
                )}

                {/* MciTextarea */}
                <textarea
                    ref={ref}
                    name={name}
                    rows={rows}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                    placeholder={label ? undefined : placeholder}
                    className={cn(
                        'w-full resize-none rounded-xl border bg-white text-base font-normal transition-all duration-300 ease-in-out outline-none',
                        'p-3 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
                        stateStyles,
                    )}
                />

                {/* ERROR MESSAGE */}
                {error && (
                    <p className="mt-2 animate-[slideDown_0.3s_ease-out] text-small font-normal text-red-600">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

MciTextarea.displayName = 'MciTextarea'

export default MciTextarea
