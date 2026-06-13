import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Dispatch, SetStateAction } from "react"

type SettingsDialogThings = {
    categories: string[]
    onDeleteCategory: (category: string) => void
    newCategory: string
    setNewCategory: Dispatch<SetStateAction<string>>
    onAddNewCategory: () => void
}

export function SettingsDialog({
    categories, onDeleteCategory, newCategory, setNewCategory, onAddNewCategory
}: SettingsDialogThings) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Settings</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Categories</h3>
                        <div className="flex gap-2">
                            <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New Category" />
                            <Button onClick={onAddNewCategory}>Add</Button>
                        </div>
                        <div className="space-y-2 mt-4">
                            {categories.map((category) => (
                                <div key={category} className="flex items-center justify-between rounded-md p-2">
                                    <span>{category}</span>
                                    {category === "Contribution to Savings Goal" ? (
                                        <span className="text-xs text-muted-foreground px-2 py-1 rounded-md border">Default</span>
                                    ) : (
                                        <Button variant="destructive" size="sm" onClick={() => onDeleteCategory(category)}>Delete</Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}