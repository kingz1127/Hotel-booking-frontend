import { CgGym } from "react-icons/cg"; 
import { AiFillCar } from "react-icons/ai"; 
import { SlPeople } from "react-icons/sl"; 
import { AiOutlineWifi } from "react-icons/ai"; 
import { FaSwimmingPool } from "react-icons/fa"; 
import { BiRestaurant } from "react-icons/bi"; 

 

export default function HotelFacilities() {
  return (
    <>
      <div className="flex items-center justify-center flex-col mt-10 mb-10">
        <p className="text-2xl text-[#c1bd3f]">Hotel Facilities</p>
        <p className="text-5xl font-serif"> Relax with Premium Facilities</p>

       
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
  
  {/* Item 1 */}
  <div className="relative z-40 transition-all duration-300 overflow-hidden rounded-lg  hover:bg-my-Bg/55 ">
    <img 
      src="src/Images/breakfast.jpg" 
      alt="Item 1 description" 
      className="opacity-20 w-full h-64 object-cover" 
    />
    <div className="absolute inset-0 flex justify-center flex-col p-8 gap-3">

        <p className="bg-[#c1bd3f] w-12 h-12 rounded-[5px]"><BiRestaurant className="w-12 h-12 text-white  " /></p>

        
      <h2 className="text-2xl  text-[#4f4e4e]">Breakfast Included</h2>
      <p>Nostrud ullamco pariatur elit excepteur <br /> ullamco aute enim aliquip magna tempor officia.</p>
    </div>
  </div>

  {/* Item 2 */}
  <div className="relative z-40 transition-all duration-300 overflow-hidden rounded-lg hover:bg-my-Bg/55">
    <img 
      src="src/Images/swimming.jpg" 
      alt="Item 2 description" 
      className="opacity-20 w-full h-64 object-cover" 
    />
    <div className="absolute inset-0 flex justify-center flex-col p-8 gap-3">

        <p className="bg-[#c1bd3f] w-12 h-12 rounded-[5px]"><FaSwimmingPool className="w-12 h-12 text-white  "/></p>

        
      <h2 className="text-2xl  text-[#4f4e4e]">Swimming Pool</h2>
      <p>Nostrud ullamco pariatur elit excepteur <br /> ullamco aute enim aliquip magna tempor officia.</p>
    </div>
  </div>

  {/* Item 3 */}
  <div className="relative z-40 transition-all duration-300 overflow-hidden rounded-lg hover:bg-my-Bg/55">
    <img 
      src="src/Images/wifi.jpg" 
      alt="Item 3 description" 
      className="opacity-20 w-full h-64 object-cover" 
    />
    <div className="absolute inset-0 flex justify-center flex-col p-8 gap-3">

        <p className="bg-[#c1bd3f] w-12 h-12 rounded-[5px]"><AiOutlineWifi className="w-12 h-12 text-white  " /></p>

        
      <h2 className="text-2xl  text-[#4f4e4e]">High Speed Wifi</h2>
      <p>Nostrud ullamco pariatur elit excepteur <br /> ullamco aute enim aliquip magna tempor officia.</p>
    </div>
  </div>

  {/* Item 4 */}
  <div className="relative z-40 transition-all duration-300 overflow-hidden rounded-lg hover:bg-my-Bg/55">
    <img 
      src="src/Images/spa.jpg"  
      alt="Item 4 description" 
      className="opacity-20 w-full h-64 object-cover" 
    />
    <div className="absolute inset-0 flex justify-center flex-col p-8 gap-3">

        <p className="bg-[#c1bd3f] w-12 h-12 rounded-[5px]"><SlPeople className="w-12 h-12 text-white  " /></p>

        
      <h2 className="text-2xl  text-[#4f4e4e]">Spa & Wellness</h2>
      <p>Nostrud ullamco pariatur elit excepteur <br /> ullamco aute enim aliquip magna tempor officia.</p>
    </div>
  </div>

  {/* Item 5 */}
  <div className="relative z-40 transition-all duration-300 overflow-hidden rounded-lg hover:bg-my-Bg/55">
    <img 
      src="src/Images/pick.jpg" 
      alt="Item 5 description" 
      className="opacity-20 w-full h-64 object-cover" 
    />
    <div className="absolute inset-0 flex justify-center flex-col p-8 gap-3">

        <p className="bg-[#c1bd3f] w-12 h-12 rounded-[5px]"><AiFillCar className="w-12 h-12 text-white  "/></p>

        
      <h2 className="text-2xl  text-[#4f4e4e]">Pick Up & Drop</h2>
      <p>Nostrud ullamco pariatur elit excepteur <br /> ullamco aute enim aliquip magna tempor officia.</p>
    </div>
  </div>

  {/* Item 6 */}
  <div className="relative z-40 transition-all duration-300 overflow-hidden rounded-lg hover:bg-my-Bg/55">
    <img 
      src="src/Images/fitness.jpg" 
      alt="Item 6 description" 
      className="opacity-20 w-full h-64 object-cover" 
    />
     <div className="absolute inset-0 flex justify-center flex-col p-8 gap-3">

        <p className="bg-[#c1bd3f] w-12 h-12 rounded-[5px]"><CgGym  className="w-12 h-12 text-white  "/></p>

        
      <h2 className="text-2xl  text-[#4f4e4e]">Fitness & Hub</h2>
      <p>Nostrud ullamco pariatur elit excepteur <br /> ullamco aute enim aliquip magna tempor officia.</p>
    </div>
  </div>

</div>

      </div>
    </>
  );
}
