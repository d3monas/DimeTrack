import { Button } from "@/components/ui/button";

type CategoryManagerThings = {
    categories: string[]
    onDelete: (category: string) => void
}

export function CategoryManager({
    categories, onDelete
}: CategoryManagerThings) {
    return (
        <div className="mt-6 rounded-2xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">Categories</h2>

            <div className="space-y-2">{categories.map((category) => (
                <div key={category} className="flex items-center justify-between rounded-lg border p-3">
                    <span>{category}</span>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(category)}>Delete</Button>
                </div>
            ))}
            </div>
        </div>
    )
}