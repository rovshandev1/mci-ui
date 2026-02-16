import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ColumnKey, MciTableColumn } from '../../types/mci-table.types'

type Persisted = {
    order: string[]
    hidden: string[]
}

type Options<T extends Record<string, unknown>> = {
    storageKey: string
    columns: MciTableColumn<T>[]
    defaultVisibleKeys?: ColumnKey<T>[]
    defaultOrder?: ColumnKey<T>[]
    minVisible?: number
}

const isStringArray = (v: unknown): v is string[] =>
    Array.isArray(v) && v.every((x) => typeof x === 'string')

const safeParse = (raw: string | null): Persisted | null => {
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw) as unknown
        if (typeof parsed !== 'object' || parsed === null) return null

        const obj = parsed as Record<string, unknown>
        if (!isStringArray(obj.order) || !isStringArray(obj.hidden)) return null

        return { order: obj.order, hidden: obj.hidden }
    } catch {
        return null
    }
}

const uniq = (arr: string[]) => {
    const set = new Set<string>()
    const out: string[] = []
    for (const x of arr) {
        if (!set.has(x)) {
            set.add(x)
            out.push(x)
        }
    }
    return out
}

const toKeySet = (keys?: string[]) => new Set((keys ?? []).map(String))

const buildOrder = (allKeys: string[], order?: string[]) => {
    const valid = order ? uniq(order.filter((k) => allKeys.includes(k))) : []
    return uniq([...valid, ...allKeys])
}

const buildDefaultHidden = (allKeys: string[], defaultVisibleKeys?: string[]) => {
    if (!defaultVisibleKeys?.length) return []
    const visibleSet = toKeySet(defaultVisibleKeys)
    return allKeys.filter((k) => !visibleSet.has(k))
}

const clampMinVisible = (minVisible: number, total: number) => Math.max(0, Math.min(minVisible, total))

const limitHidden = (hidden: string[], allKeys: string[], minVisibleCount: number) => {
    const allSet = new Set(allKeys)
    const cleaned = uniq(hidden.filter((k) => allSet.has(k)))
    const maxHidden = Math.max(0, allKeys.length - minVisibleCount)
    return cleaned.slice(0, maxHidden)
}

