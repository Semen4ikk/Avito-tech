import React from 'react';
import '../styles/Pagination.css';
import type {PaginationProps} from "../types/Pagination.types.ts";



export const Pagination: React.FC<PaginationProps> = ({
                                                          currentPage,
                                                          totalPages,
                                                          onPageChange,
                                                      }) => {
    const maxVisible = 10;
    const delta = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);
    if (end - start + 1 < maxVisible) {
        if (start === 1) {
            end = Math.min(totalPages, start + maxVisible - 1);
        } else if (end === totalPages) {
            start = Math.max(1, end - maxVisible + 1);
        }
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination_btn pagination_btn--arrow"
                aria-label="Предыдущая страница"
            >
                ‹
            </button>
            {start > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="pagination_btn"
                    >
                        1
                    </button>
                    {start > 2 && (
                        <span className="pagination_dots">...</span>
                    )}
                </>
            )}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`pagination_btn ${
                        page === currentPage ? 'pagination_btn--active' : ''
                    }`}
                    aria-label={`Страница ${page}`}
                >
                    {page}
                </button>
            ))}
            {end < totalPages && (
                <>
                    {end < totalPages - 1 && (
                        <span className="pagination_dots">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="pagination_btn"
                    >
                        {totalPages}
                    </button>
                </>
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination_btn pagination_btn--arrow"
                aria-label="Следующая страница"
            >
                ›
            </button>
        </div>
    );
};