import {AltArrowDown} from '@solar-icons/react'
import {useEffect, useRef, useState} from 'react'
import {cn} from '../../lib/utils.ts'
import type { CollapseProps } from '../../types/ui/collapse.types'

export default function MciCollapse({
                                        title,
                                        children,
                                        defaultOpen = false,
                                        icon,
                                        darkMode = false,
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
    }, [isOpen, children])

    const rootClasses = darkMode
        ? 'border-neutral-200 bg-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'
        : 'border-slate-200 bg-white'

    const triggerClasses = darkMode
        ? [
            'bg-neutral-300/70 hover:bg-neutral-200/80',
            isOpen
                ? 'border-b border-neutral-200 shadow-[inset_0_-1px_0_rgba(255,255,255,0.02)]'
                : 'border-b border-transparent',
          ]
        : [
            'hover:bg-slate-50',
            isOpen ? 'border-b border-slate-200' : 'border-b border-transparent',
          ]

    const titleClasses = darkMode
        ? 'text-neutral-50 group-hover:text-white'
        : 'text-black'

    const iconClasses = darkMode ? 'text-neutral-100' : 'text-slate-500'

    const arrowClasses = darkMode
        ? 'text-neutral-100 group-hover:text-neutral-50'
        : 'text-slate-400'

    const contentWrapperClasses = darkMode
        ? 'bg-[#22242A]'
        : 'bg-white'

    return (
        <div
            className={cn(
                'overflow-hidden rounded-xl border',
                rootClasses,
                className
            )}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'group flex w-full cursor-pointer items-center justify-between p-5 transition-all duration-300',
                    triggerClasses
                )}
            >
                <div className="flex items-center gap-2">
                    {icon && <span className={cn('shrink-0', iconClasses)}>{icon}</span>}

                    <div className={cn('text-base font-medium transition-colors duration-300', titleClasses)}>
                        {title}
                    </div>
                </div>

                <AltArrowDown weight='Linear' size={20}
                              className={cn(
                                  'shrink-0 transition-all duration-300',
                                  arrowClasses,
                                  isOpen && 'rotate-180'
                              )}
                />
            </button>

            <div
                className={cn(
                    'overflow-hidden transition-all duration-300 ease-out',
                    contentWrapperClasses
                )}
                style={{
                    height: `${contentHeight}px`,
                }}
            >
                <div
                    ref={contentRef}
                    className={cn(
                        'p-5',
                        darkMode && 'text-neutral-100',
                        contentClassName
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}
