import {Loader} from 'lucide-react'
import React from 'react'
import {cn} from '../../lib/utils'

type ButtonProps = {
    children?: React.ReactNode
    text?: string
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right'
    size?: 'sm' | 'md' | 'lg'
    variant?: 'main' | 'second' | 'error'
    state?: 'default' | 'outline' | 'ghost' | 'disabled' | 'link'
    loading?: boolean
    disabled?: boolean
    onClick?: () => void
    className?: string
    type?: 'button' | 'submit' | 'reset'
}

export default function Button({
                                   text,
                                   children,
                                   icon,
                                   iconPosition = 'left',
                                   size = 'lg',
                                   variant = 'main',
                                   state = 'default',
                                   loading = false,
                                   disabled = false,
                                   onClick,
                                   className,
                                   type = 'button',
                               }: ButtonProps) {
    const content = children ?? text

    const sizes = {
        sm: 'h-8 px-2.5 text-sm gap-1.5',
        md: 'h-9 px-3 text-sm gap-1.5',
        lg: 'h-12 px-3 text-base gap-2',
    }

    const styles = {
        main: {
            default:
                'bg-yellow-400 text-white hover:bg-yellow-500',
            outline:
                'bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-50 hover:text-yellow-500 hover:border-yellow-500',
            ghost:
                'bg-yellow-50 text-yellow-400 hover:bg-yellow-100',
            link:
                'bg-transparent text-yellow-400 p-0 h-auto hover:text-yellow-500',
            disabled: 'opacity-60 cursor-not-allowed bg-yellow-50 text-yellow-400',
        },
        second: {
            default:
                'bg-slate-900 text-white hover:bg-[#3F4555]',
            outline:
                'bg-transparent border border-slate-400 text-slate-900 hover:border-slate-700',
            ghost:
                'bg-[#E9EEF4] text-slate-900',
            link:
                'bg-transparent text-slate-900 p-0 h-auto hover:text-[#3F4555]',
            disabled:
                'opacity-60 cursor-not-allowed bg-slate-200 text-slate-900',
        },
        error: {
            default:
                'bg-red-500 text-white hover:bg-red-400',
            outline:
                'bg-transparent border border-red-500 text-red-500 hover:bg-red-50',
            ghost:
                'bg-red-50 text-red-500 hover:bg-red-100',
            link:
                'bg-transparent text-red-500 p-0 h-auto hover:text-red-400',
            disabled: 'opacity-60 cursor-not-allowed bg-red-50 text-red-500',
        },
    }

    const applied = styles[variant][state]

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading || state === 'disabled'}
            className={cn(
                'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 cursor-pointer',
                sizes[size],
                applied,
                className
            )}
        >
            {icon && iconPosition === 'left' && !loading && (
                <span className='flex items-center'>{icon}</span>
            )}

            {content && <span>{content}</span>}

            {icon && iconPosition === 'right' && !loading && (
                <span className='flex items-center'>{icon}</span>
            )}

            {loading && <Loader size={18} className='animate-spin'/>}
        </button>
    )
}
