import { ArrowUpDown, Box, ChevronDown, ChevronUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '../../lib/utils'
import type { MciTableColumn } from '../../types/MciTableType'
import Skeleton from "../skeleton/Skeleton.tsx";

interface MciTableProps<T extends Record<string, unknown>> {
	columns: MciTableColumn<T>[]
	data: T[]
	loading?: boolean
	variant?: 'clean' | 'elevated' | 'bordered'
	skeletonRows?: number
	actions?: React.ReactNode
	noDataText?: string
}

export default function MciTable<T extends Record<string, unknown>>({
	columns,
	data,
	loading = false,
	variant = 'clean',
	skeletonRows = 5,
	actions,
	noDataText,
}: MciTableProps<T>) {
	const [sortConfig, setSortConfig] = useState<{
		key: keyof T
		direction: 'asc' | 'desc' | null
	} | null>(null)

	const sortedData = useMemo(() => {
		if (!sortConfig || !sortConfig.direction) return data
		return [...data].sort((a, b) => {
			const aVal = a[sortConfig.key]
			const bVal = b[sortConfig.key]
			if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
			if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
			return 0
		})
	}, [data, sortConfig])

	const handleSort = (col: MciTableColumn<T>) => {
		if (!col.sortable) return
		setSortConfig(prev => {
			if (!prev || prev.key !== col.key) {
				return { key: col.key, direction: 'asc' }
			}
			if (prev.direction === 'asc') return { key: col.key, direction: 'desc' }
			if (prev.direction === 'desc') return { key: col.key, direction: null }
			return null
		})
	}

	const getSortIcon = (col: MciTableColumn<T>) => {
		if (!col?.sortable) return null
		if (!sortConfig || sortConfig.key !== col?.key || !sortConfig.direction) {
			return <ArrowUpDown size={15} className='opacity-40' />
		}
		return sortConfig.direction === 'asc' ? (
			<ChevronUp size={15} />
		) : (
			<ChevronDown size={15} />
		)
	}

	const variantStyle = cn(
		'w-full border-separate border-spacing-0 transition-all duration-300',
		variant === 'clean' && 'bg-white',
		variant === 'elevated' && 'bg-white  shadow-lg',
		variant === 'bordered' && 'border border-secondary-200 rounded-lg'
	)

	const headerCell = (col: MciTableColumn<T>) =>
		cn(
			'bg-secondary-50 text-secondary-800 text-sm font-semibold py-3 px-4 select-none',
			'border-b border-secondary-200 transition-colors',
			col.align === 'center' && 'text-center',
			col.align === 'right' && 'text-right',
			col.sortable && 'cursor-pointer hover:bg-secondary-100/70'
		)

	return (
		<div className='w-full space-y-3'>
			{actions && (
				<div className='flex justify-between items-center mb-2'>{actions}</div>
			)}

			<div className='w-full overflow-x-auto rounded-lg'>
				<table className={variantStyle}>
					<thead>
						<tr>
							{columns?.map((col, idx) => (
								<th
									key={String(col?.key)}
									onClick={() => handleSort(col)}
									className={cn(
										headerCell(col),
										idx === 0 && 'rounded-tl-lg',
										idx === columns?.length - 1 && 'rounded-tr-lg'
									)}
									style={{ width: col.width }}
								>
									<div className='flex items-center justify-between gap-2'>
										<span className='truncate'>{col.title}</span>
										{getSortIcon(col)}
									</div>
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{loading
							? Array.from({ length: skeletonRows })?.map((_, idx) => (
									<tr key={idx}>
										{columns?.map((_, i) => (
											<td key={i} className='px-4 py-3'>
												<Skeleton height={18} variant='rounded' />
											</td>
										))}
									</tr>
							  ))
							: sortedData?.map((row, idx) => (
									<tr
										key={idx}
										className={cn(
											'border-b border-secondary-100  transition-all duration-200'
										)}
									>
										{columns?.map((col, i) => (
											<td
												key={i}
												className={cn(
													'px-4 py-3 text-sm text-gray-800',
													col?.align === 'center' && 'text-center',
													col?.align === 'right' && 'text-right'
												)}
											>
												{col?.render
													? col?.render(row[col?.key], row)
													: String(row[col?.key])}
											</td>
										))}
									</tr>
							  ))}
					</tbody>
				</table>
			</div>

			{!loading && sortedData?.length === 0 && (
				<div className='flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400 animate-[fadeIn_0.4s_ease-in-out]'>
					<div className='relative'>
						<Box
							size={64}
							className='mb-3 text-secondary-400 dark:text-secondary-500 opacity-80 animate-[float_2.5s_ease-in-out_infinite]'
						/>
						<div className='absolute inset-0 blur-2xl bg-secondary-200/20 dark:bg-secondary-700/20 rounded-full scale-75 animate-[pulse_3s_ease-in-out_infinite]' />
					</div>
					<p className='text-sm font-medium animate-[fadeUp_0.6s_ease-out]'>
						{noDataText}
					</p>
				</div>
			)}
		</div>
	)
}
