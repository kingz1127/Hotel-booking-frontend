

import BookingSelectors from "./ui/BookingSelectors";
import { EndDatePicker, StartDatePicker } from "./example-date-picker";
import { LiquidButton } from "./ui/liquid";
import { useState } from "react";

export default function CheckIns() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  return (
    <>
      <div className="
        /* Base/Mobile styles (default - up to 639px) */
        
         
        flex flex-col items-center justify-center
        bg-[#e8e1e1]
        rounded-xl sm:rounded-2xl
        w-[90vw] max-w-[320px] sm:w-auto
        h-auto
        gap-3 sm:gap-4
        p-4 sm:p-6
        pt-8 sm:pt-10
        pb-10 sm:pb-12
        shadow-lg
        m-auto
        
        /* Small screens (640px - 767px) */
        sm:flex-row
        sm:flex-wrap
        sm:justify-between
        sm:w-[95vw]
        sm:max-w-[600px]
        sm:pb-24
        
        
        
        /* Medium screens (768px - 1023px) */
        md:w-[85vw]
        md:max-w-[750px]
        md:gap-4
        md:p-6
        md:pt-10
        md:pb-12
        
       
        
        /* Large screens (1024px - 1279px) */
        lg:flex
         lg:flex-row
        lg:items-center
        lg:justify-between
        lg:gap-8
        
        lg:m-auto
        
        
        lg:h-25
        lg:p-4
        lg:pr-12
       
        
        
        /* Extra large screens (1280px - 1535px) */
        xl:max-w-[1200px]
        xl:gap-6
        
        
        /* 2XL screens (1536px and above) */
        2xl:max-w-[1500px]
        2xl:gap-10
      ">
        
        {/* Check In Section */}
        <div className="
          /* Mobile: Full width, stacked */
          flex flex-col justify-center
          gap-y-1 sm:gap-y-2
          w-full sm:w-auto
          
          /* Small+: Fixed width */
          sm:w-[45%] sm:mb-2
          
          /* Medium+: Adjust width */
          md:w-[40%]
          
          /* Large+: Compact horizontal layout */
          lg:w-auto lg:flex-1 lg:max-w-[180px]
          
          /* Extra large+: More width */
          xl:max-w-[200px]
        ">
          <div className="
            text-xs sm:text-sm md:text-base
            font-medium text-gray-700
            mb-1
          ">
            <p>Check In</p>
          </div>

          <div className="
            w-full
            /* Adjust DatePicker size for different screens */
            [&>div]:text-sm sm:[&>div]:text-base
            [&>div>button]:h-8 sm:[&>div>button]:h-10
            [&>div>button]:text-xs sm:[&>div>button]:text-sm
          ">
            <StartDatePicker
              date={startDate}
              setDate={(d) => {
                setStartDate(d);
                if (d && endDate && endDate <= d) {
                  setEndDate(undefined);
                }
              }}
            />
          </div>
        </div>

        {/* Check Out Section */}
        <div className="
          /* Mobile: Full width, stacked */
          flex flex-col justify-center
          gap-y-1 sm:gap-y-2
          w-full sm:w-auto
          
          /* Small+: Fixed width */
          sm:w-[45%] sm:mb-2
          
          /* Medium+: Adjust width */
          md:w-[40%]
          
          /* Large+: Compact horizontal layout */
          lg:w-auto lg:flex-1 lg:max-w-[180px]
          
          /* Extra large+: More width */
          xl:max-w-[200px]
        ">
          <div className="
            text-xs sm:text-sm md:text-base
            font-medium text-gray-700
            mb-1
          ">
            <p>Check Out</p>
          </div>

          <div className="
            w-full
            /* Adjust DatePicker size for different screens */
            [&>div]:text-sm sm:[&>div]:text-base
            [&>div>button]:h-8 sm:[&>div>button]:h-10
            [&>div>button]:text-xs sm:[&>div>button]:text-sm
          ">
            <EndDatePicker
              startDate={startDate}
              date={endDate}
              setDate={setEndDate}
            />
          </div>
        </div>

        {/* Booking Selectors Section */}
        <div className="
          /* Mobile: Full width, stacked */
          flex flex-col justify-center
          gap-y-1 sm:gap-y-2
          w-full sm:w-auto
          
          /* Small+: Full width on second row */
          sm:w-full sm:text-center
          sm:order-last
          
          /* Medium+: Half width */
          md:w-[50%]
          
          /* Large+: Compact horizontal layout */
          lg:w-auto lg:flex-1 lg:max-w-[220px]
          lg:order-none
          
          /* Extra large+: More width */
          xl:max-w-[250px]
        ">
          {/* <div className="
            text-xs sm:text-sm md:text-base
            font-medium text-gray-700
            mb-1
            hidden sm:block
          ">
            <p>Guests & Rooms</p>
          </div> */}
          <div className="
            text-xs sm:text-sm md:text-base
            font-medium text-gray-700
            mb-1
            sm:hidden
          ">
            <p>Booking Details</p>
          </div>

          <div className="
            w-full
            /* Adjust BookingSelectors for different screens */
            [&>div>button]:h-8 sm:[&>div>button]:h-10
            [&>div>button]:text-xs sm:[&>div>button]:text-sm
          ">
            <BookingSelectors />
          </div>
        </div>

        {/* Check Availability Button */}
        <div className="
          /* Mobile: Full width, centered */
          flex flex-col justify-center
          gap-y-1 sm:gap-y-2
          w-full sm:w-auto
          mt-2 sm:mt-0
          
          /* Small+: Full width on second row */
          sm:w-full sm:text-center
          sm:order-last
          
          /* Medium+: Half width */
          md:w-[50%]
          
          /* Large+: Auto width, horizontal layout */
          lg:w-auto lg:flex-1 lg:max-w-[200px]
          lg:order-none
          
          /* Extra large+: More width */
          xl:max-w-[220px]
        ">
          <div className="
            /* Adjust LiquidButton for different screens */
            [&>button]:w-full
            [&>button]:h-10 sm:[&>button]:h-12
            [&>button]:text-sm sm:[&>button]:text-base
            [&>button]:rounded-lg sm:[&>button]:rounded-xl
            
            /* Mobile: Smaller button */
            [&>button]:text-xs
            [&>button]:h-9
            
            /* Small+: Medium button */
            sm:[&>button]:h-10
            sm:[&>button]:text-sm
            
            /* Large+: Regular button */
            lg:[&>button]:h-12
            lg:[&>button]:w-39
            lg:[&>button]:ml-24
            lg:[&>button]:text-base
          ">
            <LiquidButton>Check Availability</LiquidButton>
          </div>
        </div>
      </div>
    </>
  );
}