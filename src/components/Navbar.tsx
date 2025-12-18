import { FaHotel } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import { useEffect, useState } from "react";


export default function Navbar() {
  const [hideTop, setHideTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHideTop(true);
      } else {
        setHideTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Navbar */}
      {!hideTop && (
       
          <TopNavbar />
       
      )}

      {/* Main Navbar */}
      <div
        className={`flex items-center justify-evenly fixed h-24 w-full bg-gradient-to-r from-white/30 via-white/30 to-white/30 backdrop-blur-sm z-40 transition-all duration-300 ${
          hideTop ? "top-0" : "top-12"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <div className="bg-[#1d3775] text-3xl text-white w-15 h-15 rounded-full flex items-center justify-center">
            <FaHotel />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-[#1d3775]">Royale Hotel</h1>
            <p className="font-medium text-[#1d3775]">Where Every Guest is Royalty</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="text-[#1d3775] flex items-center gap-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="rooms&suites">Rooms & Suites</NavLink>
          <NavLink to="restaurants">Restaurants</NavLink>
          <NavLink to="gallery">Gallery</NavLink>
          <NavLink to="blogs">Blogs</NavLink>
          <NavLink to="aboutus">About Us</NavLink>
          <NavLink to="contactus">Contact Us</NavLink>
        </nav>

        {/* Book Now Button */}
        <div className="bg-[#1d3775] text-[#e4dddd] w-25 h-8 rounded-full flex items-center justify-center">
          <Link to={"login"}>Book Now</Link>
        </div>
      </div>
    {/* </>
  ); */}

       
      

      <div className="relative w-full h-150 aspect-video group flex items-center justify-center mt-25 ">
        {/* <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/H1CIBqDeWQ0?autoplay=1&mute=1&start=0&end=5&controls=0&loop=1&playlist=H1CIBqDeWQ0"
          title="YouTube preview"
          frameBorder="0"
          allow="; encrypted-media"
        ></iframe> */}

        <img src="src/Images/2024-12-26.png" className="w-full h-full relative " alt="" />

        
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
    <h1 className="text-white m-4">WHERE LUXURY MEETS EXCELENCE</h1>
    <h1 className="text-[white] text-4xl text-center font-serif m-2">The Ultimate Luxury Hotel <br /> Lekki Lagos</h1>
    {/* <button className="px-6 py-2 bg-white text-black rounded-full font-medium shadow-lg">
      ▶ Play video
    </button> */}
        </div>
        
      </div>      

    </>
  );
 
}
