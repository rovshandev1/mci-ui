import { cn } from '../../lib/utils.ts'
import type { SkeletonProps } from '../../types/ui/skeleton.types'

export default function MciSkeleton({
   className,
   variant = 'default',
   width = '100%',
   height = '1rem',
   darkMode = false,
}: SkeletonProps) {
   return (
      <div
         className={cn(
            'relative overflow-hidden',
            darkMode ? 'bg-slate-700' : 'bg-slate-200',
            'rounded-lg',
            variant === 'circle' && 'rounded-full',
            variant === 'rounded' && 'rounded-md',
            className
         )}
         style={{
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
         }}
      >
         <div className={darkMode ? 'shimmer-mask-dark absolute inset-0' : 'shimmer-mask absolute inset-0'} />
      </div>
   )
}
