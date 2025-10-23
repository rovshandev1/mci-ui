import { Eye, EyeOff } from 'lucide-react'
import React, { forwardRef, useMemo, useState } from 'react'
import { cn } from '../../lib/utils.ts'

type InputProps = {
	label?: string
	placeholder?: string
	type?: 'text' | 'email' | 'password' | 'number' | 'tel'
	icon?: React.ReactNode
	iconPosition?: 'left' | 'right'
	size?: 'sm' | 'md' | 'lg'
	error?: string
	success?: string
	disabled?: boolean
	required?: boolean
	value?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	onFocus?: () => void
	onBlur?: () => void
	className?: string
	name?: string
	readOnly?: boolean
}

const InputMain = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			placeholder,
			type = 'text',
			icon,
			iconPosition = 'left',
			size = 'md',
			error,
			success,
			disabled = false,
			required = false,
			value,
			onChange,
			onFocus,
			onBlur,
			className,
			name,
		},
		ref
	) => {
		const [isFocused, setIsFocused] = useState(false)
		const [internalValue, setInternalValue] = useState('')
		const [showPassword, setShowPassword] = useState(false)
		const [autoFilled, setAutoFilled] = useState(false)

		const currentValue = value ?? internalValue
		const hasValue = Boolean(currentValue) || autoFilled
		const isPassword = type === 'password'

		const handleFocus = () => {
			setIsFocused(true)
			onFocus?.()
		}

		const handleBlur = () => {
			setIsFocused(false)
			onBlur?.()
		}

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (value === undefined) setInternalValue(e.target.value)
			onChange?.(e)
		}

		const togglePassword = () => setShowPassword(prev => !prev)

		const sizes = useMemo(
			() => ({
				sm: {
					input: 'h-[38px] text-sm',
					padding: icon
						? iconPosition === 'left'
							? 'pl-10 pr-3'
							: 'pl-3 pr-10'
						: 'px-3',
					icon: 'w-4 h-4',
					iconWrapper: iconPosition === 'left' ? 'left-3' : 'right-3',
					labelFont: 'text-xs',
				},
				md: {
					input: 'h-[48px] text-base',
					padding: icon
						? iconPosition === 'left'
							? 'pl-12 pr-4'
							: 'pl-4 pr-12'
						: 'px-4',
					icon: 'w-5 h-5',
					iconWrapper: iconPosition === 'left' ? 'left-3.5' : 'right-3.5',
					labelFont: 'text-sm',
				},
				lg: {
					input: 'h-[56px] text-lg',
					padding: icon
						? iconPosition === 'left'
							? 'pl-14 pr-5'
							: 'pl-5 pr-14'
						: 'px-5',
					icon: 'w-6 h-6',
					iconWrapper: iconPosition === 'left' ? 'left-4' : 'right-4',
					labelFont: 'text-base',
				},
			}),
			[icon, iconPosition]
		)

		const stateStyles = useMemo(() => {
			if (error)
				return 'border-error-500 focus:border-error-600 focus:ring-error-500/20'
			if (success)
				return 'border-success-500 focus:border-success-600 focus:ring-success-500/20'
			return 'border-gray-300 hover:border-gray-400 focus:border-secondary-500 focus:ring-secondary-500/20'
		}, [error, success])

		const handleAutoFill = (e: React.AnimationEvent<HTMLInputElement>) => {
			if (e.animationName === 'onAutoFillStart') setAutoFilled(true)
			else if (e.animationName === 'onAutoFillCancel') setAutoFilled(false)
		}

		return (
			<div className={cn('w-full', className)}>
				<div className='relative flex items-center'>
					{/* INPUT */}
					<input
						ref={ref}
						name={name}
						type={isPassword && showPassword ? 'text' : type}
						value={currentValue}
						onChange={handleChange}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onAnimationStart={handleAutoFill}
						disabled={disabled}
						required={required}
						autoComplete='on'
						className={cn(
							'w-full rounded-[7px] border bg-white font-medium outline-none transition-all duration-300 ease-in-out',
							'focus:ring-4 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60',
							sizes[size].input,
							sizes[size].padding,
							stateStyles
						)}
						placeholder={
							label && !(isFocused || hasValue) ? undefined : placeholder
						}
					/>

					{/* FLOATING LABEL */}
					{label && (
						<label
							className={cn(
								'absolute pointer-events-none transition-all duration-300 ease-in-out font-medium bg-white px-1 select-none',
								icon && iconPosition === 'left' && !(isFocused || hasValue)
									? 'left-12'
									: 'left-4',
								isFocused || hasValue
									? cn(
											'-top-2 scale-90 origin-[0_0]',
											sizes[size].labelFont,
											error
												? 'text-error-600'
												: success
												? 'text-success-500'
												: 'text-secondary-600'
									  )
									: cn(
											'top-1/2 -translate-y-1/2 text-gray-500',
											sizes[size].labelFont
									  )
							)}
							style={{
								transformOrigin: 'left top',
								transition: 'all 0.25s ease',
							}}
						>
							{label}
							{required && <span className='text-error-500 ml-1'>*</span>}
						</label>
					)}

					{/* ICON */}
					{icon && (
						<div
							className={cn(
								'absolute top-1/2 -translate-y-1/2 flex items-center transition-all duration-300',
								sizes[size].iconWrapper,
								error
									? 'text-error-500'
									: success
									? 'text-success-500'
									: isFocused
									? 'text-secondary-500'
									: 'text-gray-400'
							)}
						>
							<span className={cn(sizes[size].icon, 'mr-2')}>{icon}</span>
						</div>
					)}

					{/* PASSWORD TOGGLE */}
					{isPassword && (
						<button
							type='button'
							onClick={togglePassword}
							className={cn(
								'absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all',
								'right-3'
							)}
						>
							{showPassword ? (
								<EyeOff className={cn(sizes[size].icon)} />
							) : (
								<Eye className={cn(sizes[size].icon)} />
							)}
						</button>
					)}
				</div>

				{/* ERROR MESSAGE */}
				{error && (
					<p className='mt-1.5 text-sm text-error-600 flex items-center gap-1 animate-[slideDown_0.3s_ease-out]'>
						{error}
					</p>
				)}

				{/* SUCCESS MESSAGE */}
				{success && !error && (
					<p className='mt-1.5 text-sm text-success-600 flex items-center gap-1 animate-[slideDown_0.3s_ease-out]'>
						{success}
					</p>
				)}

				{/* Autofill animation */}
				<style>{`
				input {
					animation-name: onAutoFillCancel;
				}
				input:-webkit-autofill {
					animation-name: onAutoFillStart;
				}
				@keyframes onAutoFillStart {}
				@keyframes onAutoFillCancel {}
			`}</style>
			</div>
		)
	}
)

InputMain.displayName = 'InputMain'

export default InputMain
