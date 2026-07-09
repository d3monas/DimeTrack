import { ShoppingCart, Tag, type LucideIcon } from "lucide-react"

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

const iconMap: Record<string, LucideIcon> = {
    ShoppingCart
}

export function getIconByName(name: string): LucideIcon {
    return (
        iconMap[name] || Tag
    )
}