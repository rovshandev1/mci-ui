import React from 'react'
import { cn } from '../../lib/utils.ts'

type TooltipProps = {
   content: React.ReactNode
   children: React.ReactNode
   position?: 'top' | 'bottom' | 'left' | 'right'
   delay?: number
   className?: string
}

export default function MciTooltip({
   content,
   children,
   position = 'top',
   delay = 200,
   className,
}: TooltipProps) {
   const positionClasses = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
   }

   const arrowClasses = {
      top: 'left-1/2 -translate-x-1/2 top-full',
      bottom: 'left-1/2 -translate-x-1/2 bottom-full',
      left: 'top-1/2 -translate-y-1/2 left-full',
      right: 'top-1/2 -translate-y-1/2 right-full',
   }

   return (
      <div className="group relative inline-block">
         {children}

         <div
            className={cn(
               'absolute z-50 rounded-md bg-slate-400 px-2 py-1 text-xs whitespace-nowrap text-white shadow-md',
               'scale-95 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100',
               'duration-200 ease-out group-hover:delay-200',
               positionClasses[position],
               className
            )}
            style={{ transitionDelay: `${delay}ms` }}
         >
            {content}

            <span
               className={cn(
                  'absolute h-2 w-2 rotate-45 bg-slate-400',
                  arrowClasses[position]
               )}
            />
         </div>
      </div>
   )
}
