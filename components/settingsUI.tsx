import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"

type SettingsDialogThings = {
    categories: string[]
    onDeleteCategory: (category: string) => void
}

export function SettingsDialog({
    categories, onDeleteCategory,
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
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <div key={category} className="flex items-center justify-between rounded-md p-2">
                                    <span>{category}</span>

                                    <Button variant="destructive" size="sm" onClick={() => onDeleteCategory(category)}>Delete</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}