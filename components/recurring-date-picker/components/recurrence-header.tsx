"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { useRecurrence } from "../context/recurrence-context"

export function RecurrenceHeader() {
  const { updateRecurrence } = useRecurrence()

  const handleReset = () => {
    updateRecurrence({
      type: "daily",
      interval: 1,
      startDate: null,
      endDate: null,
      selectedDays: [],
      monthlyPattern: "date",
      monthlyDate: 1,
      monthlyWeekNumber: 1,
      monthlyWeekDay: "monday",
      yearlyPattern: "date",
      yearlyMonth: 1,
      yearlyDate: 1,
      yearlyWeekNumber: 1,
      yearlyWeekDay: "monday",
      generatedDates: [],
    })
  }

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-900">Recurring Date Picker</h2>
      <Button variant="outline" size="sm" onClick={handleReset} className="text-sm bg-transparent">
        <RotateCcw className="w-4 h-4 mr-1" />
        Reset
      </Button>
    </div>
  )
}
