import {cn} from '../../lib/utils.ts'

type SkeletonProps = {
    className?: string
    variant?: 'default' | 'rounded' | 'circle'
    width?: string | number
    height?: string | number
}

export default function Skeleton({
                                     className,
                                     variant = 'default',
                                     width = '100%',
                                     height = '1rem',
                                 }: SkeletonProps) {
    return (
        <div
            className={cn(
                'relative overflow-hidden bg-secondary-200 dark:bg-secondary-800',
                'rounded-sm',
                variant === 'circle' && 'rounded-full',
                variant === 'rounded' && 'rounded-md',
                className
            )}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
        >
            <div className='absolute inset-0 shimmer-mask'/>
        </div>
    )
}
