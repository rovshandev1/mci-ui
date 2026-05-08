import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/utils.ts'
import type { TabsProps } from '../../types/ui/tabs.types'

const CONTAINER_CLASSES = {
   top: 'flex-col',
   bottom: 'flex-col-reverse',
   left: 'flex-row',
   right: 'flex-row-reverse',
} as const

const TABS_CONTAINER_CLASSES = {
   top: 'flex-row',
   bottom: 'flex-row',
   left: 'flex-col',
   right: 'flex-col',
} as const

const CONTENT_CLASSES = {
   top: 'mt-4',
   bottom: 'mb-4',
   left: 'ml-4',
   right: 'mr-4',
} as const

export default function FilledTabs({
   tabs,
   defaultTab,
   position = 'top',
   darkMode = false,
   className,
   tabListClassName,
   contentClassName,
   extra,
   onChange,
}: TabsProps) {
   const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
   const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({})
   const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
   const tabListRef = useRef<HTMLDivElement>(null)

   const updateIndicator = useCallback(() => {
      requestAnimationFrame(() => {
         requestAnimationFrame(() => {
            const activeIndex = tabs.findIndex((tab) => tab?.id === activeTab)
            const activeTabElement = tabsRef.current[activeIndex]

            if (!activeTabElement) return

            const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = activeTabElement
            setIndicatorStyle({
               left: `${offsetLeft}px`,
               top: `${offsetTop}px`,
               width: `${offsetWidth}px`,
               height: `${offsetHeight}px`,
               transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
            })
         })
      })
   }, [activeTab, tabs])

   useEffect(() => {
      updateIndicator()

      window.addEventListener('resize', updateIndicator)
      if ('fonts' in document) {
         document.fonts.ready.then(updateIndicator)
      }

      return () => window.removeEventListener('resize', updateIndicator)
   }, [position, updateIndicator])

   useEffect(() => {
      const tabListElement = tabListRef.current
      if (!tabListElement || typeof ResizeObserver === 'undefined') return

      const resizeObserver = new ResizeObserver(() => {
         updateIndicator()
      })

      resizeObserver.observe(tabListElement)
      tabsRef.current.forEach((tab) => {
         if (tab) resizeObserver.observe(tab)
      })

      return () => resizeObserver.disconnect()
   }, [tabs, updateIndicator])

   useEffect(() => {
      tabsRef.current = tabsRef.current.slice(0, tabs.length)
   }, [tabs])

   const isVertical = position === 'left' || position === 'right'

   const ActiveContent = useMemo(
      () => tabs.find((tab) => tab.id === activeTab)?.content,
      [activeTab, tabs]
   )

   return (
      <div className={cn('flex w-full', CONTAINER_CLASSES[position], className)}>
         <div
            className={cn(
               'flex w-full gap-4',
               isVertical ? 'flex-col items-start' : 'flex-row flex-wrap items-center'
            )}
         >
            <div className={cn('flex-1', isVertical ? 'w-full' : 'min-w-[520px]')}>
               <div
                  ref={tabListRef}
                  className={cn(
                     'relative flex rounded-xl p-1',
                     darkMode ? 'bg-neutral-300' : 'bg-slate-100',
                     TABS_CONTAINER_CLASSES[position],
                     !isVertical && 'w-full overflow-hidden',
                     isVertical ? 'min-w-48' : '',
                     tabListClassName
                  )}
               >
                  <div
                     className={cn(
                        'absolute rounded-lg',
                        darkMode ? 'bg-black' : 'bg-white',
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
                              'relative z-10 flex items-center justify-center px-3 py-2 text-base font-normal whitespace-nowrap transition-colors duration-300 hover:cursor-pointer',
                              darkMode ? 'text-white' : 'text-black',
                              tab?.disabled &&
                                 (darkMode
                                    ? 'cursor-not-allowed text-neutral-100/50 opacity-60'
                                    : 'cursor-not-allowed opacity-50'),
                              isVertical ? 'w-full justify-start' : 'min-w-0 flex-1'
                           )}
                        >
                           {tab?.icon && (
                              <span
                                 className={cn(
                                    'shrink-0 transition-transform duration-200',
                                    isActive && 'scale-110'
                                 )}
                              >
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

            {extra && (
               <div className={cn('ml-auto shrink-0', isVertical ? 'w-full' : 'max-w-full')}>
                  <div className="flex flex-wrap items-center justify-end gap-2">{extra}</div>
               </div>
            )}
         </div>

         {ActiveContent && (
            <div
               className={cn(
                  'w-full flex-1 overflow-hidden',
                  CONTENT_CLASSES[position],
                  contentClassName
               )}
            >
               <div
                  key={activeTab}
                  className="w-full animate-fade-in"
                  style={{ animationDuration: '0.35s' }}
               >
                  {tabs?.find((tab) => tab.id === activeTab)?.content}
               </div>
            </div>
         )}
      </div>
   )
}
