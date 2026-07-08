import { cn } from '../../lib/utils'

type TabCountBadgeProps = {
   count?: number
}

export default function TabCountBadge({ count }: TabCountBadgeProps) {
   if (count == null) return null

   const label = String(count)
   const isCompact = label.length < 3

   return (
      <span
         className={cn(
            'ml-2 flex h-4 shrink-0 items-center justify-center rounded-full bg-orange-600 text-[10px] font-medium whitespace-nowrap text-white tabular-nums',
            isCompact ? 'w-4' : 'min-w-4 px-1.5'
         )}
      >
         {label}
      </span>
   )
}
