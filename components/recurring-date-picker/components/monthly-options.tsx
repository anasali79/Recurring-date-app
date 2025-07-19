"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRecurrence } from "../context/recurrence-context"
import type { WeekDay, WeekNumber } from "../types"

const WEEK_NUMBERS: { value: WeekNumber; label: string }[] = [
  { value: 1, label: "First" },
  { value: 2, label: "Second" },
  { value: 3, label: "Third" },
  { value: 4, label: "Fourth" },
  { value: -1, label: "Last" },
]

const WEEKDAYS: { value: WeekDay; label: string }[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
]

export function MonthlyOptions() {
  const { monthlyPattern, monthlyDate, monthlyWeekNumber, monthlyWeekDay, updateRecurrence } = useRecurrence()

  const getPatternDescription = () => {
    if (monthlyPattern === "date") {
      return `Same date (${monthlyDate})`
    } else {
      const weekNumberLabel = WEEK_NUMBERS.find((w) => w.value === monthlyWeekNumber)?.label || "First"
      const weekDayLabel = WEEKDAYS.find((w) => w.value === monthlyWeekDay)?.label || "Monday"
      return `${weekNumberLabel} ${weekDayLabel}`
    }
  }

  return (
    <div className="space-y-4 animate-fade-in-up animation-delay-200">
      <Label className="text-sm font-medium text-gray-700">Monthly Pattern</Label>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => updateRecurrence({ monthlyPattern: "date" })}
          className={`
            px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border transform hover:scale-105
            ${
              monthlyPattern === "date"
                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }
          `}
        >
          Same Date ({monthlyDate})
        </button>
        <button
          onClick={() => updateRecurrence({ monthlyPattern: "day" })}
          className={`
            px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border transform hover:scale-105
            ${
              monthlyPattern === "day"
                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }
          `}
        >
          Same Weekday
        </button>
      </div>

      {monthlyPattern === "day" && (
        <div className="space-y-4 animate-fade-in-up animation-delay-400">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">📅 Pattern Preview</h4>
            <p className="text-sm text-blue-800">
              <strong>"{getPatternDescription()} of every month"</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">Example: "Second Tuesday of every month"</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-500 mb-2 block">Week Number</Label>
              <Select
                value={monthlyWeekNumber.toString()}
                onValueChange={(value) => updateRecurrence({ monthlyWeekNumber: Number.parseInt(value) as WeekNumber })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent>
                  {WEEK_NUMBERS.map(({ value, label }) => (
                    <SelectItem key={value} value={value.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-gray-500 mb-2 block">Weekday</Label>
              <Select
                value={monthlyWeekDay}
                onValueChange={(value) => updateRecurrence({ monthlyWeekDay: value as WeekDay })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {WEEKDAYS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span className="text-sm text-green-800">
                <strong>Current Pattern:</strong> {getPatternDescription()} of every month
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
