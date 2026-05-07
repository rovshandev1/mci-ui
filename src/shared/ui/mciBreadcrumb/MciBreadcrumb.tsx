import {AltArrowRight} from '@solar-icons/react'
import {cn} from '../../lib/utils'
import type { MciBreadcrumbProps } from '../../types/ui/breadcrumb.types'

const BREADCRUMB_THEME = {
    blue: {
        hover: 'hover:text-blue-600',
        active: 'text-blue-600',
        darkHover: 'hover:text-blue-400',
        darkActive: 'text-blue-400',
    },
    yellow: {
        hover: 'hover:text-yellow-500',
        active: 'text-yellow-500',
        darkHover: 'hover:text-yellow-400',
        darkActive: 'text-yellow-400',
    },
    orange: {
        hover: 'hover:text-orange-600',
        active: 'text-orange-600',
        darkHover: 'hover:text-orange-400',
        darkActive: 'text-orange-400',
    },
} as const

export default function MciBreadcrumb({
                                          items,
                                          variant = 'orange',
                                          darkMode = false,
                                          className,
                                      }: MciBreadcrumbProps) {
    const theme = BREADCRUMB_THEME[variant]
    const hoverColor = darkMode ? theme.darkHover : theme.hover
    const activeColor = darkMode ? theme.darkActive : theme.active
    const inactiveColor = darkMode ? 'text-neutral-50' : 'text-slate-500'

    return (
        <nav className={cn('flex items-center', className)} aria-label="Breadcrumb">
            {items.map((item, index) => {
                const isLast = index === items.length - 1

                return (
                    <div key={index} className="flex items-center">
                        {isLast ? (
                            <span className={cn('flex items-center gap-x-2 font-medium', activeColor)}>
                {item.icon}
                                <span>{item.label}</span>
              </span>
                        ) : (
                            <a
                                href={item.href ?? '#'}
                                onClick={(e) => {
                                    if (item.onClick) {
                                        e.preventDefault()
                                        item.onClick()
                                    }
                                }}
                                className={cn(
                                    'flex items-center gap-x-2 transition-all text-sm font-normal',
                                    inactiveColor,
                                    hoverColor
                                )}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </a>
                        )}

                        {!isLast && <span className="mx-2 flex items-center"><AltArrowRight weight='Linear' size={20} className={inactiveColor}/></span>}
                    </div>
                )
            })}
        </nav>
    )
}
