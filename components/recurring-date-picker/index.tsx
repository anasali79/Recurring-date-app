"use client"

import { RecurrenceProvider } from "./context/recurrence-context"
import { RecurrenceOptions } from "./components/recurrence-options"
import { DateRangePicker } from "./components/date-range-picker"
import { MiniCalendarPreview } from "./components/mini-calendar-preview"
import { GeneratedDatesList } from "./components/generated-dates-list"
import type { RecurrenceType } from "./types"
import { GoogleCalendarSync } from "./components/google-calendar-sync"

interface RecurringDatePickerProps {
  onRecurrenceChange?: (recurrence: any) => void
  defaultStartDate?: Date
  defaultEndDate?: Date
  defaultRecurrenceType?: RecurrenceType
}

export function RecurringDatePicker({
  onRecurrenceChange,
  defaultStartDate,
  defaultEndDate,
  defaultRecurrenceType = "daily",
}: RecurringDatePickerProps) {
  return (
    <RecurrenceProvider
      onRecurrenceChange={onRecurrenceChange}
      defaultStartDate={defaultStartDate}
      defaultEndDate={defaultEndDate}
      defaultRecurrenceType={defaultRecurrenceType}
    >
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-8">
              <RecurrenceOptions />
              <DateRangePicker />
            </div>
            <div className="xl:pl-6 xl:border-l xl:border-gray-200">
              <MiniCalendarPreview />
            </div>
          </div>
          <GeneratedDatesList />
          <GoogleCalendarSync />
        </div>
      </div>
    </RecurrenceProvider>
  )
}
