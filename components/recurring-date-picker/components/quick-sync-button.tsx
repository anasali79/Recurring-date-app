"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useRecurrence } from "../context/recurrence-context"
import { format } from "date-fns"

export function QuickSyncButton() {
  const { generatedDates, type, interval, startDate, endDate } = useRecurrence()

  const addToCalendar = () => {
    if (!startDate) {
      alert("Please select a start date first!")
      return
    }

    if (generatedDates.length === 0) {
      alert("No dates to add!")
      return
    }

    const eventTitle = `${type.charAt(0).toUpperCase() + type.slice(1)} Event`
    let eventDetails = `🔄 Recurring every ${interval} ${type}(s)\n`
    eventDetails += `📅 Start: ${format(startDate, "MMM d, yyyy")}\n`
    if (endDate) {
      eventDetails += `🏁 End: ${format(endDate, "MMM d, yyyy")}\n`
    }
    eventDetails += `📊 Total: ${generatedDates.length} dates`

    const googleUrl = new URL("https://calendar.google.com/calendar/render")
    googleUrl.searchParams.set("action", "TEMPLATE")
    googleUrl.searchParams.set("text", eventTitle)
    googleUrl.searchParams.set("dates", `${format(startDate, "yyyyMMdd")}/${format(startDate, "yyyyMMdd")}`)
    googleUrl.searchParams.set("details", eventDetails)

    window.open(googleUrl.toString(), "_blank")
  }

  if (!startDate) {
    return (
      <Button disabled variant="outline" className="w-full bg-transparent">
        <Calendar className="w-4 h-4 mr-2" />
        Select start date first
      </Button>
    )
  }

  if (generatedDates.length === 0) {
    return (
      <Button disabled variant="outline" className="w-full bg-transparent">
        <Calendar className="w-4 h-4 mr-2" />
        No dates generated
      </Button>
    )
  }

  return (
    <Button
      onClick={addToCalendar}
      className="w-full bg-green-600 hover:bg-green-700 text-white btn-animate transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      <Calendar className="w-4 h-4 mr-2 animate-bounce-subtle" />📅 Quick Add ({generatedDates.length})
    </Button>
  )
}
