export interface PaginationProps {
    totalItems: number
    currentPage: number
    perPage: number
    onPageChange: (page: number) => void
    onPerPageChange?: (value: number) => void
    siblingCount?: number
    perPageOptions?: number[]
    showPerPage?: boolean
    variant?: 'yellow' | 'blue'
    size?: 'medium' | 'large'
    darkMode?: boolean
    paginationClassName?: string
}
