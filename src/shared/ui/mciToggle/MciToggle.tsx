import {cn} from '../../lib/utils'
import type { ToggleProps } from '../../types/ui/toggle.types'

const TOGGLE_COLORS = {
    blue: {
        active: 'bg-blue-600',
        hover: 'hover:bg-blue-600',
        focus: 'focus:shadow-blue',
        darkActive: 'bg-blue-500',
        darkHover: 'hover:bg-blue-500',
    },
    yellow: {
        active: 'bg-yellow-500',
        hover: 'hover:bg-yellow-500',
        focus: 'focus:ring-2 focus:ring-yellow-200',
        darkActive: 'bg-yellow-500',
        darkHover: 'hover:bg-yellow-500',
    },
} as const

export default function MciToggle({
                                      checked = false,
                                      onChange,
                                      disabled = false,
                                      variant = 'yellow',
                                      darkMode = false,
                                      label,
                                      supportText,
                                      className,
                                      ...rest
                                  }: ToggleProps) {
    const handleToggle = () => {
        if (disabled) return
        onChange?.(!checked)
    }

    const activeStyles = TOGGLE_COLORS[variant]

    return (
        <div
            className={cn(
                'flex items-start gap-3 select-none',
                className
            )}
        >
            <button
                {...rest}
                type="button"
                disabled={disabled}
                onClick={handleToggle}
                className={cn(
                    'relative h-6 w-11 rounded-xl transition-all duration-300 outline-none',
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                    checked
                        ? darkMode
                            ? activeStyles.darkActive
                            : activeStyles.active
                        : darkMode
                            ? 'bg-neutral-200'
                            : 'bg-slate-200',
                    !disabled && checked && (darkMode ? activeStyles.darkHover : activeStyles.hover),
                    !disabled && !checked && (darkMode ? 'hover:bg-neutral-100' : 'hover:bg-slate-300'),
                    !disabled && activeStyles.focus,
                    darkMode && !disabled && variant === 'blue' && 'focus-visible:shadow-[0_0_0_2px_var(--opacity-25,rgba(21,93,252,0.25))]',
                    darkMode && !disabled && variant === 'yellow' && 'focus-visible:ring-2 focus-visible:ring-yellow-300/40',
                    disabled && (darkMode ? 'bg-neutral-200/60' : 'bg-slate-100')
                )}
            >
        <span
            className={cn(
                'absolute top-1/2 left-0.5 h-5 w-5 -translate-y-1/2 rounded-full transition-all duration-300',
                darkMode ? 'bg-black' : 'bg-white',
                checked && 'translate-x-5'
            )}
        ></span>
            </button>

            {(label || supportText) && (
                <div className="flex flex-col leading-tight">
                    {label && (
                        <span
                            className={cn(
                                'text-base font-medium',
                                darkMode
                                    ? (disabled ? 'text-neutral-50/50' : 'text-neutral-50')
                                    : (disabled ? 'text-slate-400' : 'text-black')
                            )}
                        >
              {label}
            </span>
                    )}

                    {supportText && (
                        <span
                            className={cn(
                                'text-sm font-normal',
                                darkMode
                                    ? (disabled ? 'text-neutral-100/50' : 'text-neutral-100')
                                    : (disabled ? 'text-slate-400' : 'text-slate-500')
                            )}
                        >
              {supportText}
            </span>
                    )}
                </div>
            )}
        </div>
    )
}
