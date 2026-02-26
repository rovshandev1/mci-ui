import { cn } from "../../lib/utils.ts"
import LoaderIcon from "../../../assets/icons/loaderIcon.svg?react"
import type { MciLoaderProps } from '../../types/ui/loader.types'

export default function MciLoader({
                                      className,
                                      size = 150,
                                      iconClassName,
                                      isLoading = false,
                                      isFullPage = true,
                                      variant = 'yellow'
                                  }: MciLoaderProps) {
    if (!isLoading) return null

    return (
        <div
            className={cn(
                "z-[99px] flex flex-col items-center justify-center transition-all duration-300",
                isFullPage
                    ? "fixed inset-0 backdrop-blur-[2px]"
                    : "absolute inset-0 w-full h-full rounded-[inherit]",
                className
            )}
        >
            <LoaderIcon
                width={size}
                height={size}
                className={cn(
                    "animate-spin",
                    !iconClassName &&
                    (variant === 'blue' ? "text-blue-600" : "text-yellow-500"),
                    iconClassName
                )}
                style={{ fill: 'currentColor', stroke: 'currentColor' }}
            />
        </div>
    )
}
