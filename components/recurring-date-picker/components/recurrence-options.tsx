"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRecurrence } from "../context/recurrence-context"
import { WeeklyOptions } from "./weekly-options"
import { MonthlyOptions } from "./monthly-options"
import { YearlyOptions } from "./yearly-options"
import { RecurrenceHeader } from "./recurrence-header"
import { RecurrenceSummary } from "./recurrence-summary"

export function RecurrenceOptions() {
  const { type, interval, updateRecurrence } = useRecurrence()

  const handleTypeChange = (newType: string) => {
    updateRecurrence({
      type: newType as any,
      selectedDays: [],
      monthlyPattern: "date",
      monthlyDate: 19,
      monthlyWeekNumber: 1,
      monthlyWeekDay: "monday",
      yearlyPattern: "date",
      yearlyMonth: 1,
      yearlyDate: 1,
      yearlyWeekNumber: 1,
      yearlyWeekDay: "monday",
    })
  }

  const handleIntervalChange = (value: string) => {
    const newInterval = Number.parseInt(value) || 1
    updateRecurrence({ interval: Math.max(1, newInterval) })
  }

  const getIntervalLabel = () => {
    switch (type) {
      case "daily":
        return interval === 1 ? "day" : "days"
      case "weekly":
        return interval === 1 ? "week" : "weeks"
      case "monthly":
        return interval === 1 ? "month" : "months"
      case "yearly":
        return interval === 1 ? "year" : "years"
      default:
        return "days"
    }
  }

  const recurrenceTypes = [
    { value: "daily", label: "Daily", icon: "🕐", description: "Every day" },
    { value: "weekly", label: "Weekly", icon: "📅", description: "Specific weekdays" },
    { value: "monthly", label: "Monthly", icon: "🔄", description: "Same date or weekday" },
    { value: "yearly", label: "Yearly", icon: "🗓️", description: "Annual events" },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <RecurrenceHeader />

      {/* Summary Section */}
      <RecurrenceSummary />

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">Recurrence Type</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            {recurrenceTypes.map(({ value, label, icon, description }) => (
              <button
                key={value}
                onClick={() => handleTypeChange(value)}
                className={`
                  flex flex-col items-center justify-center px-1 py-2 text-[11px] sm:px-4 sm:py-6 sm:text-sm rounded-xl border font-medium 
                  transition-all duration-300 transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${
                    type === value
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
                aria-pressed={type === value}
                aria-label={`Select ${label} recurrence type. ${description}`}
              >
                <span className="text-lg sm:text-2xl mb-1 sm:mb-2">{icon}</span>
                <span className="font-semibold leading-tight">{label}</span>
                <span className={`mt-1 text-[9px] sm:text-xs ${type === value ? "text-gray-200" : "text-gray-500"}`}>
                  {description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="animate-fade-in-up animation-delay-200">
          <Label htmlFor="interval-input" className="text-sm font-medium text-gray-700 mb-3 block">
            Custom Interval
          </Label>
          <div className="flex items-center space-x-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
            <span className="text-gray-700 font-medium">Every</span>
            <Input
              id="interval-input"
              type="number"
              min="1"
              max="999"
              value={interval}
              onChange={(e) => handleIntervalChange(e.target.value)}
              className="w-20 h-10 text-center transition-all duration-200 focus:scale-105 bg-white"
              aria-label={`Interval for ${type} recurrence`}
            />
            <span className="text-gray-700 font-medium">{getIntervalLabel()}</span>
          </div>
        </div>

        {/* Type-specific options */}
        <div className="space-y-6">
          {type === "weekly" && (
            <div role="region" aria-labelledby="weekly-options-heading">
              <WeeklyOptions />
            </div>
          )}
          {type === "monthly" && (
            <div role="region" aria-labelledby="monthly-options-heading">
              <MonthlyOptions />
            </div>
          )}
          {type === "yearly" && (
            <div role="region" aria-labelledby="yearly-options-heading">
              <YearlyOptions />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
