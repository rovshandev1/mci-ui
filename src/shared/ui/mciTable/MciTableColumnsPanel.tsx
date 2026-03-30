import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { TransferVertical } from '@solar-icons/react'
import { cn, useClickOutside } from '../../lib/utils'
import { MciCheck } from '../../../index.ts'
import type { ColumnKey, MciTableColumn, MciTablePanelLocale } from '../../types/mci-table.types.ts'

type DropPosition = 'before' | 'after'

const PANEL_TRANSLATIONS: Record<
    MciTablePanelLocale,
    {
        title: string
        close: string
        activeColumns: string
        minColumns: (count: number) => string
        drag: string
    }
> = {
    ru: {
        title: 'Настройки',
        close: 'Закрыть',
        activeColumns: 'Активные колонки',
        minColumns: (count) => `Минимум ${count} колонок`,
        drag: 'Перетащить',
    },
    uz: {
        title: 'Sozlamalar',
        close: 'Yopish',
        activeColumns: 'Aktiv ustunlar',
        minColumns: (count) => `Kamida ${count} ta ustun`,
        drag: 'Sudrash',
    },
}

type Props<T extends Record<string, unknown>> = {
    open: boolean
    onClose: () => void
    columns: MciTableColumn<T>[]
    hidden: ColumnKey<T>[]
    onToggle: (key: ColumnKey<T>) => void
    onMove: (from: number, to: number) => void
    onMoveByKey?: (from: ColumnKey<T>, to: ColumnKey<T>, position: DropPosition) => void

    minVisible?: number
    locale?: MciTablePanelLocale
}

