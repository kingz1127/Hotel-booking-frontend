

import { CgGym } from "react-icons/cg"; 
import { AiFillCar } from "react-icons/ai"; 
import { SlPeople } from "react-icons/sl"; 
import { AiOutlineWifi } from "react-icons/ai"; 
import { FaSwimmingPool } from "react-icons/fa"; 
import { BiRestaurant } from "react-icons/bi"; 

export default function HotelFacilities() {
  return (
    <>
      <div className="flex items-center justify-center flex-col mt-6 sm:mt-8 md:mt-10 mb-6 sm:mb-8 md:mb-10 px-4">
        <p className="text-lg sm:text-xl md:text-2xl text-[#c1bd3f] text-center">Hotel Facilities</p>
        <p className="text-3xl sm:text-4xl md:text-5xl font-serif text-center mt-2 sm:mt-4 md:mt-6 mb-4 sm:mb-6 md:mb-8">
          Relax with Premium Facilities
        </p>

        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-4 sm:gap-5 md:gap-6 
          w-full 
          max-w-7xl
          p-2 sm:p-4
        ">
  
          {/* Item 1 - Breakfast Included */}
          <div className="
            relative 
            z-40 
            transition-all 
            duration-300 
            overflow-hidden 
            rounded-lg 
            hover:bg-my-Bg/55
            group
          ">
            <img 
              src="src/Images/breakfast.jpg" 
              alt="Breakfast Included" 
              className="opacity-20 w-full h-56 sm:h-60 md:h-64 object-cover" 
            />
            <div className="absolute inset-0 flex justify-center flex-col p-4 sm:p-6 md:p-8 gap-2 sm:gap-3">
              <div className="bg-[#c1bd3f] w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-[5px] flex items-center justify-center">
                <BiRestaurant className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-xl md:text-2xl text-[#4f4e4e] font-medium">Breakfast Included</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Nostrud ullamco pariatur elit excepteur ullamco aute enim aliquip magna tempor officia.
              </p>
            </div>
          </div>

          {/* Item 2 - Swimming Pool */}
          <div className="
            relative 
            z-40 
            transition-all 
            duration-300 
            overflow-hidden 
            rounded-lg 
            hover:bg-my-Bg/55
            group
          ">
            <img 
              src="src/Images/swimming.jpg" 
              alt="Swimming Pool" 
              className="opacity-20 w-full h-56 sm:h-60 md:h-64 object-cover" 
            />
            <div className="absolute inset-0 flex justify-center flex-col p-4 sm:p-6 md:p-8 gap-2 sm:gap-3">
              <div className="bg-[#c1bd3f] w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-[5px] flex items-center justify-center">
                <FaSwimmingPool className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-xl md:text-2xl text-[#4f4e4e] font-medium">Swimming Pool</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Nostrud ullamco pariatur elit excepteur ullamco aute enim aliquip magna tempor officia.
              </p>
            </div>
          </div>

          {/* Item 3 - High Speed Wifi */}
          <div className="
            relative 
            z-40 
            transition-all 
            duration-300 
            overflow-hidden 
            rounded-lg 
            hover:bg-my-Bg/55
            group
          ">
            <img 
              src="src/Images/wifi.jpg" 
              alt="High Speed Wifi" 
              className="opacity-20 w-full h-56 sm:h-60 md:h-64 object-cover" 
            />
            <div className="absolute inset-0 flex justify-center flex-col p-4 sm:p-6 md:p-8 gap-2 sm:gap-3">
              <div className="bg-[#c1bd3f] w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-[5px] flex items-center justify-center">
                <AiOutlineWifi className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-xl md:text-2xl text-[#4f4e4e] font-medium">High Speed Wifi</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Nostrud ullamco pariatur elit excepteur ullamco aute enim aliquip magna tempor officia.
              </p>
            </div>
          </div>

          {/* Item 4 - Spa & Wellness */}
          <div className="
            relative 
            z-40 
            transition-all 
            duration-300 
            overflow-hidden 
            rounded-lg 
            hover:bg-my-Bg/55
            group
          ">
            <img 
              src="src/Images/spa.jpg"  
              alt="Spa & Wellness" 
              className="opacity-20 w-full h-56 sm:h-60 md:h-64 object-cover" 
            />
            <div className="absolute inset-0 flex justify-center flex-col p-4 sm:p-6 md:p-8 gap-2 sm:gap-3">
              <div className="bg-[#c1bd3f] w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-[5px] flex items-center justify-center">
                <SlPeople className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-xl md:text-2xl text-[#4f4e4e] font-medium">Spa & Wellness</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Nostrud ullamco pariatur elit excepteur ullamco aute enim aliquip magna tempor officia.
              </p>
            </div>
          </div>

          {/* Item 5 - Pick Up & Drop */}
          <div className="
            relative 
            z-40 
            transition-all 
            duration-300 
            overflow-hidden 
            rounded-lg 
            hover:bg-my-Bg/55
            group
          ">
            <img 
              src="src/Images/pick.jpg" 
              alt="Pick Up & Drop" 
              className="opacity-20 w-full h-56 sm:h-60 md:h-64 object-cover" 
            />
            <div className="absolute inset-0 flex justify-center flex-col p-4 sm:p-6 md:p-8 gap-2 sm:gap-3">
              <div className="bg-[#c1bd3f] w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-[5px] flex items-center justify-center">
                <AiFillCar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-xl md:text-2xl text-[#4f4e4e] font-medium">Pick Up & Drop</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Nostrud ullamco pariatur elit excepteur ullamco aute enim aliquip magna tempor officia.
              </p>
            </div>
          </div>

          {/* Item 6 - Fitness & Hub */}
          <div className="
            relative 
            z-40 
            transition-all 
            duration-300 
            overflow-hidden 
            rounded-lg 
            hover:bg-my-Bg/55
            group
          ">
            <img 
              src="src/Images/fitness.jpg" 
              alt="Fitness & Hub" 
              className="opacity-20 w-full h-56 sm:h-60 md:h-64 object-cover" 
            />
            <div className="absolute inset-0 flex justify-center flex-col p-4 sm:p-6 md:p-8 gap-2 sm:gap-3">
              <div className="bg-[#c1bd3f] w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-[5px] flex items-center justify-center">
                <CgGym className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-xl md:text-2xl text-[#4f4e4e] font-medium">Fitness & Hub</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Nostrud ullamco pariatur elit excepteur ullamco aute enim aliquip magna tempor officia.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}