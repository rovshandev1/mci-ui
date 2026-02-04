import {useCallback, useEffect, useMemo, useState} from 'react'
import type {
    ColumnKey,
    MciTableColumn,
    MciTableColumnSettingsOptions,
    MciTableColumnSettingsState,
} from '../../types/mci-table.types.ts'

type PersistedState = { order?: string[]; hidden?: string[] }

const safeParse = (raw: string | null): PersistedState | null => {
    if (!raw) return null
    try {
        const v = JSON.parse(raw) as PersistedState
        if (!v || typeof v !== 'object') return null
        return v
    } catch {
        return null
    }
}

const uniq = <T, >(arr: T[]) => Array.from(new Set(arr))

export default function useMciTableColumns<T extends Record<string, unknown>>(
    columns: MciTableColumn<T>[],
    opts?: MciTableColumnSettingsOptions<T>
) {
    const allKeys = useMemo(() => columns.map((c) => c.key), [columns])
    const storageKey = opts?.storageKey

    const initial = useMemo<MciTableColumnSettingsState<T>>(() => {
        const defaultOrder = opts?.defaultOrder?.length ? opts.defaultOrder : allKeys

        const defaultHidden = (() => {
            if (!opts?.defaultVisibleKeys) return []
            const visible = new Set<ColumnKey<T>>(opts.defaultVisibleKeys)
            return allKeys.filter((k) => !visible.has(k))
        })()

        if (!storageKey) return {order: uniq(defaultOrder), hidden: uniq(defaultHidden)}

        const persisted = safeParse(localStorage.getItem(storageKey))
        const persistedOrder = (persisted?.order ?? []) as ColumnKey<T>[]
        const persistedHidden = (persisted?.hidden ?? []) as ColumnKey<T>[]

        return {
            order: uniq(persistedOrder.length ? persistedOrder : defaultOrder),
            hidden: uniq(persistedHidden.length ? persistedHidden : defaultHidden),
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allKeys.join('|'), storageKey])

    const [state, setState] = useState<MciTableColumnSettingsState<T>>(initial)

    const persist = useCallback(
        (next: MciTableColumnSettingsState<T>) => {
            opts?.onChange?.(next)
            if (!storageKey) return
            const payload: PersistedState = {
                order: next.order as string[],
                hidden: next.hidden as string[],
            }
            localStorage.setItem(storageKey, JSON.stringify(payload))
        },
        [opts, storageKey]
    )

    useEffect(() => {
        setState((prev) => {
            const keySet = new Set(allKeys)

            const nextOrder = prev.order.filter((k) => keySet.has(k))
            for (const k of allKeys) if (!nextOrder.includes(k)) nextOrder.push(k)

            const nextHidden = prev.hidden.filter((k) => keySet.has(k))

            const changed =
                nextOrder.length !== prev.order.length ||
                nextHidden.length !== prev.hidden.length ||
                nextOrder.some((k, i) => k !== prev.order[i])

            const next = changed ? {order: nextOrder, hidden: nextHidden} : prev
            if (changed) persist(next)
            return next
        })
    }, [allKeys, persist])

    const toggleHidden = useCallback(
        (key: ColumnKey<T>) => {
            setState((prev) => {
                const set = new Set(prev.hidden)
                set.has(key) ? set.delete(key) : set.add(key)
                const next = {...prev, hidden: Array.from(set)}
                persist(next)
                return next
            })
        },
        [persist]
    )

    const move = useCallback(
        (fromIndex: number, toIndex: number) => {
            setState((prev) => {
                if (fromIndex === toIndex) return prev
                const nextOrder = [...prev.order]
                const [item] = nextOrder.splice(fromIndex, 1)
                nextOrder.splice(toIndex, 0, item)
                const next = {...prev, order: nextOrder}
                persist(next)
                return next
            })
        },
        [persist]
    )

    const reset = useCallback(() => {
        const defaultOrder = opts?.defaultOrder?.length ? opts.defaultOrder : allKeys
        const defaultHidden = (() => {
            if (!opts?.defaultVisibleKeys) return []
            const visible = new Set<ColumnKey<T>>(opts.defaultVisibleKeys)
            return allKeys.filter((k) => !visible.has(k))
        })()

        const next = {order: uniq(defaultOrder), hidden: uniq(defaultHidden)}
        setState(next)
        persist(next)
    }, [allKeys, opts?.defaultOrder, opts?.defaultVisibleKeys, persist])

    const orderedColumns = useMemo(() => {
        const byKey = new Map(columns.map((c) => [c.key, c]))
        return state.order.map((k) => byKey.get(k)).filter(Boolean) as MciTableColumn<T>[]
    }, [columns, state.order])

    const visibleColumns = useMemo(() => {
        const hiddenSet = new Set(state.hidden)
        return orderedColumns.filter((c) => !hiddenSet.has(c.key))
    }, [orderedColumns, state.hidden])

    return {
        state,
        allKeys,
        orderedColumns,
        visibleColumns,
        toggleHidden,
        move,
        reset,
    }
}
