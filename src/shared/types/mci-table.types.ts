import type {ReactNode} from 'react'

export type Align = 'left' | 'center' | 'right'
export type ColumnKey<T> = Extract<keyof T, string>
export type MciTablePanelLocale = 'ru' | 'uz'
export type MciTableVariant = 'blue' | 'yellow' | 'orange'

export type MciTableColumn<T> = {
    key: ColumnKey<T>
    title: string
    sortable?: boolean
    align?: Align
    width?: string | number
    className?: string
    render?: (value: T[ColumnKey<T>], row: T) => ReactNode
}

export type MciTableSort<T> = { key: ColumnKey<T>; direction: 'asc' | 'desc' }

export type MciTableRowSelection<T> = {
    selectedRowKeys: (string | number)[]
    onChange: (selectedRowKeys: (string | number)[]) => void
    getCheckboxProps?: (record: T) => { disabled?: boolean }
}

export type MciTableColumnSettingsState<T> = {
    order: ColumnKey<T>[]
    hidden: ColumnKey<T>[]
}

export type MciTableColumnSettingsOptions<T> = {
    storageKey?: string
    defaultVisibleKeys?: ColumnKey<T>[]
    defaultOrder?: ColumnKey<T>[]
    minVisible?: number
    onChange?: (state: MciTableColumnSettingsState<T>) => void
}

export interface MciTableProps<T extends Record<string, unknown>> {
    columns: MciTableColumn<T>[]
    data?: T[]
    loading?: boolean
    skeletonRows?: number
    noDataText?: string
    darkMode?: boolean
    variant?: MciTableVariant

    sort?: MciTableSort<T> | null
    onSortChange?: (sort: MciTableSort<T> | null) => void

    className?: string
    headerClassName?: string
    bodyClassName?: string

    rowKey?: keyof T
    rowSelection?: MciTableRowSelection<T>
}
