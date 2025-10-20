import { useState } from 'react'
import { cn } from '../../lib/utils.ts'

type TextareaProps = {
	label?: string
	placeholder?: string
	value?: string
	onChange?: (value: string) => void
	required?: boolean
	disabled?: boolean
	error?: string
	className?: string
	rows?: number
}

export default function Textarea({
	label,
	placeholder,
	value = '',
	onChange,
	required = false,
	disabled = false,
	error,
	className,
	rows = 4,
}: TextareaProps) {
	const [focused, setFocused] = useState(false)

	const isFloating = focused || value.length > 0

	return (
		<div className='relative w-full'>
			{/* Label */}
			{label && (
				<label
					className={cn(
						'absolute left-3 top-2 text-gray-500 transition-all duration-200 pointer-events-none',
						isFloating
							? 'text-xs -translate-y-3 bg-white px-1'
							: 'text-sm translate-y-0'
					)}
				>
					{label}
					{required && <span className='text-error-500 ml-0.5'>*</span>}
				</label>
			)}

			{/* Textarea */}
			<textarea
				rows={rows}
				placeholder={label ? undefined : placeholder}
				value={value}
				onChange={e => onChange?.(e.target.value)}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				disabled={disabled}
				className={cn(
					'w-full rounded-[7px] border border-gray-300 hover:border-gray-400 bg-white font-medium outline-none transition-all duration-300 ease-in-out',
					'focus:ring-4 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 autofill:shadow-[inset_0_0_0px_1000px_white] px-3 py-2 outline-none transition-all resize-none',
					'hover:border-gray-400 focus:border-secondary-500 focus:ring-secondary-500/20',
					disabled && 'opacity-50 cursor-not-allowed',
					error &&
						'border-error-500 focus:ring-error-500 focus:border-error-500',
					label && 'pt-5',
					className
				)}
			/>

			{/* Error message */}
			{error && <p className='mt-1 text-sm text-error-500'>{error}</p>}
		</div>
	)
}
