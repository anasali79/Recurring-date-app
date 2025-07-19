"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRecurrence } from "../context/recurrence-context"
import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
} from "date-fns"
import { QuickSyncButton } from "./quick-sync-button"

export function MiniCalendarPreview() {
  const { generatedDates } = useRecurrence()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const isRecurringDate = (date: Date) => {
    return generatedDates.some((recurringDate) => isSameDay(date, recurringDate))
  }

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  // Get upcoming dates for the sidebar
  const upcomingDates = generatedDates.filter((date) => date >= new Date()).slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Calendar Preview</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevMonth}
              className="hover:scale-105 transition-transform bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">{format(currentMonth, "MMMM yyyy")}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextMonth}
              className="hover:scale-105 transition-transform bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isRecurring = isRecurringDate(day)
              const isToday = isSameDay(day, new Date())
              const isHovered = hoveredDate && isSameDay(day, hoveredDate)

              return (
                <div
                  key={day.toISOString()}
                  className={`
                    relative p-2 text-center text-sm h-10 flex items-center justify-center cursor-pointer
                    transition-all duration-300 rounded-md group
                    ${!isCurrentMonth ? "text-gray-300" : "text-gray-900"}
                    ${isHovered ? "bg-blue-50 scale-105" : ""}
                  `}
                  onMouseEnter={() => setHoveredDate(day)}
                  onMouseLeave={() => setHoveredDate(null)}
                  style={{
                    animationDelay: `${index * 20}ms`, // Staggered animation
                  }}
                >
                  <span
                    className={`
                      inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium
                      transition-all duration-500 relative
                      ${
                        isRecurring
                          ? "bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 text-white shadow-lg transform scale-110 animate-gentle-pulse"
                          : ""
                      }
                      ${isToday && !isRecurring ? "bg-gray-200 font-bold ring-2 ring-blue-400" : ""}
                      ${isHovered && isRecurring ? "shadow-xl scale-125" : ""}
                    `}
                  >
                    {format(day, "d")}

                    {/* Recurring Date Indicator */}
                    {isRecurring && (
                      <>
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-30 animate-gentle-glow"></div>

                        {/* Success indicator dot */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-gentle-bounce shadow-sm"></div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-10 shadow-lg">
                          🔄 Recurring Event
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </>
                    )}

                    {/* Today indicator */}
                    {isToday && !isRecurring && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-blue-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        Today
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-blue-600"></div>
                      </div>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Enhanced Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-sm animate-gentle-pulse"></div>
            <span>Recurring Date</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full ring-2 ring-blue-400"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm animate-gentle-bounce"></div>
            <span>Active</span>
          </div>
        </div>

        {generatedDates.length === 0 && (
          <div className="text-center py-8 animate-fade-in">
            <div className="text-4xl mb-2">📅</div>
            <p className="text-sm text-gray-500">No recurring dates generated yet</p>
            <p className="text-xs text-gray-400 mt-1">Select a start date and pattern to see preview</p>
          </div>
        )}
      </div>

      {/* Upcoming Dates */}
      {upcomingDates.length > 0 && (
        <div className="animate-fade-in-up animation-delay-400">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <span className="mr-2">📅</span>
            Upcoming Dates
          </h4>
          <div className="space-y-2">
            {upcomingDates.map((date, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-300 hover:scale-102 animate-slide-in-left"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <span className="text-gray-700 font-medium">{format(date, "EEEE, MMM d")}</span>
                <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full">
                  {format(date, "yyyy")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Sync Button */}
      <div className="mt-4">
        <QuickSyncButton />
      </div>
    </div>
  )
}
