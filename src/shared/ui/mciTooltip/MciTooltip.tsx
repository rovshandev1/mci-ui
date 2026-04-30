import { cn } from '../../lib/utils.ts'
import type { TooltipProps } from '../../types/ui/tooltip.types'

const TOOLTIP_POSITION_CLASSES = {
   top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
   bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
   left: 'right-full top-1/2 -translate-y-1/2 mr-2',
   right: 'left-full top-1/2 -translate-y-1/2 ml-2',
} as const

const TOOLTIP_ARROW_CLASSES = {
   top: 'left-1/2 -translate-x-1/2 top-full',
   bottom: 'left-1/2 -translate-x-1/2 bottom-full',
   left: 'top-1/2 -translate-y-1/2 left-full',
   right: 'top-1/2 -translate-y-1/2 right-full',
} as const

export default function MciTooltip({
   content,
   children,
   position = 'top',
   delay = 200,
   className,
}: TooltipProps) {
   return (
      <div className="group relative inline-block">
         {children}

         <div
            className={cn(
               'absolute z-50 rounded-md bg-slate-800 px-2 py-1 text-xs whitespace-nowrap text-white shadow-md',
               'scale-95 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100',
               'duration-200 ease-out group-hover:delay-200',
               TOOLTIP_POSITION_CLASSES[position],
               className
            )}
            style={{ transitionDelay: `${delay}ms` }}
         >
            {content}

            <span
               className={cn(
                  'absolute h-2 w-2 rotate-45 bg-slate-800',
                  TOOLTIP_ARROW_CLASSES[position]
               )}
            />
         </div>
      </div>
   )
}
