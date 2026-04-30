import {ConfoundedSquare} from '@solar-icons/react'
import {SortVertical, SortFromBottomToTop, SortFromTopToBottom} from '@solar-icons/react'
import {useMemo, useState, useEffect, useCallback} from 'react'
import {cn} from '../../lib/utils'
import {MciSkeleton, MciCheck} from '../../../index.ts'
import type {MciTableColumn, MciTableProps, MciTableSort} from '../../types/mci-table.types.ts'
import MciTableClamp2 from './MciTableClamp2'
import {normalizeColWidth, sortRows} from './mci-table.utils'

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
                                                                        darkMode = false,
                                                                        rowKey = 'id' as keyof T,
                                                                        rowSelection,
                                                                    }: MciTableProps<T>) {
    const [localSort, setLocalSort] = useState<MciTableSort<T> | null>(null)

    const activeSort = externalSort ?? localSort
    const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data])

    const sortedData = useMemo(() => {
        return sortRows(safeData, activeSort, Boolean(externalSort))
    }, [safeData, activeSort, externalSort])

    useEffect(() => {
        if (externalSort !== undefined) setLocalSort(null)
    }, [externalSort])

    const displayData = useMemo(
        () => (loading ? [] : externalSort ? safeData : sortedData),
        [loading, externalSort, safeData, sortedData]
    )

    const handleSort = useCallback(
        (col: MciTableColumn<T>) => {
            if (!col.sortable) return

            let nextSort: MciTableSort<T> | null = null

            if (activeSort?.key !== col.key) nextSort = {key: col.key, direction: 'asc'}
            else if (activeSort.direction === 'asc') nextSort = {key: col.key, direction: 'desc'}

            if (externalSort !== undefined) onSortChange?.(nextSort)
            else setLocalSort(nextSort)
        },
        [activeSort, externalSort, onSortChange]
    )

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!rowSelection) return

        const {onChange, getCheckboxProps} = rowSelection
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
        const {selectedRowKeys, onChange} = rowSelection
        const key = row[rowKey] as string | number

        const next = checked ? [...selectedRowKeys, key] : selectedRowKeys.filter((k) => k !== key)
        onChange(next)
    }

    const isAllSelected = useMemo(() => {
        if (!rowSelection || displayData.length === 0) return false
        const selectableRows = displayData.filter((row) => !rowSelection.getCheckboxProps?.(row)?.disabled)
        if (selectableRows.length === 0) return false
        return selectableRows.every((row) =>
            rowSelection.selectedRowKeys.includes(row[rowKey] as string | number)
        )
    }, [rowSelection, displayData, rowKey])

    const getSortIcon = (col: MciTableColumn<T>) => {
        const iconClassName = cn(darkMode ? 'text-neutral-100' : 'text-slate-base', 'shrink-0')
        if (!col.sortable) return null
        if (!activeSort || activeSort.key !== col.key) {
            return <SortVertical weight="Linear" size={20} className={iconClassName}/>
        }
        return activeSort.direction === 'asc' ? (
            <SortFromTopToBottom weight="Linear" size={20} className={iconClassName}/>
        ) : (
            <SortFromBottomToTop weight="Linear" size={20} className={iconClassName}/>
        )
    }

    const renderColGroup = () => (
        <colgroup>
            {rowSelection && <col style={{width: 48}}/>}
            {columns.map((col) => (
                <col key={col.key} style={{width: normalizeColWidth(col.width) ?? 'auto'}}/>
            ))}
        </colgroup>
    )

    return (
        <div
            className={cn(
                'w-full overflow-x-auto pb-0.5',
                '[&::-webkit-scrollbar]:h-1',
                '[&::-webkit-scrollbar-track]:bg-transparent',
                darkMode ? '[&::-webkit-scrollbar-thumb]:bg-neutral-200' : '[&::-webkit-scrollbar-thumb]:bg-slate-200',
                '[&::-webkit-scrollbar-thumb]:rounded-full',
                darkMode ? 'hover:[&::-webkit-scrollbar-thumb]:bg-neutral-100' : 'hover:[&::-webkit-scrollbar-thumb]:bg-slate-300',
                className
            )}
        >
            <div className="inline-block min-w-full align-middle">
                <div
                    className={cn(
                        'overflow-hidden rounded-xl border',
                        darkMode
                            ? 'border-neutral-200 bg-neutral-300'
                            : 'border-slate-200 bg-slate-100'
                    )}
                >
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
                                            darkMode={darkMode}
                                            disabled={loading || displayData.length === 0}
                                        />
                                    </div>
                                </th>
                            )}

                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col)}
                                    className={cn(
                                        'px-4 py-3 text-left text-sm font-medium transition-colors',
                                        darkMode ? 'text-neutral-50' : 'text-slate-700',
                                        'whitespace-nowrap overflow-hidden text-ellipsis',
                                        col.align === 'center' && 'text-center',
                                        col.align === 'right' && 'text-right',
                                        col.sortable && (darkMode ? 'cursor-pointer hover:bg-neutral-200' : 'cursor-pointer hover:bg-slate-200'),
                                        headerClassName
                                    )}
                                >
                                    <div
                                        className={cn('flex items-center gap-2 min-w-0', col.align === 'right' && 'justify-end')}>
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

                <div
                    className={cn(
                        'overflow-hidden rounded-xl border border-t-0',
                        darkMode ? 'border-neutral-200 bg-transparent' : 'border-slate-200 bg-white'
                    )}
                >
                    <table className="w-full table-fixed">
                        {renderColGroup()}
                        <tbody className={cn('divide-y', darkMode ? 'divide-neutral-200' : 'divide-slate-200')}>
                        {loading ? (
                            Array.from({length: skeletonRows}).map((_, idx) => (
                                <tr key={idx}>
                                    {rowSelection && (
                                        <td className="w-12 px-4 py-3">
                                            <MciSkeleton height={20} width={20} variant="rounded"/>
                                        </td>
                                    )}
                                    {columns.map((c) => (
                                        <td key={c.key} className="px-4 py-3">
                                            <MciSkeleton height={30} variant="rounded"/>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : displayData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (rowSelection ? 1 : 0)} className="py-20">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="relative mb-4">
                                            <ConfoundedSquare weight="Bold" size={64}
                                                              className={cn('animate-float', darkMode ? 'text-neutral-100' : 'text-slate-400')}/>
                                        </div>
                                        <p className={cn('text-sm font-medium', darkMode ? 'text-neutral-100' : 'text-slate-400')}>{noDataText}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            displayData.map((row, idx) => {
                                const key = row[rowKey] as string | number
                                const isSelected = rowSelection?.selectedRowKeys.includes(key)
                                const isDisabled = rowSelection?.getCheckboxProps?.(row)?.disabled

                                return (
                                    <tr key={idx} className={cn('group transition-colors', darkMode ? 'hover:bg-neutral-100/35' : 'hover:bg-slate-50')}>
                                        {rowSelection && (
                                            <td className={cn('w-12 px-4 py-3 align-top', bodyClassName)}>
                                                <div className="flex items-center justify-center pt-1">
                                                    <MciCheck
                                                        checked={isSelected}
                                                        disabled={isDisabled}
                                                        variant="yellow"
                                                        darkMode={darkMode}
                                                        onChange={(e) => handleSelectRow(row, e.target.checked)}
                                                    />
                                                </div>
                                            </td>
                                        )}

                                        {columns.map((col) => {
                                            const cellValue = row[col.key]
                                            const raw = col.render
                                                ? col.render(cellValue as T[Extract<keyof T, string>], row)
                                                : String(cellValue ?? '-')

                                            return (
                                                <td
                                                    key={col.key}
                                                    className={cn(
                                                        'align-top px-4 py-3 text-sm font-normal',
                                                        darkMode ? 'text-neutral-50' : 'text-black',
                                                        'min-w-0 whitespace-normal',
                                                        col.align === 'center' && 'text-center',
                                                        col.align === 'right' && 'text-right',
                                                        bodyClassName,
                                                        col.className
                                                    )}
                                                >
                                                    <MciTableClamp2 title={typeof raw === 'string' ? raw : undefined}>
                                                        {raw}
                                                    </MciTableClamp2>
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
