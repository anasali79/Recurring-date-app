import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { RecurringDatePicker } from "@/components/recurring-date-picker"
import { jest } from '@jest/globals' // Import jest to declare the variable

// Mock window.open for Google Calendar tests
const mockWindowOpen = jest.fn()
Object.defineProperty(window, "open", {
  writable: true,
  value: mockWindowOpen,
})

describe("RecurringDatePicker Integration", () => {
  beforeEach(() => {
    mockWindowOpen.mockClear()
  })

  it("should render complete date picker interface", () => {
    render(<RecurringDatePicker />)

    // Check main sections are present
    expect(screen.getByText("Recurring Date Picker")).toBeInTheDocument()
    expect(screen.getByText("Recurrence Type")).toBeInTheDocument()
    expect(screen.getByText("Custom Interval")).toBeInTheDocument()
    expect(screen.getByText("Date Range")).toBeInTheDocument()
    expect(screen.getByText("Calendar Preview")).toBeInTheDocument()
  })

  it("should complete daily recurrence workflow", async () => {
    const mockOnChange = jest.fn()
    render(<RecurringDatePicker onRecurrenceChange={mockOnChange} />)

    // 1. Select daily recurrence (already selected by default)
    expect(screen.getByText("Daily").closest("button")).toHaveClass("bg-slate-900")

    // 2. Set interval to 2 days
    const intervalInput = screen.getByDisplayValue("1")
    fireEvent.change(intervalInput, { target: { value: "2" } })

    // 3. Select start date
    const startDateButton = screen.getByText("Select start date")
    fireEvent.click(startDateButton)

    // Wait for calendar to appear and select a date
    await waitFor(() => {
      const dateButton = screen.getAllByText("15")[0]
      fireEvent.click(dateButton)
    })

    // 4. Verify onRecurrenceChange was called
    expect(mockOnChange).toHaveBeenCalled()

    // 5. Check that dates are generated
    await waitFor(() => {
      expect(screen.queryByText("No recurring dates generated yet")).not.toBeInTheDocument()
    })
  })

  it("should complete weekly recurrence workflow", async () => {
    render(<RecurringDatePicker />)

    // 1. Select weekly recurrence
    const weeklyButton = screen.getByText("Weekly")
    fireEvent.click(weeklyButton)

    // 2. Select specific days
    await waitFor(() => {
      const mondayButton = screen.getAllByText("M")[0]
      const wednesdayButton = screen.getByText("W")
      const fridayButton = screen.getByText("F")

      fireEvent.click(mondayButton)
      fireEvent.click(wednesdayButton)
      fireEvent.click(fridayButton)
    })

    // 3. Set start date
    const startDateButton = screen.getByText("Select start date")
    fireEvent.click(startDateButton)

    await waitFor(() => {
      const dateButton = screen.getAllByText("1")[0]
      fireEvent.click(dateButton)
    })

    // 4. Verify weekly options are shown
    expect(screen.getByText("Days of the Week")).toBeInTheDocument()
  })

  it("should complete monthly recurrence workflow", async () => {
    render(<RecurringDatePicker />)

    // 1. Select monthly recurrence
    const monthlyButton = screen.getByText("Monthly")
    fireEvent.click(monthlyButton)

    // 2. Verify monthly options appear
    await waitFor(() => {
      expect(screen.getByText("Monthly Pattern")).toBeInTheDocument()
      expect(screen.getByText(/Same Date/)).toBeInTheDocument()
      expect(screen.getByText("Same Weekday")).toBeInTheDocument()
    })

    // 3. Select same weekday pattern
    const sameWeekdayButton = screen.getByText("Same Weekday")
    fireEvent.click(sameWeekdayButton)

    // 4. Set start date
    const startDateButton = screen.getByText("Select start date")
    fireEvent.click(startDateButton)

    await waitFor(() => {
      const dateButton = screen.getAllByText("15")[0]
      fireEvent.click(dateButton)
    })
  })

  it("should handle Google Calendar sync workflow", async () => {
    render(<RecurringDatePicker />)

    // 1. Set up a basic daily recurrence
    const startDateButton = screen.getByText("Select start date")
    fireEvent.click(startDateButton)

    await waitFor(() => {
      const dateButton = screen.getAllByText("1")[0]
      fireEvent.click(dateButton)
    })

    // 2. Wait for dates to be generated
    await waitFor(() => {
      expect(screen.queryByText("Please select a start date first")).not.toBeInTheDocument()
    })

    // 3. Click Google Calendar sync
    const syncButton = screen.getByText(/Add to Google Calendar/)
    fireEvent.click(syncButton)

    // 4. Verify window.open was called
    expect(mockWindowOpen).toHaveBeenCalledWith(expect.stringContaining("calendar.google.com"), "_blank")
  })

  it("should show proper validation messages", async () => {
    render(<RecurringDatePicker />)

    // Initially should show warning for no start date
    expect(screen.getByText("Please select a start date first to add to calendar.")).toBeInTheDocument()

    // Select weekly and check day validation
    const weeklyButton = screen.getByText("Weekly")
    fireEvent.click(weeklyButton)

    await waitFor(() => {
      expect(screen.getByText("Please select at least one day of the week.")).toBeInTheDocument()
    })
  })

  it("should handle date range properly", async () => {
    render(<RecurringDatePicker />)

    // Set start date
    const startDateButton = screen.getByText("Select start date")
    fireEvent.click(startDateButton)

    await waitFor(() => {
      const startDate = screen.getAllByText("1")[0]
      fireEvent.click(startDate)
    })

    // Set end date
    const endDateButton = screen.getByText("No end date")
    fireEvent.click(endDateButton)

    await waitFor(() => {
      const endDate = screen.getAllByText("10")[0]
      fireEvent.click(endDate)
    })

    // Verify date range is shown in sync section
    await waitFor(() => {
      expect(screen.getByText("Your Date Range")).toBeInTheDocument()
    })
  })

  it("should reset functionality work correctly", async () => {
    render(<RecurringDatePicker />)

    // Make some changes
    const weeklyButton = screen.getByText("Weekly")
    fireEvent.click(weeklyButton)

    const intervalInput = screen.getByDisplayValue("1")
    fireEvent.change(intervalInput, { target: { value: "3" } })

    // Click reset
    const resetButton = screen.getByText("Reset")
    fireEvent.click(resetButton)

    // Verify reset to defaults
    await waitFor(() => {
      expect(screen.getByText("Daily").closest("button")).toHaveClass("bg-slate-900")
      expect(screen.getByDisplayValue("1")).toBeInTheDocument()
    })
  })

  it("should handle default props correctly", () => {
    const defaultStartDate = new Date("2024-06-01")
    const defaultEndDate = new Date("2024-06-30")

    render(
      <RecurringDatePicker
        defaultStartDate={defaultStartDate}
        defaultEndDate={defaultEndDate}
        defaultRecurrenceType="weekly"
      />,
    )

    // Check that weekly is selected
    expect(screen.getByText("Weekly").closest("button")).toHaveClass("bg-slate-900")

    // Check that dates are set (would show in the date range section)
    expect(screen.getByText(/June 1st, 2024/)).toBeInTheDocument()
  })
})
