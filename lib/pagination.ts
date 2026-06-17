import { useState, useEffect } from "react"

export function pagination<T>(items: T[], perPage: number, resetKey?: unknown) {
    const [page, setPage] = useState(0)

    useEffect(() => {
        setPage(0)
    }, [resetKey])

    const totalPages = Math.max(1, Math.ceil(items.length / perPage))
    const currentPage = Math.min(page, totalPages - 1)
    const pageItems = items.slice(currentPage * perPage, currentPage * perPage + perPage)

    return {
        pageItems, currentPage, totalPages,
        nextPage: () => setPage((page) => page + 1),
        prevPage: () => setPage((page) => page - 1),
    }
}