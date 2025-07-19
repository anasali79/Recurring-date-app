import type React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { RecurrenceOptions } from "@/components/recurring-date-picker/components/recurrence-options"
import { RecurrenceProvider } from "@/components/recurring-date-picker/context/recurrence-context"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock child components
jest.mock("@/components/recurring-date-picker/components/weekly-options", () => ({
  WeeklyOptions: () => <div data-testid="weekly-options">Weekly Options</div>,
}))

jest.mock("@/components/recurring-date-picker/components/monthly-options", () => ({
  MonthlyOptions: () => <div data-testid="monthly-options">Monthly Options</div>,
}))

jest.mock("@/components/recurring-date-picker/components/recurrence-header", () => ({
  RecurrenceHeader: () => <div data-testid="recurrence-header">Header</div>,
}))

const renderWithProvider = (component: React.ReactElement) => {
  return render(<RecurrenceProvider>{component}</RecurrenceProvider>)
}

describe("RecurrenceOptions", () => {
  it("should render all recurrence type buttons", () => {
    renderWithProvider(<RecurrenceOptions />)

    expect(screen.getByText("Daily")).toBeInTheDocument()
    expect(screen.getByText("Weekly")).toBeInTheDocument()
    expect(screen.getByText("Monthly")).toBeInTheDocument()
    expect(screen.getByText("Yearly")).toBeInTheDocument()
  })

  it("should show daily as selected by default", () => {
    renderWithProvider(<RecurrenceOptions />)

    const dailyButton = screen.getByText("Daily").closest("button")
    expect(dailyButton).toHaveClass("bg-slate-900")
  })

  it("should change recurrence type when button clicked", () => {
    renderWithProvider(<RecurrenceOptions />)

    const weeklyButton = screen.getByText("Weekly")
    fireEvent.click(weeklyButton)

    expect(weeklyButton.closest("button")).toHaveClass("bg-slate-900")
  })

  it("should show weekly options when weekly is selected", () => {
    renderWithProvider(<RecurrenceOptions />)

    const weeklyButton = screen.getByText("Weekly")
    fireEvent.click(weeklyButton)

    expect(screen.getByTestId("weekly-options")).toBeInTheDocument()
  })

  it("should show monthly options when monthly is selected", () => {
    renderWithProvider(<RecurrenceOptions />)

    const monthlyButton = screen.getByText("Monthly")
    fireEvent.click(monthlyButton)

    expect(screen.getByTestId("monthly-options")).toBeInTheDocument()
  })

  it("should update interval when input changes", () => {
    renderWithProvider(<RecurrenceOptions />)

    const intervalInput = screen.getByDisplayValue("1")
    fireEvent.change(intervalInput, { target: { value: "3" } })

    expect(intervalInput).toHaveValue(3)
  })

  it("should show correct interval label for different types", () => {
    renderWithProvider(<RecurrenceOptions />)

    // Default daily
    expect(screen.getByText("day")).toBeInTheDocument()

    // Change to weekly
    const weeklyButton = screen.getByText("Weekly")
    fireEvent.click(weeklyButton)
    expect(screen.getByText("week")).toBeInTheDocument()

    // Change interval to 2
    const intervalInput = screen.getByDisplayValue("1")
    fireEvent.change(intervalInput, { target: { value: "2" } })
    expect(screen.getByText("weeks")).toBeInTheDocument()
  })

  it("should prevent negative intervals", () => {
    renderWithProvider(<RecurrenceOptions />)

    const intervalInput = screen.getByDisplayValue("1")
    fireEvent.change(intervalInput, { target: { value: "-1" } })

    // Should default to 1
    expect(intervalInput).toHaveValue(1)
  })

  it("should handle invalid interval input", () => {
    renderWithProvider(<RecurrenceOptions />)

    const intervalInput = screen.getByDisplayValue("1")
    fireEvent.change(intervalInput, { target: { value: "abc" } })

    // Should default to 1
    expect(intervalInput).toHaveValue(1)
  })
})
