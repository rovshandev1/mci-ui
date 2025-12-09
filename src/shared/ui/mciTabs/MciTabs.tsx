import React, {useEffect, useRef, useState} from 'react'
import {cn} from '../../lib/utils.ts'

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
    onChange?: (tabId: string | number) => void
}

export default function MciTabs({
                                    tabs,
                                    defaultTab,
                                    position = 'top',
                                    className,
                                    onChange,
                                }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
    const [indicatorStyle, setIndicatorStyle] = useState({})
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

    const updateIndicator = () => {
        const activeIndex = tabs.findIndex((tab) => tab?.id === activeTab)
        const activeTabElement = tabsRef.current[activeIndex]

        if (activeTabElement) {
            const {offsetLeft, offsetTop, offsetWidth, offsetHeight} = activeTabElement

            setIndicatorStyle({
                left: `${offsetLeft}px`,
                top: `${offsetTop}px`,
                width: `${offsetWidth}px`,
                height: `${offsetHeight}px`,
                transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            })
        }
    }

    useEffect(() => {
        updateIndicator()
        window.addEventListener('resize', updateIndicator)
        return () => window.removeEventListener('resize', updateIndicator)
    }, [activeTab, position, tabs])

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
        top: 'mt-6',
        bottom: 'mb-6',
        left: 'ml-6',
        right: 'mr-6',
    }

    const isVertical = position === 'left' || position === 'right'

    return (
        <div className={cn('flex w-full', containerClasses[position], className)}>
            <div
                className={cn(
                    'relative flex rounded-xl bg-slate-100 p-1',
                    tabsContainerClasses[position],
                    isVertical ? 'min-w-48' : 'w-full'
                )}
            >
                <div
                    className={cn(
                        'absolute bg-white rounded-lg',
                        isVertical ? 'w-full' : 'h-full'
                    )}
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
                                'relative flex cursor-pointer text-black text-base font-normal items-center justify-center gap-2 px-5 py-2 z-10 whitespace-nowrap transition-colors duration-300',
                                isActive
                                    ? '' : 'text-slate-500 hover:text-slate-700',
                                tab?.disabled && 'opacity-50 cursor-not-allowed',
                                isVertical ? 'w-full justify-start' : 'flex-1'
                            )}
                        >
                            {tab?.icon && (
                                <span
                                    className={cn(
                                        'flex-shrink-0 transition-transform duration-200',
                                        isActive && 'scale-110'
                                    )}
                                >
                           {tab?.icon}
                        </span>
                            )}
                            <span className="relative z-10">{tab?.label}</span>
                        </button>
                    )
                })}
            </div>

            <div className={cn('flex-1 overflow-hidden', contentClasses[position])}>
                <div key={activeTab} className="animate-fade-in" style={{animationDuration: '0.4s'}}>
                    {tabs?.find((tab) => tab?.id === activeTab)?.content}
                </div>
            </div>
        </div>
    )
}

type TabPanelProps = {
    children: React.ReactNode
    className?: string
}

export function TabPanel({children, className}: TabPanelProps) {
    return (
        <div
            className={cn(
                'rounded-xl border border-slate-200 bg-white p-6',
                className
            )}
        >
            {children}
        </div>
    )
}
