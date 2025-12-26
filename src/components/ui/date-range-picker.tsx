"use client"

import * as React from "react"
import { addDays, format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DatePickerWithRangeProps {
    className?: string
    date?: DateRange | undefined
    setDate?: (date: DateRange | undefined) => void
    align?: "center" | "start" | "end"
}

export function DatePickerWithRange({
    className,
    date,
    setDate,
    align = "start",
}: DatePickerWithRangeProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    // Presets for quick selection
    const presets = [
        {
            label: "Today",
            getValue: () => ({ from: new Date(), to: new Date() }),
        },
        {
            label: "Yesterday",
            getValue: () => {
                const yesterday = subDays(new Date(), 1)
                return { from: yesterday, to: yesterday }
            },
        },
        {
            label: "This Week",
            getValue: () => ({
                from: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday start
                to: endOfWeek(new Date(), { weekStartsOn: 1 }),
            }),
        },
        {
            label: "Last 7 Days",
            getValue: () => ({
                from: subDays(new Date(), 6),
                to: new Date(),
            }),
        },
        {
            label: "This Month",
            getValue: () => ({
                from: startOfMonth(new Date()),
                to: endOfMonth(new Date()),
            }),
        },
        {
            label: "Last Month",
            getValue: () => {
                const lastMonth = subDays(new Date(), 30) // Approximation, better to use subMonths
                const start = startOfMonth(subDays(new Date(), 30)) // Actually let's use proper date-fns math if imported, but subDays(Date, 30) is okay-ish for "Last 30 days". 
                // Let's do proper Last Month
                const now = new Date()
                const startOfLastMonth = startOfMonth(subDays(startOfMonth(now), 1))
                const endOfLastMonth = endOfMonth(subDays(startOfMonth(now), 1))
                return { from: startOfLastMonth, to: endOfLastMonth }
            },
        },
        {
            label: "This Year",
            getValue: () => ({
                from: startOfYear(new Date()),
                to: endOfYear(new Date()),
            }),
        },
    ]

    const handlePresetChange = (value: string) => {
        const preset = presets.find((p) => p.label === value)
        if (preset && setDate) {
            setDate(preset.getValue())
        }
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        size="sm"
                        className={cn(
                            "w-auto justify-start text-left font-normal h-9 px-3",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <span className="hidden sm:inline">
                                    {format(date.from, "MMM dd")} - {format(date.to, "MMM dd")}
                                </span>
                            ) : (
                                <span className="hidden sm:inline">
                                    {format(date.from, "MMM dd")}
                                </span>
                            )
                        ) : (
                            <span className="hidden sm:inline">Pick date</span>
                        )}
                        {/* Mobile view only shows icon if needed or we can just keep text small */}
                        <span className="sm:hidden font-medium">
                            {date?.from ? (
                                date.to ? (
                                    <>{format(date.from, "dd/MM")} - {format(date.to, "dd/MM")}</>
                                ) : (
                                    format(date.from, "dd/MM")
                                )
                            ) : "Date"}
                        </span>
                        <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align={align}>
                    <div className="flex flex-col sm:flex-row">
                        {/* Quick Select Sidebar */}
                        <div className="p-3 border-r border-border hidden sm:block w-[140px] space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground px-2">Presets</span>
                            <div className="flex flex-col gap-1">
                                {presets.map((preset) => (
                                    <Button
                                        key={preset.label}
                                        variant="ghost"
                                        size="sm"
                                        className="justify-start text-xs font-normal h-8"
                                        onClick={() => handlePresetChange(preset.label)}
                                    >
                                        {preset.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Select for presets */}
                        <div className="sm:hidden p-3 border-b border-border">
                            <Select onValueChange={handlePresetChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select range..." />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {presets.map((preset) => (
                                        <SelectItem key={preset.label} value={preset.label}>
                                            {preset.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-0">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={1}
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