export default function MciTableColumnsPanel<T extends Record<string, unknown>>({
                                                                                    open,
                                                                                    onClose,
                                                                                    columns,
                                                                                    hidden,
                                                                                    onToggle,
                                                                                    onMove,
                                                                                    onMoveByKey,
                                                                                    minVisible = 5,
                                                                                    locale = 'ru',
                                                                                }: Props<T>) {
    const ref = useRef<HTMLDivElement>(null)
    const { handleClick } = useClickOutside(ref, onClose)
    const t = PANEL_TRANSLATIONS[locale]

    useEffect(() => {
        if (!open) return
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [open, handleClick])

    const hiddenSet = useMemo(() => new Set(hidden), [hidden])

    const visibleCount = useMemo(() => {
        let c = 0
        for (const col of columns) if (!hiddenSet.has(col.key)) c++
        return c
    }, [columns, hiddenSet])

    const [dragFromIndex, setDragFromIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
    const [draggingKey, setDraggingKey] = useState<string | null>(null)
    const [dropPosition, setDropPosition] = useState<DropPosition>('before')

    const computeInsertIndex = useCallback(
        (from: number, over: number, position: DropPosition) => {
            let insertTo = position === 'after' ? over + 1 : over
            if (from < insertTo) insertTo -= 1
            return insertTo
        },
        []
    )

    const resetDrag = useCallback(() => {
        setDragFromIndex(null)
        setDraggingKey(null)
        setDragOverIndex(null)
        setDropPosition('before')
    }, [])

    const handleDragStart = useCallback(
        (event: React.DragEvent<HTMLDivElement>, idx: number, key: ColumnKey<T>) => {
            setDragFromIndex(idx)
            setDraggingKey(String(key))
            setDragOverIndex(null)
            setDropPosition('before')

            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('text/plain', String(idx))

            const img = new Image()
            img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
            event.dataTransfer.setDragImage(img, 0, 0)
        },
        []
    )

    const handleDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>, overIndex: number) => {
            event.preventDefault()

            const from =
                dragFromIndex ?? Number.parseInt(event.dataTransfer.getData('text/plain') || '-1', 10)

            if (!Number.isFinite(from) || from < 0) {
                resetDrag()
                return
            }

            const fromColumn = columns[from]
            const toColumn = columns[overIndex]
            if (!fromColumn || !toColumn) {
                resetDrag()
                return
            }

            const insertTo = computeInsertIndex(from, overIndex, dropPosition)

            if (insertTo !== from) {
                if (onMoveByKey) onMoveByKey(fromColumn.key, toColumn.key, dropPosition)
                else onMove(from, insertTo)
            }

            resetDrag()
        },
        [columns, computeInsertIndex, dragFromIndex, dropPosition, onMove, onMoveByKey, resetDrag]
    )

    const safeToggle = useCallback(
        (key: ColumnKey<T>, isLocked: boolean) => {
            if (isLocked) return
            onToggle(key)
        },
        [onToggle]
    )

    if (!open) return null

    return (
        <div
            ref={ref}
            className={cn(
                'absolute right-0 top-full z-50 mt-2 w-[320px]',
                'rounded-2xl p-4 bg-white',
                'border border-slate-200'
            )}
        >
            <div className="flex items-center justify-between gap-4">
                <h4 className="text-slate-600 text-large font-normal">{t.title}</h4>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
                    aria-label={t.close}
                >
                    ✕
                </button>
            </div>

            <div className="my-4 h-px bg-slate-100" />
            <p className="mb-3 text-xs text-slate-500">
                {t.activeColumns}: {visibleCount}/{columns.length}
            </p>

            <div
                className={cn(
                    'max-h-[275px] overflow-auto',
                    '[&::-webkit-scrollbar]:w-1.5',
                    '[&::-webkit-scrollbar-track]:bg-transparent',
                    '[&::-webkit-scrollbar-thumb]:bg-slate-200',
                    '[&::-webkit-scrollbar-thumb]:rounded-full',
                    'hover:[&::-webkit-scrollbar-thumb]:bg-slate-300'
                )}
            >
                {columns.map((col, idx) => {
                    const checked = !hiddenSet.has(col.key)

                    const isLocked = checked && visibleCount <= minVisible

                    const isOver = dragOverIndex === idx
                    const isDragging = draggingKey === col.key

                    return (
                        <div key={col.key} className="relative">
                            {isOver && !isDragging && (
                                <div
                                    className={cn(
                                        'pointer-events-none absolute left-2 right-2 z-10 h-0.5 rounded-full bg-blue-300',
                                        dropPosition === 'before' ? 'top-0' : 'bottom-0'
                                    )}
                                />
                            )}

                            <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, idx, col.key)}
                                onDragOver={(e) => {
                                    if (dragFromIndex == null) return
                                    e.preventDefault()
                                    e.dataTransfer.dropEffect = 'move'

                                    const rect = e.currentTarget.getBoundingClientRect()
                                    const nextPosition: DropPosition =
                                        e.clientY - rect.top > rect.height / 2 ? 'after' : 'before'

                                    if (dragOverIndex !== idx) setDragOverIndex(idx)
                                    if (dropPosition !== nextPosition) setDropPosition(nextPosition)
                                }}
                                onDrop={(e) => handleDrop(e, idx)}
                                onDragEnd={resetDrag}
                                className={cn(
                                    'group flex items-center py-2 px-1 gap-4',
                                    'rounded-md box-border overflow-visible',
                                    'transition-[background,transform] duration-150',
                                    !isDragging && !isOver && 'hover:bg-slate-50',
                                    isOver && !isDragging && 'bg-slate-50',
                                    isDragging && 'bg-slate-50 opacity-100 scale-[0.99] cursor-grabbing'
                                )}
                            >
                                <button
                                    type="button"
                                    className={cn(
                                        'shrink-0 text-slate-400',
                                        'cursor-grab active:cursor-grabbing',
                                        'rounded-lg p-1 hover:bg-slate-100',
                                        isDragging && 'cursor-grabbing'
                                    )}
                                    aria-label={t.drag}
                                >
                                    <TransferVertical weight="Linear" size={20} />
                                </button>

                                <div className="shrink-0">
                                    <MciCheck
                                        checked={checked}
                                        disabled={isLocked}
                                        onChange={() => safeToggle(col.key, isLocked)}
                                        variant="blue"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h4 className="truncate text-slate-700 text-base font-medium" title={col.title}>
                                        {col.title}
                                    </h4>
                                    {isLocked && (
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {t.minColumns(minVisible)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {idx !== columns.length - 1 && <div className="mx-2 h-px bg-slate-100" />}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
