"use client"

import { useState } from "react"
import { RecurringDatePicker } from "@/components/recurring-date-picker"
import { HomePage } from "@/components/home-page"

export default function Home() {
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleRecurrenceChange = (recurrence: any) => {
    console.log("Recurrence updated:", recurrence)
  }

  const handleStartClick = () => {
    setShowDatePicker(true)
  }

  const handleBackToHome = () => {
    setShowDatePicker(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        {!showDatePicker ? (
          <HomePage onStartClick={handleStartClick} />
        ) : (
          <div className="max-w-6xl mx-auto py-8">
            <button
              onClick={handleBackToHome}
              className="mb-6 text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-2 group"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
              <span>Back to Home</span>
            </button>
            <RecurringDatePicker onRecurrenceChange={handleRecurrenceChange} />
          </div>
        )}
      </div>
    </div>
  )
}
