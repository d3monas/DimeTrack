import { ShoppingCart, Car, Home, Utensils, Plane, Gamepad2, HeartPulse, Briefcase,
    Dumbbell, PiggyBank, Gift, GraduationCap, Baby, Dog, Zap, Coffee, Smartphone, Camera, Tag, type LucideIcon } from "lucide-react"

export type categoryCustomization = {
    color: string
    icon: string
}

export const availableColors = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
    "#10b981", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6",
    "#a855f7", "#d946ef", "#ec4899"
]

export const availableIcons = [
    "ShoppingCart", "Car", "Home", "Utensils", "Plane", "Gamepad2", "HeartPulse", "Briefcase",
    "Dumbbell", "Piggybank", "Gift", "GraduationCap", "Baby", "Dog", "Zap", "Coffee", "Smartphone", "Camera"
]

const iconMap: Record<string, LucideIcon> = {
    ShoppingCart, Car, Home, Utensils, Plane, Gamepad2, HeartPulse, Briefcase,
    Dumbbell, PiggyBank, Gift, GraduationCap, Baby, Dog, Zap, Coffee, Smartphone, Camera
}

export function getIconByName(name: string): LucideIcon {
    return (
        iconMap[name] || Tag
    )
}