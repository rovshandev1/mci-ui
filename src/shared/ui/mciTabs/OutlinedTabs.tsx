import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/utils'
import { TabsProps } from '../../types/ui'
import TabCountBadge from './TabCountBadge'

const OutlinedTabs = ({
   tabs,
   className,
   contentClassName,
   darkMode,
   defaultTab,
   activeTab: activeTabProp,
   onChange,
   tabClassName,
   tabListClassName,
   color = 'orange',
}: TabsProps) => {
   const [internalTab, setInternalTab] = useState(defaultTab || tabs[0]?.id)
   const isControlled = activeTabProp !== undefined
   const activeTab = isControlled ? activeTabProp : internalTab
   const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
   const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
   const containerRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      const el = tabRefs.current[activeTab]
      const container = containerRef.current
      if (el && container) {
         const containerLeft = container.getBoundingClientRect().left
         const elRect = el.getBoundingClientRect()
         setIndicatorStyle({
            left: elRect.left - containerLeft,
            width: elRect.width,
         })
      }
   }, [activeTab, tabs])

   const handleTabChange = (tabId: string) => {
      if (!isControlled) setInternalTab(tabId)
      onChange?.(tabId)
   }

   const ActiveContent = useMemo(
      () => tabs.find((tab) => tab.id === activeTab)?.content,
      [activeTab, tabs]
   )

   return (
      <div className={cn('space-y-4', className)}>
         <div ref={containerRef} className={cn('relative flex', tabListClassName)}>
            {tabs.map((tab) => (
               <button
                  key={tab.id}
                  ref={(el) => {
                     tabRefs.current[tab.id] = el
                  }}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                     'flex cursor-pointer items-center truncate border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                     darkMode ? 'border-slate-200/20' : 'border-slate-200',
                     activeTab === tab.id
                        ? darkMode
                           ? COLOR_CLASSES[color].darkText
                           : COLOR_CLASSES[color].lightText
                        : darkMode
                          ? 'text-slate-200/70 hover:text-slate-100'
                          : 'hover:text-primary text-slate-400',
                     tabClassName
                  )}
               >
                  <span className="truncate">{tab.label}</span>
                  <TabCountBadge count={tab.count} />
               </button>
            ))}
            <span
               className={cn(
                  'pointer-events-none absolute bottom-0 h-0.5 transition-all duration-300 ease-in-out',
                  darkMode ? COLOR_CLASSES[color].darkBg : COLOR_CLASSES[color].lightBg
               )}
               style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            />
         </div>
         {ActiveContent && <div className={cn('mt-4', contentClassName)}>{ActiveContent}</div>}
      </div>
   )
}

const COLOR_CLASSES = {
   orange: {
      darkText: 'text-white',
      lightText: 'text-orange-600',
      darkBg: 'bg-orange-400',
      lightBg: 'bg-orange-600',
   },
   blue: {
      darkText: 'text-white',
      lightText: 'text-blue-600',
      darkBg: 'bg-blue-400',
      lightBg: 'bg-blue-600',
   },
   yellow: {
      darkText: 'text-white',
      lightText: 'text-yellow-500',
      darkBg: 'bg-yellow-400',
      lightBg: 'bg-yellow-500',
   },
} as const

export default OutlinedTabs
