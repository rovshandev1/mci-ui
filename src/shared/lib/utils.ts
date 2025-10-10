import { clsx, type ClassValue } from 'clsx'
import type { RefObject } from 'react'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind classlarni merge qilish uchun utility
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * ESC tugmasini bosishni handle qilish
 */
export function useEscapeKey(callback: () => void) {
	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') callback()
	}

	return { handleEscape }
}

/**
 * Click outside handle qilish
 */
export function useClickOutside(
	ref: RefObject<HTMLDivElement>,
	callback: () => void
) {
	const handleClick = (e: MouseEvent) => {
		if (ref.current && !ref.current.contains(e.target as Node)) {
			callback()
		}
	}

	return { handleClick }
}
