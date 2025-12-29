import {AltArrowRight} from '@solar-icons/react'
import React from 'react'
import {cn} from '../../lib/utils'

type BreadcrumbItem = {
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
}

type Variant = 'blue' | 'yellow'

type MciBreadcrumbProps = {
    items: BreadcrumbItem[]
    variant?: Variant
    className?: string
}

export default function MciBreadcrumb({
                                          items,
                                          variant = 'blue',
                                          className,
                                      }: MciBreadcrumbProps) {
    const isBlue = variant === 'blue'

    const hoverColor = isBlue ? 'hover:text-blue-600' : 'hover:text-yellow-500'
    const activeColor = isBlue ? 'text-blue-600' : 'text-yellow-500'

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
                                    'flex items-center gap-x-2 transition-all text-sm font-normal text-slate-500',
                                    hoverColor
                                )}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </a>
                        )}

                        {!isLast && <span className="mx-2 flex items-center"><AltArrowRight weight='Linear' size={20} className='text-slate-500'/></span>}
                    </div>
                )
            })}
        </nav>
    )
}