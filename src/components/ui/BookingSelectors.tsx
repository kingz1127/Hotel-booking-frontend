
"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function BookingSelectors() {
  const [rooms, setRooms] = React.useState(1)

  return (
    <div className="
      /* Mobile: Full width column */
      flex flex-col
      gap-4
      w-full
      
      /* Tablet: Horizontal with smaller gap */
      sm:flex-row sm:gap-4
      
      /* Desktop: Larger gap */
      md:gap-6
    ">
      {/* Rooms Selector */}
      <div className="
        w-full
        sm:w-1/2
        md:w-auto
      ">
        <label className="
          block
          text-xs sm:text-sm
          font-medium
          text-gray-700
          mb-1 sm:mb-2
        ">
          <span className="hidden sm:inline">Rooms</span>
          <span className="sm:hidden">Select Rooms</span>
        </label>
        <RoomsSelect rooms={rooms} setRooms={setRooms} />
      </div>

      {/* Guests Selector */}
      <div className="
        w-full
        sm:w-1/2
        md:w-auto
      ">
        <label className="
          block
          text-xs sm:text-sm
          font-medium
          text-gray-700
          mb-1 sm:mb-2
        ">
          <span className="hidden sm:inline">Guests</span>
          <span className="sm:hidden">Select Guests</span>
        </label>
        <GuestsSelect rooms={rooms} />
      </div>
    </div>
  )
}

function RoomsSelect({
  rooms,
  setRooms,
}: {
  rooms: number
  setRooms: React.Dispatch<React.SetStateAction<number>>
}) {
  return (
    <Select value={String(rooms)} onValueChange={(v) => setRooms(Number(v))}>
      <SelectTrigger className="
        /* Mobile: Full width, smaller height */
        w-full
        h-10
        text-sm
        
        /* Tablet+: Fixed width */
        sm:w-[140px]
        sm:h-11
        
        /* Desktop: Larger */
        md:w-[160px]
        lg:w-[180px]
        lg:h-12
        lg:text-base
      ">
        <SelectValue>
          <span className="truncate">
            {rooms} Room{rooms > 1 ? "s" : ""}
          </span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent 
        side="bottom"
        align="start"
        className="
          w-[var(--radix-select-trigger-width)]
          max-h-[60vh]
          sm:max-h-[400px]
        "
      >
        <SelectGroup>
          <SelectLabel className="
            px-3 py-2
            text-xs sm:text-sm
            text-gray-500
          ">
            Number of Rooms
          </SelectLabel>
          {[1, 2, 3].map((num) => (
            <SelectItem
              key={num}
              value={String(num)}
              className="
                text-sm sm:text-base
                py-3
                data-[state=checked]:bg-blue-50
                data-[state=checked]:text-blue-700
              "
            >
              <div className="flex items-center justify-between">
                <span>
                  {num.toString().padStart(2, '0')} Room{num > 1 ? 's' : ''}
                </span>
                {num === rooms && (
                  <span className="text-xs text-blue-600 ml-2">✓</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function GuestsSelect({ rooms }: { rooms: number }) {
  const [adults, setAdults] = React.useState(1)
  const [children, setChildren] = React.useState(0)

  const maxAdults = rooms * 2
  const maxChildren = rooms * 1

  React.useEffect(() => {
    if (adults > maxAdults) setAdults(maxAdults)
    if (children > maxChildren) setChildren(maxChildren)
  }, [rooms, maxAdults, maxChildren])

  const value = `${adults}-${children}`

  // Generate guest options
  const guestOptions = React.useMemo(() => {
    const options = []
    for (let a = 1; a <= maxAdults; a++) {
      for (let c = 0; c <= maxChildren; c++) {
        options.push({
          adults: a,
          children: c,
          value: `${a}-${c}`,
          label: `${a} Adult${a > 1 ? 's' : ''}, ${c} Child${c !== 1 ? 'ren' : ''}`
        })
      }
    }
    return options
  }, [maxAdults, maxChildren])

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        const [a, c] = v.split("-").map(Number)
        setAdults(a)
        setChildren(c)
      }}
    >
      <SelectTrigger className="
        /* Mobile: Full width, smaller height */
        w-full
        h-10
        text-sm
        
        /* Tablet+: Fixed width */
        sm:w-[180px]
        sm:h-11
        
        /* Desktop: Larger */
        md:w-[200px]
        lg:w-[220px]
        lg:h-12
        lg:text-base
      ">
        <SelectValue>
          <span className="truncate">
            {adults} Adult{adults > 1 ? 's' : ''}, {children} Child{children !== 1 ? 'ren' : ''}
          </span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent 
        side="bottom"
        align="start"
        className="
          w-[var(--radix-select-trigger-width)]
          max-h-[60vh]
          overflow-y-auto
        "
      >
        <SelectGroup>
          <SelectLabel className="
            px-3 py-2
            text-xs sm:text-sm
            text-gray-500
            sticky top-0
            bg-white
            border-b
          ">
            Guest Configuration
            <div className="text-xs text-gray-400 mt-1">
              Max: {maxAdults} adults, {maxChildren} children
            </div>
          </SelectLabel>
          
          {guestOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="
                text-sm sm:text-base
                py-3
                data-[state=checked]:bg-blue-50
                data-[state=checked]:text-blue-700
              "
            >
              <div className="flex items-center justify-between">
                <span>{option.label}</span>
                {option.value === value && (
                  <span className="text-xs text-blue-600 ml-2">✓</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}