import {AltArrowRight} from '@solar-icons/react'
import {cn} from '../../lib/utils'
import type { MciBreadcrumbProps } from '../../types/ui/breadcrumb.types'

export default function MciBreadcrumb({
                                          items,
                                          variant = 'blue',
                                          darkMode = false,
                                          className,
                                      }: MciBreadcrumbProps) {
    const isBlue = variant === 'blue'

    const hoverColor = darkMode
        ? isBlue
            ? 'hover:text-blue-400'
            : 'hover:text-yellow-400'
        : isBlue
            ? 'hover:text-blue-600'
            : 'hover:text-yellow-500'

    const activeColor = darkMode
        ? isBlue
            ? 'text-blue-400'
            : 'text-yellow-400'
        : isBlue
            ? 'text-blue-600'
            : 'text-yellow-500'

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