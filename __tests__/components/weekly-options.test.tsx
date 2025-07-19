import type React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { WeeklyOptions } from "@/components/recurring-date-picker/components/weekly-options"
import { RecurrenceProvider } from "@/components/recurring-date-picker/context/recurrence-context"

const renderWithProvider = (component: React.ReactElement) => {
  return render(<RecurrenceProvider>{component}</RecurrenceProvider>)
}

describe("WeeklyOptions", () => {
  it("should render all weekday buttons", () => {
    renderWithProvider(<WeeklyOptions />)

    expect(screen.getByText("S")).toBeInTheDocument() // Sunday
    expect(screen.getByText("M")).toBeInTheDocument() // Monday
    expect(screen.getByText("T")).toBeInTheDocument() // Tuesday
    expect(screen.getByText("W")).toBeInTheDocument() // Wednesday
    expect(screen.getByText("F")).toBeInTheDocument() // Friday
  })

  it("should show warning when no days selected", () => {
    renderWithProvider(<WeeklyOptions />)

    expect(screen.getByText("Please select at least one day of the week.")).toBeInTheDocument()
  })

  it("should toggle day selection when clicked", () => {
    renderWithProvider(<WeeklyOptions />)

    const mondayButton = screen.getAllByText("M")[0] // Get first M (Monday)
    fireEvent.click(mondayButton)

    expect(mondayButton.closest("button")).toHaveClass("bg-slate-900")
  })

  it("should allow multiple day selection", () => {
    renderWithProvider(<WeeklyOptions />)

    const mondayButton = screen.getAllByText("M")[0]
    const wednesdayButton = screen.getByText("W")
    const fridayButton = screen.getByText("F")

    fireEvent.click(mondayButton)
    fireEvent.click(wednesdayButton)
    fireEvent.click(fridayButton)

    expect(mondayButton.closest("button")).toHaveClass("bg-slate-900")
    expect(wednesdayButton.closest("button")).toHaveClass("bg-slate-900")
    expect(fridayButton.closest("button")).toHaveClass("bg-slate-900")
  })

  it("should deselect day when clicked again", () => {
    renderWithProvider(<WeeklyOptions />)

    const mondayButton = screen.getAllByText("M")[0]

    // Select
    fireEvent.click(mondayButton)
    expect(mondayButton.closest("button")).toHaveClass("bg-slate-900")

    // Deselect
    fireEvent.click(mondayButton)
    expect(mondayButton.closest("button")).not.toHaveClass("bg-slate-900")
  })

  it("should hide warning when at least one day is selected", () => {
    renderWithProvider(<WeeklyOptions />)

    const mondayButton = screen.getAllByText("M")[0]
    fireEvent.click(mondayButton)

    expect(screen.queryByText("Please select at least one day of the week.")).not.toBeInTheDocument()
  })
})
