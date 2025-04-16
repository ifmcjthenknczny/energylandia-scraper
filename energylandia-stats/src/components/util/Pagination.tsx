import React from 'react'

type PaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (newPage: number) => void
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) => {
    const canGoBack = currentPage > 1
    const canGoForward = currentPage < totalPages

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={() => canGoBack && onPageChange(currentPage - 1)}
                disabled={!canGoBack}
                className="px-3 py-1 text-lg font-bold disabled:text-gray-400"
            >
                &lt;
            </button>
            <button
                onClick={() => canGoForward && onPageChange(currentPage + 1)}
                disabled={!canGoForward}
                className="px-3 py-1 text-lg font-bold disabled:text-gray-400"
            >
                &gt;
            </button>
        </div>
    )
}

export default Pagination
