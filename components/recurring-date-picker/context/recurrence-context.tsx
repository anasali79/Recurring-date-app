"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { RecurrenceState, RecurrenceContextType, RecurrenceType } from "../types"
import { generateRecurringDates } from "../utils/date-generator"

const initialState: RecurrenceState = {
  type: "daily",
  interval: 1,
  startDate: null,
  endDate: null,
  selectedDays: [],
  monthlyPattern: "date",
  monthlyDate: 1,
  monthlyWeekNumber: 1,
  monthlyWeekDay: "monday",
  yearlyPattern: "date",
  yearlyMonth: 1,
  yearlyDate: 1,
  yearlyWeekNumber: 1,
  yearlyWeekDay: "monday",
  generatedDates: [],
}

type RecurrenceAction =
  | { type: "UPDATE_RECURRENCE"; payload: Partial<RecurrenceState> }
  | { type: "GENERATE_DATES"; payload: Date[] }

function recurrenceReducer(state: RecurrenceState, action: RecurrenceAction): RecurrenceState {
  switch (action.type) {
    case "UPDATE_RECURRENCE":
      return { ...state, ...action.payload }
    case "GENERATE_DATES":
      return { ...state, generatedDates: action.payload }
    default:
      return state
  }
}

const RecurrenceContext = createContext<RecurrenceContextType | null>(null)

interface RecurrenceProviderProps {
  children: ReactNode
  onRecurrenceChange?: (recurrence: RecurrenceState) => void
  defaultStartDate?: Date
  defaultEndDate?: Date
  defaultRecurrenceType?: RecurrenceType
}

export function RecurrenceProvider({
  children,
  onRecurrenceChange,
  defaultStartDate,
  defaultEndDate,
  defaultRecurrenceType,
}: RecurrenceProviderProps) {
  const [state, dispatch] = useReducer(recurrenceReducer, {
    ...initialState,
    startDate: defaultStartDate || null,
    endDate: defaultEndDate || null,
    type: defaultRecurrenceType || "daily",
  })

  const updateRecurrence = (updates: Partial<RecurrenceState>) => {
    dispatch({ type: "UPDATE_RECURRENCE", payload: updates })
  }

  const generateDates = () => {
    const dates = generateRecurringDates(state)
    dispatch({ type: "GENERATE_DATES", payload: dates })
  }

  useEffect(() => {
    generateDates()
  }, [
    state.type,
    state.interval,
    state.startDate,
    state.endDate,
    state.selectedDays,
    state.monthlyPattern,
    state.monthlyDate,
    state.monthlyWeekNumber,
    state.monthlyWeekDay,
    state.yearlyPattern,
    state.yearlyMonth,
    state.yearlyDate,
    state.yearlyWeekNumber,
    state.yearlyWeekDay,
  ])

  useEffect(() => {
    onRecurrenceChange?.(state)
  }, [state, onRecurrenceChange])

  const contextValue: RecurrenceContextType = {
    ...state,
    updateRecurrence,
    generateDates,
  }

  return <RecurrenceContext.Provider value={contextValue}>{children}</RecurrenceContext.Provider>
}

export function useRecurrence() {
  const context = useContext(RecurrenceContext)
  if (!context) {
    throw new Error("useRecurrence must be used within a RecurrenceProvider")
  }
  return context
}
