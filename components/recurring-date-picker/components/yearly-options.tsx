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

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
]

export function YearlyOptions() {
  const { yearlyPattern, yearlyMonth, yearlyDate, yearlyWeekNumber, yearlyWeekDay, updateRecurrence } = useRecurrence()

  const getPatternDescription = () => {
    const monthName = MONTHS.find((m) => m.value === yearlyMonth)?.label || "January"

    if (yearlyPattern === "date") {
      const suffix = getOrdinalSuffix(yearlyDate)
      return `${monthName} ${yearlyDate}${suffix} every year`
    } else {
      const weekNumberLabel = WEEK_NUMBERS.find((w) => w.value === yearlyWeekNumber)?.label || "First"
      const weekDayLabel = WEEKDAYS.find((w) => w.value === yearlyWeekDay)?.label || "Monday"
      return `${weekNumberLabel} ${weekDayLabel} of ${monthName} every year`
    }
  }

  const getOrdinalSuffix = (num: number): string => {
    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) return "st"
    if (j === 2 && k !== 12) return "nd"
    if (j === 3 && k !== 13) return "rd"
    return "th"
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in-up animation-delay-200">
      <Label className="text-sm font-medium text-gray-700">Yearly Pattern</Label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => updateRecurrence({ yearlyPattern: "date" })}
          className={`
            px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border transform hover:scale-105
            ${
              yearlyPattern === "date"
                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }
          `}
          aria-pressed={yearlyPattern === "date"}
          aria-label="Select fixed date pattern for yearly recurrence"
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-lg">📅</span>
            <span>Fixed Date</span>
          </div>
        </button>

        <button
          onClick={() => updateRecurrence({ yearlyPattern: "day" })}
          className={`
            px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border transform hover:scale-105
            ${
              yearlyPattern === "day"
                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }
          `}
          aria-pressed={yearlyPattern === "day"}
          aria-label="Select weekday pattern for yearly recurrence"
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-lg">🔄</span>
            <span>Weekday Pattern</span>
          </div>
        </button>
      </div>

      {/* Pattern Configuration */}
      <div className="space-y-4 animate-fade-in-up animation-delay-400">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">📅 Pattern Preview</h4>
          <p className="text-sm text-blue-800">
            <strong>"{getPatternDescription()}"</strong>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {yearlyPattern === "date"
              ? "Example: January 15th, 2024 → January 15th, 2025 → January 15th, 2026"
              : "Example: Second Friday of March 2024 → Second Friday of March 2025"}
          </p>
        </div>

        {yearlyPattern === "date" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="yearly-month" className="text-xs text-gray-500 mb-2 block">
                Month
              </Label>
              <Select
                value={yearlyMonth.toString()}
                onValueChange={(value) => updateRecurrence({ yearlyMonth: Number.parseInt(value) })}
              >
                <SelectTrigger id="yearly-month" aria-label="Select month for yearly recurrence">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map(({ value, label }) => (
                    <SelectItem key={value} value={value.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="yearly-date" className="text-xs text-gray-500 mb-2 block">
                Date
              </Label>
              <Select
                value={yearlyDate.toString()}
                onValueChange={(value) => updateRecurrence({ yearlyDate: Number.parseInt(value) })}
              >
                <SelectTrigger id="yearly-date" aria-label="Select date for yearly recurrence">
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                    <SelectItem key={date} value={date.toString()}>
                      {date}
                      {getOrdinalSuffix(date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="yearly-week-number" className="text-xs text-gray-500 mb-2 block">
                Week Number
              </Label>
              <Select
                value={yearlyWeekNumber.toString()}
                onValueChange={(value) => updateRecurrence({ yearlyWeekNumber: Number.parseInt(value) as WeekNumber })}
              >
                <SelectTrigger id="yearly-week-number" aria-label="Select week number for yearly recurrence">
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
              <Label htmlFor="yearly-weekday" className="text-xs text-gray-500 mb-2 block">
                Weekday
              </Label>
              <Select
                value={yearlyWeekDay}
                onValueChange={(value) => updateRecurrence({ yearlyWeekDay: value as WeekDay })}
              >
                <SelectTrigger id="yearly-weekday" aria-label="Select weekday for yearly recurrence">
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

            <div>
              <Label htmlFor="yearly-month-pattern" className="text-xs text-gray-500 mb-2 block">
                Month
              </Label>
              <Select
                value={yearlyMonth.toString()}
                onValueChange={(value) => updateRecurrence({ yearlyMonth: Number.parseInt(value) })}
              >
                <SelectTrigger id="yearly-month-pattern" aria-label="Select month for yearly weekday pattern">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map(({ value, label }) => (
                    <SelectItem key={value} value={value.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span className="text-sm text-green-800">
              <strong>Current Pattern:</strong> {getPatternDescription()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
