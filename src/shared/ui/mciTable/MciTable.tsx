import { ConfoundedSquare } from '@solar-icons/react'
import { SortVertical, SortFromBottomToTop, SortFromTopToBottom } from '@solar-icons/react'
import { useMemo, useState, useEffect, type ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { MciSkeleton } from "../../../index.ts";

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
    noDataText?: string
    sort?: { key: keyof T; direction: 'asc' | 'desc' } | null
    onSortChange?: (sort: { key: keyof T; direction: 'asc' | 'desc' } | null) => void
    className?: string
    headerClassName?: string
    bodyClassName?: string
}

export default function MciTable<T extends Record<string, unknown>>({
                                                                        columns,
                                                                        data,
                                                                        loading = false,
                                                                        skeletonRows = 5,
                                                                        noDataText = '',
                                                                        sort: externalSort,
                                                                        onSortChange,
                                                                        className,
                                                                        headerClassName,
                                                                        bodyClassName,
                                                                    }: MciTableProps<T>) {
    const [localSort, setLocalSort] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

    const activeSort = externalSort ?? localSort

    const sortedData = useMemo(() => {
        if (!activeSort || externalSort) return data;

        return [...data].sort((a, b) => {
            const aVal = a[activeSort.key];
            const bVal = b[activeSort.key];

            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (aVal < bVal) return activeSort.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return activeSort.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, activeSort, externalSort]);

    const handleSort = (col: MciTableColumn<T>) => {
        if (!col.sortable) return

        let nextSort: { key: keyof T; direction: 'asc' | 'desc' } | null = null;

        if (activeSort?.key !== col.key) {
            nextSort = { key: col.key, direction: 'asc' };
        } else if (activeSort.direction === 'asc') {
            nextSort = { key: col.key, direction: 'desc' };
        }

        if (externalSort !== undefined) {
            onSortChange?.(nextSort);
        } else {
            setLocalSort(nextSort);
        }
    }

    useEffect(() => {
        if (externalSort !== undefined) setLocalSort(null);
    }, [externalSort])

    const getSortIcon = (col: MciTableColumn<T>) => {
        if (!col.sortable) return null

        if (!activeSort || activeSort.key !== col.key) {
            return <SortVertical weight='Linear' size={20} className="text-slate-base" />
        }

        return activeSort.direction === 'asc' ? (
            <SortFromTopToBottom weight='Linear' size={20} className="text-slate-base" />
        ) : (
            <SortFromBottomToTop weight='Linear' size={20} className="text-slate-base" />
        )
    }

    const displayData = loading ? [] : externalSort ? data : sortedData

    const getTooltipText = (value: unknown): string | undefined => {
        if (value === null || value === undefined) return undefined;
        if (typeof value === 'string' || typeof value === 'number') return String(value);
        return undefined;
    };

    return (
        <div
            className={cn(
                "w-full overflow-x-auto",
                "pb-0.5",
                "[&::-webkit-scrollbar]:h-1",
                "[&::-webkit-scrollbar-track]:bg-transparent",
                "[&::-webkit-scrollbar-thumb]:bg-slate-200",
                "[&::-webkit-scrollbar-thumb]:rounded-full",
                "[&::-webkit-scrollbar-thumb]:border",
                "[&::-webkit-scrollbar-thumb]:border-transparent",
                "[&::-webkit-scrollbar-thumb]:bg-clip-padding-box",
                "hover:[&::-webkit-scrollbar-thumb]:bg-slate-300",
                className
            )}
        >
            <div className="inline-block min-w-full align-middle">
                <div className='overflow-hidden rounded-xl border border-slate-200 bg-slate-100'>
                    <table className="w-full table-fixed">
                        <thead>
                        <tr>
                            {columns?.map((col, idx) => (
                                <th
                                    key={idx}
                                    onClick={() => handleSort(col)}
                                    className={cn(
                                        'px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors',
                                        col.align === 'center' && 'text-center',
                                        col.align === 'right' && 'text-right',
                                        col.sortable && 'cursor-pointer hover:bg-slate-200',
                                        headerClassName
                                    )}
                                    style={{ width: col.width || 'auto' }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="truncate flex-1 min-w-0" title={col.title}>
                                            {col.title}
                                        </span>
                                        {getSortIcon(col)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                        </thead>
                    </table>
                </div>

                <div className='overflow-hidden rounded-xl border border-slate-200 bg-white'>
                    <table className='w-full table-fixed'>
                        <tbody className='divide-y divide-slate-200'>
                        {loading ? (
                            Array.from({ length: skeletonRows }).map((_, idx) => (
                                <tr key={idx}>
                                    {columns?.map((col, i) => (
                                        <td key={i} className="px-4 py-3" style={{ width: col.width }}>
                                            <MciSkeleton height={30} variant="rounded" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : displayData?.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="py-20">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="relative mb-4">
                                            <ConfoundedSquare
                                                weight='Bold'
                                                size={64}
                                                className="animate-float text-slate-400"
                                            />
                                        </div>
                                        <p className="text-sm font-medium text-slate-400">{noDataText}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            displayData?.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className='group transition-colors hover:bg-slate-50'
                                >
                                    {columns?.map((col, colIndex) => {
                                        const cellValue = row[col.key];
                                        const tooltipText = getTooltipText(cellValue);

                                        return (
                                            <td
                                                key={colIndex}
                                                className={cn(
                                                    'px-4 py-3 text-sm font-normal text-black align-top',
                                                    col.align === 'center' && 'text-center',
                                                    col.align === 'right' && 'text-right',
                                                    bodyClassName
                                                )}
                                                style={{ width: col.width || 'auto' }}
                                            >
                                                <div
                                                    className={cn(
                                                        'line-clamp-2',
                                                        'break-words',
                                                        'whitespace-normal'
                                                    )}
                                                    title={!col.render ? tooltipText : undefined}
                                                >
                                                    {col.render
                                                        ? col.render(cellValue, row)
                                                        : String(cellValue ?? '-')}
                                                </div>
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}