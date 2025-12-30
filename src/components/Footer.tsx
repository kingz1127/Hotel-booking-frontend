


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
      <div className="
        bg-my-Bg 
        mt-8 sm:mt-10 md:mt-12 
        p-4 sm:p-5 md:p-6 
        flex 
        flex-col sm:flex-row 
        justify-center sm:justify-evenly 
        items-start
        gap-6 sm:gap-8 md:gap-10 lg:gap-12
        rounded-tl-2xl 
        rounded-tr-2xl
      ">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 w-full sm:w-auto max-w-xs">
          <div className="flex items-center gap-2">
            <div className="
              bg-white 
              text-2xl sm:text-3xl 
              text-[#1d3775] 
              w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 
              rounded-full 
              flex 
              items-center 
              justify-center
            ">
              <FaHotel />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-medium text-white">Royale Hotel</h1>
              <p className="font-medium text-white text-sm sm:text-base">Luxury Royalty</p>
            </div>
          </div>
          
          <p className="text-white text-sm sm:text-base leading-relaxed">
            Irure id veniam elit anim commodo ex voluptate proident voluptate.
          </p>

          {/* Social Media Links */}
          <div className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg">
            <a 
              href="http://fb.com" 
              className="bg-white rounded-full p-1.5 hover:scale-110 transition-transform"
              aria-label="Facebook"
            >
              <AiFillFacebook className="text-blue-600" />
            </a>
            <a 
              href="http://instagram.com" 
              className="bg-white rounded-full p-1.5 hover:scale-110 transition-transform"
              aria-label="Instagram"
            >
              <BsInstagram className="text-red-400" />
            </a>
            <a 
              href="http://pinterest.com" 
              className="bg-white rounded-full p-1.5 hover:scale-110 transition-transform"
              aria-label="Pinterest"
            >
              <ImPinterest2 className="text-red-600" />
            </a>
            <a 
              href="http://youtube.com" 
              className="bg-white rounded-full p-1.5 hover:scale-110 transition-transform"
              aria-label="YouTube"
            >
              <AiFillYoutube className="text-red-600" />
            </a>  
          </div>
        </div>

        {/* Links Section */}
        <div className="text-white flex flex-col gap-2 sm:gap-3 w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl md:text-[1.4rem] font-medium mb-1">Links</h1>
          <a href="#faqs" className="text-sm sm:text-base hover:text-[#c1bd3f] transition-colors cursor-pointer">
            Faqs
          </a>
          <a href="#staff" className="text-sm sm:text-base hover:text-[#c1bd3f] transition-colors cursor-pointer">
            Our Staffs
          </a>
          <a href="#contact" className="text-sm sm:text-base hover:text-[#c1bd3f] transition-colors cursor-pointer">
            Contact Us
          </a>
          <a href="#about" className="text-sm sm:text-base hover:text-[#c1bd3f] transition-colors cursor-pointer">
            About Us
          </a>
          <a href="#reviews" className="text-sm sm:text-base hover:text-[#c1bd3f] transition-colors cursor-pointer">
            Guest Review
          </a>
        </div>

        {/* Contact Info Section */}
        <div className="text-white flex flex-col gap-2 sm:gap-3 w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl md:text-[1.4rem] font-medium mb-1">Contact Info</h1>
          <a 
            href="tel:0000000" 
            className="text-sm sm:text-base hover:text-[#c1bd3f] transition-colors"
          >
            0000000
          </a>
          <a 
            href="mailto:osunyingboadedeji1@gmail.com" 
            className="text-sm sm:text-base hover:text-[#c1bd3f] transition-colors break-all"
          >
            osunyingboadedeji1@gmail.com
          </a>
          <p className="text-sm sm:text-base leading-relaxed">
            34, Mark Anthony way, Lekki<br className="hidden sm:block" /> Lagos 265165
          </p>
        </div>

        {/* Newsletter Section */}
        <div className="text-white flex flex-col gap-2 sm:gap-3 w-full sm:w-auto sm:max-w-xs">
          <h1 className="text-lg sm:text-xl md:text-[1.4rem] font-medium mb-1">
            Get the latest information
          </h1>
          <div className="flex gap-1.5 w-full">
            <Input 
              type="email" 
              placeholder="Enter your email"
              className="
                flex-1 
                text-sm sm:text-base 
                h-9 sm:h-10
                bg-white
              " 
            />
            <Button 
              className="
                bg-green-500 
                hover:bg-red-400 
                transition-colors
                h-9 sm:h-10
                px-3 sm:px-4
              "
              aria-label="Subscribe"
            >
              <BiSend className="text-lg sm:text-xl" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}