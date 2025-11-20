import {ChevronLeft, ChevronRight} from 'lucide-react'

interface PaginationProps {
    totalItems: number
    currentPage: number
    perPage: number
    onPageChange: (page: number) => void
    onPerPageChange?: (value: number) => void
    siblingCount?: number
    perPageOptions?: number[]
    showPerPage?: boolean
}

export default function Pagination({
                                       totalItems,
                                       currentPage,
                                       perPage,
                                       onPageChange,
                                       onPerPageChange,
                                       siblingCount = 1,
                                       perPageOptions = [10, 20, 30, 40, 50],
                                       showPerPage = true,
                                   }: PaginationProps) {
    const safeTotalItems =
        Number.isFinite(totalItems) && totalItems > 0 ? totalItems : 0
    const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 10
    const safeCurrentPage =
        Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1

    const totalPages = Math.ceil(safeTotalItems / safePerPage)

    if (safeTotalItems === 0 || totalPages <= 1) return null

    const createPageRange = () => {
        const totalPageNumbers = siblingCount * 2 + 5
        if (totalPages <= totalPageNumbers) {
            return Array.from({length: totalPages}, (_, i) => i + 1)
        }

        const leftSiblingIndex = Math.max(safeCurrentPage - siblingCount, 2)
        const rightSiblingIndex = Math.min(
            safeCurrentPage + siblingCount,
            totalPages - 1
        )

        const showLeftDots = leftSiblingIndex > 2
        const showRightDots = rightSiblingIndex < totalPages - 1

        const range: (number | string)[] = [1]

        if (showLeftDots) range.push('...')

        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
            range.push(i)
        }

        if (showRightDots) range.push('...')

        range.push(totalPages)

        return range
    }

    const pages = createPageRange()

    const handlePrev = () => {
        if (safeCurrentPage > 1) onPageChange(safeCurrentPage - 1)
    }

    const handleNext = () => {
        if (safeCurrentPage < totalPages) onPageChange(safeCurrentPage + 1)
    }

    return (
        <div className='w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4'>
            {showPerPage && onPerPageChange && safeTotalItems > 0 && (
                <div className='flex justify-center md:justify-start w-full md:w-auto'>
                    <select
                        value={safePerPage}
                        onChange={e => onPerPageChange(Number(e.target.value))}
                        className='border rounded-md p-2 text-sm bg-white
							hover:border-yellow-500
							focus:outline-none focus:ring-2 focus:ring-yellow-500
							transition-all duration-200'
                    >
                        {perPageOptions?.map(option => (
                            <option key={option} value={option}>
                                {option} / page
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Pagination buttons */}
            <div className='flex items-center justify-center md:justify-end w-full'>
                {/* Prev */}
                <button
                    onClick={handlePrev}
                    disabled={safeCurrentPage === 1}
                    className={`flex items-center justify-center h-9 w-9 border border-slate-300 rounded-md text-slate-700 transition-all duration-200
						${
                        safeCurrentPage === 1
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-slate-300 hover:text-slate-700'
                    }
					`}
                >
                    <ChevronLeft size={18}/>
                </button>

                {/* Page numbers */}
                <div className='flex items-center gap-1 mx-1'>
                    {pages.map((page, idx) => (
                        <button
                            key={idx}
                            onClick={() => typeof page === 'number' && onPageChange(page)}
                            disabled={page === '...'}
                            className={`min-w-[36px] h-9 border border-slate-300 rounded-md text-slate-700 text-sm font-medium transition-all duration-200
								${
                                page === safeCurrentPage
                                    ? 'bg-yellow-500 border-yellow-500 text-white'
                                    : page === '...'
                                        ? 'cursor-default text-slate-700'
                                        : 'bg-white hover:bg-slate-100'
                            }
							`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Next */}
                <button
                    onClick={handleNext}
                    disabled={safeCurrentPage === totalPages}
                    className={`flex items-center h-9 w-9 justify-center text-slate-700 border border-slate-300 rounded-md transition-all duration-200
						${
                        safeCurrentPage === totalPages
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-secondary-100 hover:text-secondary-700'
                    }
					`}
                >
                    <ChevronRight size={18}/>
                </button>
            </div>
        </div>
    )
}
