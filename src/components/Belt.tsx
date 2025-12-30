

import { BsStars } from "react-icons/bs"; 

export default function Belt() {
  return (
    <>
      <div className="
        bg-my-Bg 
        text-white 
        p-3 sm:p-4 md:p-2
        
        /* Mobile: Stack vertically */
        flex flex-col sm:flex-row
        items-center 
        justify-center sm:justify-evenly
        
        /* Text sizing */
        text-sm sm:text-base md:text-lg lg:text-[1.8rem]
        
        /* Gaps */
        gap-3 sm:gap-4 md:gap-2
      ">
        <p className="text-center">Breakfast Included</p>
        <BsStars className="text-[#c1bd3f] text-lg sm:text-xl md:text-2xl hidden sm:block" />
        
        <p className="text-center">Swimming Pool</p>
        <BsStars className="text-[#c1bd3f] text-lg sm:text-xl md:text-2xl hidden sm:block" />
        
        <p className="text-center">High Speed Wifi</p>
        <BsStars className="text-[#c1bd3f] text-lg sm:text-xl md:text-2xl hidden sm:block" />
        
        <p className="text-center">Spa & Wellness</p>
      </div>
    </>
  );
}