import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { TransferVertical } from '@solar-icons/react'
import { cn, useClickOutside } from '../../lib/utils'
import { MciCheck } from '../../../index.ts'
import type { ColumnKey, MciTableColumn } from '../../types/mci-table.types.ts'

type Props<T extends Record<string, unknown>> = {
    open: boolean
    onClose: () => void
    columns: MciTableColumn<T>[]
    hidden: ColumnKey<T>[]
    onToggle: (key: ColumnKey<T>) => void
    onMove: (from: number, to: number) => void

    minVisible?: number
}

export default function MciTableColumnsPanel<T extends Record<string, unknown>>({
                                                                                    open,
                                                                                    onClose,
                                                                                    columns,
                                                                                    hidden,
                                                                                    onToggle,
                                                                                    onMove,
                                                                                    minVisible = 5,
                                                                                }: Props<T>) {
    const ref = useRef<HTMLDivElement>(null)
    const { handleClick } = useClickOutside(ref, onClose)

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

    const dragFromRef = useRef<number | null>(null)
    const dragOverRef = useRef<number | null>(null)
    const allowDragRef = useRef(false)

    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
    const [draggingKey, setDraggingKey] = useState<string | null>(null)

    const rafRef = useRef<number | null>(null)
    const commitDragOver = useCallback((next: number | null) => {
        dragOverRef.current = next
        if (rafRef.current != null) return

        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null
            setDragOverIndex(dragOverRef.current)
        })
    }, [])

    useEffect(() => {
        return () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    const onHandleMouseDown = useCallback(
        (idx: number) => {
            allowDragRef.current = true
            dragFromRef.current = idx
            setDraggingKey(columns[idx]?.key ?? null)
        },
        [columns]
    )

    const onHandleMouseUp = useCallback(() => {
        allowDragRef.current = false
    }, [])

    useEffect(() => {
        if (!open) return
        document.addEventListener('mouseup', onHandleMouseUp)
        return () => document.removeEventListener('mouseup', onHandleMouseUp)
    }, [open, onHandleMouseUp])

    const resetDrag = useCallback(() => {
        dragFromRef.current = null
        allowDragRef.current = false
        setDraggingKey(null)
        commitDragOver(null)
    }, [commitDragOver])

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
                <h4 className="text-slate-600 text-large font-normal">Settings</h4>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>

            <div className="my-4 h-px bg-slate-100" />

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
                        <div key={col.key}>
                            <div
                                draggable
                                onDragStart={(e) => {
                                    if (!allowDragRef.current) {
                                        e.preventDefault()
                                        return
                                    }

                                    e.dataTransfer.setData('text/plain', String(idx))
                                    e.dataTransfer.effectAllowed = 'move'

                                    setDraggingKey(col.key)
                                    commitDragOver(null)

                                    const img = new Image()
                                    img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
                                    e.dataTransfer.setDragImage(img, 0, 0)
                                }}
                                onDragOver={(e) => {
                                    if (dragFromRef.current == null) return
                                    e.preventDefault()
                                    e.dataTransfer.dropEffect = 'move'
                                    commitDragOver(idx)
                                }}
                                onDragLeave={() => {
                                    if (dragOverRef.current === idx) commitDragOver(null)
                                }}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    const from = dragFromRef.current ?? Number(e.dataTransfer.getData('text/plain'))
                                    if (Number.isFinite(from) && from !== idx) onMove(from, idx)
                                    resetDrag()
                                }}
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
                                    onMouseDown={() => onHandleMouseDown(idx)}
                                    className={cn(
                                        'shrink-0 text-slate-400',
                                        'cursor-grab active:cursor-grabbing',
                                        'rounded-lg p-1 hover:bg-slate-100',
                                        isDragging && 'cursor-grabbing'
                                    )}
                                    aria-label="Drag"
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
                                            Минимум {minVisible} колонок
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