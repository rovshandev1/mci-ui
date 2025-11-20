import {ArrowDown, ArrowUp, ArrowUpDown, Box} from 'lucide-react'
import {useMemo, useState, useEffect, type ReactNode} from 'react'
import {cn} from '../../lib/utils'
import Skeleton from '../skeleton/Skeleton'

type Align = 'left' | 'center' | 'right'

export type MciTableColumn<T> = {
    key: keyof T
    title: string
    sortable?: boolean
    align?: Align
    width?: string | number
    render?: (value: T[keyof T], row: T) => ReactNode
}

export interface MciTableProps<T extends Record<string, unknown>> {
    columns: MciTableColumn<T>[]
    data: T[]
    loading?: boolean
    skeletonRows?: number
    actions?: ReactNode
    noDataText?: string

    sort?: { key: keyof T; direction: 'asc' | 'desc' } | null
    onSortChange?: (sort: { key: keyof T; direction: 'asc' | 'desc' } | null) => void
}

export default function MciTable<T extends Record<string, unknown>>({
                                                                        columns,
                                                                        data,
                                                                        loading = false,
                                                                        skeletonRows = 5,
                                                                        actions,
                                                                        noDataText = 'Maʼlumot topilmadi',
                                                                        sort: externalSort,
                                                                        onSortChange,
                                                                    }: MciTableProps<T>) {
    const [localSort, setLocalSort] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null)

    const activeSort = externalSort ?? localSort
33
    const sortedData = useMemo(() => {
        if (externalSort || !activeSort?.direction) return data

        return [...data].sort((a, b) => {
            const aVal = a[activeSort.key]
            const bVal = b[activeSort.key]

            if (aVal == null) return 1
            if (bVal == null) return -1

            if (aVal < bVal) return activeSort.direction === 'asc' ? -1 : 1
            if (aVal > bVal) return activeSort.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [data, activeSort, externalSort])

    const handleSort = (col: MciTableColumn<T>) => {
        if (!col.sortable) return

        let nextSort: { key: keyof T; direction: 'asc' | 'desc' } | null

        if (activeSort?.key !== col.key) {
            nextSort = {key: col.key, direction: 'asc'}
        } else if (activeSort.direction === 'asc') {
            nextSort = {key: col.key, direction: 'desc'}
        } else {
            nextSort = null
        }

        if (externalSort !== undefined) {
            onSortChange?.(nextSort)
        } else {
            setLocalSort(nextSort)
        }
    }

    useEffect(() => {
        if (externalSort !== undefined) {
            setLocalSort(null)
        }
    }, [externalSort])

    const getSortIcon = (col: MciTableColumn<T>) => {
        if (!col.sortable) return null

        if (!activeSort || activeSort.key !== col.key) {
            return <ArrowUpDown size={15} className="text-slate-900"/>
        }

        return activeSort.direction === 'asc' ? (
            <ArrowUp size={15} className="text-slate-900"/>
        ) : (
            <ArrowDown size={15} className="text-slate-900"/>
        )
    }

    const headerCellClass = (col: MciTableColumn<T>) =>
        cn(
            'text-sm font-semibold py-5 px-4 text-slate-900 leading-5 transition-all',
            col.align === 'center' && 'text-center',
            col.align === 'right' && 'text-right',
            col.sortable && 'cursor-pointer hover:bg-slate-100',
            'select-none'
        )

    const cellClass = (align?: Align) =>
        cn(
            'px-4 py-6 text-sm text-slate-700 font-normal leading-5',
            align === 'center' && 'text-center',
            align === 'right' && 'text-right'
        )

    const displayData = loading ? [] : (externalSort ? data : sortedData)

    return (
        <div className="w-full space-y-4">
            {actions && (
                <div className="flex items-center justify-between mb-3">{actions}</div>
            )}

            <div className="w-full overflow-x-auto rounded-xl border border-slate-300">
                <table className="w-full border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-300">
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={String(col.key)}
                                onClick={() => handleSort(col)}
                                className={cn(
                                    headerCellClass(col),
                                    idx === 0 && 'rounded-tl-xl',
                                    idx === columns.length - 1 && 'rounded-tr-xl'
                                )}
                                style={{width: col.width}}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="truncate">{col.title}</span>
                                    {getSortIcon(col)}
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {loading ? (
                        Array.from({length: skeletonRows}).map((_, idx) => (
                            <tr key={idx}>
                                {columns.map((col, i) => (
                                    <td key={i} className="px-4 py-5" style={{width: col.width}}>
                                        <Skeleton height={20} variant="rounded"/>
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : displayData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="py-16">
                                <div className="flex flex-col items-center justify-center text-slate-900">
                                    <div className="relative mb-4">
                                        <Box
                                            size={64}
                                            className="text-slate-400 opacity-70 animate-float"
                                        />
                                        <div
                                            className="absolute inset-0 blur-3xl bg-slate-300/20 rounded-full animate-pulse"/>
                                    </div>
                                    <p className="text-sm font-medium">{noDataText}</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        displayData.map((row, idx) => (
                            <tr
                                key={idx}
                                className={cn(
                                    'border-b border-slate-200 last:border-none transition-colors',
                                )}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={String(col.key)}
                                        className={cellClass(col.align)}
                                        style={{width: col.width}}
                                    >
                                        {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '-')}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}