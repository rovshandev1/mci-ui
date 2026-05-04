import {cn} from '../../lib/utils'
import {Star2} from '@solar-icons/react'
import type {ButtonProps} from '../../types/ui/button.types'

const BUTTON_SIZES = {
    sm: 'h-9 px-2 text-sm gap-1.5 rounded-lg leading-9 min-w-9',
    md: 'h-10 px-2 text-base gap-2 rounded-lg leading-10 min-w-10',
    base: 'h-12 px-4 text-base gap-2 rounded-xl leading-12 min-w-12',
} as const

const BUTTON_COLOR_VARIANTS = {
    blue: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-2 focus:ring-[rgba(21,93,252,0.25)]',
        secondary: 'bg-blue-100 text-blue-600 hover:bg-blue-200 active:bg-blue-200 active:border active:border-blue-600 focus:ring-2 focus:ring-[rgba(21,93,252,0.25)]',
        outline: 'border border-blue-600 text-blue-600 hover:border-blue-700 hover:text-blue-700 active:border-blue-800 active:text-blue-800 focus:ring-2 focus:ring-blue-200',
    },
    yellow: {
        primary: 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 focus:ring-2 focus:ring-yellow-300',
        secondary: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 active:bg-yellow-100 active:border active:border-yellow-500 focus:ring-2 focus:ring-yellow-200',
        outline: 'border border-yellow-500 text-yellow-500 hover:border-yellow-600 hover:text-yellow-600 active:border-yellow-700 active:text-yellow-700 focus:ring-2 focus:ring-yellow-200',
    },
} as const

const BUTTON_DARK_COLOR_VARIANTS = {
    blue: {
        primary: 'bg-blue-500 text-black hover:bg-blue-400 active:bg-blue-300 focus:ring-2 focus:ring-blue-500',
        secondary: 'border border-blue-900 bg-blue-900 text-blue-500 hover:bg-blue-700 active:bg-blue-700 active:border-blue-700 focus:ring-2 focus:ring-blue-900',
        outline: 'border border-blue-500 text-blue-500 hover:border-blue-400 hover:text-blue-400 active:text-blue-300 active:border-blue-300 focus:ring-2 focus:ring-blue-500',
    },
    yellow: {
        primary: 'bg-yellow-400 text-slate-950 hover:bg-yellow-300 active:bg-yellow-200 focus:ring-2 focus:ring-yellow-300/40',
        secondary: 'border border-slate-700 bg-slate-800 text-yellow-300 hover:bg-slate-700 active:bg-slate-600 focus:ring-2 focus:ring-yellow-300/30',
        outline: 'border border-yellow-400 text-yellow-300 hover:bg-yellow-500/10 hover:border-yellow-300 hover:text-yellow-200 active:bg-yellow-500/20 active:border-yellow-200 focus:ring-2 focus:ring-yellow-300/30',
    },
} as const

const BUTTON_FIXED_VARIANTS = {
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:shadow-red',
    tertiary: 'bg-slate-100 text-black hover:bg-slate-200 active:bg-slate-300 focus:ring-2 focus:shadow-slate',
} as const

const BUTTON_DARK_FIXED_VARIANTS = {
    danger: 'bg-red-500 text-black hover:bg-red-300 active:bg-red-200 focus:ring-2 focus:ring-red-500/35',
    tertiary: 'bg-neutral-300 text-white hover:bg-neutral-200 focus:ring-2 focus:ring-slate-200/80',
} as const

export default function MciButton({
                                      children,
                                      text,
                                      icon,
                                      iconPosition = 'left',
                                      size = 'base',
                                      variant = 'primary',
                                      color = 'yellow',
                                      darkMode = false,
                                      loading = false,
                                      disabled = false,
                                      className,
                                      type = 'button',
                                      ...rest
                                  }: ButtonProps) {
    const content = children ?? text

    const baseVariant = (variant === 'primary' || variant === 'secondary' || variant === 'outline')
        ? darkMode
            ? BUTTON_DARK_COLOR_VARIANTS[color][variant]
            : BUTTON_COLOR_VARIANTS[color][variant]
        : darkMode
            ? BUTTON_DARK_FIXED_VARIANTS[variant]
            : BUTTON_FIXED_VARIANTS[variant]

    const isDisabled = disabled || loading

    const disabledClasses = isDisabled
        ? variant === 'outline'
            ? darkMode
                ? 'border-neutral-200 bg-transparent text-neutral-100 cursor-not-allowed hover:bg-transparent hover:border-neutral-200 hover:text-neutral-100 active:border-neutral-200 active:text-neutral-100 active:bg-transparent focus:bg-transparent focus:ring-0'
                : 'border-slate-200 bg-white text-slate-400 cursor-not-allowed hover:bg-transparent hover:border-slate-200 hover:text-slate-400 active:border-slate-200 active:text-slate-400 active:bg-transparent focus:bg-transparent focus:ring-0'
            : darkMode
                ? 'bg-neutral-200 text-neutral-100 cursor-not-allowed focus:ring-0'
                : 'border-neutral-200 text-neutral-100 cursor-not-allowed focus:ring-0'
        : ''

    return (
        <button
            {...rest}
            type={type}
            disabled={isDisabled}
            className={cn(
                'inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap text-center font-medium transition-all duration-200 cursor-pointer',
                BUTTON_SIZES[size],
                baseVariant,
                !isDisabled && baseVariant,
                disabledClasses,
                className
            )}
        >
            {icon && iconPosition === 'left' && !loading && (
                <span className="flex items-center">{icon}</span>
            )}

            {content && <span className="whitespace-nowrap">{content}</span>}

            {icon && iconPosition === 'right' && !loading && (
                <span className="flex items-center">{icon}</span>
            )}

            {loading && <Star2 weight='Linear' size={20} className="animate-spin"/>}
        </button>
    )
}
