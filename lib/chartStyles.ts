export const chartTooltipStyle = {
    wrapperStyle: { zIndex: 1000 },
    allowEscapeViewBox: { x: true, y: true },
    offset: 40,
    contentStyle: {
        backgroundColor: "hsl(var(--popover))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "0.5rem",
        color: "hsl(var(--muted-foreground))",
        fontSize: "12px",
        padding: "8px 12px",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
    },
    labelStyle: {
        color: "hsl(var(--popover-foreground))",
        fontWeight: 600,
        marginBottom: "4px"
    },
    itemStyle: {
        color: "hsl(var(--popover-foreground))"
    }
}