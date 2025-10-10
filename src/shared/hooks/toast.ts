import { useState } from 'react'
import type { ToastProps } from '../ui/toast/Toast.tsx'

export function useToast() {
	const [toasts, setToasts] = useState<ToastProps[]>([])

	const toast = (props: Omit<ToastProps, 'id'>) => {
		const id = Math.random().toString(36)
		setToasts(prev => [...prev, { ...props, id }])
		return id
	}

	const removeToast = (id: string) => {
		setToasts(prev => prev.filter(t => t.id !== id))
	}

	return {
		toasts,
		toast,
		success: (t: string, d?: string) =>
			toast({ title: t, description: d, type: 'success' }),
		error: (t: string, d?: string) =>
			toast({ title: t, description: d, type: 'error' }),
		warning: (t: string, d?: string) =>
			toast({ title: t, description: d, type: 'warning' }),
		info: (t: string, d?: string) =>
			toast({ title: t, description: d, type: 'info' }),
		loading: (t: string, d?: string) =>
			toast({ title: t, description: d, type: 'loading', duration: Infinity }),
		removeToast,
	}
}
