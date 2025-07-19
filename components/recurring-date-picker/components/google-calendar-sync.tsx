"use client"

import { Button } from "@/components/ui/button"
import { Calendar, AlertCircle } from "lucide-react"
import { useRecurrence } from "../context/recurrence-context"
import { format } from "date-fns"

export function GoogleCalendarSync() {
  const { generatedDates, type, interval, startDate, endDate } = useRecurrence()

  const addToGoogleCalendar = () => {
    if (!startDate) {
      alert("Please select a start date first!")
      return
    }

    if (generatedDates.length === 0) {
      alert("No recurring dates generated. Please check your settings!")
      return
    }

    const eventStartDate = startDate
    const eventTitle = `Recurring Event - ${type.charAt(0).toUpperCase() + type.slice(1)}`

    let eventDetails = `🔄 Recurring every ${interval} ${type}(s)\n`
    eventDetails += `📅 Start Date: ${format(startDate, "MMMM d, yyyy")}\n`
    if (endDate) {
      eventDetails += `🏁 End Date: ${format(endDate, "MMMM d, yyyy")}\n`
    }
    eventDetails += `📊 Total ${generatedDates.length} occurrences\n\n`
    eventDetails += `✨ Created with Recurring Date Picker\n\n`
    eventDetails += `📋 All dates:\n`

    generatedDates.slice(0, 10).forEach((date, index) => {
      eventDetails += `${index + 1}. ${format(date, "EEEE, MMMM d, yyyy")}\n`
    })

    if (generatedDates.length > 10) {
      eventDetails += `... and ${generatedDates.length - 10} more dates`
    }

    const googleUrl = new URL("https://calendar.google.com/calendar/render")
    googleUrl.searchParams.set("action", "TEMPLATE")
    googleUrl.searchParams.set("text", eventTitle)

    const startDateFormatted = format(eventStartDate, "yyyyMMdd")
    const endDateFormatted = format(eventStartDate, "yyyyMMdd")
    googleUrl.searchParams.set("dates", `${startDateFormatted}/${endDateFormatted}`)
    googleUrl.searchParams.set("details", eventDetails)
    googleUrl.searchParams.set("location", "")

    window.open(googleUrl.toString(), "_blank")
  }

  if (!startDate) {
    return (
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📅 Add to Google Calendar</h3>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">Please select a start date first to add to calendar.</p>
          </div>
        </div>
      </div>
    )
  }

  if (generatedDates.length === 0) {
    return (
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📅 Add to Google Calendar</h3>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">No recurring dates generated yet. Please check your settings.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">📅 Add to Google Calendar</h3>
        <span className="text-sm text-gray-500">{generatedDates.length} dates ready</span>
      </div>

      <div className="space-y-4">
        <Button
          onClick={addToGoogleCalendar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-medium w-full btn-animate transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          size="lg"
        >
          <Calendar className="w-5 h-5 mr-2 animate-bounce-subtle" />🚀 Add to Google Calendar
        </Button>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-green-600 text-2xl">📅</div>
            <div>
              <h4 className="text-sm font-medium text-green-900 mb-1">Your Date Range</h4>
              <p className="text-sm text-green-800">
                <strong>Start:</strong> {format(startDate, "MMMM d, yyyy")}
                <br />
                <strong>End:</strong> {endDate ? format(endDate, "MMMM d, yyyy") : "No end date"}
                <br />
                <strong>Pattern:</strong> Every {interval} {type}(s)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-blue-600 text-2xl">⚡</div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">How it works</h4>
              <p className="text-sm text-blue-800">
                Click the button above and Google Calendar will open with your event details. The event will include all
                your recurring dates in the description.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">📋 Your recurring dates:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600 max-h-32 overflow-y-auto">
            {generatedDates.map((date, index) => (
              <div key={index} className="bg-white px-2 py-1 rounded flex justify-between">
                <span>{format(date, "MMM d, yyyy")}</span>
                <span className="text-gray-400">{format(date, "EEEE")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
