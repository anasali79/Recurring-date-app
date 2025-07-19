"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { useRecurrence } from "../context/recurrence-context"
import { format } from "date-fns"

export function DateRangePicker() {
  const { startDate, endDate, updateRecurrence } = useRecurrence()

  return (
    <div className="space-y-4 sm:space-y-6">
      <Label className="text-sm font-medium text-gray-700">Date Range</Label>

      <div className="space-y-4">
        <div>
          <Label htmlFor="start-date-picker" className="text-xs text-gray-500 mb-2 block">
            Start Date *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date-picker"
                variant="outline"
                className="w-full justify-start bg-white text-gray-900 border-gray-200 h-12 px-4 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={
                  startDate ? `Start date selected: ${format(startDate, "MMMM do, yyyy")}` : "Select start date"
                }
              >
                <CalendarIcon className="mr-3 h-4 w-4 text-gray-500" />
                <span className="text-sm">{startDate ? format(startDate, "MMMM do, yyyy") : "Select start date"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate || undefined}
                onSelect={(date) => updateRecurrence({ startDate: date || null })}
                initialFocus
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="end-date-picker" className="text-xs text-gray-500 mb-2 block">
            End Date (Optional)
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date-picker"
                variant="outline"
                className="w-full justify-start bg-white text-gray-900 border-gray-200 h-12 px-4 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={endDate ? `End date selected: ${format(endDate, "MMMM do, yyyy")}` : "No end date selected"}
              >
                <CalendarIcon className="mr-3 h-4 w-4 text-gray-500" />
                <span className="text-sm">{endDate ? format(endDate, "MMMM do, yyyy") : "No end date"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate || undefined}
                onSelect={(date) => updateRecurrence({ endDate: date || null })}
                disabled={(date) => (startDate ? date < startDate : false)}
                initialFocus
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
          {startDate && !endDate && (
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <span className="mr-1">💡</span>
              Without an end date, we'll show 6 months of recurring dates
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
