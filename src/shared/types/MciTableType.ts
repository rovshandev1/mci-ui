import React from "react";

export type MciTableColumn<T> = {
    key: keyof T
    title: string
    sortable?: boolean
    align?: 'left' | 'center' | 'right'
    width?: string | number
    render?: (value: T[keyof T], row: T) => React.ReactNode
}
