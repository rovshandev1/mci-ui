import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { TransferVertical } from '@solar-icons/react'
import { cn, useClickOutside } from '../../lib/utils'
import { MciCheck } from '../../../index.ts'
import type { ColumnKey, MciTableColumn, MciTablePanelLocale, MciTableVariant } from '../../types/mci-table.types.ts'

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

const PANEL_THEME: Record<
    MciTableVariant,
    {
        dropIndicator: string
        darkDropIndicator: string
        close: string
        darkClose: string
    }
> = {
    blue: {
        dropIndicator: 'bg-blue-300',
        darkDropIndicator: 'bg-blue-500',
        close: 'hover:bg-blue-50 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-[rgba(21,93,252,0.25)]',
        darkClose: 'hover:bg-blue-500/20 hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-[rgba(21,93,252,0.25)]',
    },
    yellow: {
        dropIndicator: 'bg-yellow-400',
        darkDropIndicator: 'bg-yellow-500',
        close: 'hover:bg-yellow-50 hover:text-yellow-600 focus-visible:ring-2 focus-visible:ring-yellow-200',
        darkClose: 'hover:bg-yellow-500/20 hover:text-yellow-300 focus-visible:ring-2 focus-visible:ring-yellow-300/40',
    },
    orange: {
        dropIndicator: 'bg-orange-400',
        darkDropIndicator: 'bg-orange-600',
        close: 'hover:bg-orange-50 hover:text-orange-600 focus-visible:ring-2 focus-visible:ring-[rgba(227,98,12,0.25)]',
        darkClose: 'hover:bg-orange-600/20 hover:text-orange-400 focus-visible:ring-2 focus-visible:ring-[rgba(227,98,12,0.25)]',
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
    darkMode?: boolean
    variant?: MciTableVariant
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
                                                                                    darkMode = false,
                                                                                    variant = 'orange',
                                                                                }: Props<T>) {
    const ref = useRef<HTMLDivElement>(null)
    const { handleClick } = useClickOutside(ref, onClose)
    const t = PANEL_TRANSLATIONS[locale]
    const theme = PANEL_THEME[variant]

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
                'rounded-2xl p-4',
                darkMode
                    ? 'border border-neutral-200 bg-[#22242A] shadow-xl'
                    : 'border border-slate-200 bg-white'
            )}
        >
            <div className="flex items-center justify-between gap-4">
                <h4 className={cn('text-large font-normal', darkMode ? 'text-neutral-50' : 'text-slate-600')}>{t.title}</h4>

                <button
                    type="button"
                    onClick={onClose}
                    className={cn(
                        'cursor-pointer rounded-lg px-2 py-1',
                        darkMode
                            ? cn('text-neutral-100 hover:bg-neutral-300', theme.darkClose)
                            : cn('text-slate-500 hover:bg-slate-100', theme.close)
                    )}
                    aria-label={t.close}
                >
                    ✕
                </button>
            </div>

            <div className={cn('my-4 h-px', darkMode ? 'bg-neutral-200' : 'bg-slate-100')} />
            <p className={cn('mb-3 text-xs', darkMode ? 'text-neutral-100' : 'text-slate-500')}>
                {t.activeColumns}: {visibleCount}/{columns.length}
            </p>

            <div
                className={cn(
                    'max-h-[275px] overflow-auto',
                    '[&::-webkit-scrollbar]:w-1.5',
                    '[&::-webkit-scrollbar-track]:bg-transparent',
                    darkMode ? '[&::-webkit-scrollbar-thumb]:bg-neutral-200' : '[&::-webkit-scrollbar-thumb]:bg-slate-200',
                    '[&::-webkit-scrollbar-thumb]:rounded-full',
                    darkMode ? 'hover:[&::-webkit-scrollbar-thumb]:bg-neutral-100' : 'hover:[&::-webkit-scrollbar-thumb]:bg-slate-300'
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
                                        'pointer-events-none absolute left-2 right-2 z-10 h-0.5 rounded-full',
                                        darkMode ? theme.darkDropIndicator : theme.dropIndicator,
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
                                    !isDragging && 'cursor-grab',
                                    !isDragging && !isOver && (darkMode ? 'hover:bg-neutral-300/60' : 'hover:bg-slate-50'),
                                    isOver && !isDragging && (darkMode ? 'bg-neutral-300/60' : 'bg-slate-50'),
                                    isDragging && (darkMode ? 'bg-neutral-300 opacity-100 scale-[0.99] cursor-grabbing' : 'bg-slate-50 opacity-100 scale-[0.99] cursor-grabbing')
                                )}
                            >
                                <button
                                    type="button"
                                    className={cn(
                                        'shrink-0',
                                        darkMode ? 'text-neutral-100' : 'text-slate-400',
                                        'cursor-grab active:cursor-grabbing',
                                        darkMode ? 'rounded-lg p-1 hover:bg-neutral-200' : 'rounded-lg p-1 hover:bg-slate-100',
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
                                        variant={variant}
                                        darkMode={darkMode}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h4 className={cn('truncate text-base font-medium', darkMode ? 'text-neutral-50' : 'text-slate-700')} title={col.title}>
                                        {col.title}
                                    </h4>
                                    {isLocked && (
                                        <p className={cn('mt-0.5 text-xs', darkMode ? 'text-neutral-100' : 'text-slate-400')}>
                                            {t.minColumns(minVisible)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {idx !== columns.length - 1 && <div className={cn('mx-2 h-px', darkMode ? 'bg-neutral-200' : 'bg-slate-100')} />}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
