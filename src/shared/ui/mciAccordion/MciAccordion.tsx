import { AltArrowDown } from '@solar-icons/react'
import React, { useId, useRef, useState } from 'react'
import { cn } from '../../lib/utils.ts'
import type { AccordionProps } from '../../types/ui/accordion.types'

// ─── Helpers ────────────────────────────────────────────────────────────────

const getDisplayName = (child: React.ReactElement): string | undefined =>
   (child.type as { displayName?: string }).displayName

const getChildByType = (
   children: React.ReactNode,
   displayName: string,
   component: React.ElementType
): React.ReactNode =>
   React.Children.toArray(children).find(
      (child): child is React.ReactElement =>
         React.isValidElement(child) &&
         (getDisplayName(child) === displayName || child.type === component)
   ) ?? null

// ─── Sub-components ──────────────────────────────────────────────────────────

function AccordionTitle({
   children,
   className,
   darkMode = false,
}: {
   children: React.ReactNode
   className?: string
   darkMode?: boolean
}) {
   return <div className={cn('text-base font-medium', darkMode ? 'text-neutral-50' : 'text-black', className)}>{children}</div>
}
AccordionTitle.displayName = 'AccordionTitle'

function AccordionContent({
   children,
   className,
   darkMode = false,
}: {
   children: React.ReactNode
   className?: string
   darkMode?: boolean
}) {
   return <div className={cn('p-5 text-base', darkMode ? 'text-neutral-100' : 'text-black', className)}>{children}</div>
}
AccordionContent.displayName = 'AccordionContent'

// ─── Main component ──────────────────────────────────────────────────────────

function MciAccordion({ children, defaultValue = false, icon, darkMode = false, className }: AccordionProps) {
   const [isOpen, setIsOpen] = useState(defaultValue)
   const contentRef = useRef<HTMLDivElement>(null)
   const contentId = useId()

   const toggle = () => setIsOpen((prev) => !prev)

   const titleNode = getChildByType(children, 'AccordionTitle', AccordionTitle)
   const contentNode = getChildByType(children, 'AccordionContent', AccordionContent)

   const title = React.isValidElement(titleNode)
      ? React.cloneElement(titleNode as React.ReactElement<{ darkMode?: boolean }>, {
           darkMode,
        })
      : titleNode

   const content = React.isValidElement(contentNode)
      ? React.cloneElement(contentNode as React.ReactElement<{ darkMode?: boolean }>, {
           darkMode,
        })
      : contentNode

   return (
      <div
         className={cn(
            'overflow-hidden rounded-xl border',
            darkMode
               ? 'border-neutral-200 bg-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'
               : 'border-slate-200 bg-white',
            className
         )}
      >
         <button
            type="button"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-controls={contentId}
            className={cn(
               'group flex w-full cursor-pointer items-center justify-between gap-2 p-5 transition-all duration-300',
               darkMode
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
            )}
         >
            <div className="flex w-full items-center gap-2">
               {icon && <span className={cn('shrink-0', darkMode ? 'text-neutral-100' : 'text-slate-500')}>{icon}</span>}
               {title}
            </div>

            <AltArrowDown
               weight="Linear"
               size={20}
               className={cn(
                  'shrink-0 transition-all duration-300',
                  darkMode ? 'text-neutral-100 group-hover:text-neutral-50' : 'text-slate-400',
                  isOpen && 'rotate-180'
               )}
            />
         </button>

         <div
            id={contentId}
            role="region"
            aria-labelledby={contentId}
            className={cn(
               'grid transition-[grid-template-rows] duration-300 ease-out',
               isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            )}
         >
            <div
               ref={contentRef}
               className={cn(
                  'min-h-0 overflow-hidden',
                  darkMode ? 'bg-[#22242A]' : 'bg-white'
               )}
            >
               {content}
            </div>
         </div>
      </div>
   )
}

MciAccordion.Title = AccordionTitle
MciAccordion.Content = AccordionContent

export default MciAccordion
