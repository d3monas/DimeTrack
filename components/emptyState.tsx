type EmptyStateThings = {
    message: string
}

export function EmptyState({ message }: EmptyStateThings) {
    return (
        <p className="py-2 text-sm text-muted-foreground">{message}</p>
    )
}