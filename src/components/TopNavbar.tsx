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
      <div className=" top-0 left-0 right-0
      h-12
      z-50
      flex items-center justify-between
      bg-my-Bg
      px-12
      text-white">
        <div className="flex items-center row gap-2">
          <div className="flex items-center gap-1">
            {" "}
            <IoMdCall className="text-emerald-400" /> <a href="tel:+2348131817432"> +2348131817432</a>{" "}
          </div>
          <div className="flex items-center gap-1">
            {" "}
            <AiTwotoneMail className="text-sky-400" />{" "}
            <a href="mailto:osunyingboadedeji1@gmail.com">
              osunyingboadedeji1@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-1">
            <ImLocation className="text-fuchsia-400" /> 34, Mark Anthony way, Lekki Lagos 265165
          </div>
        </div>

        <div className="flex items-center row gap-4 text-lg">
          <a href="http://fb.com" >
            <AiFillFacebook className="text-blue-600" />
          </a>
          <a href="http://instagram.com"> <BsInstagram className="text-red-400" /></a>
          <a href="http://pinterest.com "><ImPinterest2 className="text-red-600" /></a>
          <a href="http://youtube.com"><AiFillYoutube className="text-red-600"  /></a>  
        </div>
      </div>
    </>
  );
}


// import { AiFillYoutube } from "react-icons/ai";
// import { ImPinterest2 } from "react-icons/im";
// import { BsInstagram } from "react-icons/bs";
// import { AiFillFacebook } from "react-icons/ai";
// import { ImLocation } from "react-icons/im";
// import { AiTwotoneMail } from "react-icons/ai";
// import { IoMdCall } from "react-icons/io";

// export default function TopNavbar() {
//   return (
//     <>
//       <div className="top-0 left-0 right-0
//         h-auto md:h-12
//         z-50
//         flex flex-col md:flex-row items-center justify-between
//         bg-my-Bg
//         px-4 sm:px-6 md:px-8 lg:px-12
//         py-3 md:py-0
//         text-white
//         text-sm sm:text-base">
        
//         {/* Contact Info Section */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-6 mb-3 md:mb-0">
//           <div className="flex items-center gap-1">
//             <IoMdCall className="text-emerald-400 text-lg" /> 
//             <a href="tel:+2348131817432" className="hover:text-emerald-300 transition-colors">
//               <span className="hidden sm:inline">+2348131817432</span>
//               <span className="sm:hidden">Call Us</span>
//             </a>
//           </div>
          
//           <div className="hidden sm:block text-gray-300">|</div>
          
//           <div className="flex items-center gap-1">
//             <AiTwotoneMail className="text-sky-400 text-lg" /> 
//             <a href="mailto:osunyingboadedeji1@gmail.com" className="hover:text-sky-300 transition-colors truncate max-w-[180px] sm:max-w-none">
//               <span className="hidden md:inline">osunyingboadedeji1@gmail.com</span>
//               <span className="md:hidden">Email Us</span>
//             </a>
//           </div>
          
//           <div className="hidden lg:block text-gray-300">|</div>
          
//           <div className="hidden lg:flex items-center gap-1">
//             <ImLocation className="text-fuchsia-400" /> 
//             <span>34, Mark Anthony way, Lekki Lagos</span>
//           </div>
//         </div>

//         {/* Social Media Section */}
//         <div className="flex items-center gap-3 sm:gap-4 text-lg">
//           <a href="http://fb.com" className="hover:scale-110 transition-transform">
//             <AiFillFacebook className="text-blue-600 hover:text-blue-500" />
//           </a>
//           <a href="http://instagram.com" className="hover:scale-110 transition-transform">
//             <BsInstagram className="text-red-400 hover:text-red-300" />
//           </a>
//           <a href="http://pinterest.com" className="hover:scale-110 transition-transform">
//             <ImPinterest2 className="text-red-600 hover:text-red-500" />
//           </a>
//           <a href="http://youtube.com" className="hover:scale-110 transition-transform">
//             <AiFillYoutube className="text-red-600 hover:text-red-500" />
//           </a>
//         </div>
//       </div>
//     </>
//   );
// }

// export default function TopNavbar() {
//   return (
//     <>
//       <div className="top-0 left-0 right-0
//         /* Mobile (default): Stack vertically, auto height */
//         h-auto py-3 px-4
//         flex flex-col items-center justify-center gap-3
        
//         /* Small screens (640px+): Start horizontal layout */
//         sm:h-10 sm:py-0 sm:px-6
//         sm:flex-row sm:justify-between
        
//         /* Medium screens (768px+): Full horizontal layout */
//         md:h-12 md:px-8
        
//         /* Large screens (1024px+): More spacing */
//         lg:px-12
        
//         /* Extra large (1280px+): Max width container */
//         xl:max-w-7xl xl:mx-auto
        
//         /* Common styles */
//         z-50 bg-my-Bg text-white text-sm md:text-base">
        
//         {/* Contact Info - Responsive layout */}
//         <div className="
//           /* Mobile: Stack contact items */
//           flex flex-col items-center gap-2
          
//           /* Small+: Horizontal layout */
//           sm:flex-row sm:gap-4
          
//           /* Medium+: More spacing */
//           md:gap-6">
          
//           {/* Phone */}
//           <div className="flex items-center gap-1">
//             <IoMdCall className="text-emerald-400 text-base sm:text-lg" />
//             <a href="tel:+2348131817432" className="hover:text-emerald-300 transition-colors">
//               <span className="hidden sm:inline">+2348131817432</span>
//               <span className="sm:hidden text-sm">Call: +2348131817432</span>
//             </a>
//           </div>
          
//           <div className="hidden sm:inline text-gray-300">|</div>
          
//           {/* Email */}
//           <div className="flex items-center gap-1">
//             <AiTwotoneMail className="text-sky-400 text-base sm:text-lg" />
//             <a href="mailto:osunyingboadedeji1@gmail.com" className="hover:text-sky-300 transition-colors">
//               <span className="hidden lg:inline">osunyingboadedeji1@gmail.com</span>
//               <span className="hidden sm:inline lg:hidden">Email Us</span>
//               <span className="sm:hidden text-sm">Email</span>
//             </a>
//           </div>
          
//           <div className="hidden lg:inline text-gray-300">|</div>
          
//           {/* Address - Shows only on large screens */}
//           <div className="hidden lg:flex items-center gap-1">
//             <ImLocation className="text-fuchsia-400" />
//             <span>34, Mark Anthony way, Lekki Lagos</span>
//           </div>
//         </div>

//         {/* Social Media Icons */}
//         <div className="flex items-center gap-3 sm:gap-4">
//           <a href="http://fb.com" aria-label="Facebook" className="hover:scale-110 transition-transform">
//             <AiFillFacebook className="text-blue-600 hover:text-blue-500 text-xl" />
//           </a>
//           <a href="http://instagram.com" aria-label="Instagram" className="hover:scale-110 transition-transform">
//             <BsInstagram className="text-red-400 hover:text-red-300 text-xl" />
//           </a>
//           <a href="http://pinterest.com" aria-label="Pinterest" className="hover:scale-110 transition-transform">
//             <ImPinterest2 className="text-red-600 hover:text-red-500 text-xl" />
//           </a>
//           <a href="http://youtube.com" aria-label="YouTube" className="hover:scale-110 transition-transform">
//             <AiFillYoutube className="text-red-600 hover:text-red-500 text-xl" />
//           </a>
//         </div>
//       </div>
//     </>
//   );
// }