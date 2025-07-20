import type React from "react"
import { renderHook, act } from "@testing-library/react"
import { RecurrenceProvider, useRecurrence } from "@/components/recurring-date-picker/context/recurrence-context"
import { jest } from '@jest/globals'

// Mock the date generator
jest.mock("@/components/recurring-date-picker/utils/date-generator", () => ({
  generateRecurringDates: jest.fn(() => [new Date("2024-01-01"), new Date("2024-01-02"), new Date("2024-01-03")]),
}))

describe("RecurrenceContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => <RecurrenceProvider>{children}</RecurrenceProvider>

  it("should provide initial state", () => {
    const { result } = renderHook(() => useRecurrence(), { wrapper })

    expect(result.current.type).toBe("daily")
    expect(result.current.interval).toBe(1)
    expect(result.current.startDate).toBeNull()
    expect(result.current.endDate).toBeNull()
    expect(result.current.selectedDays).toEqual([])
    expect(result.current.monthlyPattern).toBe("date")
  })

  it("should update recurrence state", () => {
    const { result } = renderHook(() => useRecurrence(), { wrapper })

    act(() => {
      result.current.updateRecurrence({
        type: "weekly",
        interval: 2,
        startDate: new Date("2024-01-01"),
      })
    })

    expect(result.current.type).toBe("weekly")
    expect(result.current.interval).toBe(2)
    expect(result.current.startDate).toEqual(new Date("2024-01-01"))
  })

  it("should call onRecurrenceChange when state updates", () => {
    const mockOnChange = jest.fn()

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <RecurrenceProvider onRecurrenceChange={mockOnChange}>{children}</RecurrenceProvider>
    )

    const { result } = renderHook(() => useRecurrence(), { wrapper: TestWrapper })

    act(() => {
      result.current.updateRecurrence({ type: "monthly" })
    })

    expect(mockOnChange).toHaveBeenCalled()
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ type: "monthly" }))
  })

  it("should generate dates when state changes", () => {
    const { result } = renderHook(() => useRecurrence(), { wrapper })

    act(() => {
      result.current.updateRecurrence({
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-10"),
      })
    })

    expect(result.current.generatedDates).toHaveLength(3)
    expect(result.current.generatedDates[0]).toEqual(new Date("2024-01-01"))
  })

  it("should accept default props", () => {
    const defaultStartDate = new Date("2024-06-01")
    const defaultEndDate = new Date("2024-06-30")

    const CustomWrapper = ({ children }: { children: React.ReactNode }) => (
      <RecurrenceProvider
        defaultStartDate={defaultStartDate}
        defaultEndDate={defaultEndDate}
        defaultRecurrenceType="weekly"
      >
        {children}
      </RecurrenceProvider>
    )

    const { result } = renderHook(() => useRecurrence(), { wrapper: CustomWrapper })

    expect(result.current.startDate).toEqual(defaultStartDate)
    expect(result.current.endDate).toEqual(defaultEndDate)
    expect(result.current.type).toBe("weekly")
  })

  it("should throw error when used outside provider", () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      renderHook(() => useRecurrence())
    }).toThrow("useRecurrence must be used within a RecurrenceProvider")

    consoleSpy.mockRestore()
  })
})
