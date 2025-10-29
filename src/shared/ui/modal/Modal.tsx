import { X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { cn, useClickOutside, useEscapeKey } from '../../lib/utils'

interface ModalProps {
	show: boolean
	setShow: (show: boolean) => void
	title?: string
	Header?: React.ReactNode
	Body?: React.ReactNode
	footer?: React.ReactNode
	handleClickOutside?: boolean
}

export default function Modal({
	show,
	setShow,
	title,
	Header,
	Body,
	footer,
	handleClickOutside = false,
}: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null!)

	// ESC
	const { handleEscape } = useEscapeKey(() => setShow(false))
	useEffect(() => {
		if (show) {
			document.addEventListener('keydown', handleEscape)
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
		return () => document.removeEventListener('keydown', handleEscape)
	}, [show, handleEscape])

	// Click outside
	const { handleClick } = useClickOutside(modalRef, () => {
		if (handleClickOutside) {
			setShow(false)
		}
	})

	useEffect(() => {
		if (show && handleClickOutside) {
			document.addEventListener('mousedown', handleClick)
		}
		return () => document.removeEventListener('mousedown', handleClick)
	}, [show, handleClick, handleClickOutside])

	return (
		<div
			className={cn(
				'fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-100/50 backdrop-blur-sm transition-all duration-500 ease-in-out',
				show
					? 'opacity-100 pointer-events-auto'
					: 'opacity-0 pointer-events-none'
			)}
		>
			<div
				ref={modalRef}
				className={cn(
					'relative w-full max-w-lg rounded-[7px] shadow-xl bg-secondary-50 text-gray-800',
					'transform transition-all duration-500 ease-out',
					show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
				)}
			>
				{/* Header */}
				{(Header || title) && (
					<div className='flex items-center justify-between px-6 py-4 border-b border-secondary-300'>
						{Header || (
							<h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
						)}

						<button
							onClick={() => setShow(false)}
							className='text-gray-800 hover:text-secondary-300 active:animate-spin transition'
						>
							<X className='w-5 h-5' />
						</button>
					</div>
				)}

				{/* Body */}
				{Body && (
					<div className='px-6 py-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300'>
						{Body}
					</div>
				)}

				{/* Footer */}
				{footer && (
					<div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-300'>
						{footer}
					</div>
				)}
			</div>
		</div>
	)
}
