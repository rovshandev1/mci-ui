import React, { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils.ts'

type Tab = {
    id: string
    label: string
    icon?: React.ReactNode
    content: React.ReactNode
    disabled?: boolean
}

type TabsProps = {
    tabs: Tab[]
    defaultTab?: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    className?: string
    tabListClassName?: string
    contentClassName?: string
    extra?: React.ReactNode
    onChange?: (tabId: string | number) => void
}

export default function MciTabs({
                                    tabs,
                                    defaultTab,
                                    position = 'top',
                                    className,
                                    tabListClassName,
                                    contentClassName,
                                    extra,
                                    onChange,
                                }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({})
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

    const updateIndicator = () => {
        requestAnimationFrame(() => {
            const activeIndex = tabs.findIndex((tab) => tab?.id === activeTab)
            const activeTabElement = tabsRef.current[activeIndex]

            if (activeTabElement) {
                const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = activeTabElement
                setIndicatorStyle({
                    left: `${offsetLeft}px`,
                    top: `${offsetTop}px`,
                    width: `${offsetWidth}px`,
                    height: `${offsetHeight}px`,
                    transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                })
            }
        })
    }

    useEffect(() => {
        updateIndicator()

        window.addEventListener('resize', updateIndicator)
        if ('fonts' in document) {
            document.fonts.ready.then(updateIndicator)
        }

        return () => window.removeEventListener('resize', updateIndicator)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, position, tabs])

    useEffect(() => {
        tabsRef.current = tabsRef.current.slice(0, tabs.length)
    }, [tabs])

    const isVertical = position === 'left' || position === 'right'

    const containerClasses = {
        top: 'flex-col',
        bottom: 'flex-col-reverse',
        left: 'flex-row',
        right: 'flex-row-reverse',
    }

    const tabsContainerClasses = {
        top: 'flex-row',
        bottom: 'flex-row',
        left: 'flex-col',
        right: 'flex-col',
    }

    const contentClasses = {
        top: 'mt-4',
        bottom: 'mb-4',
        left: 'ml-4',
        right: 'mr-4',
    }

    return (
        <div className={cn('flex w-full', containerClasses[position], className)}>
            <div
                className={cn(
                    'flex w-full gap-4',
                    isVertical
                        ? 'flex-col items-start'
                        : 'flex-row flex-wrap items-center'
                )}
            >
                {/* TABS */}
                <div
                    className={cn(
                        'flex-1',
                        isVertical ? 'w-full' : 'min-w-[520px]'
                    )}
                >
                    <div
                        className={cn(
                            'relative flex rounded-xl bg-slate-100 p-1',
                            tabsContainerClasses[position],
                            !isVertical &&
                            'w-full overflow-hidden',
                            isVertical ? 'min-w-48' : '',
                            tabListClassName
                        )}
                    >
                        <div
                            className={cn('absolute rounded-lg bg-white', isVertical ? 'w-full' : 'h-full')}
                            style={indicatorStyle}
                        />

                        {tabs?.map((tab, index) => {
                            const isActive = activeTab === tab.id

                            return (
                                <button
                                    key={tab?.id}
                                    ref={(el) => {
                                        tabsRef.current[index] = el
                                    }}
                                    onClick={() => {
                                        if (!tab?.disabled) {
                                            setActiveTab(tab?.id)
                                            onChange?.(tab?.id)
                                        }
                                    }}
                                    disabled={tab?.disabled}
                                    className={cn(
                                        'relative z-10 flex items-center justify-center whitespace-nowrap px-3 py-2 text-base font-normal text-black transition-colors duration-300',
                                        tab?.disabled && 'cursor-not-allowed opacity-50',
                                        isVertical ? 'w-full justify-start' : 'flex-1 min-w-0' // ✅
                                    )}
                                >
                                    {tab?.icon && (
                                        <span className={cn('shrink-0 transition-transform duration-200', isActive && 'scale-110')}>
      {tab?.icon}
    </span>
                                    )}

                                    <span className="relative z-10 truncate" title={tab?.label}>
    {tab?.label}
  </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* EXTRA */}
                {extra && (
                    <div
                        className={cn(
                            'shrink-0 ml-auto',
                            isVertical ? 'w-full' : 'max-w-full'
                        )}
                    >
                        <div className="flex flex-wrap items-center justify-end gap-2">
                            {extra}
                        </div>
                    </div>
                )}
            </div>

            <div className={cn('w-full flex-1 overflow-hidden', contentClasses[position], contentClassName)}>
                <div key={activeTab} className="animate-fade-in w-full" style={{ animationDuration: '0.35s' }}>
                    {tabs?.find((tab) => tab.id === activeTab)?.content}
                </div>
            </div>
        </div>
    )
}
