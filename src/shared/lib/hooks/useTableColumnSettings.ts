import {useCallback, useEffect, useMemo, useState} from 'react'
import type {ColumnKey, MciTableColumn} from '../../types/mci-table.types'

type Persisted = {
    order: string[]
    hidden: string[]
}

type Options<T extends Record<string, unknown>> = {
    storageKey: string
    columns: MciTableColumn<T>[]
    defaultVisibleKeys?: ColumnKey<T>[]
    defaultOrder?: ColumnKey<T>[]
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

        return {order: obj.order, hidden: obj.hidden}
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

export default function useTableColumnSettings<T extends Record<string, unknown>>(opts: Options<T>) {
    const {storageKey, columns, defaultVisibleKeys, defaultOrder} = opts

    const allKeys = useMemo(() => columns.map((c) => String(c.key)), [columns])
    const allKeysSet = useMemo(() => new Set(allKeys), [allKeys])

    const [state, setState] = useState<Persisted>(() => {
        if (typeof window === 'undefined') {
            const baseOrder = (defaultOrder?.map(String) ?? allKeys) as string[]
            const baseHidden =
                defaultVisibleKeys && defaultVisibleKeys.length
                    ? allKeys.filter((k) => !new Set(defaultVisibleKeys.map(String)).has(k))
                    : []
            return {order: uniq(baseOrder), hidden: uniq(baseHidden)}
        }

        const persisted = safeParse(window.localStorage.getItem(storageKey))

        const baseOrder = (defaultOrder?.map(String) ?? allKeys) as string[]
        const baseOrderUniq = uniq(baseOrder)

        const persistedOrder = uniq((persisted?.order ?? []).filter((k) => allKeysSet.has(k)))

        const mergedOrder = uniq([
            ...persistedOrder,
            ...baseOrderUniq.filter((k) => !persistedOrder.includes(k)),
            ...allKeys.filter((k) => !persistedOrder.includes(k) && !baseOrderUniq.includes(k)),
        ])

        const persistedHidden = uniq((persisted?.hidden ?? []).filter((k) => allKeysSet.has(k)))

        const derivedHidden =
            persistedHidden.length === 0 && defaultVisibleKeys && defaultVisibleKeys.length
                ? allKeys.filter((k) => !new Set(defaultVisibleKeys.map(String)).has(k))
                : persistedHidden

        return {order: mergedOrder, hidden: uniq(derivedHidden)}
    })

    useEffect(() => {
        if (typeof window === 'undefined') return
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(state))
        } catch {
            // ignore
        }
    }, [storageKey, state])

    useEffect(() => {
        setState((prev) => {
            const nextOrder = uniq([
                ...prev.order.filter((k) => allKeysSet.has(k)),
                ...allKeys.filter((k) => !prev.order.includes(k)),
            ])
            const nextHidden = uniq(prev.hidden.filter((k) => allKeysSet.has(k)))

            const sameOrder =
                nextOrder.length === prev.order.length && nextOrder.every((v, i) => v === prev.order[i])
            const sameHidden =
                nextHidden.length === prev.hidden.length && nextHidden.every((v, i) => v === prev.hidden[i])

            if (sameOrder && sameHidden) return prev
            return {order: nextOrder, hidden: nextHidden}
        })
    }, [allKeys, allKeysSet])

    const hiddenSet = useMemo(() => new Set(state.hidden), [state.hidden])

    const orderedColumns = useMemo(() => {
        const idx = new Map<string, number>()
        state.order.forEach((k, i) => idx.set(k, i))

        const visible = columns.filter((c) => !hiddenSet.has(String(c.key)))

        return [...visible].sort((a, b) => {
            const ai = idx.get(String(a.key)) ?? Number.MAX_SAFE_INTEGER
            const bi = idx.get(String(b.key)) ?? Number.MAX_SAFE_INTEGER
            return ai - bi
        })
    }, [columns, hiddenSet, state.order])

    const hiddenKeys = useMemo(
        () => state.hidden.filter((k) => allKeysSet.has(k)) as ColumnKey<T>[],
        [state.hidden, allKeysSet]
    )

    const toggleColumn = useCallback((key: ColumnKey<T>) => {
        const k = String(key)
        setState((prev) => {
            const isHidden = prev.hidden.includes(k)
            const nextHidden = isHidden ? prev.hidden.filter((x) => x !== k) : [...prev.hidden, k]
            return {...prev, hidden: uniq(nextHidden)}
        })
    }, [])

    const moveColumn = useCallback((from: number, to: number) => {
        setState((prev) => {
            const arr = prev.order.slice()
            if (from < 0 || to < 0 || from >= arr.length || to >= arr.length) return prev
            const [item] = arr.splice(from, 1)
            arr.splice(to, 0, item)
            return {...prev, order: arr}
        })
    }, [])

    const reset = useCallback(() => {
        setState(() => {
            const baseOrder = uniq((defaultOrder?.map(String) ?? allKeys) as string[])
            const baseHidden =
                defaultVisibleKeys && defaultVisibleKeys.length
                    ? uniq(allKeys.filter((k) => !new Set(defaultVisibleKeys.map(String)).has(k)))
                    : []
            return {order: baseOrder, hidden: baseHidden}
        })
    }, [defaultOrder, defaultVisibleKeys, allKeys])

    return {
        orderedColumns,
        hiddenKeys,
        toggleColumn,
        moveColumn,
        reset,
    }
}
