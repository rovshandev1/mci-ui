import type { MciTableSort } from '../../types/mci-table.types'

export function normalizeColWidth(width?: string | number) {
    if (width == null) return undefined
    if (typeof width === 'number') return `${width}px`
    return width
}

export function sortRows<T extends Record<string, unknown>>(
    rows: T[],
    activeSort: MciTableSort<T> | null,
    isExternalSort: boolean
) {
    if (!activeSort || isExternalSort) return rows

    return [...rows].sort((a, b) => {
        const aVal = a[activeSort.key]
        const bVal = b[activeSort.key]

        if (aVal == null) return 1
        if (bVal == null) return -1
        if (aVal < bVal) return activeSort.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return activeSort.direction === 'asc' ? 1 : -1
        return 0
    })
}
