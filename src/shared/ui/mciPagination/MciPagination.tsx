import {AltArrowLeft, AltArrowRight, AltArrowDown, MenuDots} from '@solar-icons/react'
import {cn} from '../../lib/utils'

interface PaginationProps {
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
}

export default function MciPagination({
                                          totalItems,
                                          currentPage,
                                          perPage,
                                          onPageChange,
                                          onPerPageChange,
                                          siblingCount = 1,
                                          perPageOptions = [10, 30, 50, 100],
                                          showPerPage = true,
                                          variant = 'yellow',
                                          size = 'large',
                                      }: PaginationProps) {
    const safeTotalItems = Number.isFinite(totalItems) && totalItems > 0 ? totalItems : 0
    const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 10
    const safeCurrentPage = Math.max(1, Number.isFinite(currentPage) ? currentPage : 1)

    const totalPages = Math.ceil(safeTotalItems / safePerPage)
    if (totalPages <= 1 || safeTotalItems === 0) return null

    const createPageRange = () => {
        const pages: (number | string)[] = []
        const totalPageNumbers = siblingCount * 2 + 5

        if (totalPages <= totalPageNumbers) {
            return Array.from({length: totalPages}, (_, i) => i + 1)
        }

        const leftSibling = Math.max(safeCurrentPage - siblingCount, 2)
        const rightSibling = Math.min(safeCurrentPage + siblingCount, totalPages - 1)

        pages.push(1)
        if (leftSibling > 2) pages.push('...')
        for (let i = leftSibling; i <= rightSibling; i++) pages.push(i)
        if (rightSibling < totalPages - 1) pages.push('...')
        if (totalPages > 1) pages.push(totalPages)

        return pages
    }

    const pages = createPageRange()

    const sizeClasses = {
        medium: 'h-9 w-9 text-small',
        large: 'h-10 w-10 text-base',
    }[size]

    const theme = {
        yellow: {
            active: 'bg-yellow-500 text-white border-yellow-500',
            inactive: 'bg-slate-100 border-slate-200 text-black hover:bg-slate-200',
            disabled: 'text-slate-400 border-slate-200',
            arrow: 'text-black',
        },
        blue: {
            active: 'bg-blue-600 text-white border-blue-600',
            inactive: 'bg-slate-100 border-slate-200 text-black hover:bg-slate-200',
            disabled: 'text-slate-400 border-slate-300',
            arrow: 'text-black',
        },
    }[variant ?? 'yellow']

    return (
        <div className="flex items-center justify-between gap-4 w-full">
            {showPerPage && onPerPageChange && (
                <div className="flex items-center gap-2">
                    <span
                        className="whitespace-nowrap text-extra-small text-slate-base font-normal">Строк на странице:</span>

                    <div className="relative">
                        <select
                            value={safePerPage}
                            onChange={(e) => onPerPageChange(Number(e.target.value))}
                            className={cn(
                                'appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-base text-black font-medium focus:outline-none cursor-pointer',
                                size === 'large' ? 'h-10' : 'h-9'
                            )}
                            aria-label="Количество строк на странице"
                        >
                            {perPageOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>

                        <AltArrowDown
                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                            weight="Linear"
                            size={20}
                        />
                    </div>
                </div>
            )}

            <nav aria-label="Пагинация" className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    aria-label="Предыдущая страница"
                    className={cn(
                        'flex items-center justify-center rounded-lg border transition-all bg-slate-100',
                        sizeClasses,
                        safeCurrentPage === 1
                            ? cn('cursor-not-allowed opacity-50', theme.disabled)
                            : cn('hover:cursor-pointer',theme.arrow, 'border-slate-200')
                    )}
                >
                    <AltArrowLeft weight="Linear" size={20}/>
                </button>

                <div className="flex items-center gap-1">
                    {pages.map((page, idx) => {
                        if (page === '...') {
                            return (
                                <span
                                    key={idx}
                                    className={cn('flex items-center justify-center text-black font-medium', sizeClasses)}
                                    aria-hidden="true"
                                >
                  <MenuDots weight='Bold' size={20}/>
                </span>
                            )
                        }

                        const isActive = page === safeCurrentPage

                        return (
                            <button
                                key={idx}
                                onClick={() => onPageChange(page as number)}
                                aria-label={`Страница ${page}${isActive ? ', текущая' : ''}`}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    'flex items-center justify-center rounded-lg border font-medium transition-all hover:cursor-pointer',
                                    sizeClasses,
                                    isActive ? theme.active : theme.inactive
                                )}
                            >
                                {page}
                            </button>
                        )
                    })}
                </div>

                <button
                    onClick={() => onPageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    aria-label="Следующая страница"
                    className={cn(
                        'flex items-center justify-center rounded-lg border transition-all bg-slate-100',
                        sizeClasses,
                        safeCurrentPage === totalPages
                            ? cn('cursor-not-allowed opacity-50', theme.disabled)
                            : cn('hover:cursor-pointer', theme.arrow, 'border-slate-200')
                    )}
                >
                    <AltArrowRight size={20} weight="Linear"/>
                </button>
            </nav>
        </div>
    )
}