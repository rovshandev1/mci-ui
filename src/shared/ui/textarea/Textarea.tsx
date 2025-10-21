import { useMemo, useState } from 'react'
import { cn } from '../../lib/utils.ts'

type TextareaProps = {
	label?: string
	placeholder?: string
	value?: string
	onChange?: (value: string) => void
	required?: boolean
	disabled?: boolean
	error?: string
	success?: string
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
	success,
	className,
	rows = 4,
}: TextareaProps) {
	const [focused, setFocused] = useState(false)

	const isFloating = focused || value.length > 0

	const stateStyles = useMemo(() => {
		if (error)
			return 'border-error-500 focus:border-error-600 focus:ring-error-500/20'
		if (success)
			return 'border-success-500 focus:border-success-600 focus:ring-success-500/20'
		return 'border-gray-300 hover:border-gray-400 focus:border-secondary-500 focus:ring-secondary-500/20'
	}, [error, success])

	return (
		<div className={cn('relative w-full', className)}>
			{/* Textarea */}
			<textarea
				rows={rows}
				value={value}
				onChange={e => onChange?.(e.target.value)}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				disabled={disabled}
				placeholder={label ? undefined : placeholder}
				className={cn(
					'w-full rounded-[7px] border bg-white font-medium outline-none transition-all duration-300 ease-in-out resize-none',
					'focus:ring-4 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 px-4 py-3',
					stateStyles,
					label && 'pt-5'
				)}
			/>

			{/* FLOATING LABEL */}
			{label && (
				<label
					className={cn(
						'absolute left-4 pointer-events-none font-medium transition-all duration-300 ease-in-out bg-white px-1 select-none',
						isFloating
							? cn(
									'top-0 -translate-y-1/2 scale-90 text-secondary-600',
									error
										? 'text-error-600'
										: success
										? 'text-success-500'
										: 'text-secondary-600'
							  )
							: 'top-1/2 -translate-y-1/2 text-gray-500'
					)}
					style={{
						transformOrigin: 'left top',
					}}
				>
					{label}
					{required && <span className='text-error-500 ml-1'>*</span>}
				</label>
			)}

			{/* ERROR MESSAGE */}
			{error && (
				<p className='mt-1.5 text-sm text-error-600 animate-[slideDown_0.3s_ease-out]'>
					{error}
				</p>
			)}

			{/* SUCCESS MESSAGE */}
			{success && !error && (
				<p className='mt-1.5 text-sm text-success-600 animate-[slideDown_0.3s_ease-out]'>
					{success}
				</p>
			)}
		</div>
	)
}
