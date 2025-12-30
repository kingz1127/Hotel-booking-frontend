
import { FaHotel } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi"; 

export default function Navbar() {
  const [hideTop, setHideTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle scroll for hiding top navbar
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

  // Handle screen resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typically the breakpoint for tablets/mobile
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navLinks = document.querySelector('.nav-links-container');
      const hamburger = document.querySelector('.hamburger-button');
      
      if (
        isMenuOpen && 
        navLinks && 
        hamburger &&
        !navLinks.contains(event.target) && 
        !hamburger.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu when route changes (for mobile)
  const handleNavLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      {!hideTop && <TopNavbar />}

      {/* Main Navbar */}
      <div
        className={`flex items-center justify-between px-4 md:px-6 lg:px-8 fixed h-20 md:h-24 w-full bg-gradient-to-r from-white/30 via-white/30 to-white/30 backdrop-blur-sm z-40 transition-all duration-300 ${
          hideTop ? "top-0" : "top-12"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 z-50">
          <div className="bg-[#1d3775] text-xl md:text-2xl lg:text-3xl text-white w-10 h-10 md:w-12 md:h-12 lg:w-15 lg:h-15 rounded-full flex items-center justify-center">
            <FaHotel />
          </div>
          <div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-medium text-[#1d3775]">
              Royale Hotel
            </h1>
            <p className="text-xs md:text-sm font-medium text-[#1d3775] hidden sm:block">
              Where Every Guest is Royalty
            </p>
          </div>
        </div>

        {/* Hamburger Button for Mobile */}
        <button
          className="hamburger-button md:hidden z-50 text-[#1d3775] text-2xl p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Desktop Nav Links (Hidden on Mobile) */}
        <nav className="hidden md:flex text-[#1d3775] items-center gap-4 lg:gap-6">
          <NavLink to="/" className="hover:text-[#0d2a6b] transition-colors duration-200">
            Home
          </NavLink>
          <NavLink to="rooms&suites" className="hover:text-[#0d2a6b] transition-colors duration-200">
            Rooms & Suites
          </NavLink>
          <NavLink to="restaurants" className="hover:text-[#0d2a6b] transition-colors duration-200">
            Restaurants
          </NavLink>
          <NavLink to="gallery" className="hover:text-[#0d2a6b] transition-colors duration-200">
            Gallery
          </NavLink>
          <NavLink to="blogs" className="hover:text-[#0d2a6b] transition-colors duration-200">
            Blogs
          </NavLink>
          <NavLink to="aboutus" className="hover:text-[#0d2a6b] transition-colors duration-200">
            About Us
          </NavLink>
          <NavLink to="contactus" className="hover:text-[#0d2a6b] transition-colors duration-200">
            Contact Us
          </NavLink>
        </nav>

        {/* Mobile Menu Overlay */}
        <div
          className={`nav-links-container fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Mobile Menu Panel */}
          <div
            className={`absolute top-0 right-0 h-full w-3/4 max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button in Mobile Menu */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl text-[#1d3775] p-2"
                aria-label="Close menu"
              >
                <HiX />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col p-6">
              <NavLink
                to="/"
                className="py-4 px-4 text-[#1d3775] text-lg border-b border-gray-100 hover:bg-[#1d3775] hover:text-white transition-all duration-200 rounded-md"
                onClick={handleNavLinkClick}
              >
                Home
              </NavLink>
              <NavLink
                to="rooms&suites"
                className="py-4 px-4 text-[#1d3775] text-lg border-b border-gray-100 hover:bg-[#1d3775] hover:text-white transition-all duration-200 rounded-md"
                onClick={handleNavLinkClick}
              >
                Rooms & Suites
              </NavLink>
              <NavLink
                to="restaurants"
                className="py-4 px-4 text-[#1d3775] text-lg border-b border-gray-100 hover:bg-[#1d3775] hover:text-white transition-all duration-200 rounded-md"
                onClick={handleNavLinkClick}
              >
                Restaurants
              </NavLink>
              <NavLink
                to="gallery"
                className="py-4 px-4 text-[#1d3775] text-lg border-b border-gray-100 hover:bg-[#1d3775] hover:text-white transition-all duration-200 rounded-md"
                onClick={handleNavLinkClick}
              >
                Gallery
              </NavLink>
              <NavLink
                to="blogs"
                className="py-4 px-4 text-[#1d3775] text-lg border-b border-gray-100 hover:bg-[#1d3775] hover:text-white transition-all duration-200 rounded-md"
                onClick={handleNavLinkClick}
              >
                Blogs
              </NavLink>
              <NavLink
                to="aboutus"
                className="py-4 px-4 text-[#1d3775] text-lg border-b border-gray-100 hover:bg-[#1d3775] hover:text-white transition-all duration-200 rounded-md"
                onClick={handleNavLinkClick}
              >
                About Us
              </NavLink>
              <NavLink
                to="contactus"
                className="py-4 px-4 text-[#1d3775] text-lg border-b border-gray-100 hover:bg-[#1d3775] hover:text-white transition-all duration-200 rounded-md"
                onClick={handleNavLinkClick}
              >
                Contact Us
              </NavLink>
              
              {/* Book Now Button for Mobile */}
              <div className="mt-8 p-4">
                <div className="bg-[#1d3775] text-white w-full h-12 rounded-full flex items-center justify-center hover:bg-[#0d2a6b] transition-colors duration-200">
                  <Link to="login" className="w-full text-center" onClick={handleNavLinkClick}>
                    Book Now
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Desktop Book Now Button */}
        <div className="hidden md:flex bg-[#1d3775] text-white w-24 h-10 lg:w-25 lg:h-8 rounded-full items-center justify-center hover:bg-[#0d2a6b] transition-colors duration-200">
          <Link to="login">Book Now</Link>
        </div>
      </div>

      {/* Video Section */}
      <div className="relative w-full h-40 sm:h-60 md:h-80 lg:h-96 xl:h-150 aspect-video group flex items-center justify-center mt-20 md:mt-24">
        {/* <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/H1CIBqDeWQ0?autoplay=1&mute=1&start=0&end=5&controls=0&loop=1&playlist=H1CIBqDeWQ0"
          title="YouTube preview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe> */}

        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4">
          <h1 className="text-[#908e8e] text-sm sm:text-base md:text-lg lg:text-xl text-center mb-2">
            WHERE LUXURY MEETS EXCELENCE
          </h1>
          <h1 className="text-[#908e8e] text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-serif mb-4">
            The Ultimate Luxury Hotel <br /> Lekki Lagos
          </h1>
        </div>
      </div>
    </>
  );
}