export default function useTableColumnSettings<T extends Record<string, unknown>>(opts: Options<T>) {
    const { storageKey, columns, defaultVisibleKeys, defaultOrder, minVisible = 5 } = opts

    const allKeys = useMemo(() => columns.map((c) => String(c.key)), [columns])
    const allKeysSet = useMemo(() => new Set(allKeys), [allKeys])
    const minVisibleCount = useMemo(
        () => clampMinVisible(minVisible, allKeys.length),
        [allKeys.length, minVisible]
    )

    const [state, setState] = useState<Persisted>(() => {
        const baseOrder = buildOrder(
            allKeys,
            (defaultOrder?.map(String) ?? []) as string[]
        )
        const baseHidden = buildDefaultHidden(
            allKeys,
            (defaultVisibleKeys?.map(String) ?? []) as string[]
        )

        if (typeof window === 'undefined') {
            return {
                order: baseOrder,
                hidden: limitHidden(baseHidden, allKeys, minVisibleCount),
            }
        }

        const persisted = safeParse(window.localStorage.getItem(storageKey))
        const persistedOrder = uniq((persisted?.order ?? []).filter((k) => allKeysSet.has(k)))
        const mergedOrder = uniq([...persistedOrder, ...baseOrder, ...allKeys])

        const persistedHidden = uniq((persisted?.hidden ?? []).filter((k) => allKeysSet.has(k)))
        const initialHidden = persisted ? persistedHidden : baseHidden

        return {
            order: mergedOrder,
            hidden: limitHidden(initialHidden, allKeys, minVisibleCount),
        }
    })

    useEffect(() => {
        if (typeof window === 'undefined') return
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(state))
        } catch {
            // ignore
        }
    }, [state, storageKey])

    useEffect(() => {
        setState((prev) => {
            const nextOrder = uniq([
                ...prev.order.filter((k) => allKeysSet.has(k)),
                ...allKeys.filter((k) => !prev.order.includes(k)),
            ])
            const nextHidden = limitHidden(prev.hidden, allKeys, minVisibleCount)

            const sameOrder =
                nextOrder.length === prev.order.length && nextOrder.every((v, i) => v === prev.order[i])
            const sameHidden =
                nextHidden.length === prev.hidden.length && nextHidden.every((v, i) => v === prev.hidden[i])

            if (sameOrder && sameHidden) return prev
            return { order: nextOrder, hidden: nextHidden }
        })
    }, [allKeys, allKeysSet, minVisibleCount])

    const hiddenSet = useMemo(() => new Set(state.hidden), [state.hidden])

    const orderedAllColumns = useMemo(() => {
        const idx = new Map<string, number>()
        state.order.forEach((k, i) => idx.set(k, i))

        return [...columns].sort((a, b) => {
            const ai = idx.get(String(a.key)) ?? Number.MAX_SAFE_INTEGER
            const bi = idx.get(String(b.key)) ?? Number.MAX_SAFE_INTEGER
            return ai - bi
        })
    }, [columns, state.order])

    const orderedColumns = useMemo(
        () => orderedAllColumns.filter((c) => !hiddenSet.has(String(c.key))),
        [orderedAllColumns, hiddenSet]
    )

    const hiddenKeys = useMemo(
        () => state.hidden.filter((k) => allKeysSet.has(k)) as ColumnKey<T>[],
        [state.hidden, allKeysSet]
    )

    const visibleCount = allKeys.length - hiddenKeys.length

    const toggleColumn = useCallback((key: ColumnKey<T>) => {
        const k = String(key)
        setState((prev) => {
            const isHidden = prev.hidden.includes(k)
            if (isHidden) {
                return { ...prev, hidden: prev.hidden.filter((x) => x !== k) }
            }

            const currentVisibleCount = allKeys.length - prev.hidden.length
            if (currentVisibleCount <= minVisibleCount) return prev

            const nextHidden = limitHidden([...prev.hidden, k], allKeys, minVisibleCount)
            return { ...prev, hidden: nextHidden }
        })
    }, [allKeys, minVisibleCount])

    const moveColumn = useCallback((from: number, to: number) => {
        setState((prev) => {
            const arr = prev.order.slice()
            if (from < 0 || to < 0 || from >= arr.length || to >= arr.length) return prev
            const [item] = arr.splice(from, 1)
            arr.splice(to, 0, item)
            return { ...prev, order: arr }
        })
    }, [])

    const moveColumnByKey = useCallback((
        fromKey: ColumnKey<T>,
        toKey: ColumnKey<T>,
        position: 'before' | 'after' = 'before'
    ) => {
        const from = String(fromKey)
        const to = String(toKey)
        if (from === to) return

        setState((prev) => {
            const arr = prev.order.slice()
            const fromIdx = arr.indexOf(from)
            const toIdx = arr.indexOf(to)
            if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return prev

            let insertTo = position === 'after' ? toIdx + 1 : toIdx
            if (fromIdx < insertTo) insertTo -= 1
            if (insertTo === fromIdx) return prev

            const [item] = arr.splice(fromIdx, 1)
            arr.splice(insertTo, 0, item)
            return { ...prev, order: arr }
        })
    }, [])

    const reset = useCallback(() => {
        setState(() => {
            const baseOrder = buildOrder(
                allKeys,
                (defaultOrder?.map(String) ?? []) as string[]
            )
            const baseHidden = buildDefaultHidden(
                allKeys,
                (defaultVisibleKeys?.map(String) ?? []) as string[]
            )

            return {
                order: baseOrder,
                hidden: limitHidden(baseHidden, allKeys, minVisibleCount),
            }
        })
    }, [allKeys, defaultOrder, defaultVisibleKeys, minVisibleCount])

    return {
        orderedAllColumns,
        orderedColumns,
        hiddenKeys,
        visibleCount,
        toggleColumn,
        moveColumn,
        moveColumnByKey,
        reset,
    }
}
