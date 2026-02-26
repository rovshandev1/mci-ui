export function createPageRange(
    currentPage: number,
    siblingCount: number,
    totalPages: number
): Array<number | string> {
    const pages: Array<number | string> = []
    const totalPageNumbers = siblingCount * 2 + 5

    if (totalPages <= totalPageNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSibling = Math.max(currentPage - siblingCount, 2)
    const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1)

    pages.push(1)
    if (leftSibling > 2) pages.push('...')
    for (let i = leftSibling; i <= rightSibling; i += 1) pages.push(i)
    if (rightSibling < totalPages - 1) pages.push('...')
    if (totalPages > 1) pages.push(totalPages)

    return pages
}
