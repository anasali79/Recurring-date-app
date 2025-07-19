export type RecurrenceType = "daily" | "weekly" | "monthly" | "yearly"
export type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
export type MonthlyPattern = "date" | "day"
export type YearlyPattern = "date" | "day"
export type WeekNumber = 1 | 2 | 3 | 4 | -1

export interface RecurrenceState {
  type: RecurrenceType
  interval: number
  startDate: Date | null
  endDate: Date | null
  selectedDays: WeekDay[]
  monthlyPattern: MonthlyPattern
  monthlyDate: number
  monthlyWeekNumber: WeekNumber
  monthlyWeekDay: WeekDay
  yearlyPattern: YearlyPattern
  yearlyMonth: number
  yearlyDate: number
  yearlyWeekNumber: WeekNumber
  yearlyWeekDay: WeekDay
  generatedDates: Date[]
}

export interface RecurrenceContextType extends RecurrenceState {
  updateRecurrence: (updates: Partial<RecurrenceState>) => void
  generateDates: () => void
}
