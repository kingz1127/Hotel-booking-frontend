
import BookingSelectors from "./ui/BookingSelectors";
import { EndDatePicker, StartDatePicker } from "./example-date-picker";
import { LiquidButton } from "./ui/liquid";
import { useState } from "react";
export default function CheckIns() {

const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  
  return (
    <>
    <div className="absolute
  left-1/2
  -translate-x-1/2
  -mt-6
  flex items-center justify-center
  bg-[#e8e1e1]
  rounded-2xl
  h-20
  gap-4
  p-6
  pt-10
  pb-12
  
   ">
        
      <div className="flex flex-col justify-center gap-y-2  ">
        <div>
            <p>Check In</p>
        </div>

        <div >
            <StartDatePicker
          date={startDate}
          setDate={(d) => {
            setStartDate(d)
            if (d && endDate && endDate <= d) {
              setEndDate(undefined)
            }
          }}
        />
        </div>

      </div>

      <div className="flex flex-col justify-center gap-y-2  ">
        <div>
            <p>Check Out</p>
        </div>

        <div>
            <EndDatePicker
          startDate={startDate}
          date={endDate}
          setDate={setEndDate}
        />
        </div>
         </div>


     <div className="flex flex-col justify-center gap-y-2  ">
        <div>
            <BookingSelectors />
        </div>
     </div>

      <div className="flex flex-col justify-center gap-y-2  ">
        <div><LiquidButton>Check Availability</LiquidButton></div>
      </div>
      


      </div>
    </>
  );
}
