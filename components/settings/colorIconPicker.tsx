import { getIconByName, availableColors, availableIcons } from "@/lib/categoryCustomization"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type ColorIconPickerThings = {
    color: string
    icon: string
    onChange: (data: { color?: string, icon?: string }) => void
}

export function ColorIconPicker({ color, icon, onChange }: ColorIconPickerThings) {
    const Icon = getIconByName(icon)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="h-8 w-8 rounded-md flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-ring" style={{ backgroundColor: color}}>
                    <Icon className="h-4 w-4" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
                <div className="grid grid-cols-8 gap-2 mb-4">
                    {availableColors.map((c) => (
                        <button key={c}
                            className="h-5 w-5 rounded-full border-2 hover:scale-110 transition-transform"
                            style={{ backgroundColor: c, borderColor: color === c ? "white" : "transparent"}}
                            onClick={() => onChange({ color: c})} />
                    ))}
                </div>
                <div className="grid grid-cols-6 gap-2">
                    {availableIcons.map((iconName) => {
                        const I = getIconByName(iconName)
                        return (
                            <button key={iconName}
                                className={`h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted ${icon === iconName ? "bg-muted ring-1 ring-ring" : ""}`}
                                onClick={() => onChange({ icon: iconName })}><I className="h-4 w-4" /></button>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}