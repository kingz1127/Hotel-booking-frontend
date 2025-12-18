import { BiSend } from "react-icons/bi"; 
import { AiFillFacebook, AiFillYoutube } from "react-icons/ai";
import { BsInstagram } from "react-icons/bs";
import { FaHotel } from "react-icons/fa";
import { ImPinterest2 } from "react-icons/im";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

export default function Footer() {
  return (
    <>
    <div className="bg-my-Bg mt-12 p-6 flex justify-evenly rounded-tl-2xl rounded-tr-2xl">

    
      <div className="flex  flex-col gap-5 ">
        <div className="flex items-center  gap-2">
                  <div className="bg-[white] text-3xl text-[#1d3775] w-15 h-15 rounded-full flex items-center justify-center">
                    <FaHotel />
                  </div>
                  <div>
                    <h1 className="text-2xl font-medium text-[white]">Royale Hotel</h1>
                    <p className="font-medium text-[white]">Luxury Royalty</p>
                  </div>
                </div>
                <p className="text-[white]">Irure id veniam elit anim <br />commodo ex voluptate <br />proident voluptate.</p>

                <div className="flex items-center row gap-4 text-lg">
                <a href="http://fb.com" className="bg-white rounded-full  p-1.5">
                  <AiFillFacebook className="text-blue-600 " />
                </a>
                <a href="http://instagram.com" className="bg-white rounded-full  p-1.5"> <BsInstagram className="text-red-400" /></a>
                <a href="http://pinterest.com " className="bg-white rounded-full  p-1.5"><ImPinterest2 className="text-red-600" /></a>
                <a href="http://youtube.com" className="bg-white rounded-full  p-1.5"><AiFillYoutube className="text-red-600"  /></a>  
              </div>
      </div>

      <div className="text-white flex flex-col gap-3">
        <h1 className="text-[1.4rem] font-medium">Links</h1>
        <p>Faqs</p>
        <p>Our Staffs</p>
        <p>Contact Us</p>
        <p>About Us</p>
        <p>Guest Review</p>
      </div>

        <div className="text-white flex flex-col gap-3">
        <h1 className="text-[1.4rem] font-medium">Contact Info</h1>
        <p>0000000</p>
        <p>osunyingboadedeji1@gmail.com</p>
        <p>34, Mark Anthony way, Lekki <br /> Lagos 265165</p>
        
      </div>

      <div className="text-white flex flex-col gap-3">
        <h1 className="text-[1.4rem] font-medium">Get the latest information</h1>
        <div className="flex gap-1.5">
           
        <Input type="email" />
        <Button className="bg-green-500 hover:bg-red-400"><BiSend  /></Button>
       
        </div>
      </div>

      


    </div>
    </>
  );
}
