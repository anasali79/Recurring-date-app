"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock, Repeat, Sparkles, ArrowRight, CheckCircle } from "lucide-react"

interface HomePageProps {
  onStartClick: () => void
}

export function HomePage({ onStartClick }: HomePageProps) {
  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Recurring Patterns",
      description: "Daily, weekly, monthly, or yearly - create any pattern you need",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Instant Calendar Sync",
      description: "One-click sync with Google Calendar - no complex setup required",
    },
    {
      icon: <Repeat className="w-6 h-6" />,
      title: "Flexible Customization",
      description: "Custom intervals, specific days, and advanced patterns",
    },
  ]

  const benefits = [
    "No signup required - start immediately",
    "Works with any calendar app",
    "Preview dates before syncing",
    "Mobile-friendly interface",
  ]

  return (
    <div className="min-h-screen flex flex-col justify-center py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fade-in-up">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-bounce-subtle">
          <Sparkles className="w-4 h-4" />
          <span>Free & Easy to Use</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-up animation-delay-200">
          Recurring Date
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
            {" "}
            Picker
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-400">
          Create perfect recurring schedules in seconds. A powerful date picker - configure daily,
          weekly, monthly, or yearly patterns with advanced customization options.
        </p>

        <Button
          onClick={onStartClick}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-600 group"
        >
          <Calendar className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
          Start Creating Dates
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in-up animation-delay-800">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
          >
            <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in-up animation-delay-1000">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Why Choose Our Date Picker?</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 group hover:bg-green-50 p-3 rounded-lg transition-colors duration-200"
            >
              <CheckCircle className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
