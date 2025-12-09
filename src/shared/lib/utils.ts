import {clsx, type ClassValue} from 'clsx'
import type {RefObject} from 'react'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function useEscapeKey(callback: () => void) {
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') callback()
    }

    return {handleEscape}
}

export function useClickOutside(ref: RefObject<HTMLDivElement | null>, callback: () => void) {
    const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            callback()
        }
    }

    return {handleClick}
}
