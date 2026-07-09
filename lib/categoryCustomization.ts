import { icons, type LucideIcon } from "lucide-react"

export type categoryCustomization = {
    color: string
    icon: string
}

export const availableColors = [
    "#ef4444"
]

export const availableIcons = [
    "ShoppingCart"
]

export function getIconByName(name: string): LucideIcon {
    return (
        (icons as Record<string, LucideIcon>)[name] || icons.Tag
    )
}