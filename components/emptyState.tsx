import { Button } from "./ui/button"

type EmptyStateThings = {
    message: string
    actionLabel?: string
    onAction?: () => void
}

export function EmptyState({ message, actionLabel, onAction }: EmptyStateThings) {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">{message}</p>
            {actionLabel && onAction && (
                <Button variant="outline" size="sm" className="mt-4" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}