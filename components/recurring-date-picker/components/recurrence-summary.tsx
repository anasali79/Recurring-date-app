"use client"

import { useRecurrence } from "../context/recurrence-context"
import { format } from "date-fns"

const WEEKDAY_NAMES: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const WEEK_NUMBERS: Record<number, string> = {
  1: "First",
  2: "Second",
  3: "Third",
  4: "Fourth",
  [-1]: "Last",
}

export function RecurrenceSummary() {
  const {
    type,
    interval,
    startDate,
    endDate,
    selectedDays,
    monthlyPattern,
    monthlyDate,
    monthlyWeekNumber,
    monthlyWeekDay,
    yearlyPattern,
    yearlyMonth,
    yearlyDate,
    yearlyWeekNumber,
    yearlyWeekDay,
    generatedDates,
  } = useRecurrence()

  const generateSummary = (): string => {
    if (!startDate) return "Please select a start date to see the pattern"

    let summary = "Repeats "
    summary += interval === 1 ? `every ${type}` : `every ${interval} ${type}s`

    switch (type) {
      case "weekly":
        if (selectedDays.length > 0) {
          const dayNames = selectedDays.map((day) => WEEKDAY_NAMES[day])
          if (dayNames.length === 1) {
            summary += ` on ${dayNames[0]}`
          } else if (dayNames.length === 2) {
            summary += ` on ${dayNames[0]} and ${dayNames[1]}`
          } else {
            const lastDay = dayNames.pop()
            summary += ` on ${dayNames.join(", ")} and ${lastDay}`
          }
        }
        break

      case "monthly":
        if (monthlyPattern === "date") {
          summary += ` on the ${monthlyDate}${getOrdinalSuffix(monthlyDate)}`
        } else {
          const weekName = WEEK_NUMBERS[monthlyWeekNumber]
          const dayName = WEEKDAY_NAMES[monthlyWeekDay]
          summary += ` on the ${weekName} ${dayName}`
        }
        break

      case "yearly":
        if (yearlyPattern === "date") {
          const monthName = MONTH_NAMES[yearlyMonth - 1]
          summary += ` on ${monthName} ${yearlyDate}${getOrdinalSuffix(yearlyDate)}`
        } else {
          const weekName = WEEK_NUMBERS[yearlyWeekNumber]
          const dayName = WEEKDAY_NAMES[yearlyWeekDay]
          const monthName = MONTH_NAMES[yearlyMonth - 1]
          summary += ` on the ${weekName} ${dayName} of ${monthName}`
        }
        break
    }

    summary += `, starting from ${format(startDate, "MMMM d, yyyy")}`
    if (endDate) summary += ` until ${format(endDate, "MMMM d, yyyy")}`

    return summary
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
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 sm:p-6 animate-fade-in-up animation-delay-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
            <span className="mr-2 text-lg">📋</span>
            <span>Recurrence Summary</span>
          </h3>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">{generateSummary()}</p>
        </div>

        {generatedDates.length > 0 && (
          <div className="flex-shrink-0">
            <div className="bg-white rounded-lg px-3 py-2 border border-blue-200 shadow-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{generatedDates.length}</div>
                <div className="text-xs text-gray-500">dates</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
