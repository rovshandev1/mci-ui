import {forwardRef, useMemo} from 'react'
import {cn} from '../../lib/utils.ts'
import type { TextareaProps } from '../../types/ui/textarea.types'

const MciTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            placeholder,
            darkMode = false,
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
            if (darkMode) {
                if (error) {
                    return 'border-red-500 hover:border-red-500 focus:border-red-500 focus:shadow-[0_0_0_2px_rgba(231,0,11,0.25)]'
                }
                return 'border-neutral-200 hover:border-neutral-100 focus:border-blue-500 focus:shadow-[0_0_0_2px_var(--opacity-25,rgba(21,93,252,0.25))]'
            }

            if (error) return 'border-red-600 focus:border-red-600 shadow-red'
            return 'border-slate-200 hover:border-slate-400 focus:shadow-blue focus:border-blue-600'
        }, [darkMode, error])

        return (
            <div className={cn('relative w-full', className)}>
                {label && (
                    <label
                        className={cn(
                            'mb-2 block text-base font-medium',
                            error
                                ? darkMode
                                    ? 'text-red-500'
                                    : 'text-red-600'
                                : darkMode
                                    ? 'text-neutral-50'
                                    : 'text-slate-700'
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
                    placeholder={placeholder}
                    className={cn(
                        'w-full resize-none rounded-xl border text-base font-normal transition-all duration-300 ease-in-out outline-none',
                        darkMode
                            ? 'p-3 text-neutral-50 placeholder:text-neutral-100 focus:text-white disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-300 disabled:text-neutral-100/50 disabled:placeholder:text-neutral-100/50'
                            : 'bg-white p-3 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
                        stateStyles,
                    )}
                />

                {error && (
                    <p
                        className={cn(
                            'mt-2 animate-[slideDown_0.3s_ease-out] text-sm font-normal',
                            darkMode ? 'text-red-500' : 'text-red-600'
                        )}
                    >
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

MciTextarea.displayName = 'MciTextarea'

export default MciTextarea
