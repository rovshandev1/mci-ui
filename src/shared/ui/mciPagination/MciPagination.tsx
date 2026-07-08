import {AltArrowLeft, AltArrowRight, AltArrowDown, MenuDots} from '@solar-icons/react'
import { useMemo } from 'react'
import {cn} from '../../lib/utils'
import type { PaginationProps } from '../../types/ui/pagination.types'
import { createPageRange } from './mci-pagination.utils'

const PAGINATION_SIZE_CLASSES = {
    medium: 'h-9 text-sm',
    large: 'h-10 text-base',
} as const

const PAGINATION_THEME = {
    yellow: {
        active: 'bg-yellow-500 text-white border-yellow-500',
        inactive: 'bg-slate-100 border-slate-200 text-black hover:bg-slate-200',
        disabled: 'text-slate-400 border-slate-200',
        arrow: 'text-black',
        darkActive: 'bg-yellow-500 text-white border-yellow-500',
        darkInactive: 'bg-neutral-300 border-neutral-200 text-neutral-50 hover:bg-neutral-200',
        darkDisabled: 'text-white border-neutral-200 bg-neutral-300/60',
        darkArrow: 'text-neutral-50',
    },
    blue: {
        active: 'bg-blue-600 text-white border-blue-600',
        inactive: 'bg-slate-100 border-slate-200 text-black hover:bg-slate-200',
        disabled: 'text-slate-400 border-slate-300',
        arrow: 'text-black',
        darkActive: 'bg-blue-500 text-white border-blue-500',
        darkInactive: 'bg-neutral-300 border-neutral-200 text-white hover:bg-neutral-200',
        darkDisabled: 'text-neutral-100/50 border-neutral-200 bg-neutral-300/60',
        darkArrow: 'text-neutral-50',
    },
    orange: {
        active: 'bg-orange-600 text-white border-orange-600',
        inactive: 'bg-slate-100 border-slate-200 text-black hover:bg-slate-200',
        disabled: 'text-slate-400 border-slate-300',
        arrow: 'text-black',
        darkActive: 'bg-orange-600 text-white border-orange-600',
        darkInactive: 'bg-neutral-300 border-neutral-200 text-white hover:bg-neutral-200',
        darkDisabled: 'text-neutral-100/50 border-neutral-200 bg-neutral-300/60',
        darkArrow: 'text-neutral-50',
    },
} as const

export default function MciPagination({
                                          totalItems,
                                          currentPage,
                                          perPage,
                                          onPageChange,
                                          onPerPageChange,
                                          siblingCount = 1,
                                          perPageOptions = [10, 30, 50, 100],
                                          showPerPage = true,
                                          variant = 'orange',
                                          size = 'large',
                                          darkMode = false,
                                          paginationClassName
                                      }: PaginationProps) {
    const safeTotalItems = Number.isFinite(totalItems) && totalItems > 0 ? totalItems : 0
    const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 10
    const totalPages = Math.max(1, Math.ceil(safeTotalItems / safePerPage))
    const rawCurrentPage = Number.isFinite(currentPage) ? currentPage : 1
    const safeCurrentPage = Math.min(Math.max(1, rawCurrentPage), totalPages)
    const shouldShowPerPage = showPerPage && typeof onPerPageChange === 'function'
    const shouldShowNavigation = totalPages > 1

    const pages = useMemo(() => {
        return createPageRange(safeCurrentPage, siblingCount, totalPages)
    }, [safeCurrentPage, siblingCount, totalPages])

    const sizeClasses = PAGINATION_SIZE_CLASSES[size]
    const theme = PAGINATION_THEME[variant ?? 'yellow']
    const activeClass = darkMode ? theme.darkActive : theme.active
    const inactiveClass = darkMode ? theme.darkInactive : theme.inactive
    const disabledClass = darkMode ? theme.darkDisabled : theme.disabled
    const arrowClass = darkMode ? theme.darkArrow : theme.arrow

    if (safeTotalItems === 0 || (!shouldShowPerPage && !shouldShowNavigation)) return null

    return (
        <div className={cn(
            'flex items-center justify-between gap-4 w-full',
            paginationClassName
        )}>
            {shouldShowPerPage && (
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            'whitespace-nowrap text-extra-small font-normal',
                            darkMode ? 'text-neutral-100' : 'text-slate-base'
                        )}>Строк на странице:</span>

                    <div className="relative">
                        <select
                            value={safePerPage}
                            onChange={(e) => onPerPageChange?.(Number(e.target.value))}
                            className={cn(
                                'appearance-none rounded-lg border pl-3 pr-8 text-base font-medium focus:outline-none cursor-pointer',
                                darkMode
                                    ? 'border-neutral-200 bg-neutral-300 text-white'
                                    : 'border-slate-200 bg-white text-black',
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
                            className={cn(
                                'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none',
                                darkMode ? 'text-neutral-100' : 'text-slate-400'
                            )}
                            weight="Linear"
                            size={20}
                        />
                    </div>
                </div>
            )}

            {shouldShowNavigation && (
                <nav aria-label="Пагинация" className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                    <button
                        onClick={() => onPageChange(safeCurrentPage - 1)}
                        disabled={safeCurrentPage === 1}
                        aria-label="Предыдущая страница"
                        className={cn(
                            'flex items-center justify-center rounded-lg border transition-all min-w-10',
                            darkMode ? 'bg-neutral-300 border-neutral-200' : 'bg-slate-100',
                            sizeClasses,
                            safeCurrentPage === 1
                                ? cn('cursor-not-allowed opacity-50', disabledClass)
                                : cn('cursor-pointer', arrowClass, darkMode ? 'hover:bg-neutral-200' : 'border-slate-200')
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
                                        className={cn(
                                            'flex items-center justify-center font-medium min-w-10',
                                            darkMode ? 'text-neutral-50' : 'text-black',
                                            sizeClasses
                                        )}
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
                                        'flex cursor-pointer items-center justify-center rounded-lg border font-medium transition-all min-w-10 px-2',
                                        sizeClasses,
                                        isActive ? activeClass : inactiveClass
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
                            'flex items-center justify-center rounded-lg border transition-all min-w-10',
                            darkMode ? 'bg-neutral-300 border-neutral-200' : 'bg-slate-100',
                            sizeClasses,
                            safeCurrentPage === totalPages
                                ? cn('cursor-not-allowed opacity-50', disabledClass)
                                : cn('cursor-pointer', arrowClass, darkMode ? 'hover:bg-neutral-200' : 'border-slate-200')
                        )}
                    >
                        <AltArrowRight size={20} weight="Linear"/>
                    </button>
                </nav>
            )}
        </div>
    )
}
