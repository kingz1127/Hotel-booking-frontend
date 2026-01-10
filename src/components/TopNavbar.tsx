import { AiFillYoutube } from "react-icons/ai";
import { ImPinterest2 } from "react-icons/im";
import { BsInstagram } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import { ImLocation } from "react-icons/im";
import { AiTwotoneMail } from "react-icons/ai";
import { IoMdCall } from "react-icons/io";

export default function TopNavbar() {
  return (
    <>
      <div className="
       

        top-0 left-0 right-0
        bg-my-Bg
        text-white
        z-50
        
        
        h-auto py-2 px-3
        flex flex-col items-center justify-center gap-2
        w-full
        text-xs
        
        
        sm:h-10 sm:py-0 sm:px-4
        sm:flex-row sm:justify-between
        sm:text-sm
       
        
        /* Medium screens (768px - 1023px) */
        md:h-12 md:px-6
        
        /* Large screens (1024px - 1279px) */
        lg:px-8
        
        /* Extra large screens (1280px - 1535px) */
        xl:px-10
        
        /* 2XL screens (1536px and above) */
        2xl:px-12
      ">
        
        {/* Contact Information Container */}
        <div className="
          /* Mobile: Stack items vertically */
          flex  items-center justify-center gap-1
          
          /* Small+: Horizontal layout */
          sm:flex-row sm:gap-3
          
          /* Medium+: Adjust gap */
          md:gap-4
          
          /* Large+: More gap for better spacing */
          lg:gap-5
        ">
          
          {/* Phone Number */}
          <div className="flex items-center gap-1">
            <IoMdCall className="
              text-emerald-400
              text-sm   /* Extra small */
              sm:text-base   /* Small+ */
              md:text-lg     /* Medium+ */
            " />
            <a 
              href="tel:+2348131817432" 
              className="
                hover:text-emerald-300 transition-colors duration-200
                /* Hide full number on small screens, show truncated */
                hidden sm:inline
              "
            >
              +2348131817432
            </a>
            <a 
              href="tel:+2348131817432" 
              className="
                hover:text-emerald-300 transition-colors duration-200
                /* Show on extra small screens only */
                sm:hidden
              "
            >
              Call Us
            </a>
          </div>
          
          {/* Separator - Hidden on mobile */}
          <div className="
            hidden
            sm:inline sm:text-gray-300
          ">
            |
          </div>
          
          {/* Email Address */}
          <div className="flex items-center gap-1">
            <AiTwotoneMail className="
              text-sky-400
              text-sm   /* Extra small */
              sm:text-base   /* Small+ */
              md:text-lg     /* Medium+ */
            " />
            <a 
              href="mailto:osunyingboadedeji1@gmail.com" 
              className="
                hover:text-sky-300 transition-colors duration-200
                
                hidden md:inline
                truncate max-w-[180px] lg:max-w-none
              "
            >
              osunyingboadedeji1@gmail.com
            </a>
            <a 
              href="mailto:osunyingboadedeji1@gmail.com" 
              className="
                hover:text-sky-300 transition-colors duration-200
                
                hidden sm:inline md:hidden
              "
            >
              Email Us
            </a>
            <a 
              href="mailto:osunyingboadedeji1@gmail.com" 
              className="
                hover:text-sky-300 transition-colors duration-200
                
                sm:hidden
              "
            >
              Email
            </a>
          </div>
          
          {/* Separator - Only on large screens */}
          <div className="
            hidden
            lg:inline lg:text-gray-300
          ">
            |
          </div>
          
          {/* Address - Only visible on large screens */}
          <div className="
            hidden
            lg:flex lg:items-center lg:gap-1
          ">
            <ImLocation className="text-fuchsia-400" />
            <span className="
              truncate max-w-[200px]   /* Large screens */
              xl:max-w-[250px]        /* Extra large */
              2xl:max-w-none          /* 2XL screens full */
            ">
              34, Mark Anthony way, Lekki Lagos 265165
            </span>
          </div>
          
          {/* Address for Medium screens only - shorter version */}
          <div className="
            hidden
            md:flex md:items-center md:gap-1
            lg:hidden
          ">
            <ImLocation className="text-fuchsia-400" />
            <span className="truncate max-w-[150px]">
              Lekki, Lagos
            </span>
          </div>
        </div>
        
        {/* Social Media Icons */}
        <div className="
          flex items-center
          gap-2   /* Extra small */
          sm:gap-3   /* Small+ */
          md:gap-4   /* Medium+ */
        ">
          <a 
            href="http://fb.com" 
            aria-label="Facebook"
            className="hover:scale-110 transition-transform duration-200"
          >
            <AiFillFacebook className="
              text-blue-600 hover:text-blue-500
              text-lg   /* Extra small */
              sm:text-xl   /* Small+ */
            " />
          </a>
          <a 
            href="http://instagram.com" 
            aria-label="Instagram"
            className="hover:scale-110 transition-transform duration-200"
          >
            <BsInstagram className="
              text-red-400 hover:text-red-300
              text-lg   /* Extra small */
              sm:text-xl   /* Small+ */
            " />
          </a>
          <a 
            href="http://pinterest.com" 
            aria-label="Pinterest"
            className="hover:scale-110 transition-transform duration-200"
          >
            <ImPinterest2 className="
              text-red-600 hover:text-red-500
              text-lg   /* Extra small */
              sm:text-xl   /* Small+ */
            " />
          </a>
          <a 
            href="http://youtube.com" 
            aria-label="YouTube"
            className="hover:scale-110 transition-transform duration-200"
          >
            <AiFillYoutube className="
              text-red-600 hover:text-red-500
              text-lg   /* Extra small */
              sm:text-xl   /* Small+ */
            " />
          </a>
        </div>
      </div>
    </>
  );
}