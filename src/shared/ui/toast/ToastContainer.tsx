import { Toast, type ToastProps } from './Toast.tsx'

export function ToastContainer({
	toasts,
	onRemove,
	position = 'top-right',
}: {
	toasts: ToastProps[]
	onRemove: (id: string) => void
	position?: ToastProps['position']
}) {
	return (
		<>
			{toasts.map(t => (
				<Toast key={t.id} {...t} onClose={onRemove} position={position} />
			))}
		</>
	)
}
