import { Check } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { cn } from '../../lib/utils.ts'

type CheckBoxProps = {
	label?: string
	checked?: boolean
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	size?: 'sm' | 'md' | 'lg'
	error?: string
	success?: string
	disabled?: boolean
	required?: boolean
	className?: string
	variant?: 'default' | 'minimal'
}

export default function CheckBox({
	label,
	checked: controlledChecked,
	onChange,
	size = 'md',
	error,
	success,
	disabled = false,
	required = false,
	className,
	variant = 'default',
}: CheckBoxProps) {
	const [internalChecked, setInternalChecked] = useState(false)
	const checked =
		controlledChecked !== undefined ? controlledChecked : internalChecked

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (controlledChecked === undefined) {
			setInternalChecked(e.target.checked)
		}
		onChange?.(e)
	}

	const sizes = useMemo(
		() => ({
			sm: { box: 'h-4 w-4 min-w-[16px]', icon: 'h-3 w-3', label: 'text-sm' },
			md: { box: 'h-5 w-5 min-w-[20px]', icon: 'h-4 w-4', label: 'text-base' },
			lg: { box: 'h-6 w-6 min-w-[24px]', icon: 'h-5 w-5', label: 'text-lg' },
		}),
		[]
	)

	// ranglar
	const baseBorder = error
		? 'border-error-500'
		: success
		? 'border-success-500'
		: 'border-gray-300'

	const hoverBorder = error
		? 'group-hover:border-error-600'
		: success
		? 'group-hover:border-success-600'
		: 'group-hover:border-gray-400'

	const checkedBg = error
		? 'bg-error-500 border-error-500'
		: success
		? 'bg-success-500 border-success-500'
		: 'bg-secondary-500 border-secondary-500'

	const stateStyles = cn(
		'rounded flex items-center justify-center border-2 transition-all duration-300 ease-in-out',
		baseBorder,
		hoverBorder,
		checked && checkedBg,
		'focus-visible:ring-4 focus-visible:ring-secondary-500/20',
		disabled && 'opacity-60 cursor-not-allowed'
	)

	return (
		<div className={cn('flex flex-col', className)}>
			<label
				className={cn(
					'group flex cursor-pointer items-center',
					disabled && 'cursor-not-allowed'
				)}
			>
				<input
					type='checkbox'
					checked={checked}
					onChange={handleChange}
					disabled={disabled}
					required={required}
					className='sr-only'
					aria-invalid={!!error}
					aria-describedby={
						error ? 'checkbox-error' : success ? 'checkbox-success' : undefined
					}
				/>
				<div className={cn(sizes[size].box, stateStyles)}>
					<Check
						className={cn(
							sizes[size].icon,
							checked ? 'opacity-100' : 'opacity-0',
							'text-white stroke-2 transition-opacity duration-200'
						)}
					/>
				</div>
				{label && (
					<span
						className={cn(
							'ml-2 select-none',
							sizes[size].label,
							error
								? 'text-error-600'
								: success
								? 'text-success-500'
								: 'text-gray-800',
							disabled && 'opacity-60'
						)}
					>
						{label}
						{required && <span className='text-error-500 ml-1'>*</span>}
					</span>
				)}
			</label>

			{error && (
				<p
					id='checkbox-error'
					className='mt-1.5 text-sm text-error-600 animate-[slideDown_0.3s_ease-out]'
				>
					{error}
				</p>
			)}

			{success && !error && (
				<p
					id='checkbox-success'
					className='mt-1.5 text-sm text-success-600 animate-[slideDown_0.3s_ease-out]'
				>
					{success}
				</p>
			)}
		</div>
	)
}
