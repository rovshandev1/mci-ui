import {ConfoundedSquare} from '@solar-icons/react'
import {SortVertical, SortFromBottomToTop, SortFromTopToBottom} from '@solar-icons/react'
import {useMemo, useState, useEffect, type ReactNode} from 'react'
import {cn} from '../../lib/utils'
import MciSkeleton from '../mciSkeleton/MciSkeleton.tsx'

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
}

export default function MciTable<T extends Record<string, unknown>>({
                                                                        columns,
                                                                        data,
                                                                        loading = false,
                                                                        skeletonRows = 5,
                                                                        noDataText = '',
                                                                        sort: externalSort,
                                                                        onSortChange,
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
            nextSort = {key: col.key, direction: 'asc'};
        } else if (activeSort.direction === 'asc') {
            nextSort = {key: col.key, direction: 'desc'};
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
            return <SortVertical weight='Linear' size={20} className="text-slate-base"/>
        }

        return activeSort.direction === 'asc' ? (
            <SortFromTopToBottom weight='Linear' size={20} className="text-slate-base"/>
        ) : (
            <SortFromBottomToTop weight='Linear' size={20} className="text-slate-base"/>
        )
    }

    const displayData = loading ? [] : externalSort ? data : sortedData

    return (
        <div className="w-full overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className='overflow-hidden rounded-xl border border-slate-200 bg-slate-100'>
                    <table className="min-w-full">
                        <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    onClick={() => handleSort(col)}
                                    className={cn(
                                        'px-4 py-3.5 text-left text-small font-medium text-slate-700 transition-colors',
                                        col.align === 'center' && 'text-center',
                                        col.align === 'right' && 'text-right',
                                        col.sortable && 'cursor-pointer hover:bg-slate-200',
                                    )}
                                    style={{width: col.width || 'auto'}}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="truncate">{col.title}</span>
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
                            Array.from({length: skeletonRows}).map((_, idx) => (
                                <tr key={idx}>
                                    {columns.map((col, i) => (
                                        <td key={i} className="px-4 py-3" style={{width: col.width}}>
                                            <MciSkeleton height={30} variant="rounded"/>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : displayData.length === 0 ? (
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
                                        <p className="text-small font-medium text-slate-400">{noDataText}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            displayData.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className='group transition-colors hover:bg-slate-50'
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={String(col.key)}
                                            className={cn(
                                                'px-3 py-4 text-small font-normal text-black',
                                                col.align === 'center' && 'text-center',
                                                col.align === 'right' && 'text-right',
                                            )}
                                            style={{width: col.width || 'auto'}}
                                        >
                                            <div className='line-clamp-2' title={col.render ? undefined : String(row[col.key] ?? '')}>
                                                {col.render
                                                    ? col.render(row[col.key], row)
                                                    : String(row[col.key] ?? '-')}
                                            </div>
                                        </td>
                                    ))}
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
