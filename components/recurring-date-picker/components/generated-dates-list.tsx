"use client"

import { useRecurrence } from "../context/recurrence-context"
import { format } from "date-fns"

export function GeneratedDatesList() {
  const { generatedDates } = useRecurrence()

  if (generatedDates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">0 dates generated</p>
      </div>
    )
  }

  const displayDates = generatedDates.slice(0, 12)
  const remainingCount = generatedDates.length - displayDates.length

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Generated Recurring Dates</h3>
        <span className="text-sm text-gray-500">{generatedDates.length} dates generated</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayDates.map((date, index) => (
          <div
            key={index}
            className="px-4 py-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            {format(date, "EEEE, MMMM d, yyyy")}
          </div>
        ))}
      </div>

      {remainingCount > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">...and {remainingCount} more dates</p>
        </div>
      )}
    </div>
  )
}
