import {ChevronRight} from 'lucide-react'
import React from 'react'
import {cn} from '../../lib/utils.ts'

type BreadcrumbItem = {
    label: string
    href?: string
    onClick?: () => void
}

type BreadcrumbProps = {
    items: BreadcrumbItem[]
    className?: string
    separatorIcon?: React.ReactNode
}

export default function Breadcrumb({
                                       items,
                                       className,
                                       separatorIcon = (
                                           <ChevronRight className='w-5 h-5 text-slate-400 '/>
                                       ),
                                   }: BreadcrumbProps) {
    return (
        <nav
            className={cn(
                'flex items-center text-sm font-medium text-slate-500',
                className
            )}
            aria-label='Breadcrumb'
        >
            {items?.map((item, index) => {
                const isLast = index === items?.length - 1

                return (
                    <div key={index} className='flex items-center'>
                        {isLast ? (
                            <span className='text-yellow-500'>
                                {item.label}
                            </span>
                        ) : (
                            <a
                                href={item.href || '#'}
                                onClick={item.onClick}
                                className='transition-colors text-sm font-medium text-slate-500 hover:text-slate-700'
                            >
                                {item.label}
                            </a>
                        )}

                        {!isLast && (
                            <span className='mx-1.5 flex items-center'>
                                {separatorIcon}
                            </span>
                        )}
                    </div>
                )
            })}
        </nav>
    )
}
