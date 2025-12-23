import {cn} from "../../lib/utils.ts"
import LoaderIcon from "../../../assets/icons/loaderIcon.svg?react"

interface MciLoaderProps {
    className?: string
    size?: number
    iconClassName?: string
}

export default function MciLoader({className, size = 150, iconClassName}: MciLoaderProps) {
    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center",
                "backdrop-blur-[2px]",
                className
            )}
        >
            <LoaderIcon
                width={size}
                height={size}
                className={cn(
                    "animate-spin duration-1000 ease-linear",
                    "text-yellow-500",
                    iconClassName
                )}
            />
        </div>
    )
}