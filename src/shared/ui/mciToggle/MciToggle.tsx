import {cn} from '../../lib/utils'
import type { ToggleProps } from '../../types/ui/toggle.types'

const TOGGLE_COLORS = {
    blue: {
        active: 'bg-blue-600',
        hover: 'hover:bg-blue-600',
        focus: 'focus:shadow-blue',
    },
    yellow: {
        active: 'bg-yellow-500',
        hover: 'hover:bg-yellow-500',
        focus: 'focus:ring-2 focus:ring-yellow-200',
    },
} as const

export default function MciToggle({
                                      checked = false,
                                      onChange,
                                      disabled = false,
                                      variant = 'yellow',
                                      label,
                                      supportText,
                                      className,
                                  }: ToggleProps) {
    const handleToggle = () => {
        if (disabled) return
        onChange?.(!checked)
    }

    const disabledStyle =
        'bg-slate-100 cursor-not-allowed'

    return (
        <div
            className={cn(
                'flex items-start gap-3 select-none',
                className
            )}
        >
            <button
                type="button"
                disabled={disabled}
                className={cn(
                    'relative h-6 w-11 rounded-xl transition-all duration-300 outline-none cursor-pointer',
                    checked
                        ? TOGGLE_COLORS[variant].active
                        : 'bg-slate-200',
                    !disabled && TOGGLE_COLORS[variant].hover,
                    !disabled && TOGGLE_COLORS[variant].focus,
                    disabled && disabledStyle
                )}
                onClick={handleToggle}
            >
        <span
            className={cn(
                'absolute top-1/2 left-0.5 h-5 w-5 -translate-y-1/2 rounded-full transition-all duration-300 bg-white',
                checked && 'translate-x-5'
            )}
        ></span>
            </button>

            {(label || supportText) && (
                <div className="flex flex-col leading-tight">
                    {label && (
                        <span
                            className={cn(
                                'text-base font-medium text-black'
                            )}
                        >
              {label}
            </span>
                    )}

                    {supportText && (
                        <span className="text-sm font-normal text-slate-500">
              {supportText}
            </span>
                    )}
                </div>
            )}
        </div>
    )
}
