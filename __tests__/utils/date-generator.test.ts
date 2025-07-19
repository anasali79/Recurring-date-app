import { generateRecurringDates } from "@/components/recurring-date-picker/utils/date-generator"
import type { RecurrenceState } from "@/components/recurring-date-picker/types"
import { format } from "date-fns"

describe("Date Generator", () => {
  const baseState: RecurrenceState = {
    type: "daily",
    interval: 1,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-10"),
    selectedDays: [],
    monthlyPattern: "date",
    monthlyDate: 1,
    monthlyWeekNumber: 1,
    monthlyWeekDay: "monday",
    generatedDates: [],
  }

  describe("Daily Recurrence", () => {
    it("should generate daily dates with interval 1", () => {
      const state = { ...baseState, type: "daily" as const, interval: 1 }
      const dates = generateRecurringDates(state)

      expect(dates).toHaveLength(10)
      expect(format(dates[0], "yyyy-MM-dd")).toBe("2024-01-01")
      expect(format(dates[1], "yyyy-MM-dd")).toBe("2024-01-02")
      expect(format(dates[9], "yyyy-MM-dd")).toBe("2024-01-10")
    })

    it("should generate daily dates with interval 2", () => {
      const state = { ...baseState, type: "daily" as const, interval: 2 }
      const dates = generateRecurringDates(state)

      expect(dates).toHaveLength(5)
      expect(format(dates[0], "yyyy-MM-dd")).toBe("2024-01-01")
      expect(format(dates[1], "yyyy-MM-dd")).toBe("2024-01-03")
      expect(format(dates[2], "yyyy-MM-dd")).toBe("2024-01-05")
    })

    it("should handle no end date by defaulting to 6 months", () => {
      const state = { ...baseState, type: "daily" as const, endDate: null }
      const dates = generateRecurringDates(state)

      expect(dates.length).toBeGreaterThan(100) // Should have many dates
      expect(dates[0]).toEqual(new Date("2024-01-01"))
    })
  })

  describe("Weekly Recurrence", () => {
    it("should generate weekly dates with no specific days selected", () => {
      const state = {
        ...baseState,
        type: "weekly" as const,
        interval: 1,
        endDate: new Date("2024-02-01"),
      }
      const dates = generateRecurringDates(state)

      expect(dates.length).toBeGreaterThan(0)
      expect(format(dates[0], "yyyy-MM-dd")).toBe("2024-01-01")
    })

    it("should generate dates for specific weekdays", () => {
      const state = {
        ...baseState,
        type: "weekly" as const,
        interval: 1,
        selectedDays: ["monday", "wednesday", "friday"],
        endDate: new Date("2024-01-15"),
      }
      const dates = generateRecurringDates(state)

      expect(dates.length).toBeGreaterThan(0)
      // Check that generated dates fall on correct weekdays
      dates.forEach((date) => {
        const dayOfWeek = date.getDay()
        expect([1, 3, 5]).toContain(dayOfWeek) // Monday=1, Wednesday=3, Friday=5
      })
    })

    it("should handle weekly interval of 2", () => {
      const state = {
        ...baseState,
        type: "weekly" as const,
        interval: 2,
        selectedDays: ["monday"],
        endDate: new Date("2024-02-01"),
      }
      const dates = generateRecurringDates(state)

      expect(dates.length).toBeGreaterThan(0)
      // Dates should be 2 weeks apart
      if (dates.length > 1) {
        const diffInDays = (dates[1].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24)
        expect(diffInDays).toBe(14)
      }
    })
  })

  describe("Monthly Recurrence", () => {
    it("should generate monthly dates by same date", () => {
      const state = {
        ...baseState,
        type: "monthly" as const,
        interval: 1,
        monthlyPattern: "date" as const,
        monthlyDate: 15,
        endDate: new Date("2024-06-01"),
      }
      const dates = generateRecurringDates(state)

      expect(dates.length).toBeGreaterThan(0)
      dates.forEach((date) => {
        expect(date.getDate()).toBe(15)
      })
    })

    it("should generate monthly dates by same weekday", () => {
      const state = {
        ...baseState,
        type: "monthly" as const,
        interval: 1,
        monthlyPattern: "day" as const,
        monthlyWeekNumber: 2,
        monthlyWeekDay: "tuesday",
        endDate: new Date("2024-06-01"),
      }
      const dates = generateRecurringDates(state)

      expect(dates.length).toBeGreaterThan(0)
      dates.forEach((date) => {
        expect(date.getDay()).toBe(2) // Tuesday = 2
      })
    })

    it("should handle monthly interval of 3", () => {
      const state = {
        ...baseState,
        type: "monthly" as const,
        interval: 3,
        monthlyPattern: "date" as const,
        monthlyDate: 1,
        endDate: new Date("2024-12-01"),
      }
      const dates = generateRecurringDates(state)

      expect(dates.length).toBeGreaterThan(0)
      // Check that months are 3 apart
      if (dates.length > 1) {
        expect(dates[1].getMonth() - dates[0].getMonth()).toBe(3)
      }
    })
  })

  describe("Yearly Recurrence", () => {
    it("should generate yearly dates", () => {
      const state = {
        ...baseState,
        type: "yearly" as const,
        interval: 1,
        endDate: new Date("2027-01-01"),
      }
      const dates = generateRecurringDates(state)

      expect(dates).toHaveLength(3) // 2024, 2025, 2026
      expect(dates[0].getFullYear()).toBe(2024)
      expect(dates[1].getFullYear()).toBe(2025)
      expect(dates[2].getFullYear()).toBe(2026)
    })

    it("should handle yearly interval of 2", () => {
      const state = {
        ...baseState,
        type: "yearly" as const,
        interval: 2,
        endDate: new Date("2030-01-01"),
      }
      const dates = generateRecurringDates(state)

      expect(dates.length).toBeGreaterThan(0)
      if (dates.length > 1) {
        expect(dates[1].getFullYear() - dates[0].getFullYear()).toBe(2)
      }
    })
  })

  describe("Edge Cases", () => {
    it("should return empty array when no start date", () => {
      const state = { ...baseState, startDate: null }
      const dates = generateRecurringDates(state)

      expect(dates).toEqual([])
    })

    it("should handle start date after end date", () => {
      const state = {
        ...baseState,
        startDate: new Date("2024-01-10"),
        endDate: new Date("2024-01-05"),
      }
      const dates = generateRecurringDates(state)

      expect(dates).toEqual([])
    })

    it("should prevent infinite loops with max iterations", () => {
      const state = {
        ...baseState,
        type: "daily" as const,
        interval: 0, // Invalid interval
        endDate: null,
      }
      const dates = generateRecurringDates(state)

      // Should not hang and should return reasonable number of dates
      expect(dates.length).toBeLessThan(2000)
    })

    it("should handle invalid monthly dates (like Feb 31)", () => {
      const state = {
        ...baseState,
        type: "monthly" as const,
        startDate: new Date("2024-01-31"),
        monthlyPattern: "date" as const,
        monthlyDate: 31,
        endDate: new Date("2024-06-01"),
      }

      // Should not throw error
      expect(() => generateRecurringDates(state)).not.toThrow()
    })
  })

  describe("Date Sorting", () => {
    it("should return dates in chronological order", () => {
      const state = {
        ...baseState,
        type: "weekly" as const,
        selectedDays: ["friday", "monday", "wednesday"],
        endDate: new Date("2024-01-15"),
      }
      const dates = generateRecurringDates(state)

      for (let i = 1; i < dates.length; i++) {
        expect(dates[i].getTime()).toBeGreaterThan(dates[i - 1].getTime())
      }
    })
  })
})
