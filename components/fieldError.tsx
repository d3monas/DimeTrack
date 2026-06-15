type FieldErrorThings = {
    message?: string
}

export function FieldError({ message }: FieldErrorThings) {
    if (!message) {
        return null
    }
    return (
        <p className="mt-1 text-sm text-red-500">{message}</p>
    )
}