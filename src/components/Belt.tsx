import { BsStars } from "react-icons/bs"; 
export default function Belt() {
  return (
    <>
      <div className="bg-my-Bg text-[1.8rem] flex items-center justify-evenly p-2 text-white ">
        <p>Breakfast Included</p>
        <BsStars className="text-[#c1bd3f]" />
        <p>Swimming Pool</p>
         <BsStars className="text-[#c1bd3f]"/>
        <p>High Speed Wifi</p>
         <BsStars className="text-[#c1bd3f]"/>
        <p>Spa & Wellness</p>
      </div>
    </>
  );
}
