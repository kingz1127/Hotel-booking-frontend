import { TbRulerMeasure } from "react-icons/tb"; 
import { FaBath } from "react-icons/fa"; 
import { FaBed } from "react-icons/fa"; 
import { Card } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

export default function RoomsSuites(){
    return<>
    <div className="flex flex-col items-center justify-center mt-10 mb-10">
        <p className="text-2xl text-[#c1bd3f]">Rooms & Suites</p>
        <p className="text-5xl mt-8 mb-8 font-serif">Luxury Rooms & Suites</p>

        <div>
          <Carousel className="w-full max-w-7xl  ">
  <CarouselContent className="-ml-4 gap-5 ">
    <CarouselItem className="pl-4 basis-1/5">
      <Card className="p-2 w-[16rem] h-88 ">
        <img src="src/Images/1 bed.jpg" alt="" className="w-60 h-48 rounded-tl-xl rounded-tr-xl" />
        <div className="bg-my-Bg h-8 w-28 flex items-center absolute p-2 top-46 text-white rounded-tl-[5px] rounded-tr-[5px] rounded-br-[5px] rounded-bl-0 ">
         Luxury Room
        </div>
        <div className="  -mt-6 p-1.5 rounded-bl-xl rounded-br-xl ">

          <div className="flex items-center gap-1 mt-3"><p className=" text-[#058505] text-2xl font-serif ">$150</p> <p className="text-gray-400">/night</p></div>

          <p className="font-serif h-9 mt-3.5" >Standard Rooms</p>
          <hr />
          <div className="flex justify-around items-center mt-3.5">
            <p className="flex gap-0.5 items-center justify-center text-[1rem]"><FaBed className="text-[#c1bd3f]" /> 1 Bed</p>
            <p className="flex  items-center justify-center"><FaBath className="text-[#c1bd3f]" /> 1 Bath</p>
            <p className="flex  items-center justify-center"><TbRulerMeasure className="text-[#c1bd3f]" /> 300 sqft</p>
          </div>
        </div>
      </Card>
    </CarouselItem>
    <CarouselItem className="pl-4 basis-1/5">
      <Card className="p-2 w-[16rem] h-88 ">
        <img src="src/Images/deluxe.jpg" alt="" className="w-60 h-48 rounded-tl-xl rounded-tr-xl" />
        <div className="bg-my-Bg h-8 w-28 flex items-center absolute p-2 top-46 text-white rounded-tl-[5px] rounded-tr-[5px] rounded-br-[5px] rounded-bl-0 ">
         Luxury Room
        </div>
        <div className="  -mt-6 p-1.5 rounded-bl-xl rounded-br-xl ">

          <div className="flex items-center gap-1 mt-3"><p className=" text-[#058505] text-2xl font-serif ">$250</p> <p className="text-gray-400">/night</p></div>

          <p className="font-serif h-9 mt-3.5" >Deluxe Rooms</p>
          <hr />
          <div className="flex justify-around items-center mt-3.5">
            <p className="flex gap-0.5 items-center justify-center text-[1rem]"><FaBed className="text-[#c1bd3f]" /> 1 Bed</p>
            <p className="flex  items-center justify-center"><FaBath className="text-[#c1bd3f]" /> 2 Baths</p>
            <p className="flex  items-center justify-center"><TbRulerMeasure className="text-[#c1bd3f]" /> 400 sqft</p>
          </div>
        </div>
      </Card>
    </CarouselItem>
    <CarouselItem className="pl-4 basis-1/5">
      <Card className="p-2 w-[16rem] h-88 ">
        <img src="src/Images/2 bed.jpg" alt="" className="w-60 h-48 rounded-tl-xl rounded-tr-xl" />
        <div className="bg-my-Bg h-8 w-28 flex items-center absolute p-2 top-46 text-white rounded-tl-[5px] rounded-tr-[5px] rounded-br-[5px] rounded-bl-0 ">
         Luxury Room
        </div>
        <div className="  -mt-6 p-1.5 rounded-bl-xl rounded-br-xl ">

          <div className="flex items-center gap-1 mt-3"><p className=" text-[#058505] text-2xl font-serif ">$350</p> <p className="text-gray-400">/night</p></div>

          <p className="font-serif h-9 mt-3.5" >Superior Rooms</p>
          <hr />
          <div className="flex justify-around items-center mt-3.5">
            <p className="flex gap-0.5 items-center justify-center text-[1rem]"><FaBed className="text-[#c1bd3f]" /> 2 Beds</p>
            <p className="flex  items-center justify-center"><FaBath className="text-[#c1bd3f]" /> 2 Baths</p>
            <p className="flex  items-center justify-center"><TbRulerMeasure className="text-[#c1bd3f]" /> 600 sqft</p>
          </div>
        </div>
      </Card>
    </CarouselItem>
    <CarouselItem className="pl-4 basis-1/5">
      <Card className="p-2 w-[16rem] h-88 ">
        <img src="src/Images/junior.jpg" alt="" className="w-60 h-48 rounded-tl-xl rounded-tr-xl" />
        <div className="bg-my-Bg h-8 w-28 flex items-center absolute p-2 top-46 text-white rounded-tl-[5px] rounded-tr-[5px] rounded-br-[5px] rounded-bl-0 ">
         Luxury Suite
        </div>
        <div className="  -mt-6 p-1.5 rounded-bl-xl rounded-br-xl ">

          <div className="flex items-center gap-1 mt-3"><p className=" text-[#058505] text-2xl font-serif ">$450</p> <p className="text-gray-400">/night</p></div>

          <p className="font-serif h-9 mt-3.5" >Junior Suite</p>
          <hr />
          <div className="flex justify-around items-center mt-3.5">
            <p className="flex gap-0.5 items-center justify-center text-[1rem]"><FaBed className="text-[#c1bd3f]" /> 1 Bed</p>
            <p className="flex  items-center justify-center"><FaBath className="text-[#c1bd3f]" /> 1 Bath</p>
            <p className="flex  items-center justify-center"><TbRulerMeasure className="text-[#c1bd3f]" /> 400 sqft</p>
          </div>
        </div>
      </Card>
    </CarouselItem>
    <CarouselItem className="pl-4 basis-1/5">
      <Card className="p-2 w-[16rem] h-88 ">
        <img src="src/Images/executive.jpg" alt="" className="w-60 h-48 rounded-tl-xl rounded-tr-xl" />
        <div className="bg-my-Bg h-8 w-28 flex items-center absolute p-2 top-46 text-white rounded-tl-[5px] rounded-tr-[5px] rounded-br-[5px] rounded-bl-0 ">
        Luxury Suite
        </div>
        <div className="  -mt-6 p-1.5 rounded-bl-xl rounded-br-xl ">

          <div className="flex items-center gap-1 mt-3"><p className=" text-[#058505] text-2xl font-serif ">$1800</p> <p className="text-gray-400">/night</p></div>

          <p className="font-serif h-9 mt-3.5" >Executive Suite</p>
          <hr />
          <div className="flex justify-around items-center mt-3.5">
            <p className="flex gap-0.5 items-center justify-center text-[1rem]"><FaBed className="text-[#c1bd3f]" /> 2 Beds</p>
            <p className="flex  items-center justify-center"><FaBath className="text-[#c1bd3f]" /> 2 Baths</p>
            <p className="flex  items-center justify-center"><TbRulerMeasure className="text-[#c1bd3f]" /> 1000 sqft</p>
          </div>
        </div>
      </Card>
    </CarouselItem>
    <CarouselItem className="pl-4 basis-1/5">
      <Card className="p-2 w-[16rem] h-88 ">
        <img src="src/Images/presidential.jpg" alt="" className="w-60 h-48 rounded-tl-xl rounded-tr-xl" />
        <div className="bg-my-Bg h-8 w-28 flex items-center absolute p-2 top-46 text-white rounded-tl-[5px] rounded-tr-[5px] rounded-br-[5px] rounded-bl-0 ">
         Luxury Suite
        </div>
        <div className="  -mt-6 p-1.5 rounded-bl-xl rounded-br-xl ">

          <div className="flex items-center gap-1 mt-3"><p className=" text-[#058505] text-2xl font-serif ">$4000</p> <p className="text-gray-400">/night</p></div>

          <p className="font-serif h-9 mt-3.5" >Presidential Suite</p>
          <hr />
          <div className="flex justify-around items-center mt-3.5">
            <p className="flex gap-0.5 items-center justify-center text-[1rem]"><FaBed className="text-[#c1bd3f]" /> 1 Bed</p>
            <p className="flex  items-center justify-center"><FaBath className="text-[#c1bd3f]" /> 1 Bath</p>
            <p className="flex  items-center justify-center"><TbRulerMeasure className="text-[#c1bd3f]" /> 300 sqft</p>
          </div>
        </div>
      </Card>
    </CarouselItem>
    <CarouselItem className="pl-4 basis-1/5">
      <Card className="p-2 w-[16rem] h-88 ">
        <img src="src/Images/Screenshot (14).png" alt="" className="w-60 h-48 rounded-tl-xl rounded-tr-xl" />
        <div className="bg-my-Bg h-8 w-28 flex items-center absolute p-2 top-46 text-white rounded-tl-[5px] rounded-tr-[5px] rounded-br-[5px] rounded-bl-0 ">
         Luxury Room
        </div>
        <div className="  -mt-6 p-1.5 rounded-bl-xl rounded-br-xl ">

          <div className="flex items-center gap-1 mt-3"><p className=" text-[#058505] text-2xl font-serif ">$150</p> <p className="text-gray-400">/night</p></div>

          <p className="font-serif h-9 mt-3.5" >Standard Rooms</p>
          <hr />
          <div className="flex justify-around items-center mt-3.5">
            <p className="flex gap-0.5 items-center justify-center text-[1rem]"><FaBed className="text-[#c1bd3f]" /> 1 Bed</p>
            <p className="flex  items-center justify-center"><FaBath className="text-[#c1bd3f]" /> 1 Bath</p>
            <p className="flex  items-center justify-center"><TbRulerMeasure className="text-[#c1bd3f]" /> 300 sqft</p>
          </div>
        </div>
      </Card>
    </CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>

        </div> 
    </div>
    </>
}