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
}: {
   children: React.ReactNode
   className?: string
}) {
   return <div className={cn('text-base font-medium text-black', className)}>{children}</div>
}
AccordionTitle.displayName = 'AccordionTitle'

function AccordionContent({
   children,
   className,
}: {
   children: React.ReactNode
   className?: string
}) {
   return <div className={cn('p-5 text-base', className)}>{children}</div>
}
AccordionContent.displayName = 'AccordionContent'

// ─── Main component ──────────────────────────────────────────────────────────

function MciAccordion({ children, defaultValue = false, icon, className }: AccordionProps) {
   const [isOpen, setIsOpen] = useState(defaultValue)
   const contentRef = useRef<HTMLDivElement>(null)
   const contentId = useId()

   const toggle = () => setIsOpen((prev) => !prev)

   return (
      <div className={cn('overflow-hidden rounded-xl border border-slate-200', className)}>
         <button
            type="button"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-controls={contentId}
            className={cn(
               'flex w-full items-center justify-between gap-2 p-5 transition-all duration-300 hover:cursor-pointer',
               isOpen ? 'border-b border-slate-200' : 'border-b border-transparent'
            )}
         >
            <div className="flex w-full items-center gap-2">
               {icon && <span className="shrink-0">{icon}</span>}
               {getChildByType(children, 'AccordionTitle', AccordionTitle)}
            </div>

            <AltArrowDown
               weight="Linear"
               size={20}
               className={cn(
                  'shrink-0 text-slate-400 transition-transform duration-300',
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
            <div ref={contentRef} className="min-h-0 overflow-hidden">
               {getChildByType(children, 'AccordionContent', AccordionContent)}
            </div>
         </div>
      </div>
   )
}

MciAccordion.Title = AccordionTitle
MciAccordion.Content = AccordionContent

export default MciAccordion
