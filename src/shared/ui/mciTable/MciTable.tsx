import { ConfoundedSquare } from '@solar-icons/react'
import { SortVertical, SortFromBottomToTop, SortFromTopToBottom } from '@solar-icons/react'
import { useMemo, useState, useEffect, type ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { MciSkeleton, MciCheck } from '../../../index.ts'

type Align = 'left' | 'center' | 'right'

export type MciTableColumn<T> = {
    key: keyof T
    title: string
    sortable?: boolean
    align?: Align
    width?: string | number
    className?: string
    render?: (value: T[keyof T], row: T) => ReactNode
}

export interface MciTableProps<T extends Record<string, unknown>> {
    columns: MciTableColumn<T>[]
    data?: T[]
    loading?: boolean
    skeletonRows?: number
    noDataText?: string
    sort?: { key: keyof T; direction: 'asc' | 'desc' } | null
    onSortChange?: (sort: { key: keyof T; direction: 'asc' | 'desc' } | null) => void
    className?: string
    headerClassName?: string
    bodyClassName?: string
    rowKey?: keyof T
    rowSelection?: {
        selectedRowKeys: (string | number)[]
        onChange: (selectedRowKeys: (string | number)[]) => void
        getCheckboxProps?: (record: T) => { disabled?: boolean }
    }
}

export default function MciTable<T extends Record<string, unknown>>({
                                                                        columns,
                                                                        data = [],
                                                                        loading = false,
                                                                        skeletonRows = 5,
                                                                        noDataText = '',
                                                                        sort: externalSort,
                                                                        onSortChange,
                                                                        className,
                                                                        headerClassName,
                                                                        bodyClassName,
                                                                        rowKey = 'id' as keyof T,
                                                                        rowSelection,
                                                                    }: MciTableProps<T>) {
    const [localSort, setLocalSort] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(
        null
    )

    const activeSort = externalSort ?? localSort
    const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data])

    const sortedData = useMemo(() => {
        if (!activeSort || externalSort) return safeData

        return [...safeData].sort((a, b) => {
            const aVal = a[activeSort.key]
            const bVal = b[activeSort.key]

            if (aVal == null) return 1
            if (bVal == null) return -1
            if (aVal < bVal) return activeSort.direction === 'asc' ? -1 : 1
            if (aVal > bVal) return activeSort.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [safeData, activeSort, externalSort])

    const handleSort = (col: MciTableColumn<T>) => {
        if (!col.sortable) return

        let nextSort: { key: keyof T; direction: 'asc' | 'desc' } | null = null

        if (activeSort?.key !== col.key) {
            nextSort = { key: col.key, direction: 'asc' }
        } else if (activeSort.direction === 'asc') {
            nextSort = { key: col.key, direction: 'desc' }
        }

        if (externalSort !== undefined) {
            onSortChange?.(nextSort)
        } else {
            setLocalSort(nextSort)
        }
    }

    useEffect(() => {
        if (externalSort !== undefined) setLocalSort(null)
    }, [externalSort])

    const displayData = loading ? [] : externalSort ? safeData : sortedData

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!rowSelection) return

        const { onChange, getCheckboxProps } = rowSelection
        const checked = e.target.checked

        if (checked) {
            const selectableRows = displayData.filter((row) => !getCheckboxProps?.(row)?.disabled)
            const newSelectedKeys = selectableRows.map((row) => row[rowKey] as string | number)
            onChange(newSelectedKeys)
        } else {
            onChange([])
        }
    }

    const handleSelectRow = (row: T, checked: boolean) => {
        if (!rowSelection) return

        const { selectedRowKeys, onChange } = rowSelection
        const key = row[rowKey] as string | number
        let newKeys: (string | number)[]

        if (checked) {
            newKeys = [...selectedRowKeys, key]
        } else {
            newKeys = selectedRowKeys.filter((k) => k !== key)
        }
        onChange(newKeys)
    }

    const isAllSelected = useMemo(() => {
        if (!rowSelection || displayData.length === 0) return false
        const selectableRows = displayData.filter(
            (row) => !rowSelection.getCheckboxProps?.(row)?.disabled
        )
        if (selectableRows.length === 0) return false
        return selectableRows.every((row) =>
            rowSelection.selectedRowKeys.includes(row[rowKey] as string | number)
        )
    }, [rowSelection, displayData, rowKey])

    const getSortIcon = (col: MciTableColumn<T>) => {
        if (!col.sortable) return null
        if (!activeSort || activeSort.key !== col.key) {
            return <SortVertical weight="Linear" size={20} className="text-slate-base" />
        }
        return activeSort.direction === 'asc' ? (
            <SortFromTopToBottom weight="Linear" size={20} className="text-slate-base" />
        ) : (
            <SortFromBottomToTop weight="Linear" size={20} className="text-slate-base" />
        )
    }

    const renderColGroup = () => (
        <colgroup>
            {rowSelection && <col style={{ width: 48 }} />}
            {columns.map((col, idx) => (
                <col key={idx} style={{ width: col.width || 'auto' }} />
            ))}
        </colgroup>
    )

    return (
        <div
            className={cn(
                'w-full overflow-x-auto',
                'pb-0.5',
                '[&::-webkit-scrollbar]:h-1',
                '[&::-webkit-scrollbar-track]:bg-transparent',
                '[&::-webkit-scrollbar-thumb]:bg-slate-200',
                '[&::-webkit-scrollbar-thumb]:rounded-full',
                '[&::-webkit-scrollbar-thumb]:border',
                '[&::-webkit-scrollbar-thumb]:border-transparent',
                '[&::-webkit-scrollbar-thumb]:bg-clip-padding-box',
                'hover:[&::-webkit-scrollbar-thumb]:bg-slate-300',
                className
            )}
        >
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <table className="w-full table-fixed">
                        {renderColGroup()}
                        <thead>
                        <tr>
                            {rowSelection && (
                                <th className={cn('w-12 px-4 py-3', headerClassName)}>
                                    <div className="flex items-center justify-center">
                                        <MciCheck
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                            variant="yellow"
                                            disabled={loading || displayData.length === 0}
                                        />
                                    </div>
                                </th>
                            )}

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
                                >
                                    <div className="flex items-center gap-2">
                                            <span className="min-w-0 flex-1 truncate" title={col.title}>
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

                {/* BODY TABLE */}
                <div className="rounded-xl border border-t-0 border-slate-200 bg-white overflow-hidden">
                    <table className="w-full table-fixed">
                        {renderColGroup()}
                        <tbody className="divide-y divide-slate-200">
                        {loading ? (
                            Array.from({ length: skeletonRows }).map((_, idx) => (
                                <tr key={idx}>
                                    {rowSelection && (
                                        <td className="w-12 px-4 py-3">
                                            <MciSkeleton height={20} width={20} variant="rounded" />
                                        </td>
                                    )}
                                    {columns?.map((_, i) => (
                                        <td key={i} className="px-4 py-3">
                                            <MciSkeleton height={30} variant="rounded" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : displayData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (rowSelection ? 1 : 0)} className="py-20">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="relative mb-4">
                                            <ConfoundedSquare
                                                weight="Bold"
                                                size={64}
                                                className="animate-float text-slate-400"
                                            />
                                        </div>
                                        <p className="text-sm font-medium text-slate-400">{noDataText}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            displayData.map((row, idx) => {
                                const key = row[rowKey] as string | number
                                const isSelected = rowSelection?.selectedRowKeys.includes(key)
                                const isDisabled = rowSelection?.getCheckboxProps?.(row)?.disabled

                                return (
                                    <tr
                                        key={idx}
                                        className={cn('group transition-colors hover:bg-slate-50')}
                                    >
                                        {rowSelection && (
                                            <td className={cn('w-12 px-4 py-3 align-top', bodyClassName)}>
                                                <div className="flex items-center justify-center pt-1">
                                                    <MciCheck
                                                        checked={isSelected}
                                                        disabled={isDisabled}
                                                        variant="yellow"
                                                        onChange={(e) =>
                                                            handleSelectRow(row, e.target.checked)
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        )}

                                        {columns?.map((col, colIndex) => {
                                            const cellValue = row[col.key]
                                            return (
                                                <td
                                                    key={colIndex}
                                                    className={cn(
                                                        'align-top px-4 py-3 text-sm font-normal text-black',
                                                        col.align === 'center' && 'text-center',
                                                        col.align === 'right' && 'text-right',
                                                        bodyClassName,
                                                        col.className
                                                    )}
                                                >
                                                    <div
                                                        className="min-w-0 break-words whitespace-normal"
                                                        style={{ overflowWrap: 'break-word' }}
                                                    >
                                                        {col.render
                                                            ? col.render(cellValue, row)
                                                            : String(cellValue ?? '-')}
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}