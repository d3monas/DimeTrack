import { Button } from "./ui/button"

type PaginationUIThings = {
    currentPage: number
    totalPages: number
    onPrev: () => void
    onNext: () => void
}

export function PaginationUI({ currentPage, totalPages, onPrev, onNext }: PaginationUIThings) {
    if (totalPages <= 1) {
        return null
    }

    return (
        <div className="flex mt-4 items-center justify-between">
            <Button variant="outline" size="sm" disabled={currentPage === 0} onClick={onPrev}>Previous</Button>
            <span className="text-xs text-muted-foreground">Page {currentPage + 1} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages - 1} onClick={onNext}>Next</Button>
        </div>
    )
}