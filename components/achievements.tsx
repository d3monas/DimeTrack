import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { ACHIEVEMENTS, CheckedAchievement } from "@/lib/achievements"
import { CheckCircle2, Circle, Footprints, ListChecks, Database, Target, Trophy, LineChart, PiggyBank, CalendarDays, BookMarked, Gem, CalendarRange, CalendarClock } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, any> = {
  Footprints, ListChecks, Database, BookMarked, Target, Trophy, LineChart, PiggyBank, Gem, CalendarDays, CalendarRange, CalendarClock
}

type AchievementsDialogThings = {
  open: boolean
  onOpenChange: (open: boolean) => void
  checkedAchievements: Record<string, CheckedAchievement>
}

export function AchievementsDialog({ open, onOpenChange, checkedAchievements }: AchievementsDialogThings) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Achievements</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {ACHIEVEMENTS.map((achievement) => {
            const checked = checkedAchievements[achievement.id]
            const isUnlocked = checked?.unlocked || false
            const currentValue = Math.min(checked?.currentValue || 0, achievement.goalValue)
            const progressPercent = Math.min(100, (currentValue / achievement.goalValue) * 100)
            const Icon = iconMap[achievement.icon] || Circle

            return (
              <div key={achievement.id} className={cn(
                "flex flex-col items-center text-center p-4 rounded-xl border transition-colors",
                isUnlocked ? "bg-green-500/10 border-green-500/30" : "bg-muted/30 border-border"
              )}>
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center mb-2",
                  isUnlocked ? "bg-green-500/20" : "bg-muted"
                )}>
                  <Icon className={cn("h-5 w-5", isUnlocked ? "text-green-600" : "text-muted-foreground")} />
                </div>
                <h3 className="text-sm font-semibold flex items-center gap-1">
                  {achievement.title}
                  {isUnlocked && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-2">{achievement.description}</p>

                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", isUnlocked ? "bg-green-600" : "bg-primary")}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {Math.floor(currentValue)} / {achievement.goalValue}
                </p>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}