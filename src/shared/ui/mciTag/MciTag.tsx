import { cn } from '../../lib/utils.ts'
import type { TagProps } from '../../types/ui/tag.types'

const sizes = {
   sm: 'px-2 py-0.5',
   md: 'px-2 py-1',
   lg: 'px-3 py-2',
}

const iconSizes = {
   sm: 'w-3 h-3',
   md: 'w-3 h-3',
   lg: 'w-3 h-3',
}

const variants = {
    success: 'bg-green-50 text-green-600',
    warning: 'bg-orange-50 text-orange-600',
    error: 'bg-red-50 text-red-600',
    gray: 'bg-slate-200 text-slate-700',
    blue: 'bg-blue-50 text-blue-600',
}

export default function MciTag({
   children,
   variant = 'success',
   size = 'lg',
   icon,
   iconPosition = 'left',
   className,
}: TagProps) {
   return (
      <span
         className={cn(
            'inline-flex animate-[fadeIn_0.3s_ease-out] items-center rounded-lg text-extra-small font-medium',
            sizes[size],
            variants[variant],
            icon && 'gap-[2px]',
            className
         )}
      >
         {icon && iconPosition === 'left' && (
            <span className={`flex items-center ${cn(iconSizes[size])}`}>{icon}</span>
         )}

         <span>{children}</span>

         {icon && iconPosition === 'right' && (
            <span className={`flex items-center ${cn(iconSizes[size])}`}>{icon}</span>
         )}
      </span>
   )
}
