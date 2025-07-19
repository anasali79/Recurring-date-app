"use client"

import { Label } from "@/components/ui/label"
import { useRecurrence } from "../context/recurrence-context"
import type { WeekDay } from "../types"

const WEEKDAYS: { value: WeekDay; label: string; shortLabel: string }[] = [
  { value: "sunday", label: "Sunday", shortLabel: "S" },
  { value: "monday", label: "Monday", shortLabel: "M" },
  { value: "tuesday", label: "Tuesday", shortLabel: "T" },
  { value: "wednesday", label: "Wednesday", shortLabel: "W" },
  { value: "thursday", label: "Thursday", shortLabel: "T" },
  { value: "friday", label: "Friday", shortLabel: "F" },
  { value: "saturday", label: "Saturday", shortLabel: "S" },
]

export function WeeklyOptions() {
  const { selectedDays, updateRecurrence } = useRecurrence()

  const handleDayToggle = (day: WeekDay) => {
    const isSelected = selectedDays.includes(day)
    const newSelectedDays = isSelected ? selectedDays.filter((d) => d !== day) : [...selectedDays, day]

    updateRecurrence({ selectedDays: newSelectedDays })
  }

  return (
    <div className="space-y-4 animate-fade-in-up animation-delay-200">
      <Label id="weekly-options-heading" className="text-sm font-medium text-gray-700">
        Days of the Week
      </Label>

      {/* Mobile: Full day names */}
      <div className="grid grid-cols-1 gap-2 sm:hidden" role="group" aria-labelledby="weekly-options-heading">
        {WEEKDAYS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleDayToggle(value)}
            className={`
              px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${
                selectedDays.includes(value)
                  ? "bg-slate-900 text-white shadow-lg animate-bounce-subtle"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
              }
            `}
            aria-pressed={selectedDays.includes(value)}
            aria-label={`Toggle ${label} for weekly recurrence`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Desktop: Short labels */}
      <div className="hidden sm:grid grid-cols-7 gap-2" role="group" aria-labelledby="weekly-options-heading">
        {WEEKDAYS.map(({ value, label, shortLabel }) => (
          <button
            key={value}
            onClick={() => handleDayToggle(value)}
            className={`
              w-12 h-12 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${
                selectedDays.includes(value)
                  ? "bg-slate-900 text-white shadow-lg animate-bounce-subtle"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
            aria-pressed={selectedDays.includes(value)}
            aria-label={`Toggle ${label} for weekly recurrence`}
            title={label}
          >
            {shortLabel}
          </button>
        ))}
      </div>

      {selectedDays.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3" role="alert">
          <p className="text-sm text-amber-700 flex items-center">
            <span className="mr-2">⚠️</span>
            Please select at least one day of the week.
          </p>
        </div>
      )}

      {selectedDays.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700 flex items-center">
            <span className="mr-2">✅</span>
            Selected: {selectedDays.map((day) => WEEKDAYS.find((w) => w.value === day)?.label).join(", ")}
          </p>
        </div>
      )}
    </div>
  )
}
