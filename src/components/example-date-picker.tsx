"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function DualDatePicker() {
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()

  // Function to get minimum date for end date picker
  const getEndDateMinDate = () => {
    if (startDate) {
      // Add one day to start date to prevent same day selection
      const nextDay = new Date(startDate)
      nextDay.setDate(nextDay.getDate() + 1)
      return nextDay
    }
    // If no start date selected, minimum is tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  }

  // Function to disable past dates
  const disablePastDates = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Function to disable dates before start date for end picker
  const disableDatesBeforeStart = (date: Date) => {
    if (!startDate) {
      return disablePastDates(date)
    }
    const minDate = getEndDateMinDate()
    return date < minDate
  }

  // Handle start date selection
  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date)
    // If end date is before the new start date, reset it
    if (date && endDate && endDate <= date) {
      setEndDate(undefined)
    }
  }

  // Handle end date selection
  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date)
  }

  // Clear both dates
  const clearDates = () => {
    setStartDate(undefined)
    setEndDate(undefined)
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <label className="text-sm font-medium">Start Date</label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[280px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick a start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateSelect}
                disabled={disablePastDates}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <div className="text-sm text-muted-foreground">
            {startDate ? (
              <span className="text-green-600 font-medium">
                ✓ Start date selected
              </span>
            ) : (
              "Select a date (past dates disabled)"
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">End Date</label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={!startDate}
                className={cn(
                  "w-full sm:w-[280px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground",
                  !startDate && "opacity-50 cursor-not-allowed"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? (
                  format(endDate, "PPP")
                ) : startDate ? (
                  "Pick an end date"
                ) : (
                  "Select start date first"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateSelect}
                disabled={disableDatesBeforeStart}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <div className="text-sm text-muted-foreground">
            {endDate ? (
              <span className="text-green-600 font-medium">
                ✓ End date selected
              </span>
            ) : startDate ? (
              <span>
                Must be after {format(getEndDateMinDate(), "MMM do")}
              </span>
            ) : (
              "Select start date first"
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          onClick={clearDates}
          className="flex-1"
        >
          Clear Dates
        </Button>
        <Button
          variant="default"
          disabled={!startDate || !endDate}
          className="flex-1"
          onClick={() => {
            if (startDate && endDate) {
              alert(`Selected range: ${format(startDate, "PP")} - ${format(endDate, "PP")}`)
            }
          }}
        >
          Confirm Selection
        </Button>
      </div>

      {/* Info panel */}
      {(startDate || endDate) && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-800 mb-1">Date Range Rules:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Past dates cannot be selected</li>
            <li>• End date must be after start date</li>
            <li>• Start date must be selected first</li>
            {startDate && endDate && (
              <li className="font-medium mt-2">
                Selected range: {format(startDate, "PP")} to {format(endDate, "PP")}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export function StartDatePicker({
  date,
  setDate,
}: {
  date?: Date
  setDate: (date?: Date) => void
}) {
  const disablePastDates = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : "Pick a start date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disablePastDates}
        />
      </PopoverContent>
    </Popover>
  )
}

export function EndDatePicker({
  startDate,
  date,
  setDate,
}: {
  startDate?: Date
  date?: Date
  setDate: (date?: Date) => void
}) {
  const disableDates = (d: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (d < today) return true

    if (startDate) {
      const minDate = new Date(startDate)
      minDate.setDate(minDate.getDate() + 1)
      return d < minDate   // ✅ IMPORTANT
    }

    return false
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={!startDate}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            !startDate && "opacity-50 cursor-not-allowed"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : "Pick an end date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disableDates}
        />
      </PopoverContent>
    </Popover>
  )
}

// Simple single date picker that disables past dates (your original but enhanced)
export function DatePickerDemoEnhanced() {
  const [date, setDate] = React.useState<Date>()

  const disablePastDates = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Select Date (Past dates disabled)</div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={disablePastDates}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <div className="text-xs text-muted-foreground">
        {date ? (
          <span className="text-green-600">✓ Selected: {format(date, "PPP")}</span>
        ) : (
          "Past dates are disabled"
        )}
      </div>
    </div>
  )
}