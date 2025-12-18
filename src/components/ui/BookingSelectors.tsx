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
    <div className="flex gap-6">
      <div>
        <div>Rooms</div>
        <RoomsSelect rooms={rooms} setRooms={setRooms} />
      </div>

      <div>
        <div>Guests</div>
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
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Rooms</SelectLabel>
          <SelectItem value="1">01 Room</SelectItem>
          <SelectItem value="2">02 Rooms</SelectItem>
          <SelectItem value="3">03 Rooms</SelectItem>
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
  }, [rooms])

  const value = `${adults}-${children}`

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        const [a, c] = v.split("-").map(Number)
        setAdults(a)
        setChildren(c)
      }}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue
          placeholder={`${adults} Adult${adults > 1 ? "s" : ""}, ${children} Child`}
        />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Guests</SelectLabel>

          {Array.from({ length: maxAdults }, (_, a) =>
            Array.from({ length: maxChildren + 1 }, (_, c) => (
              <SelectItem
                key={`${a + 1}-${c}`}
                value={`${a + 1}-${c}`}
              >
                {a + 1} Adult{a > 0 && "s"}, {c} Child
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
