import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { Database } from "lucide-react"

type TutorialDialogThings = {
  open: boolean
  onClose: () => void
  onLoadSampleData: () => void
}

export function TutorialDialog({ open, onClose, onLoadSampleData }: TutorialDialogThings) {
  const handleClose = () => {
    onClose()
  }

  const handleLoadSample = () => {
    onLoadSampleData()
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Database className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Welcome to DimeTrack! 👋</DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground pt-2 min-h-15">
            DimeTrack is a 100% private, offline budgeting app. Your data stays on your device by default. If you turn on optional sync, your data is encrypted on your device before it's sent, meaning that nobody can read it. Would you like to start with an interactive demo tour with sample data, or start completely fresh?
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={handleClose}>Start Fresh</Button>
            <Button className="flex-1" onClick={handleLoadSample}>Start Demo Tour</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}