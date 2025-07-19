import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isBefore,
  getDay,
  setDate,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isAfter,
  setMonth,
} from "date-fns"
import type { RecurrenceState, WeekDay } from "../types"

const WEEKDAY_MAP: Record<WeekDay, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

export function generateRecurringDates(state: RecurrenceState): Date[] {
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
  } = state

  if (!startDate) return []

  const dates: Date[] = []
  const maxDate = endDate || addMonths(startDate, 6)
  let currentDate = new Date(startDate)
  let iterations = 0
  const maxIterations = 1000

  while (!isAfter(currentDate, maxDate) && iterations < maxIterations) {
    iterations++

    switch (type) {
      case "daily":
        if (!isAfter(currentDate, maxDate)) {
          dates.push(new Date(currentDate))
        }
        currentDate = addDays(currentDate, interval)
        break

      case "weekly":
        if (selectedDays.length === 0) {
          if (!isAfter(currentDate, maxDate)) {
            dates.push(new Date(currentDate))
          }
          currentDate = addWeeks(currentDate, interval)
        } else {
          const weekStart = currentDate
          selectedDays.forEach((day) => {
            const dayNumber = WEEKDAY_MAP[day]
            const dayDate = addDays(weekStart, (dayNumber - getDay(weekStart) + 7) % 7)
            if (!isBefore(dayDate, startDate) && !isAfter(dayDate, maxDate)) {
              dates.push(new Date(dayDate))
            }
          })
          currentDate = addWeeks(currentDate, interval)
        }
        break

      case "monthly":
        if (monthlyPattern === "date") {
          try {
            const monthDate = setDate(currentDate, Math.min(monthlyDate, 31))
            if (!isBefore(monthDate, startDate) && !isAfter(monthDate, maxDate)) {
              dates.push(new Date(monthDate))
            }
          } catch (error) {
            console.warn("Invalid date for monthly recurrence:", error)
          }
        } else {
          const monthDate = getNthWeekdayOfMonth(currentDate, monthlyWeekNumber, monthlyWeekDay)
          if (monthDate && !isBefore(monthDate, startDate) && !isAfter(monthDate, maxDate)) {
            dates.push(new Date(monthDate))
          }
        }
        currentDate = addMonths(currentDate, interval)
        break

      case "yearly":
        if (yearlyPattern === "date") {
          try {
            let yearDate = setMonth(currentDate, yearlyMonth - 1)
            yearDate = setDate(yearDate, yearlyDate)
            if (!isBefore(yearDate, startDate) && !isAfter(yearDate, maxDate)) {
              dates.push(new Date(yearDate))
            }
          } catch (error) {
            console.warn("Invalid date for yearly recurrence:", error)
          }
        } else {
          const yearDate = getNthWeekdayOfYear(currentDate, yearlyMonth, yearlyWeekNumber, yearlyWeekDay)
          if (yearDate && !isBefore(yearDate, startDate) && !isAfter(yearDate, maxDate)) {
            dates.push(new Date(yearDate))
          }
        }
        currentDate = addYears(currentDate, interval)
        break
    }
  }

  return dates.sort((a, b) => a.getTime() - b.getTime())
}

function getNthWeekdayOfMonth(date: Date, weekNumber: number, weekDay: WeekDay): Date | null {
  const targetDayNumber = WEEKDAY_MAP[weekDay]
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)

  if (weekNumber === -1) {
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const matchingDays = daysInMonth.filter((day) => getDay(day) === targetDayNumber)
    return matchingDays[matchingDays.length - 1] || null
  } else {
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const matchingDays = daysInMonth.filter((day) => getDay(day) === targetDayNumber)
    return matchingDays[weekNumber - 1] || null
  }
}

function getNthWeekdayOfYear(date: Date, month: number, weekNumber: number, weekDay: WeekDay): Date | null {
  const yearMonth = setMonth(date, month - 1)
  return getNthWeekdayOfMonth(yearMonth, weekNumber, weekDay)
}
