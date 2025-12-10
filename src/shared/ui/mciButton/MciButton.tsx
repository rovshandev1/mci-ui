import React from 'react'
import {cn} from '../../lib/utils'
import {Star2} from '@solar-icons/react'

type ButtonProps = {
    children?: React.ReactNode
    text?: string
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right'
    size?: 'sm' | 'md' | 'base'
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'tertiary'
    color?: 'blue' | 'yellow'
    loading?: boolean
    disabled?: boolean
    onClick?: () => void
    className?: string
    type?: 'button' | 'submit' | 'reset'
}

export default function MciButton({
                                   children,
                                   text,
                                   icon,
                                   iconPosition = 'left',
                                   size = 'base',
                                   variant = 'primary',
                                   color = 'yellow',
                                   loading = false,
                                   disabled = false,
                                   onClick,
                                   className,
                                   type = 'button',
                               }: ButtonProps) {
    const content = children ?? text

    const sizes = {
        sm: 'h-9 px-2 text-small gap-1.5 rounded-lg leading-9 min-w-9',
        md: 'h-10 px-2 text-base gap-2 rounded-lg leading-10 min-w-10',
        base: 'h-12 px-4 text-base gap-2 rounded-xl leading-12 min-w-12',
    }

    const colorVariants = {
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
    }

    const fixedVariants = {
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:shadow-red',
        tertiary: 'bg-slate-100 text-black hover:bg-slate-200 active:bg-slate-300 focus:ring-2 focus:shadow-slate',
    }

    const baseVariant = (variant === 'primary' || variant === 'secondary' || variant === 'outline')
        ? colorVariants[color][variant]
        : fixedVariants[variant]

    const isDisabled = disabled || loading

    const disabledClasses = isDisabled
        ? variant === 'outline'
            ? 'border-slate-200 bg-white text-slate-400 cursor-not-allowed hover:bg-transparent hover:border-slate-200 hover:text-slate-400 active:border-slate-200 active:text-slate-400 active:bg-transparent focus:bg-transparent focus:ring-0'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200 active:bg-slate-200 focus:ring-0'
        : ''

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={cn(
                'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer',
                sizes[size],
                baseVariant,
                !isDisabled && baseVariant,
                disabledClasses,
                className
            )}
        >
            {icon && iconPosition === 'left' && !loading && (
                <span className="flex items-center">{icon}</span>
            )}

            {content && <span>{content}</span>}

            {icon && iconPosition === 'right' && !loading && (
                <span className="flex items-center">{icon}</span>
            )}

            {loading && <Star2 weight='Linear' size={20} className="animate-spin"/>}
        </button>
    )
}
