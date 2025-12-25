import {AltArrowDown} from '@solar-icons/react'
import React, {useEffect, useRef, useState} from 'react'
import {cn} from '../../lib/utils.ts'

type CollapseProps = {
    title: React.ReactNode | string
    children: React.ReactNode
    defaultOpen?: boolean
    icon?: React.ReactNode
    className?: string
    contentClassName?: string
}

export default function MciCollapse({
                                        title,
                                        children,
                                        defaultOpen = false,
                                        icon,
                                        className,
                                        contentClassName,
                                    }: CollapseProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)
    const [contentHeight, setContentHeight] = useState(0)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(isOpen ? contentRef.current.scrollHeight : 0)
        }
    }, [isOpen])

    return (
        <div className={cn('overflow-hidden rounded-xl border border-slate-200', className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex w-full items-center justify-between p-5 transition-all duration-300 hover:cursor-pointer',
                    isOpen ? 'border-b border-slate-200' : 'border-b border-transparent'
                )}
            >
                <div className="flex items-center gap-2">
                    {icon && <span className="shrink-0">{icon}</span>}

                    <div className={cn('text-base font-medium text-black')}>
                        {title}
                    </div>
                </div>

                <AltArrowDown weight='Linear' size={20}
                              className={cn(
                                  'shrink-0 transition-transform duration-300 text-slate-400',
                                  isOpen && 'rotate-180'
                              )}
                />
            </button>

            <div
                className={cn(
                    'overflow-hidden transition-all duration-300 ease-out',
                )}
                style={{
                    height: `${contentHeight}px`,
                }}
            >
                <div ref={contentRef} className={cn('p-5', contentClassName)}>
                    {children}
                </div>
            </div>
        </div>
    )
}
